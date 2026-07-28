"use client";

import { useEffect, useMemo, useState } from "react";
import {
  interviewSources,
  jobs,
  knowledge,
  practices,
  questions,
  type Question,
} from "./content";

type TabId = "home" | "roadmap" | "roles" | "interview" | "practice";
type ExperienceId = "starter" | "growing" | "senior";

const tabs: { id: TabId; label: string }[] = [
  { id: "home", label: "概览" },
  { id: "roadmap", label: "学习路线" },
  { id: "roles", label: "岗位机会" },
  { id: "interview", label: "面试训练" },
  { id: "practice", label: "刻意练习" },
];

const experienceLevels: {
  id: ExperienceId;
  label: string;
  caption: string;
  multiplier: number;
}[] = [
  { id: "starter", label: "0—2 年", caption: "先补工程地基", multiplier: 1.25 },
  { id: "growing", label: "3—5 年", caption: "应用与全栈并进", multiplier: 1 },
  { id: "senior", label: "5 年以上", caption: "用业务与架构换赛道", multiplier: 0.82 },
];

const rolePaths = [
  {
    id: "AI 产品前端",
    name: "AI 产品前端",
    en: "AI Product Frontend",
    description: "构建流式、多模态、生成式 UI，让不确定的模型能力成为清晰、可控的用户体验。",
    bridge: ["React / Vue / TypeScript", "交互与性能", "组件与工程体系"],
    learn: ["Streams / SSE", "模型边界", "AI UX 与评测"],
    fits: { starter: 94, growing: 98, senior: 96 },
    accent: "blue",
  },
  {
    id: "AI Native 全栈",
    name: "AI Native 全栈",
    en: "AI Native Full-stack",
    description: "从界面到 Agent、数据与服务，独立交付完整 AI 功能，是前端向 AI 迁移的黄金通道。",
    bridge: ["TypeScript / Node.js", "产品交付", "前后端协作"],
    learn: ["Python / FastAPI", "RAG / Agent", "数据库与可靠性"],
    fits: { starter: 82, growing: 96, senior: 98 },
    accent: "violet",
  },
  {
    id: "AI 体验 / 原型",
    name: "AI 体验工程",
    en: "AI Experience Engineer",
    description: "连接设计、研究与工程，用高保真原型定义新的 Human-AI Interaction 模式。",
    bridge: ["UI / 动效", "设计系统", "快速原型"],
    learn: ["用户研究", "信任与控制", "原型评测"],
    fits: { starter: 90, growing: 94, senior: 92 },
    accent: "orange",
  },
  {
    id: "Agent 应用工程",
    name: "Agent 应用工程",
    en: "Agent Application Engineer",
    description: "把模型、知识与工具编排成可恢复、可评测、可安全执行的生产系统。",
    bridge: ["Node / API", "系统思维", "业务抽象"],
    learn: ["Python 深度", "检索与状态图", "分布式与安全"],
    fits: { starter: 68, growing: 84, senior: 90 },
    accent: "green",
  },
];

const milestones = [
  { days: "0—30", title: "理解", text: "Python、LLM 原理、流式 UI；做出第一个可用 AI 界面。" },
  { days: "31—60", title: "连接", text: "接入 RAG、引用与工具调用，把模型连接真实数据。" },
  { days: "61—90", title: "测量", text: "建立黄金集、trace、延迟和成本指标，拒绝凭感觉优化。" },
  { days: "91—120", title: "可靠", text: "补状态、幂等、重试、降级、安全与人工确认。" },
  { days: "121—150", title: "上线", text: "容器化、监控和灰度；邀请真实用户使用并记录失败。" },
  { days: "151—180", title: "表达", text: "作品集、架构文档、指标复盘与高频模拟面试。" },
];

function formatTime(seconds: number) {
  const minute = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minute}:${rest}`;
}

function Rating({ value, label }: { value: number; label: string }) {
  return (
    <span className="rating" aria-label={`${label} ${value} / 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <i className={index < value ? "filled" : ""} key={index} />
      ))}
    </span>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [experience, setExperience] = useState<ExperienceId>("growing");
  const [roadmapSort, setRoadmapSort] = useState<"importance" | "difficulty" | "days">(
    "importance",
  );
  const [roadmapCategory, setRoadmapCategory] = useState("全部");
  const [expandedKnowledge, setExpandedKnowledge] = useState<string>("ai-ui");
  const [roleFilter, setRoleFilter] = useState("全部");
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [questionRole, setQuestionRole] = useState("全部");
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(questions[0]);
  const [answer, setAnswer] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [review, setReview] = useState<null | {
    score: number;
    structure: number;
    evidence: number;
    depth: number;
    missing: string[];
  }>(null);
  const [completedPractice, setCompletedPractice] = useState<string[]>([]);

  const level = experienceLevels.find((item) => item.id === experience)!;

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as TabId;
    if (tabs.some((tab) => tab.id === hash)) setActiveTab(hash);
    const savedExperience = window.localStorage.getItem("frontend-ai-experience");
    if (savedExperience && experienceLevels.some((item) => item.id === savedExperience)) {
      setExperience(savedExperience as ExperienceId);
    }
    const savedPractice = window.localStorage.getItem("frontend-ai-practice-v2");
    if (savedPractice) setCompletedPractice(JSON.parse(savedPractice) as string[]);
  }, []);

  useEffect(() => {
    if (activeTab !== "interview" || review) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [activeTab, review, selectedQuestion]);

  function switchTab(tab: TabId) {
    setActiveTab(tab);
    window.history.replaceState(null, "", `#${tab}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseExperience(value: ExperienceId) {
    setExperience(value);
    window.localStorage.setItem("frontend-ai-experience", value);
  }

  const sortedKnowledge = useMemo(() => {
    return knowledge
      .filter((item) => roadmapCategory === "全部" || item.category === roadmapCategory)
      .map((item) => ({
        ...item,
        adjustedDays: Math.max(3, Math.round(item.days * level.multiplier)),
      }))
      .sort((a, b) =>
        roadmapSort === "days"
          ? b.adjustedDays - a.adjustedDays
          : b[roadmapSort] - a[roadmapSort],
      );
  }, [level.multiplier, roadmapCategory, roadmapSort]);

  const filteredJobs = useMemo(() => {
    const list = roleFilter === "全部" ? jobs : jobs.filter((job) => job.role === roleFilter);
    return showAllJobs ? list : list.slice(0, 6);
  }, [roleFilter, showAllJobs]);

  const filteredQuestions = useMemo(
    () =>
      questions.filter(
        (question) => questionRole === "全部" || question.role.includes(questionRole),
      ),
    [questionRole],
  );

  function chooseQuestion(question: Question) {
    setSelectedQuestion(question);
    setAnswer("");
    setReview(null);
    setSeconds(0);
  }

  function submitAnswer() {
    const normalized = answer.toLowerCase();
    const hitCount = selectedQuestion.keywords.filter((keyword) =>
      normalized.includes(keyword.toLowerCase()),
    ).length;
    const coverage = hitCount / selectedQuestion.keywords.length;
    const lengthFactor = Math.min(answer.trim().length / 500, 1);
    const structure = Math.min(98, Math.round(46 + lengthFactor * 28 + coverage * 24));
    const evidence = Math.min(
      98,
      Math.round(
        36 +
          (/\d|%|用户|指标|ms|秒|成本|结果/.test(answer) ? 34 : 0) +
          coverage * 24,
      ),
    );
    const depth = Math.min(
      98,
      Math.round(
        38 +
          (/(取舍|权衡|失败|边界|复盘|对比|因为)/.test(answer) ? 31 : 0) +
          coverage * 26,
      ),
    );
    setReview({
      score: Math.min(96, Math.round(structure * 0.34 + evidence * 0.32 + depth * 0.34)),
      structure,
      evidence,
      depth,
      missing: selectedQuestion.keywords
        .filter((keyword) => !normalized.includes(keyword.toLowerCase()))
        .slice(0, 4),
    });
  }

  function nextQuestion() {
    const current = filteredQuestions.findIndex(
      (question) => question.id === selectedQuestion.id,
    );
    chooseQuestion(
      filteredQuestions[(current + 1) % filteredQuestions.length] ?? questions[0],
    );
  }

  function togglePractice(tag: string) {
    const next = completedPractice.includes(tag)
      ? completedPractice.filter((item) => item !== tag)
      : [...completedPractice, tag];
    setCompletedPractice(next);
    window.localStorage.setItem("frontend-ai-practice-v2", JSON.stringify(next));
  }

  return (
    <div className="app">
      <header className="global-nav">
        <button className="wordmark" onClick={() => switchTab("home")} aria-label="前端向 AI 首页">
          <span className="wordmark-icon">F</span>
          <span>Frontend to AI</span>
        </button>
        <nav className="tab-bar" role="tablist" aria-label="网站模块">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => switchTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button className="nav-action" onClick={() => switchTab("interview")}>
          开始训练
        </button>
      </header>

      <main className="module-stage" key={activeTab}>
        {activeTab === "home" && (
          <section className="home-module module">
            <div className="hero-copy">
              <p className="overline">A PRACTICAL GUIDE FOR EVERY FRONTEND DEVELOPER</p>
              <h1>
                让前端，
                <br />
                向<span>智能</span>生长。
              </h1>
              <p className="hero-description">
                AI 的接口持续变化，但优秀前端工程师最擅长的事从未改变：
                理解用户、组织复杂性、打磨体验并可靠交付。这里提供一条不绑定模型与厂商的转型路径。
              </p>
              <div className="hero-buttons">
                <button className="primary-button" onClick={() => switchTab("roadmap")}>
                  查看学习路线
                </button>
                <button className="text-button" onClick={() => switchTab("roles")}>
                  探索岗位方向 <span>›</span>
                </button>
              </div>
            </div>

            <div className="hero-product" aria-hidden="true">
              <div className="ambient-orb orb-one" />
              <div className="ambient-orb orb-two" />
              <div className="product-frame">
                <div className="product-bar">
                  <span><i /><i /><i /></span>
                  <b>AI Workbench</b>
                  <em>● LIVE</em>
                </div>
                <div className="product-body">
                  <aside>
                    <span className="mini-logo">F</span>
                    <i className="selected" />
                    <i />
                    <i />
                    <i />
                  </aside>
                  <div className="product-canvas">
                    <div className="canvas-greeting">今天想构建什么？</div>
                    <div className="prompt-card">
                      <span>为这个产品设计一个可解释、可撤销的 AI 工作流</span>
                      <b>↑</b>
                    </div>
                    <div className="tool-row">
                      <span>◉ 设计规范</span><span>⌁ 产品数据</span><span>＋ 添加工具</span>
                    </div>
                  </div>
                  <div className="insight-panel">
                    <small>QUALITY SIGNAL</small>
                    <strong>92</strong>
                    <span>答案引用完整度</span>
                    <div><i style={{ width: "92%" }} /></div>
                    <p>3 个来源 · 1 项待确认</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="experience-card">
              <div>
                <small>先选择你的阶段</small>
                <h2>每个前端，都有自己的最短路径。</h2>
              </div>
              <div className="experience-options">
                {experienceLevels.map((item) => (
                  <button
                    key={item.id}
                    className={experience === item.id ? "active" : ""}
                    onClick={() => chooseExperience(item.id)}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.caption}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bento-grid">
              <article className="bento-card bento-dark">
                <small>长期复利</small>
                <h3>模型会换。<br />能力不会。</h3>
                <div className="orbit">
                  <span>评测</span><span>体验</span><span>可靠性</span><span>数据</span>
                  <i>AI</i>
                </div>
              </article>
              <article className="bento-card">
                <small>学习地图</small>
                <strong className="bento-number">14</strong>
                <p>知识模块 · 每块 3 条优质资源</p>
                <button onClick={() => switchTab("roadmap")}>打开路线图 ›</button>
              </article>
              <article className="bento-card bento-blue">
                <small>北京岗位样本</small>
                <strong className="bento-number">12</strong>
                <p>真实 JD 与薪资 · 每条均可溯源</p>
                <button onClick={() => switchTab("roles")}>查看岗位 ›</button>
              </article>
              <article className="bento-card bento-wide">
                <div>
                  <small>真实面经训练</small>
                  <h3>高频问题，不只给答案。<br />还要练证据与取舍。</h3>
                </div>
                <div className="score-preview">
                  <span><b>结构</b><i><em style={{ width: "86%" }} /></i></span>
                  <span><b>证据</b><i><em style={{ width: "72%" }} /></i></span>
                  <span><b>深度</b><i><em style={{ width: "91%" }} /></i></span>
                </div>
                <button onClick={() => switchTab("interview")}>进入模拟面试 ›</button>
              </article>
            </div>
          </section>
        )}

        {activeTab === "roadmap" && (
          <section className="roadmap-module module">
            <div className="module-hero centered">
              <p className="overline">KNOWLEDGE ROADMAP</p>
              <h1>学会不容易过时的东西。</h1>
              <p>
                当前选择：{level.label}前端。学习日已按这一阶段调整；建议每周投入 12—20 小时，并用一个贯穿项目验证所有知识。
              </p>
              <div className="inline-levels">
                {experienceLevels.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => chooseExperience(item.id)}
                    className={experience === item.id ? "active" : ""}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="roadmap-toolbar">
              <div className="filter-tabs">
                {["全部", "底层", "前端", "应用", "设计", "工程", "质量", "进阶"].map(
                  (item) => (
                    <button
                      key={item}
                      className={roadmapCategory === item ? "active" : ""}
                      onClick={() => setRoadmapCategory(item)}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
              <label>
                排序
                <select
                  value={roadmapSort}
                  onChange={(event) =>
                    setRoadmapSort(event.target.value as typeof roadmapSort)
                  }
                >
                  <option value="importance">重要程度</option>
                  <option value="difficulty">学习难度</option>
                  <option value="days">预计时长</option>
                </select>
              </label>
            </div>

            <div className="roadmap-list">
              {sortedKnowledge.map((item, index) => {
                const expanded = expandedKnowledge === item.id;
                return (
                  <article className={expanded ? "expanded" : ""} key={item.id}>
                    <button
                      className="roadmap-summary"
                      onClick={() => setExpandedKnowledge(expanded ? "" : item.id)}
                      aria-expanded={expanded}
                    >
                      <span className="roadmap-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="roadmap-name">
                        <small>{item.category}{item.optional ? " · 选修" : ""}</small>
                        <strong>{item.name}</strong>
                        <em>{item.why}</em>
                      </span>
                      <span className="roadmap-metric">
                        <small>重要</small><Rating value={item.importance} label="重要程度" />
                      </span>
                      <span className="roadmap-metric">
                        <small>难度</small><Rating value={item.difficulty} label="学习难度" />
                      </span>
                      <span className="roadmap-days">
                        <strong>{item.adjustedDays}</strong><small>天</small>
                      </span>
                      <span className="disclosure">{expanded ? "−" : "+"}</span>
                    </button>
                    {expanded && (
                      <div className="roadmap-detail">
                        <div className="output-card">
                          <small>完成标准</small>
                          <h3>学完之后，你应该能——</h3>
                          <p>{item.outcome}</p>
                        </div>
                        <div className="learning-resources">
                          {item.resources.map((resource, resourceIndex) => (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noreferrer"
                              key={resource.title}
                            >
                              <span>{resourceIndex + 1}</span>
                              <div>
                                <small>{resource.provider} · {resource.lang}</small>
                                <strong>{resource.title}</strong>
                                <p>{resource.note}</p>
                              </div>
                              <b>↗</b>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === "roles" && (
          <section className="roles-module module">
            <div className="module-hero">
              <p className="overline">ROLE FINDER · BEIJING SNAPSHOT</p>
              <h1>前端经验，<br />可以迁移到哪里？</h1>
              <p>
                四条路线都从前端已有能力出发。岗位优先级随经验阶段变化；公开 JD 与薪资快照采集于 2026-07-28。
              </p>
            </div>

            <div className="role-carousel">
              {[...rolePaths]
                .sort((a, b) => b.fits[experience] - a.fits[experience])
                .map((role, index) => (
                  <article className={`role-path ${role.accent}`} key={role.id}>
                    <div className="role-top">
                      <span>0{index + 1}</span>
                      <strong>{role.fits[experience]}% 相关度</strong>
                    </div>
                    <small>{role.en}</small>
                    <h2>{role.name}</h2>
                    <p>{role.description}</p>
                    <div className="role-columns">
                      <div>
                        <small>你已拥有</small>
                        {role.bridge.map((item) => <span key={item}>✓ {item}</span>)}
                      </div>
                      <div>
                        <small>下一步补齐</small>
                        {role.learn.map((item) => <span key={item}>＋ {item}</span>)}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setQuestionRole(
                          role.id === "AI 体验 / 原型" ? "AI 产品前端" : role.id,
                        );
                        switchTab("interview");
                      }}
                    >
                      训练这个岗位 <b>›</b>
                    </button>
                  </article>
                ))}
            </div>

            <div className="jobs-section">
              <div className="jobs-heading">
                <div>
                  <small>TRACEABLE JOB LIBRARY</small>
                  <h2>真实岗位快照</h2>
                </div>
                <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                  <option>全部</option>
                  {[...new Set(jobs.map((job) => job.role))].map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="job-list">
                {filteredJobs.map((job) => (
                  <a href={job.source} target="_blank" rel="noreferrer" key={`${job.company}-${job.title}`}>
                    <span className="company-monogram">{job.company.slice(0, 1)}</span>
                    <div className="job-title">
                      <small>{job.company} · 北京</small>
                      <strong>{job.title}</strong>
                      <p>{job.keywords.join(" · ")}</p>
                    </div>
                    <div className="job-pay">
                      <strong>{job.salary}</strong>
                      <span>{job.months} · {job.experience}</span>
                    </div>
                    <span className="job-arrow">↗</span>
                  </a>
                ))}
              </div>
              <button className="show-more" onClick={() => setShowAllJobs((value) => !value)}>
                {showAllJobs ? "收起岗位" : `查看全部 ${roleFilter === "全部" ? jobs.length : jobs.filter((job) => job.role === roleFilter).length} 条岗位`}
              </button>
              <p className="data-note">
                薪资为公开页面税前标注，不含股票、奖金与职级差异；职位可能下线，原始链接用于保留样本来源。
              </p>
            </div>
          </section>
        )}

        {activeTab === "interview" && (
          <section className="interview-module module">
            <div className="interview-intro">
              <p className="overline">INTERVIEW STUDIO</p>
              <h1>把“我会”，<br />变成可信的证据。</h1>
              <p>
                题库由 8 组 2026 年公开面经聚合。选择问题、限时口述，再写下关键证据；复盘只在当前设备完成。
              </p>
              <label>
                目标岗位
                <select
                  value={questionRole}
                  onChange={(event) => {
                    const nextRole = event.target.value;
                    setQuestionRole(nextRole);
                    const next =
                      questions.find(
                        (question) =>
                          nextRole === "全部" || question.role.includes(nextRole),
                      ) ?? questions[0];
                    chooseQuestion(next);
                  }}
                >
                  <option>全部</option>
                  <option>AI 产品前端</option>
                  <option>AI Native 全栈</option>
                  <option>Agent 应用工程</option>
                  <option>大模型应用算法</option>
                </select>
              </label>
            </div>

            <div className="interview-workspace">
              <aside className="question-rail">
                <div className="rail-title">
                  <strong>{filteredQuestions.length} 个高频主题</strong>
                  <span>按样本热度</span>
                </div>
                <div className="rail-scroll">
                  {filteredQuestions.map((question, index) => (
                    <button
                      key={question.id}
                      className={selectedQuestion.id === question.id ? "active" : ""}
                      onClick={() => chooseQuestion(question)}
                    >
                      <span>Q{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <small>{question.category} · {question.frequency}/8 命中</small>
                        <strong>{question.question}</strong>
                      </div>
                    </button>
                  ))}
                </div>
              </aside>

              <section className="answer-studio">
                <div className="studio-top">
                  <span>本轮 · {selectedQuestion.category}</span>
                  <time>{formatTime(seconds)}</time>
                </div>
                <h2>{selectedQuestion.question}</h2>
                <p className="question-why">{selectedQuestion.why}</p>
                <div className="answer-steps">
                  {selectedQuestion.answerFrame.map((step, index) => (
                    <span key={step}><b>{index + 1}</b>{step}</span>
                  ))}
                </div>
                <label className="answer-field">
                  <span>口述后，写下关键证据</span>
                  <textarea
                    value={answer}
                    disabled={Boolean(review)}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder="建议 300—600 字。先给结论，再讲场景、架构、关键取舍、量化结果和复盘……"
                  />
                  <small>{answer.length} 字 · 回答不会上传</small>
                </label>
                {!review ? (
                  <button
                    className="review-button"
                    disabled={answer.trim().length < 80}
                    onClick={submitAnswer}
                  >
                    生成本轮复盘
                  </button>
                ) : (
                  <div className="review-result">
                    <div className="total-score">
                      <strong>{review.score}</strong><span>本轮得分<br />/ 100</span>
                    </div>
                    <div className="dimension-scores">
                      {[
                        ["结构", review.structure],
                        ["证据", review.evidence],
                        ["深度", review.depth],
                      ].map(([label, value]) => (
                        <div key={label as string}>
                          <span>{label}</span><i><b style={{ width: `${value}%` }} /></i><em>{value}</em>
                        </div>
                      ))}
                    </div>
                    <p>
                      {review.missing.length
                        ? `下一轮请主动补齐：${review.missing.join("、")}，并加入一个失败案例与量化结果。`
                        : "关键概念覆盖完整。下一轮请压缩到两分钟，并增加一个反例或关键权衡。"}
                    </p>
                    <button onClick={nextQuestion}>下一题</button>
                  </div>
                )}
                <details className="source-drawer">
                  <summary>查看这道题的面经来源</summary>
                  <div>
                    {selectedQuestion.sourceIds.map((sourceId) => {
                      const source = interviewSources.find((item) => item.id === sourceId);
                      return source ? (
                        <a href={source.url} target="_blank" rel="noreferrer" key={sourceId}>
                          {source.label} ↗
                        </a>
                      ) : null;
                    })}
                  </div>
                </details>
              </section>
            </div>
          </section>
        )}

        {activeTab === "practice" && (
          <section className="practice-module module">
            <div className="module-hero centered">
              <p className="overline">DELIBERATE PRACTICE</p>
              <h1>每天进步一点，<br />最终形成新的职业身份。</h1>
              <p>一次只练一个薄弱点。完成记录保存在当前设备，你可以反复清空、重练和比较表达质量。</p>
              <div className="completion-ring">
                <strong>{completedPractice.length}</strong>
                <span>/ {practices.length}<br />本轮完成</span>
              </div>
            </div>

            <div className="practice-grid">
              {practices.map((practice, index) => {
                const done = completedPractice.includes(practice.tag);
                return (
                  <article className={done ? "done" : ""} key={practice.tag}>
                    <button
                      onClick={() => togglePractice(practice.tag)}
                      aria-label={`${done ? "取消完成" : "标记完成"} ${practice.tag}`}
                    >
                      {done ? "✓" : ""}
                    </button>
                    <small>0{index + 1} · {practice.minutes} MIN</small>
                    <h2>{practice.tag}</h2>
                    <p>{practice.task}</p>
                    <span>{done ? "已完成" : "下一项"}</span>
                  </article>
                );
              })}
            </div>

            <div className="milestone-section">
              <div>
                <small>180-DAY SYSTEM</small>
                <h2>一个项目，串起六个阶段。</h2>
                <p>
                  选择你真正关心的业务问题。每 30 天增加一层能力，而不是做六个互不相关的 Demo。
                </p>
              </div>
              <div className="milestones">
                {milestones.map((milestone, index) => (
                  <article key={milestone.days}>
                    <span>{index + 1}</span>
                    <small>DAY {milestone.days}</small>
                    <h3>{milestone.title}</h3>
                    <p>{milestone.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="project-callout">
              <div className="project-orb" />
              <small>CAPSTONE IDEA</small>
              <h2>做一个真正有人用的 AI 产品。</h2>
              <p>
                例如：设计评审 Agent、代码库知识助手、可访问性诊断器、运营素材工作台。
                关键不是题目，而是展示真实用户、失败样本、评测指标与工程取舍。
              </p>
              <button onClick={() => switchTab("roadmap")}>从路线图开始</button>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <span>Frontend to AI</span>
        <p>面向所有前端开发者的 AI 转型路线图 · 北京岗位快照 2026-07-28</p>
        <button onClick={() => switchTab("home")}>返回概览 ↑</button>
      </footer>
    </div>
  );
}
