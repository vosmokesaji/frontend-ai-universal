"use client";

import { useEffect, useMemo, useState } from "react";
import {
  flashcards,
  interviewSources,
  jobs,
  knowledge,
  knowledgeGraph,
  practices,
  questions,
  rolePaths,
  type ExperienceId,
  type QuestionV3,
} from "./data-v3";

type TabId = "home" | "roadmap" | "roles" | "interview" | "practice";
type RoadmapSortKey = "importance" | "difficulty" | "days";
type ResourceSortKey = "ease" | "professional";

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
  const [roadmapSort, setRoadmapSort] = useState<RoadmapSortKey>("importance");
  const [roadmapSortDirection, setRoadmapSortDirection] = useState<"asc" | "desc">(
    "desc",
  );
  const [resourceSort, setResourceSort] = useState<ResourceSortKey>("ease");
  const [roadmapCategory, setRoadmapCategory] = useState("全部");
  const [expandedKnowledge, setExpandedKnowledge] = useState<string>("ai-ui");
  const [roleFilter, setRoleFilter] = useState("全部");
  const [jobSearch, setJobSearch] = useState("");
  const [jobVisibleCount, setJobVisibleCount] = useState(12);
  const [questionRole, setQuestionRole] = useState("全部");
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionV3>(questions[0]);
  const [answer, setAnswer] = useState("");
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("点击麦克风开始口述，识别结果会实时转成文字。");
  const [seconds, setSeconds] = useState(0);
  const [review, setReview] = useState<null | {
    score: number;
    structure: number;
    evidence: number;
    depth: number;
    missing: string[];
    engine: "local" | "model";
    strengths: string[];
    improvements: { point: string; example: string }[];
  }>(null);
  const [completedPractice, setCompletedPractice] = useState<string[]>([]);
  const [practiceMode, setPracticeMode] = useState<"flashcards" | "graph" | "drills">(
    "flashcards",
  );
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<string[]>([]);
  const [selectedGraphNode, setSelectedGraphNode] = useState("product");

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
      .sort((a, b) => {
        const delta =
          roadmapSort === "days"
            ? a.adjustedDays - b.adjustedDays
            : a[roadmapSort] - b[roadmapSort];
        return roadmapSortDirection === "desc" ? -delta : delta;
      });
  }, [level.multiplier, roadmapCategory, roadmapSort, roadmapSortDirection]);

  const filteredJobs = useMemo(() => {
    const query = jobSearch.trim().toLowerCase();
    return jobs.filter((job) => {
      const roleMatch = roleFilter === "全部" || job.role === roleFilter;
      const text = `${job.company}${job.title}${job.team}${job.keywords.join("")}`.toLowerCase();
      return roleMatch && (!query || text.includes(query));
    });
  }, [jobSearch, roleFilter]);

  const filteredQuestions = useMemo(
    () =>
      questions.filter(
        (question) => questionRole === "全部" || question.role.includes(questionRole),
      ),
    [questionRole],
  );

  function chooseQuestion(question: QuestionV3) {
    setSelectedQuestion(question);
    setAnswer("");
    setReview(null);
    setSeconds(0);
    setIsListening(false);
  }

  function toggleRoadmapSort(key: RoadmapSortKey) {
    if (roadmapSort === key) {
      setRoadmapSortDirection((direction) => (direction === "desc" ? "asc" : "desc"));
      return;
    }
    setRoadmapSort(key);
    setRoadmapSortDirection("desc");
  }

  function startVoiceInput() {
    type RecognitionEvent = {
      results: ArrayLike<{
        0: { transcript: string };
        isFinal: boolean;
      }>;
    };
    type Recognition = {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      start: () => void;
      stop: () => void;
      onresult: ((event: RecognitionEvent) => void) | null;
      onend: (() => void) | null;
      onerror: (() => void) | null;
    };
    type RecognitionConstructor = new () => Recognition;
    const voiceWindow = window as typeof window & {
      SpeechRecognition?: RecognitionConstructor;
      webkitSpeechRecognition?: RecognitionConstructor;
    };
    const RecognitionApi =
      voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition;
    if (!RecognitionApi) {
      setVoiceMessage("当前浏览器不支持语音识别，已切换到文本输入。");
      setInputMode("text");
      return;
    }
    const recognition = new RecognitionApi();
    recognition.lang = "zh-CN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let finalText = "";
      for (let index = 0; index < event.results.length; index += 1) {
        if (event.results[index].isFinal) finalText += event.results[index][0].transcript;
      }
      if (finalText) setAnswer((value) => `${value}${value ? " " : ""}${finalText}`);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setVoiceMessage("没有识别到声音，请检查麦克风权限后重试，或切换文本输入。");
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
    setVoiceMessage("正在聆听…请像真实面试一样完整回答。");
    window.setTimeout(() => recognition.stop(), 180000);
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
      engine: "local",
      strengths: [
        hitCount
          ? `覆盖了 ${hitCount} 个关键概念，核心术语与题目方向一致。`
          : "已经形成完整回答，可以继续补充更明确的技术关键词。",
        /\d|%|用户|指标|ms|秒|成本|结果/.test(answer)
          ? "回答中出现了数据或结果证据，这是可信度最高的部分。"
          : "表达具备基本结构，下一步需要用数据证明结果。",
      ],
      improvements: [
        {
          point: "补足缺失概念，并说明它们和你的方案有什么关系。",
          example: `“在${selectedQuestion.reference.evidence[0]}之外，我还会说明 ${selectedQuestion.keywords
            .filter((keyword) => !normalized.includes(keyword.toLowerCase()))
            .slice(0, 2)
            .join("、") || "失败边界与回滚策略"}，因为这决定方案是否能进入生产。”`,
        },
        {
          point: "增加一个失败样本或没有选择另一方案的原因。",
          example: selectedQuestion.reference.example,
        },
      ],
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

  function rateFlashcard(known: boolean) {
    const current = flashcards[flashcardIndex];
    if (known && !knownCards.includes(current.id)) {
      setKnownCards((items) => [...items, current.id]);
    }
    if (!known) setKnownCards((items) => items.filter((id) => id !== current.id));
    setFlashcardFlipped(false);
    setFlashcardIndex((index) => (index + 1) % flashcards.length);
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
                <p>知识模块 · 每块 6 条中英文优质资源</p>
                <button onClick={() => switchTab("roadmap")}>打开路线图 ›</button>
              </article>
              <article className="bento-card bento-blue">
                <small>北京岗位样本</small>
                <strong className="bento-number">100</strong>
                <p>10 类岗位 · 中大厂招聘入口可溯源</p>
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
              <span className="toolbar-hint">点击表头即可排序，再点一次切换升降序</span>
            </div>

            <div className="roadmap-list">
              <div className="roadmap-table-head" role="row">
                <span>#</span>
                <span>知识模块</span>
                {[
                  ["importance", "重要程度"],
                  ["difficulty", "学习难度"],
                  ["days", "预计时长"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => toggleRoadmapSort(key as RoadmapSortKey)}
                    className={roadmapSort === key ? "active" : ""}
                  >
                    {label}
                    <i>
                      {roadmapSort === key
                        ? roadmapSortDirection === "desc"
                          ? "↓"
                          : "↑"
                        : "↕"}
                    </i>
                  </button>
                ))}
                <span aria-hidden="true" />
              </div>
              {sortedKnowledge.map((item, index) => {
                const expanded = expandedKnowledge === item.id;
                const sortedResources = [...item.resources].sort(
                  (a, b) => b[resourceSort] - a[resourceSort],
                );
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
                        <div className="knowledge-position">
                          <div className="position-heading">
                            <div>
                              <small>KNOWLEDGE POSITIONING</small>
                              <h3>先拿下 20% 的高价值知识，再决定是否深挖。</h3>
                            </div>
                            <p>{item.outcome}</p>
                          </div>
                          <div className="level-ladder">
                            {item.levels.map((knowledgeLevel, levelIndex) => (
                              <article
                                className={levelIndex === 0 ? "priority" : ""}
                                key={knowledgeLevel.title}
                              >
                                <div>
                                  <span>{levelIndex + 1}</span>
                                  <strong>{knowledgeLevel.title}</strong>
                                </div>
                                <small>{knowledgeLevel.effort}</small>
                                <em>{knowledgeLevel.share}</em>
                                <ul>
                                  {knowledgeLevel.items.map((levelItem) => (
                                    <li key={levelItem}>{levelItem}</li>
                                  ))}
                                </ul>
                              </article>
                            ))}
                          </div>
                        </div>

                        <div className="resource-section">
                          <div className="resource-heading">
                            <div>
                              <small>6 CURATED RESOURCES</small>
                              <h3>3 条中文 + 3 条国际资源</h3>
                              <p className="resource-method">
                                易懂度综合公开学习者口碑与课程结构；专业度按内容深度、完整性和权威性评审。
                              </p>
                            </div>
                            <div className="resource-sort" aria-label="教程排序">
                              <span>教程排序</span>
                              <button
                                className={resourceSort === "ease" ? "active" : ""}
                                onClick={() => setResourceSort("ease")}
                              >
                                易学易懂
                              </button>
                              <button
                                className={resourceSort === "professional" ? "active" : ""}
                                onClick={() => setResourceSort("professional")}
                              >
                                专业程度
                              </button>
                            </div>
                          </div>
                          <div className="learning-resources">
                          {sortedResources.map((resource, resourceIndex) => (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noreferrer"
                              key={resource.title}
                            >
                              <span>{resourceIndex + 1}</span>
                              <div>
                                <small>
                                  {resource.provider} · {resource.lang} · {resource.audience}
                                </small>
                                <strong>{resource.title}</strong>
                                <p>{resource.note}</p>
                                <em>
                                  易懂 {resource.ease.toFixed(1)}
                                  <i style={{ width: `${resource.ease * 10}%` }} />
                                  专业 {resource.professional.toFixed(1)}
                                  <i style={{ width: `${resource.professional * 10}%` }} />
                                </em>
                              </div>
                              <b>↗</b>
                            </a>
                          ))}
                          </div>
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
                10 条路线都从前端已有能力出发。岗位优先级随经验阶段变化；100
                条北京招聘观察卡来自中大厂公开招聘入口，更新于 2026-07-29。
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
                        setQuestionRole(role.id);
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
                  <h2>100 条招聘观察卡</h2>
                </div>
                <div className="job-controls">
                  <input
                    value={jobSearch}
                    onChange={(event) => {
                      setJobSearch(event.target.value);
                      setJobVisibleCount(12);
                    }}
                    placeholder="搜索公司、岗位或技术关键词"
                    aria-label="搜索岗位"
                  />
                  <select
                    value={roleFilter}
                    onChange={(event) => {
                      setRoleFilter(event.target.value);
                      setJobVisibleCount(12);
                    }}
                  >
                    <option>全部</option>
                    {rolePaths.map((role) => (
                      <option key={role.id}>{role.id}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="job-stats">
                <span><strong>10</strong> 种岗位类型</span>
                <span><strong>{jobs.length}</strong> 条观察卡</span>
                <span><strong>{new Set(jobs.map((job) => job.company)).size}</strong> 家中大厂</span>
                <span><strong>{filteredJobs.length}</strong> 条当前结果</span>
              </div>
              <div className="job-list">
                {filteredJobs.slice(0, jobVisibleCount).map((job) => (
                  <a href={job.source} target="_blank" rel="noreferrer" key={job.id}>
                    <span className="company-monogram">{job.company.slice(0, 1)}</span>
                    <div className="job-title">
                      <small>{job.company} · 北京 · {job.team}</small>
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
              {jobVisibleCount < filteredJobs.length && (
                <button
                  className="show-more"
                  onClick={() => setJobVisibleCount((count) => count + 12)}
                >
                  再加载 12 条 · 剩余 {filteredJobs.length - jobVisibleCount} 条
                </button>
              )}
              <p className="data-note">
                每种岗位覆盖至少 10 家中大厂。链接指向公司官方招聘入口，职位会动态上下线；薪资为北京市场公开样本区间，仅用于比较方向，不代表具体 Offer。
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
                题库由 {interviewSources.length} 组公开面经样本聚合。首选语音模拟真实面试，也可切换文本；参考答案在选题时即刻可用。
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
                  {rolePaths.map((role) => (
                    <option key={role.id}>{role.id}</option>
                  ))}
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
                        <small>
                          {question.category} · {question.frequency}/{interviewSources.length} 组命中
                        </small>
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
                <div className="question-purpose">
                  <div className="purpose-icon">◎</div>
                  <div>
                    <small>面试官为什么问 · QUESTION INTENT</small>
                    <strong>{selectedQuestion.purpose.tests}</strong>
                    <p>{selectedQuestion.purpose.expects}</p>
                  </div>
                </div>
                <div className="answer-steps">
                  {selectedQuestion.answerFrame.map((step, index) => (
                    <span key={step}><b>{index + 1}</b>{step}</span>
                  ))}
                </div>

                <div className="input-mode-switch" role="tablist" aria-label="回答方式">
                  <button
                    className={inputMode === "voice" ? "active" : ""}
                    onClick={() => setInputMode("voice")}
                  >
                    <span>●</span> 语音回答 <em>首选</em>
                  </button>
                  <button
                    className={inputMode === "text" ? "active" : ""}
                    onClick={() => setInputMode("text")}
                  >
                    文本回答
                  </button>
                </div>

                {inputMode === "voice" && !review && (
                  <div className={`voice-recorder ${isListening ? "listening" : ""}`}>
                    <button onClick={startVoiceInput} disabled={isListening}>
                      <span className="voice-rings"><i /><i /><b>⌁</b></span>
                      <strong>{isListening ? "正在聆听" : "开始语音回答"}</strong>
                      <small>{isListening ? "最长 3 分钟 · 自动转写" : "点击后请允许麦克风权限"}</small>
                    </button>
                    <p>{voiceMessage}</p>
                  </div>
                )}

                <label className={`answer-field ${inputMode === "voice" ? "transcript" : ""}`}>
                  <span>{inputMode === "voice" ? "语音转写 · 可手动修正" : "输入完整回答"}</span>
                  <textarea
                    value={answer}
                    disabled={Boolean(review)}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder="建议 300—600 字。先给结论，再讲场景、架构、关键取舍、量化结果和复盘……"
                  />
                  <small>{answer.length} 字 · 本地评估时不会上传</small>
                </label>
                {!review ? (
                  <>
                    <button
                      className="review-button"
                      disabled={answer.trim().length < 80}
                      onClick={submitAnswer}
                    >
                      生成结构化复盘
                    </button>
                    <p className="model-status">
                      <span>AI</span>
                      模型评分接口待配置；当前先使用透明的本地规则评估，不会冒充模型结果。
                    </p>
                  </>
                ) : (
                  <div className="review-result">
                    <div className="review-engine">
                      <span>{review.engine === "model" ? "AI 模型评分" : "本地结构化评估"}</span>
                      {review.engine === "local" && <em>待接入模型后自动升级</em>}
                    </div>
                    <div className="review-score-row">
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
                    </div>

                    <div className="answer-annotation">
                      <small>答案标记 · 绿色为表现较好的证据和关键概念</small>
                      <p>
                        {answer.split(/([。！？；\n])/).map((sentence, index) => {
                          const strong =
                            selectedQuestion.keywords.some((keyword) =>
                              sentence.toLowerCase().includes(keyword.toLowerCase()),
                            ) || /\d|%|用户|指标|结果|成本/.test(sentence);
                          return strong ? (
                            <mark key={`${sentence}-${index}`}>{sentence}</mark>
                          ) : (
                            <span key={`${sentence}-${index}`}>{sentence}</span>
                          );
                        })}
                      </p>
                    </div>

                    <div className="review-columns">
                      <section className="review-strengths">
                        <small>优秀点</small>
                        {review.strengths.map((strength) => (
                          <p key={strength}>✓ {strength}</p>
                        ))}
                      </section>
                      <section className="review-improvements">
                        <small>不足与改进示例</small>
                        {review.improvements.map((improvement) => (
                          <article key={improvement.point}>
                            <strong>{improvement.point}</strong>
                            <p>{improvement.example}</p>
                          </article>
                        ))}
                      </section>
                    </div>
                    <button onClick={nextQuestion}>下一题</button>
                  </div>
                )}

                <details className="reference-answer">
                  <summary>
                    <span>结构化参考答案</span>
                    <em>选题后即可查看，无需模型生成</em>
                  </summary>
                  <div className="reference-content">
                    <section className="reference-thesis">
                      <small>一句话主张</small>
                      <strong>{selectedQuestion.reference.thesis}</strong>
                    </section>
                    <div className="reference-grid">
                      {selectedQuestion.reference.sections.map((section, index) => (
                        <article key={section.label}>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <strong>{section.label}</strong>
                          <p>{section.content}</p>
                        </article>
                      ))}
                    </div>
                    <div className="reference-evidence">
                      <section>
                        <small>必须给出的证据</small>
                        {selectedQuestion.reference.evidence.map((item) => (
                          <p key={item}>＋ {item}</p>
                        ))}
                      </section>
                      <section>
                        <small>常见失分点</small>
                        {selectedQuestion.reference.pitfalls.map((item) => (
                          <p key={item}>× {item}</p>
                        ))}
                      </section>
                    </div>
                    <blockquote>{selectedQuestion.reference.example}</blockquote>
                  </div>
                </details>
                <details className="source-drawer">
                  <summary>
                    查看这道题的 {selectedQuestion.sourceIds.length} 组面经来源
                  </summary>
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
              <p>用主动回忆代替“看懂了”的错觉：闪卡练概念，知识图谱找位置，专项任务练输出。</p>
              <div className="completion-ring">
                <strong>{knownCards.length}</strong>
                <span>/ {flashcards.length}<br />闪卡掌握</span>
              </div>
            </div>

            <div className="practice-mode-tabs" role="tablist" aria-label="刻意练习模式">
              {[
                ["flashcards", "闪卡练习", "主动回忆"],
                ["graph", "知识图谱", "定位与路径"],
                ["drills", "专项任务", "真实输出"],
              ].map(([id, label, caption]) => (
                <button
                  key={id}
                  className={practiceMode === id ? "active" : ""}
                  onClick={() => setPracticeMode(id as typeof practiceMode)}
                >
                  <strong>{label}</strong><span>{caption}</span>
                </button>
              ))}
            </div>

            {practiceMode === "flashcards" && (
              <div className="flashcard-lab">
                <div className="flashcard-progress">
                  <span>
                    CARD {String(flashcardIndex + 1).padStart(2, "0")} / {flashcards.length}
                  </span>
                  <i>
                    <b style={{ width: `${((flashcardIndex + 1) / flashcards.length) * 100}%` }} />
                  </i>
                  <em>{knownCards.length} 张已掌握</em>
                </div>
                <button
                  className={`flashcard ${flashcardFlipped ? "flipped" : ""}`}
                  onClick={() => setFlashcardFlipped((value) => !value)}
                >
                  <small>{flashcards[flashcardIndex].category}</small>
                  <div className="flashcard-front">
                    <span>问题</span>
                    <h2>{flashcards[flashcardIndex].front}</h2>
                    <p>提示：{flashcards[flashcardIndex].hint}</p>
                  </div>
                  <div className="flashcard-back">
                    <span>答案</span>
                    <h2>{flashcards[flashcardIndex].back}</h2>
                    <p>点击卡片可返回问题</p>
                  </div>
                  <em>{flashcardFlipped ? "查看问题 ↺" : "点击翻面 ↻"}</em>
                </button>
                <div className="flashcard-actions">
                  <button onClick={() => rateFlashcard(false)}>还需要练</button>
                  <button className="known" onClick={() => rateFlashcard(true)}>已经掌握</button>
                </div>
              </div>
            )}

            {practiceMode === "graph" && (
              <div className="knowledge-graph-lab">
                <div className="graph-heading">
                  <div>
                    <small>INTERACTIVE KNOWLEDGE GRAPH</small>
                    <h2>看见依赖，才知道下一步学什么。</h2>
                  </div>
                  <p>点击节点查看它在路线中的作用；连线代表推荐的先修关系。</p>
                </div>
                <div className="graph-canvas">
                  {knowledgeGraph.edges.map(([from, to]) => {
                    const source = knowledgeGraph.nodes.find((node) => node.id === from)!;
                    const target = knowledgeGraph.nodes.find((node) => node.id === to)!;
                    const deltaX = target.x - source.x;
                    const deltaY = target.y - source.y;
                    return (
                      <i
                        className="graph-edge"
                        key={`${from}-${to}`}
                        style={{
                          left: `${source.x}%`,
                          top: `${source.y}%`,
                          width: `${Math.sqrt(deltaX ** 2 + deltaY ** 2)}%`,
                          transform: `rotate(${Math.atan2(deltaY, deltaX) * (180 / Math.PI)}deg)`,
                        }}
                      />
                    );
                  })}
                  {knowledgeGraph.nodes.map((node) => (
                    <button
                      key={node.id}
                      className={`${node.group === "结果" ? "destination" : ""} ${selectedGraphNode === node.id ? "active" : ""}`}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      onClick={() => setSelectedGraphNode(node.id)}
                    >
                      <span>{node.label}</span>
                      <small>{node.group}</small>
                    </button>
                  ))}
                </div>
                <div className="graph-inspector">
                  <small>当前节点</small>
                  <strong>
                    {knowledgeGraph.nodes.find((node) => node.id === selectedGraphNode)?.label}
                  </strong>
                  <p>
                    {selectedGraphNode === "product"
                      ? "这是最终目标：把模型、界面、数据、评测、安全和运维组合成可被真实用户使用的产品。"
                      : `先掌握与该节点相连的上游知识，再用一个可运行的小项目验证。它会直接影响 ${
                          knowledgeGraph.edges.filter(([from]) => from === selectedGraphNode).length
                        } 个后续节点。`}
                  </p>
                  <button onClick={() => switchTab("roadmap")}>在路线图中学习</button>
                </div>
              </div>
            )}

            {practiceMode === "drills" && (
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
            )}

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
        <p>14 个知识模块 · 100 条岗位观察 · 52 组面经样本 · 更新于 2026-07-29</p>
        <button onClick={() => switchTab("home")}>返回概览 ↑</button>
      </footer>
    </div>
  );
}
