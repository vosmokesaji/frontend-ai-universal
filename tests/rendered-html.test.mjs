import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the universal frontend-to-AI product", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /转型工作台/);
  assert.match(html, /只展示当前状态、下一步和需要处理的事项/);
  assert.match(html, /学习路线/);
  assert.match(html, /岗位机会/);
  assert.match(html, /面试训练/);
  assert.match(html, /刻意练习/);
  assert.match(html, /0—2 年/);
  assert.match(html, /今日闪卡/);
  assert.match(html, /岗位跟进/);
  assert.doesNotMatch(html, /为 10 年前端/);
  assert.doesNotMatch(html, /A PRACTICAL GUIDE|让前端，|向智能生长|AI Workbench/);
  assert.doesNotMatch(html, /codex-preview/);
  assert.doesNotMatch(html, /Your site is taking shape/);
});

test("starter preview is fully removed", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/", import.meta.url)));
});

test("v4 includes the task-first roadmap, evidence, interview and practice systems", async () => {
  const [page, data, research, modelRoute, drillRoute] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data-v3.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/research-v4.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/interview-review/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/drill-review/route.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /roadmap-table-head/);
  assert.match(page, /toggleRoadmapSort/);
  assert.match(page, /knowledge-drawer/);
  assert.match(page, /frontend-ai-knowledge-progress-v4/);
  assert.match(page, /frontend-ai-learning-plan-v4/);
  assert.match(page, /resourceSort/);
  assert.match(page, /startVoiceInput/);
  assert.match(page, /参考答案形态/);
  assert.match(page, /flashcard-lab/);
  assert.match(page, /mindmap-lab/);
  assert.match(page, /间隔重复|rateFlashcard/);
  assert.match(page, /正式模拟/);
  assert.match(page, /isMeaningfulAnswer/);
  assert.match(page, /删除这次测试记录/);
  assert.match(page, /frontend-ai-applications-v4/);
  assert.match(page, /frontend-ai-drill-history-v4/);
  assert.match(page, /全站搜索/);
  assert.match(research, /不伪装成独立职位/);
  assert.match(research, /evidenceLevel: "精确 JD"/);
  assert.match(research, /evidenceLevel: "官方招聘检索"/);
  assert.equal(
    research.match(/^\s+\["n\d{2}",/gm)?.length,
    50,
    "interview evidence should contain 50 independent source links",
  );
  assert.equal(
    research.match(/id: "radar-/g)?.length ?? 0,
    0,
    "official role radar is generated from 10 transparent company sources instead of pretending to be exact JDs",
  );
  assert.match(research, /companySources\.map/);
  assert.match(research, /rolePaths\.flatMap/);
  assert.match(page, /3 条中文 \+ 3 条英文/);
  assert.match(modelRoute, /DEEPSEEK_API_KEY/);
  assert.match(modelRoute, /https:\/\/api\.deepseek\.com/);
  assert.match(modelRoute, /deepseek-v4-flash/);
  assert.match(modelRoute, /response_format: \{ type: "json_object" \}/);
  assert.match(page, /frontend-ai-interview-history-v2/);
  assert.match(page, /重新回答本题/);
  assert.match(page, /ScoreTrend/);
  assert.match(page, /voiceInterim/);
  assert.match(page, /完整优质回答/);
  assert.match(page, /event\.code === "Space"/);
  assert.match(page, /event\.key === "ArrowLeft"/);
  assert.match(page, /const mindMapBranches/);
  assert.match(page, /先修知识/);
  assert.match(page, /推荐下一节点/);
  assert.match(page, /currentFlashcard\.category/);
  assert.match(data, /const flashcardBlueprints/);
  assert.match(data, /fullReferenceAnswers/);
  assert.match(data, /export const practices: PracticeDrill\[\]/);
  assert.match(drillRoute, /DEEPSEEK_API_KEY/);
  assert.match(drillRoute, /专项任务/);
  const flashcardBlock = data.slice(
    data.indexOf("const flashcardBlueprints"),
    data.indexOf("export const flashcards"),
  );
  assert.equal(
    flashcardBlock.match(/^\s+\["(?:低|中|高)"/gm)?.length,
    84,
    "14 knowledge modules should each contain 6 flashcards",
  );
});

test("model review accepts a zero-strength result for a meaningless answer", async () => {
  const { normalizeReview } = await import(
    new URL("../app/api/interview-review/route.ts", import.meta.url)
  );
  const answer = "123123123123123123123123123123123123123123123123123123123123123123123123123123";
  const review = normalizeReview(
    {
      score: 0,
      dimensions: { structure: 0, evidence: 0, depth: 0 },
      strengths: [],
      improvements: [
        {
          point: "回答没有包含与题目相关的信息",
          example: "先给出结论，再用项目事实、数据和取舍说明理由。",
        },
      ],
      annotations: [],
    },
    answer,
  );

  assert.ok(review);
  assert.equal(review.score, 0);
  assert.deepEqual(review.strengths, []);
  assert.equal(review.improvements.length, 1);
});
