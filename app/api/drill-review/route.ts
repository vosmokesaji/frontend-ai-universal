type DrillRequest = {
  task?: unknown;
  deliverable?: unknown;
  criteria?: unknown;
  submission?: unknown;
};

const defaultBaseUrl = "https://api.deepseek.com";
const defaultModel = "deepseek-v4-flash";

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function cleanText(value: unknown, maxLength = 5000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanList(value: unknown, maxItems = 6) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanText(item, 500))
    .filter(Boolean)
    .slice(0, maxItems);
}

function clampScore(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(100, Math.round(number))) : 0;
}

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const baseUrl = (process.env.DEEPSEEK_BASE_URL?.trim() || defaultBaseUrl).replace(
    /\/+$/,
    "",
  );
  const model = process.env.DEEPSEEK_MODEL?.trim() || defaultModel;
  if (!apiKey) return json({ error: "MODEL_NOT_CONFIGURED" }, 503);

  let body: DrillRequest;
  try {
    body = (await request.json()) as DrillRequest;
  } catch {
    return json({ error: "INVALID_JSON" }, 400);
  }

  const task = cleanText(body.task, 1500);
  const deliverable = cleanText(body.deliverable, 800);
  const criteria = cleanList(body.criteria, 8);
  const submission = cleanText(body.submission, 8000);
  if (!task || submission.length < 80) {
    return json({ error: "INVALID_INPUT" }, 400);
  }

  const systemPrompt = `你是一名严格、务实的 AI 工程教练。请根据专项任务、交付物和验收标准评审用户提交。

要求：
1. score 为 0 到 100 的整数。
2. strengths 只写提交中真实存在的优点；没有就返回空数组。
3. improvements 给出 1 到 5 条具体、可执行的改进。
4. nextAction 必须是一个 15 到 45 分钟内可执行的下一步。
5. 只输出合法 JSON，不要 Markdown，不要输出思考过程。

JSON：
{"score":72,"strengths":["明确给出了失败边界"],"improvements":["补充可量化的验收指标"],"nextAction":"用 20 分钟补充 5 条失败样本并重新提交"}`;

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
            content: JSON.stringify({ task, deliverable, criteria, submission }),
          },
        ],
        thinking: { type: "disabled" },
        temperature: 0.2,
        max_tokens: 900,
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(45_000),
    });
    if (!response.ok) return json({ error: "MODEL_UPSTREAM_ERROR" }, 502);
    const completion = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = completion.choices?.[0]?.message?.content;
    if (!content) return json({ error: "EMPTY_MODEL_RESPONSE" }, 502);
    const parsed = JSON.parse(content) as Record<string, unknown>;
    const improvements = cleanList(parsed.improvements, 5);
    const nextAction = cleanText(parsed.nextAction, 700);
    if (!improvements.length || !nextAction) {
      return json({ error: "INVALID_MODEL_REVIEW" }, 502);
    }
    return json({
      engine: "model",
      score: clampScore(parsed.score),
      strengths: cleanList(parsed.strengths, 4),
      improvements,
      nextAction,
    });
  } catch {
    return json({ error: "MODEL_REQUEST_FAILED" }, 502);
  }
}
