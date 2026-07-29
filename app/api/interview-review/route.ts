type ReviewRequest = {
  question?: unknown;
  purpose?: unknown;
  answer?: unknown;
  answerFrame?: unknown;
  keywords?: unknown;
  reference?: unknown;
};

type ModelReview = {
  score: number;
  dimensions: {
    structure: number;
    evidence: number;
    depth: number;
  };
  strengths: string[];
  improvements: { point: string; example: string }[];
  annotations: { quote: string; type: "excellent"; reason: string }[];
};

const defaultBaseUrl = "https://api.deepseek.com";
const defaultModel = "deepseek-v4-flash";

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function clampScore(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(100, Math.round(number))) : 0;
}

function cleanText(value: unknown, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanList(value: unknown, maxItems: number, maxLength = 500) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanText(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizeReview(value: unknown, answer: string): ModelReview | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  const dimensions =
    candidate.dimensions && typeof candidate.dimensions === "object"
      ? (candidate.dimensions as Record<string, unknown>)
      : {};

  const strengths = cleanList(candidate.strengths, 4);
  const rawImprovements = Array.isArray(candidate.improvements)
    ? candidate.improvements
    : [];
  const improvements = rawImprovements
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const improvement = item as Record<string, unknown>;
      const point = cleanText(improvement.point);
      const example = cleanText(improvement.example, 900);
      return point && example ? { point, example } : null;
    })
    .filter((item): item is { point: string; example: string } => Boolean(item))
    .slice(0, 4);

  const rawAnnotations = Array.isArray(candidate.annotations) ? candidate.annotations : [];
  const annotations = rawAnnotations
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const annotation = item as Record<string, unknown>;
      const quote = cleanText(annotation.quote, 240);
      const reason = cleanText(annotation.reason, 360);
      if (!quote || !reason || !answer.includes(quote)) return null;
      return { quote, type: "excellent" as const, reason };
    })
    .filter(
      (
        item,
      ): item is { quote: string; type: "excellent"; reason: string } => Boolean(item),
    )
    .slice(0, 8);

  if (!strengths.length || !improvements.length) return null;

  return {
    score: clampScore(candidate.score),
    dimensions: {
      structure: clampScore(dimensions.structure),
      evidence: clampScore(dimensions.evidence),
      depth: clampScore(dimensions.depth),
    },
    strengths,
    improvements,
    annotations,
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const baseUrl = (process.env.DEEPSEEK_BASE_URL?.trim() || defaultBaseUrl).replace(
    /\/+$/,
    "",
  );
  const model = process.env.DEEPSEEK_MODEL?.trim() || defaultModel;

  if (!apiKey) {
    return json(
      {
        configured: false,
        error: "MODEL_NOT_CONFIGURED",
        message: "站点尚未配置 DEEPSEEK_API_KEY。",
      },
      503,
    );
  }

  let body: ReviewRequest;
  try {
    body = (await request.json()) as ReviewRequest;
  } catch {
    return json({ configured: true, error: "INVALID_JSON" }, 400);
  }

  const question = cleanText(body.question, 1200);
  const answer = cleanText(body.answer, 6000);
  if (!question || answer.length < 80) {
    return json(
      {
        configured: true,
        error: "INVALID_INPUT",
        message: "题目不能为空，回答至少需要 80 个字符。",
      },
      400,
    );
  }

  const systemPrompt = `你是一名严格但建设性的中文技术面试官。你要评估候选人的回答，不评估人格。

评分维度：
- structure：是否先结论后证据、层次清晰、紧扣题目。
- evidence：是否提供数据、项目事实、对比基线、个人贡献或可验证结果。
- depth：是否解释取舍、失败边界、风险、替代方案和复盘。

要求：
1. 分数必须是 0 到 100 的整数，避免没有依据的高分。
2. strengths 只写回答中真实存在的优点。
3. improvements 必须指出具体不足，并给出可以直接学习的中文回答示例。
4. annotations.quote 必须逐字摘自用户答案，标记真正优秀的片段；type 固定为 excellent。
5. 只输出合法 JSON，不要 Markdown，不要解释过程，也不要输出思考内容。

JSON 示例：
{"score":78,"dimensions":{"structure":82,"evidence":70,"depth":76},"strengths":["先给出了明确结论"],"improvements":[{"point":"缺少量化结果","example":"上线后首字延迟从 1.8 秒降到 900ms。"}],"annotations":[{"quote":"我先定义成功指标","type":"excellent","reason":"先建立了可验证标准"}]}`;

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: JSON.stringify({
              question,
              purpose: body.purpose,
              answer,
              answerFrame: body.answerFrame,
              keywords: body.keywords,
              reference: body.reference,
            }),
          },
        ],
        thinking: { type: "disabled" },
        temperature: 0.2,
        max_tokens: 1400,
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(45_000),
    });

    if (!response.ok) {
      return json(
        {
          configured: true,
          error: "MODEL_UPSTREAM_ERROR",
          message: "DeepSeek 暂时未能完成评分，请稍后重试。",
        },
        502,
      );
    }

    const completion = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      return json(
        {
          configured: true,
          error: "EMPTY_MODEL_RESPONSE",
          message: "DeepSeek 未返回可用的评分内容。",
        },
        502,
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return json(
        {
          configured: true,
          error: "INVALID_MODEL_RESPONSE",
          message: "DeepSeek 返回了无法解析的评分内容。",
        },
        502,
      );
    }

    const review = normalizeReview(parsed, answer);
    if (!review) {
      return json(
        {
          configured: true,
          error: "INVALID_MODEL_REVIEW",
          message: "DeepSeek 返回的评分结构不完整。",
        },
        502,
      );
    }

    return json({
      configured: true,
      engine: "model",
      model,
      ...review,
    });
  } catch {
    return json(
      {
        configured: true,
        error: "MODEL_REQUEST_FAILED",
        message: "模型请求超时或网络不可用，已允许前端回退到本地评估。",
      },
      502,
    );
  }
}
