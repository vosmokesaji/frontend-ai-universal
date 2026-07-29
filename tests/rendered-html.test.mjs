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
  assert.match(html, /让前端/);
  assert.match(html, /智能/);
  assert.match(html, /学习路线/);
  assert.match(html, /岗位机会/);
  assert.match(html, /面试训练/);
  assert.match(html, /刻意练习/);
  assert.match(html, /0—2 年/);
  assert.doesNotMatch(html, /为 10 年前端/);
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

test("v3 includes the expanded roadmap, job, interview and practice systems", async () => {
  const [page, data] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data-v3.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /roadmap-table-head/);
  assert.match(page, /position-heading/);
  assert.match(page, /resourceSort/);
  assert.match(page, /startVoiceInput/);
  assert.match(page, /结构化参考答案/);
  assert.match(page, /flashcard-lab/);
  assert.match(page, /knowledge-graph-lab/);
  assert.match(data, /Array\.from\(\{ length: 10 \}/);
  assert.match(data, /interviewCollections/);
  assert.match(page, /3 条中文 \+ 3 条国际资源/);
});
