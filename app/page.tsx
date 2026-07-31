"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, react-hooks/purity */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  flashcards,
  knowledge,
  practices,
  rolePaths,
  type ExperienceId,
  type QuestionV3,
} from "./data-v3";
import {
  companySources,
  interviewEvidence,
  jobSignals,
  tracedQuestions,
} from "./research-v4";

type TabId = "home" | "roadmap" | "roles" | "interview" | "practice";
type RoadmapSortKey = "importance" | "difficulty" | "days";
type ResourceSortKey = "ease" | "professional";
type JobSortKey = "match" | "captured";
type InterviewMode = "practice" | "formal";
type PracticeMode = "flashcards" | "graph" | "drills";
type ApplicationStatus = "收藏" | "已投递" | "面试中" | "暂不合适";
type FlashcardRating = "again" | "hard" | "good" | "easy";

type ReviewResult = {
  score: number;
  structure: number;
  evidence: number;
  depth: number;
  engine: "local" | "model";
  strengths: string[];
  improvements: { point: string; example: string }[];
  annotations: { quote: string; type: "excellent"; reason: string }[];
};

type InterviewAttempt = {
  id: string;
  questionId: number;
  question: string;
  answer: string;
  createdAt: string;
  duration: number;
  review: ReviewResult;
  valid: boolean;
};

type FlashcardSchedule = {
  level: number;
  due: string;
  streak: number;
  lastRating: FlashcardRating;
};

type DrillReview = {
  score: number;
  strengths: string[];
  improvements: string[];
  nextAction: string;
  engine: "local" | "model";
};

type DrillAttempt = {
  id: string;
  practiceId: string;
  submission: string;
  createdAt: string;
  review: DrillReview;
};

const tabs: { id: TabId; label: string; icon: string; short: string }[] = [
  { id: "home", label: "转型工作台", icon: "⌂", short: "总览" },
  { id: "roadmap", label: "学习路线", icon: "▤", short: "路线" },
  { id: "roles", label: "岗位机会", icon: "⌁", short: "岗位" },
  { id: "interview", label: "面试训练", icon: "▣", short: "面试" },
  { id: "practice", label: "刻意练习", icon: "☆", short: "练习" },
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

const mindMapBranches = [
  { id: "foundation", title: "基础认知", ids: ["ml", "llm", "python"] },
  { id: "application", title: "AI 应用", ids: ["prompt", "rag", "agent", "finetune"] },
  { id: "experience", title: "体验界面", ids: ["ai-ui", "ai-ux", "next"] },
  { id: "production", title: "生产交付", ids: ["backend", "eval", "security", "llmops"] },
];

const prerequisites: Record<string, string[]> = {
  ml: [],
  llm: ["ml"],
  python: [],
  prompt: ["llm"],
  rag: ["python", "llm", "prompt"],
  agent: ["python", "prompt", "rag"],
  finetune: ["ml", "llm", "python"],
  "ai-ui": ["next", "prompt"],
  "ai-ux": ["ai-ui"],
  next: [],
  backend: ["python"],
  eval: ["ml", "rag"],
  security: ["agent", "backend"],
  llmops: ["backend", "eval"],
};

const weakKnowledgeMap: Record<string, string> = {
  项目深挖: "eval",
  RAG: "rag",
  Agent: "agent",
  可靠性: "backend",
  评测: "eval",
  "流式 UI": "ai-ui",
  上下文: "prompt",
  安全: "security",
  高并发: "backend",
  "AI UX": "ai-ux",
  工具协议: "agent",
  "LLM 原理": "llm",
  前端性能: "ai-ui",
  算法: "ml",
};

const applicationStatuses: ApplicationStatus[] = ["收藏", "已投递", "面试中", "暂不合适"];
const today = () => new Date().toISOString().slice(0, 10);

function formatTime(seconds: number) {
  const minute = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minute}:${rest}`;
}

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function isMeaningfulAnswer(value: string) {
  const compact = value.replace(/\s/g, "");
  if (compact.length < 40) return false;
  if (/^\d+$/.test(compact)) return false;
  if (/^(.)\1+$/.test(compact)) return false;
  const unique = new Set(compact).size;
  return unique >= Math.min(12, Math.ceil(compact.length * 0.08));
}

function scoreLabel(value: number) {
  if (value >= 85) return "优秀";
  if (value >= 70) return "可用";
  if (value >= 55) return "待加强";
  return "需重答";
}

function ScoreTrend({ attempts }: { attempts: InterviewAttempt[] }) {
  if (!attempts.length) return <p className="empty-inline">完成有效回答后显示得分曲线。</p>;
  const max = Math.max(1, attempts.length - 1);
  const points = attempts.map((attempt, index) => {
    const x = 4 + (index / max) * 92;
    const y = 94 - attempt.review.score * 0.86;
    return `${x},${y}`;
  });
  return (
    <div className="trend-chart" role="img" aria-label={`得分：${attempts.map((item) => item.review.score).join("、")}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="4" x2="96" y1="30" y2="30" />
        <line x1="4" x2="96" y1="60" y2="60" />
        <line x1="4" x2="96" y1="90" y2="90" />
        <polyline points={points.join(" ")} />
        {attempts.map((attempt, index) => {
          const x = 4 + (index / max) * 92;
          const y = 94 - attempt.review.score * 0.86;
          return <circle key={attempt.id} cx={x} cy={y} r="2.2" />;
        })}
      </svg>
      <div className="trend-labels">
        {attempts.map((attempt, index) => (
          <span key={attempt.id}>
            <b>{attempt.review.score}</b>
            <small>第 {index + 1} 次</small>
          </span>
        ))}
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  value,
  items,
  onChange,
  label,
}: {
  value: T;
  items: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="segmented" role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.value}
          className={value === item.value ? "active" : ""}
          onClick={() => onChange(item.value)}
          role="tab"
          aria-selected={value === item.value}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [experience, setExperience] = useState<ExperienceId>("growing");
  const [targetRole, setTargetRole] = useState(rolePaths[0].id);
  const [globalSearch, setGlobalSearch] = useState("");
  const [roadmapSort, setRoadmapSort] = useState<RoadmapSortKey>("importance");
  const [roadmapSortDirection, setRoadmapSortDirection] = useState<"asc" | "desc">("desc");
  const [roadmapCategory, setRoadmapCategory] = useState("全部");
  const [selectedKnowledgeId, setSelectedKnowledgeId] = useState<string | null>(null);
  const [resourceSort, setResourceSort] = useState<ResourceSortKey>("ease");
  const [resourceRatings, setResourceRatings] = useState<Record<string, number>>({});
  const [knowledgeProgress, setKnowledgeProgress] = useState<Record<string, number>>({});
  const [learningPlan, setLearningPlan] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState("全部");
  const [companyFilter, setCompanyFilter] = useState("全部");
  const [evidenceFilter, setEvidenceFilter] = useState("全部");
  const [jobSearch, setJobSearch] = useState("");
  const [jobSort, setJobSort] = useState<JobSortKey>("match");
  const [jobVisibleCount, setJobVisibleCount] = useState(20);
  const [applications, setApplications] = useState<Record<string, ApplicationStatus>>({});
  const [interviewMode, setInterviewMode] = useState<InterviewMode>("practice");
  const [questionRole, setQuestionRole] = useState("全部");
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionV3>(tracedQuestions[0]);
  const [formalQuestionIds, setFormalQuestionIds] = useState<number[]>([]);
  const [formalIndex, setFormalIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [isListening, setIsListening] = useState(false);
  const [voiceInterim, setVoiceInterim] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("点击麦克风开始口述，转写内容会实时出现。");
  const [seconds, setSeconds] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const [modelError, setModelError] = useState("");
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [answerHistory, setAnswerHistory] = useState<InterviewAttempt[]>([]);
  const [referenceMode, setReferenceMode] = useState<"structured" | "full">("structured");
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("flashcards");
  const [flashcardModule, setFlashcardModule] = useState("全部");
  const [flashcardDifficulty, setFlashcardDifficulty] = useState("全部");
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [flashcardSchedule, setFlashcardSchedule] = useState<Record<string, FlashcardSchedule>>({});
  const [selectedGraphNode, setSelectedGraphNode] = useState("ai-ui");
  const [selectedDrillId, setSelectedDrillId] = useState(practices[0].id);
  const [drillSubmission, setDrillSubmission] = useState("");
  const [drillReview, setDrillReview] = useState<DrillReview | null>(null);
  const [drillAttempts, setDrillAttempts] = useState<DrillAttempt[]>([]);
  const [isDrillReviewing, setIsDrillReviewing] = useState(false);
  const speechRef = useRef<{ stop: () => void } | null>(null);

  const level = experienceLevels.find((item) => item.id === experience)!;
  const currentRole = rolePaths.find((role) => role.id === targetRole) ?? rolePaths[0];
  const selectedKnowledge = knowledge.find((item) => item.id === selectedKnowledgeId) ?? null;
  const selectedGraph = knowledge.find((item) => item.id === selectedGraphNode) ?? knowledge[0];
  const selectedDrill = practices.find((item) => item.id === selectedDrillId) ?? practices[0];

  useEffect(() => {
    const [hash, detail] = window.location.hash.replace("#", "").split(":") as [
      TabId,
      string | undefined,
    ];
    if (tabs.some((tab) => tab.id === hash)) setActiveTab(hash);
    if (hash === "roadmap" && detail) setSelectedKnowledgeId(detail);
    if (hash === "roles" && detail) setRoleFilter(decodeURIComponent(detail));
    if (hash === "interview" && detail) {
      const question = tracedQuestions.find((item) => String(item.id) === detail);
      if (question) setSelectedQuestion(question);
    }
    setExperience(safeRead("frontend-ai-experience", "growing"));
    setTargetRole(safeRead("frontend-ai-target-role-v4", rolePaths[0].id));
    setResourceRatings(safeRead("frontend-ai-resource-ratings-v4", {}));
    setKnowledgeProgress(safeRead("frontend-ai-knowledge-progress-v4", {}));
    setLearningPlan(safeRead("frontend-ai-learning-plan-v4", []));
    setApplications(safeRead("frontend-ai-applications-v4", {}));
    setAnswerHistory(safeRead("frontend-ai-interview-history-v2", []));
    setFlashcardSchedule(safeRead("frontend-ai-flashcard-schedule-v4", {}));
    setDrillAttempts(safeRead("frontend-ai-drill-history-v4", []));
  }, []);

  useEffect(() => {
    if (activeTab !== "interview" || review) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [activeTab, review, selectedQuestion.id]);

  const sortedKnowledge = useMemo(
    () =>
      knowledge
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
        }),
    [level.multiplier, roadmapCategory, roadmapSort, roadmapSortDirection],
  );

  const filteredJobs = useMemo(() => {
    const query = jobSearch.trim().toLowerCase();
    return jobSignals
      .filter((job) => {
        const roleMatch = roleFilter === "全部" || job.role === roleFilter;
        const companyMatch = companyFilter === "全部" || job.company === companyFilter;
        const evidenceMatch = evidenceFilter === "全部" || job.evidenceLevel === evidenceFilter;
        const text = `${job.company}${job.title}${job.summary}${job.keywords.join("")}`.toLowerCase();
        return roleMatch && companyMatch && evidenceMatch && (!query || text.includes(query));
      })
      .sort((a, b) => {
        const evidenceDelta =
          Number(b.evidenceLevel === "精确 JD") -
          Number(a.evidenceLevel === "精确 JD");
        if (evidenceDelta) return evidenceDelta;
        return jobSort === "match"
          ? b.match - a.match
          : b.captured.localeCompare(a.captured);
      });
  }, [companyFilter, evidenceFilter, jobSearch, jobSort, roleFilter]);

  const filteredQuestions = useMemo(
    () =>
      tracedQuestions
        .filter((question) => questionRole === "全部" || question.role.includes(questionRole))
        .sort((a, b) => b.frequency - a.frequency),
    [questionRole],
  );

  const validAttempts = useMemo(
    () => answerHistory.filter((attempt) => attempt.valid !== false),
    [answerHistory],
  );

  const questionAttempts = useMemo(
    () =>
      validAttempts
        .filter((attempt) => attempt.questionId === selectedQuestion.id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [selectedQuestion.id, validAttempts],
  );

  const averages = useMemo(() => {
    if (!validAttempts.length) return { score: 0, structure: 0, evidence: 0, depth: 0 };
    const sum = validAttempts.reduce(
      (acc, item) => ({
        score: acc.score + item.review.score,
        structure: acc.structure + item.review.structure,
        evidence: acc.evidence + item.review.evidence,
        depth: acc.depth + item.review.depth,
      }),
      { score: 0, structure: 0, evidence: 0, depth: 0 },
    );
    return Object.fromEntries(
      Object.entries(sum).map(([key, value]) => [key, Math.round(value / validAttempts.length)]),
    ) as typeof sum;
  }, [validAttempts]);

  const weakestDimension = (
    [
      ["structure", "结构", averages.structure],
      ["evidence", "证据", averages.evidence],
      ["depth", "深度", averages.depth],
    ] as const
  ).sort((a, b) => a[2] - b[2])[0];

  const dueFlashcards = useMemo(() => {
    const date = today();
    return flashcards.filter((card) => {
      const schedule = flashcardSchedule[card.id];
      return !schedule || schedule.due <= date;
    });
  }, [flashcardSchedule]);

  const filteredFlashcards = useMemo(() => {
    const source = dueFlashcards.length ? dueFlashcards : flashcards;
    return source.filter(
      (card) =>
        (flashcardModule === "全部" || card.knowledgeId === flashcardModule) &&
        (flashcardDifficulty === "全部" || card.difficulty === flashcardDifficulty),
    );
  }, [dueFlashcards, flashcardDifficulty, flashcardModule]);

  const currentFlashcard = filteredFlashcards[flashcardIndex] ?? flashcards[0];
  const masteredCards = Object.values(flashcardSchedule).filter((item) => item.level >= 3).length;
  const completedKnowledge = Object.values(knowledgeProgress).filter((value) => value >= 1).length;
  const savedJobs = Object.values(applications).filter((status) => status !== "暂不合适").length;
  const nextKnowledge =
    learningPlan
      .map((id) => knowledge.find((item) => item.id === id))
      .find((item) => item && (knowledgeProgress[item.id] ?? 0) < 1) ??
    knowledge.find((item) => (knowledgeProgress[item.id] ?? 0) < 1) ??
    knowledge[0];
  const routeProgress = Math.round(
    (Object.values(knowledgeProgress).reduce((sum, value) => sum + value, 0) /
      (knowledge.length * 3)) *
      100,
  );
  const activePage = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const dashboardSteps = [
    ...learningPlan
      .map((id) => knowledge.find((item) => item.id === id))
      .filter((item): item is (typeof knowledge)[number] => Boolean(item)),
    ...knowledge,
  ]
    .filter(
      (item, index, source) =>
        source.findIndex((candidate) => candidate.id === item.id) === index,
    )
    .slice(0, 5);

  const globalResults = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();
    if (!query) return [];
    return [
      ...knowledge
        .filter((item) => `${item.name}${item.why}${item.category}`.toLowerCase().includes(query))
        .slice(0, 4)
        .map((item) => ({ type: "知识", label: item.name, tab: "roadmap" as TabId, id: item.id })),
      ...rolePaths
        .filter((item) => `${item.name}${item.description}${item.keywords.join("")}`.toLowerCase().includes(query))
        .slice(0, 3)
        .map((item) => ({ type: "岗位", label: item.name, tab: "roles" as TabId, id: item.id })),
      ...tracedQuestions
        .filter((item) => `${item.question}${item.category}`.toLowerCase().includes(query))
        .slice(0, 4)
        .map((item) => ({ type: "面试题", label: item.question, tab: "interview" as TabId, id: String(item.id) })),
    ].slice(0, 8);
  }, [globalSearch]);

  function switchTab(tab: TabId, detail?: string) {
    setActiveTab(tab);
    window.history.replaceState(
      null,
      "",
      `#${tab}${detail ? `:${encodeURIComponent(detail)}` : ""}`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
    setGlobalSearch("");
  }

  function chooseExperience(value: ExperienceId) {
    setExperience(value);
    window.localStorage.setItem("frontend-ai-experience", value);
  }

  function chooseTargetRole(value: string) {
    setTargetRole(value);
    window.localStorage.setItem("frontend-ai-target-role-v4", value);
  }

  function openSearchResult(result: { tab: TabId; id: string }) {
    if (result.tab === "roadmap") setSelectedKnowledgeId(result.id);
    if (result.tab === "roles") {
      setRoleFilter(result.id);
      chooseTargetRole(result.id);
    }
    if (result.tab === "interview") {
      const question = tracedQuestions.find((item) => String(item.id) === result.id);
      if (question) chooseQuestion(question);
    }
    switchTab(result.tab, result.id);
  }

  function toggleRoadmapSort(key: RoadmapSortKey) {
    if (roadmapSort === key) {
      setRoadmapSortDirection((direction) => (direction === "desc" ? "asc" : "desc"));
    } else {
      setRoadmapSort(key);
      setRoadmapSortDirection("desc");
    }
  }

  function updateKnowledgeProgress(id: string, value: number) {
    const next = { ...knowledgeProgress, [id]: value };
    setKnowledgeProgress(next);
    saveLocal("frontend-ai-knowledge-progress-v4", next);
  }

  function toggleLearningPlan(id: string) {
    const next = learningPlan.includes(id)
      ? learningPlan.filter((item) => item !== id)
      : [...learningPlan, id];
    setLearningPlan(next);
    saveLocal("frontend-ai-learning-plan-v4", next);
  }

  function rateResource(key: string, value: number) {
    const next = { ...resourceRatings, [key]: value };
    setResourceRatings(next);
    saveLocal("frontend-ai-resource-ratings-v4", next);
  }

  function updateApplication(id: string, status: ApplicationStatus) {
    const next = { ...applications, [id]: status };
    setApplications(next);
    saveLocal("frontend-ai-applications-v4", next);
  }

  function chooseQuestion(question: QuestionV3) {
    setSelectedQuestion(question);
    setAnswer("");
    setReview(null);
    setModelError("");
    setIsReviewing(false);
    setVoiceInterim("");
    setReferenceMode("structured");
    setSeconds(0);
    setIsListening(false);
    speechRef.current?.stop();
  }

  function startFormalInterview() {
    const pool = filteredQuestions.length >= 5 ? filteredQuestions : tracedQuestions;
    const ids = [...pool]
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5)
      .map((item) => item.id);
    setFormalQuestionIds(ids);
    setFormalIndex(0);
    setInterviewMode("formal");
    const first = tracedQuestions.find((item) => item.id === ids[0]) ?? tracedQuestions[0];
    chooseQuestion(first);
  }

  function exitFormalInterview() {
    setInterviewMode("practice");
    setFormalQuestionIds([]);
    setFormalIndex(0);
    setReview(null);
    setAnswer("");
  }

  function nextQuestion() {
    if (interviewMode === "formal" && formalQuestionIds.length) {
      const nextIndex = formalIndex + 1;
      if (nextIndex < formalQuestionIds.length) {
        setFormalIndex(nextIndex);
        chooseQuestion(
          tracedQuestions.find((item) => item.id === formalQuestionIds[nextIndex]) ??
            tracedQuestions[0],
        );
      } else {
        exitFormalInterview();
      }
      return;
    }
    const current = filteredQuestions.findIndex((question) => question.id === selectedQuestion.id);
    chooseQuestion(filteredQuestions[(current + 1) % filteredQuestions.length] ?? tracedQuestions[0]);
  }

  function retryQuestion() {
    setAnswer("");
    setReview(null);
    setModelError("");
    setVoiceInterim("");
    setIsListening(false);
    setIsReviewing(false);
    setSeconds(0);
  }

  function startVoiceInput() {
    type RecognitionEvent = {
      resultIndex: number;
      results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
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
    const RecognitionApi = voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition;
    if (!RecognitionApi) {
      setVoiceMessage("当前浏览器不支持语音识别，已切换为文本输入。");
      setInputMode("text");
      return;
    }
    if (isListening) {
      speechRef.current?.stop();
      return;
    }
    const recognition = new RecognitionApi();
    recognition.lang = "zh-CN";
    recognition.continuous = true;
    recognition.interimResults = true;
    const answerBeforeRecording = answer.trim();
    let committedTranscript = "";
    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript;
        if (event.results[index].isFinal) committedTranscript += `${transcript} `;
        else interimTranscript += transcript;
      }
      setVoiceInterim(interimTranscript);
      setAnswer(
        [answerBeforeRecording, committedTranscript.trim(), interimTranscript.trim()]
          .filter(Boolean)
          .join(" "),
      );
      setVoiceMessage(
        interimTranscript
          ? `实时识别：${interimTranscript}`
          : `已记录 ${committedTranscript.trim().length} 字，继续说即可。`,
      );
    };
    recognition.onerror = () => {
      setIsListening(false);
      setVoiceInterim("");
      setVoiceMessage("没有识别到声音，请检查麦克风权限或切换文本输入。");
    };
    recognition.onend = () => {
      setIsListening(false);
      setVoiceInterim("");
      speechRef.current = null;
      setVoiceMessage(
        committedTranscript
          ? `已完成实时转写 ${committedTranscript.trim().length} 字，可修改后提交。`
          : "本次没有识别到有效内容，请重试。",
      );
    };
    speechRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setVoiceMessage("正在实时转写；再次点击麦克风可停止。");
  }

  function buildLocalReview(): ReviewResult {
    const normalized = answer.toLowerCase();
    const hitCount = selectedQuestion.keywords.filter((keyword) =>
      normalized.includes(keyword.toLowerCase()),
    ).length;
    const coverage = hitCount / selectedQuestion.keywords.length;
    const lengthFactor = Math.min(answer.trim().length / 500, 1);
    const structure = Math.min(94, Math.round(42 + lengthFactor * 30 + coverage * 22));
    const evidence = Math.min(
      94,
      Math.round(34 + (/\d|%|用户|指标|ms|秒|成本|结果/.test(answer) ? 32 : 0) + coverage * 22),
    );
    const depth = Math.min(
      94,
      Math.round(36 + (/(取舍|权衡|失败|边界|复盘|对比|因为)/.test(answer) ? 30 : 0) + coverage * 24),
    );
    return {
      score: Math.round(structure * 0.34 + evidence * 0.32 + depth * 0.34),
      structure,
      evidence,
      depth,
      engine: "local",
      strengths: hitCount ? [`覆盖 ${hitCount} 个关键概念，回答方向与题目一致。`] : [],
      improvements: [
        {
          point: "补足缺失概念，并说明它们和方案的关系。",
          example: `“除 ${selectedQuestion.reference.evidence[0]} 外，我还会说明失败边界与回滚策略，因为这决定方案能否进入生产。”`,
        },
        { point: "增加一个真实失败样本或量化结果。", example: selectedQuestion.reference.example },
      ],
      annotations: [],
    };
  }

  function saveAttempt(nextReview: ReviewResult) {
    const attempt: InterviewAttempt = {
      id: `${selectedQuestion.id}-${Date.now()}`,
      questionId: selectedQuestion.id,
      question: selectedQuestion.question,
      answer: answer.trim(),
      createdAt: new Date().toISOString(),
      duration: seconds,
      review: nextReview,
      valid: true,
    };
    setAnswerHistory((items) => {
      const next = [...items, attempt].slice(-200);
      saveLocal("frontend-ai-interview-history-v2", next);
      return next;
    });
  }

  async function submitAnswer() {
    if (!isMeaningfulAnswer(answer)) {
      setModelError("回答内容过短、重复或缺少有效语义，本次不评分，也不会计入进步曲线。请重新回答。");
      return;
    }
    setIsReviewing(true);
    setModelError("");
    try {
      const response = await fetch("/api/interview-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion.question,
          purpose: selectedQuestion.purpose,
          answer,
          answerFrame: selectedQuestion.answerFrame,
          keywords: selectedQuestion.keywords,
          reference: selectedQuestion.reference,
        }),
      });
      const result = (await response.json()) as {
        engine?: "model";
        score?: number;
        dimensions?: { structure?: number; evidence?: number; depth?: number };
        strengths?: string[];
        improvements?: { point: string; example: string }[];
        annotations?: { quote: string; type: "excellent"; reason: string }[];
        message?: string;
      };
      if (response.ok && result.engine === "model" && typeof result.score === "number" && result.dimensions) {
        const nextReview: ReviewResult = {
          score: result.score,
          structure: result.dimensions.structure ?? 0,
          evidence: result.dimensions.evidence ?? 0,
          depth: result.dimensions.depth ?? 0,
          engine: "model",
          strengths: result.strengths ?? [],
          improvements: result.improvements ?? [],
          annotations: result.annotations ?? [],
        };
        setReview(nextReview);
        saveAttempt(nextReview);
      } else {
        setModelError(result.message ?? "模型暂时不可用，本轮使用本地结构化评估。");
        const nextReview = buildLocalReview();
        setReview(nextReview);
        saveAttempt(nextReview);
      }
    } catch {
      setModelError("网络暂时不可用，本轮使用本地结构化评估。");
      const nextReview = buildLocalReview();
      setReview(nextReview);
      saveAttempt(nextReview);
    } finally {
      setIsReviewing(false);
    }
  }

  function deleteAttempt(id: string) {
    const next = answerHistory.filter((item) => item.id !== id);
    setAnswerHistory(next);
    saveLocal("frontend-ai-interview-history-v2", next);
  }

  function rateFlashcard(rating: FlashcardRating) {
    const current = flashcardSchedule[currentFlashcard.id] ?? {
      level: 0,
      due: today(),
      streak: 0,
      lastRating: "again" as FlashcardRating,
    };
    const day = new Date();
    const interval =
      rating === "again"
        ? 0
        : rating === "hard"
          ? 1
          : rating === "good"
            ? Math.max(3, 3 * 2 ** current.level)
            : Math.max(7, 7 * 2 ** current.level);
    day.setDate(day.getDate() + interval);
    const nextItem: FlashcardSchedule = {
      level:
        rating === "again"
          ? 0
          : Math.min(5, current.level + (rating === "easy" ? 2 : 1)),
      due: day.toISOString().slice(0, 10),
      streak: rating === "again" ? 0 : current.streak + 1,
      lastRating: rating,
    };
    const next = { ...flashcardSchedule, [currentFlashcard.id]: nextItem };
    setFlashcardSchedule(next);
    saveLocal("frontend-ai-flashcard-schedule-v4", next);
    setFlashcardFlipped(false);
    setFlashcardIndex((index) => (index + 1) % Math.max(1, filteredFlashcards.length));
  }

  useEffect(() => {
    setFlashcardIndex(0);
    setFlashcardFlipped(false);
  }, [flashcardDifficulty, flashcardModule]);

  useEffect(() => {
    if (activeTab !== "practice" || practiceMode !== "flashcards") return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, button") || target?.isContentEditable) return;
      if (event.key === "ArrowLeft") {
        setFlashcardFlipped(false);
        setFlashcardIndex(
          (index) =>
            (index - 1 + Math.max(1, filteredFlashcards.length)) %
            Math.max(1, filteredFlashcards.length),
        );
      }
      if (event.key === "ArrowRight") {
        setFlashcardFlipped(false);
        setFlashcardIndex(
          (index) => (index + 1) % Math.max(1, filteredFlashcards.length),
        );
      }
      if (event.code === "Space") {
        event.preventDefault();
        setFlashcardFlipped((value) => !value);
      }
      if (flashcardFlipped && ["1", "2", "3", "4"].includes(event.key)) {
        const ratings: FlashcardRating[] = ["again", "hard", "good", "easy"];
        rateFlashcard(ratings[Number(event.key) - 1]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTab, filteredFlashcards.length, flashcardFlipped, practiceMode]);

  function buildLocalDrillReview(): DrillReview {
    const criteriaHits = selectedDrill.criteria.filter((criterion) =>
      drillSubmission.includes(criterion.slice(0, 4)),
    ).length;
    const lengthScore = Math.min(50, Math.round(drillSubmission.length / 12));
    const score = Math.min(88, 35 + lengthScore + criteriaHits * 8);
    return {
      score,
      strengths: drillSubmission.length >= 180 ? ["提交内容具备基本完整度，已经形成可复盘的真实输出。"] : [],
      improvements: selectedDrill.criteria.map((criterion) => `补充证据：${criterion}`),
      nextAction: `用 15 分钟按“${selectedDrill.criteria[0]}”补一版，再次提交对比。`,
      engine: "local",
    };
  }

  async function submitDrill() {
    if (drillSubmission.trim().length < 80) {
      setDrillReview({
        score: 0,
        strengths: [],
        improvements: ["提交至少 80 字，并包含你的具体方案、证据或产物链接。"],
        nextAction: "先按验收标准逐条补全，再提交评审。",
        engine: "local",
      });
      return;
    }
    setIsDrillReviewing(true);
    try {
      const response = await fetch("/api/drill-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: selectedDrill.task,
          deliverable: selectedDrill.deliverable,
          criteria: selectedDrill.criteria,
          submission: drillSubmission,
        }),
      });
      const result = (await response.json()) as DrillReview;
      const nextReview =
        response.ok && typeof result.score === "number" ? { ...result, engine: "model" as const } : buildLocalDrillReview();
      setDrillReview(nextReview);
      const attempt: DrillAttempt = {
        id: `${selectedDrill.id}-${Date.now()}`,
        practiceId: selectedDrill.id,
        submission: drillSubmission.trim(),
        createdAt: new Date().toISOString(),
        review: nextReview,
      };
      const next = [...drillAttempts, attempt].slice(-100);
      setDrillAttempts(next);
      saveLocal("frontend-ai-drill-history-v4", next);
    } catch {
      const nextReview = buildLocalDrillReview();
      setDrillReview(nextReview);
      const attempt: DrillAttempt = {
        id: `${selectedDrill.id}-${Date.now()}`,
        practiceId: selectedDrill.id,
        submission: drillSubmission.trim(),
        createdAt: new Date().toISOString(),
        review: nextReview,
      };
      const next = [...drillAttempts, attempt].slice(-100);
      setDrillAttempts(next);
      saveLocal("frontend-ai-drill-history-v4", next);
    } finally {
      setIsDrillReviewing(false);
    }
  }

  const selectedQuestionSources = selectedQuestion.sourceIds
    .map((id) => interviewEvidence.find((source) => source.id === id))
    .filter(Boolean);

  return (
    <div className="app">
      <aside className="global-nav">
        <button className="wordmark" onClick={() => switchTab("home")} aria-label="打开工作台">
          <span>F</span>
        </button>
        <nav className="tab-bar" role="tablist" aria-label="网站模块">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => switchTab(tab.id)}
              title={tab.label}
            >
              <span aria-hidden="true">{tab.icon}</span>
              <em>{tab.short}</em>
            </button>
          ))}
        </nav>
        <button className="rail-settings" aria-label="设置" title="设置">
          <span aria-hidden="true">⚙</span>
          <em>设置</em>
        </button>
      </aside>

      <header className="dashboard-header">
        <div className="dashboard-title">
          <span>Frontend → AI</span>
          <h1>{activePage.label}</h1>
        </div>
        <div className="dashboard-header-actions">
          <span className="header-progress">
            <i><b style={{ width: `${routeProgress}%` }} /></i>
            {routeProgress}%
          </span>
          <div className="global-search">
            <span>⌕</span>
            <input
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              placeholder="搜索知识、岗位、题目"
              aria-label="全站搜索"
            />
            {globalResults.length > 0 && (
              <div className="search-results">
                {globalResults.map((result) => (
                  <button key={`${result.type}-${result.id}`} onClick={() => openSearchResult(result)}>
                    <small>{result.type}</small>
                    <span>{result.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="dashboard-avatar" aria-label="个人进度">F</span>
        </div>
      </header>

      <main className="module-stage">
        {activeTab === "home" && (
          <section className="module shell">
            <div className="module-toolbar">
              <div>
                <h1>转型工作台</h1>
                <p>只展示当前状态、下一步和需要处理的事项。</p>
              </div>
              <div className="toolbar-actions">
                <label>
                  前端经验
                  <select value={experience} onChange={(event) => chooseExperience(event.target.value as ExperienceId)}>
                    {experienceLevels.map((item) => (
                      <option value={item.id} key={item.id}>{item.label}</option>
                    ))}
                  </select>
                </label>
                <label>
                  目标岗位
                  <select value={targetRole} onChange={(event) => chooseTargetRole(event.target.value)}>
                    {rolePaths.map((role) => (
                      <option value={role.id} key={role.id}>{role.name}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="reference-dashboard">
              <section className="route-progress-card dashboard-surface">
                <div className="surface-heading">
                  <div><small>学习计划</small><h2>路线推进</h2></div>
                  <button onClick={() => switchTab("roadmap")}>查看全部</button>
                </div>
                <div className="route-progress-list">
                  {dashboardSteps.map((item) => {
                    const progress = knowledgeProgress[item.id] ?? 0;
                    const percent = Math.round((progress / 3) * 100);
                    return (
                      <button key={item.id} onClick={() => { setSelectedKnowledgeId(item.id); switchTab("roadmap"); }}>
                        <span className={`route-node route-node-${progress}`}>{progress >= 1 ? "✓" : ""}</span>
                        <div><strong>{item.name}</strong><small>{["未开始", "入门", "进阶", "精通"][progress]}</small></div>
                        <b>{percent}%</b>
                        <i><em style={{ width: `${percent}%` }} /></i>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="activity-card dashboard-surface">
                <div className="surface-heading">
                  <div><small>当前状态</small><h2>任务清单</h2></div>
                  <span>{today().slice(5).replace("-", "/")}</span>
                </div>
                <div className="activity-list">
                  {([
                    ["路线", `${completedKnowledge} / ${knowledge.length} 个知识块已入门`, "roadmap" as TabId],
                    ["闪卡", `${dueFlashcards.length} 张等待复习`, "practice" as TabId],
                    ["岗位", `${savedJobs} 个岗位在跟进`, "roles" as TabId],
                    ["面试", `${validAttempts.length} 次有效回答`, "interview" as TabId],
                    ["任务", `${drillAttempts.length} 次专项提交`, "practice" as TabId],
                  ] as [string, string, TabId][]).map(([label, text, tab]) => (
                    <button key={label} onClick={() => switchTab(tab)}>
                      <span>{label.slice(0, 1)}</span>
                      <div><strong>{label}</strong><small>{text}</small></div>
                      <i>✓</i>
                      <time>{today().slice(5).replace("-", "/")}</time>
                    </button>
                  ))}
                </div>
              </section>

              <section className="trend-dashboard-card dashboard-surface">
                <div className="surface-heading">
                  <div><small>面试训练</small><h2>得分趋势</h2></div>
                  <button onClick={() => switchTab("interview")}>开始训练</button>
                </div>
                <ScoreTrend attempts={validAttempts.slice(-8)} />
                <div className="trend-metrics">
                  <span><b>{averages.score || "—"}</b><small>总分</small></span>
                  <span><b>{averages.structure || "—"}</b><small>结构</small></span>
                  <span><b>{averages.depth || "—"}</b><small>深度</small></span>
                </div>
              </section>

              <section className="number-dashboard-card dashboard-surface">
                <div className="number-main">
                  <div><small>今日待办</small><strong>{dueFlashcards.length + learningPlan.length}</strong></div>
                  <div
                    className="progress-ring"
                    style={{ background: `conic-gradient(#0a6cff ${routeProgress * 3.6}deg, #e8e9ec 0deg)` }}
                  >
                    <span>{routeProgress}%</span>
                  </div>
                </div>
                <div className="number-list">
                  <button onClick={() => switchTab("roadmap")}><i className="dot red" /><span>学习计划</span><b>{learningPlan.length}</b></button>
                  <button onClick={() => switchTab("practice")}><i className="dot amber" /><span>今日闪卡</span><b>{dueFlashcards.length}</b></button>
                  <button onClick={() => switchTab("roles")}><i className="dot blue" /><span>收藏岗位</span><b>{savedJobs}</b></button>
                </div>
              </section>

              <section className="next-action-card dashboard-surface">
                <div className="next-action-icon">→</div>
                <div>
                  <small>推荐下一步</small>
                  <h2>{nextKnowledge.name}</h2>
                  <p>{nextKnowledge.outcome}</p>
                </div>
                <dl>
                  <div><dt>预计投入</dt><dd>{Math.max(3, Math.round(nextKnowledge.days * level.multiplier))} 天</dd></div>
                  <div><dt>目标岗位</dt><dd>{currentRole.name}</dd></div>
                  <div><dt>迁移匹配</dt><dd>{currentRole.fits[experience]}%</dd></div>
                </dl>
                <button
                  className="primary-action"
                  onClick={() => {
                    setSelectedKnowledgeId(nextKnowledge.id);
                    switchTab("roadmap");
                  }}
                >
                  打开学习详情
                </button>
              </section>

              <section className="milestone-card dashboard-surface">
                <div className="milestone-track">
                  {dashboardSteps.map((item, index) => {
                    const progress = knowledgeProgress[item.id] ?? 0;
                    return (
                      <button key={item.id} onClick={() => { setSelectedKnowledgeId(item.id); switchTab("roadmap"); }}>
                        <span className={progress ? "done" : index === completedKnowledge ? "current" : ""}>
                          {progress ? "✓" : index + 1}
                        </span>
                        <strong>{item.name}</strong>
                      </button>
                    );
                  })}
                </div>
                <button className="milestone-date" onClick={() => switchTab("roadmap")}>▣ 查看路线</button>
              </section>
            </div>
          </section>
        )}

        {activeTab === "roadmap" && (
          <section className="module shell">
            <div className="module-toolbar">
              <div>
                <h1>学习路线</h1>
                <p>表头排序；点开知识大块查看 20/80 内容、资源和个人进度。</p>
              </div>
              <div className="toolbar-actions">
                <label>
                  分类
                  <select value={roadmapCategory} onChange={(event) => setRoadmapCategory(event.target.value)}>
                    <option>全部</option>
                    {[...new Set(knowledge.map((item) => item.category))].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <span className="toolbar-stat">{learningPlan.length} 项计划中 · {completedKnowledge} 项已入门</span>
              </div>
            </div>

            <div className="roadmap-layout">
              <div className="roadmap-table-wrap">
                <table className="roadmap-table">
                  <thead className="roadmap-table-head">
                    <tr>
                      <th>知识大块</th>
                      <th>阶段</th>
                      <th>
                        <button onClick={() => toggleRoadmapSort("importance")}>
                          重要度 {roadmapSort === "importance" ? (roadmapSortDirection === "desc" ? "↓" : "↑") : "↕"}
                        </button>
                      </th>
                      <th>
                        <button onClick={() => toggleRoadmapSort("difficulty")}>
                          难度 {roadmapSort === "difficulty" ? (roadmapSortDirection === "desc" ? "↓" : "↑") : "↕"}
                        </button>
                      </th>
                      <th>
                        <button onClick={() => toggleRoadmapSort("days")}>
                          学习天数 {roadmapSort === "days" ? (roadmapSortDirection === "desc" ? "↓" : "↑") : "↕"}
                        </button>
                      </th>
                      <th>我的进度</th>
                      <th>计划</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedKnowledge.map((item) => (
                      <tr
                        key={item.id}
                        className={selectedKnowledgeId === item.id ? "selected" : ""}
                        onClick={() => setSelectedKnowledgeId(item.id)}
                      >
                        <td>
                          <strong>{item.name}</strong>
                          <small>{item.category} · {item.outcome}</small>
                        </td>
                        <td>{item.phase}</td>
                        <td><span className="score-dots">{item.importance}/5</span></td>
                        <td><span className="score-dots">{item.difficulty}/5</span></td>
                        <td>{item.adjustedDays} 天</td>
                        <td>
                          <span className={`progress-tag progress-${knowledgeProgress[item.id] ?? 0}`}>
                            {["未开始", "入门", "进阶", "精通"][knowledgeProgress[item.id] ?? 0]}
                          </span>
                        </td>
                        <td>
                          <button
                            className={learningPlan.includes(item.id) ? "bookmark active" : "bookmark"}
                            onClick={(event) => { event.stopPropagation(); toggleLearningPlan(item.id); }}
                            aria-label={learningPlan.includes(item.id) ? "移出计划" : "加入计划"}
                          >
                            {learningPlan.includes(item.id) ? "★" : "☆"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedKnowledge && (
                <aside className="knowledge-drawer">
                  <button className="drawer-close" onClick={() => setSelectedKnowledgeId(null)} aria-label="关闭">×</button>
                  <small>{selectedKnowledge.category} · {selectedKnowledge.phase}</small>
                  <h2>{selectedKnowledge.name}</h2>
                  <p>{selectedKnowledge.why}</p>
                  <section className="drawer-progress">
                    <span>我的位置</span>
                    <div>
                      {["未开始", "入门", "进阶", "精通"].map((label, index) => (
                        <button
                          key={label}
                          className={(knowledgeProgress[selectedKnowledge.id] ?? 0) === index ? "active" : ""}
                          onClick={() => updateKnowledgeProgress(selectedKnowledge.id, index)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </section>
                  <div className="level-stack">
                    {selectedKnowledge.levels.map((item, index) => (
                      <article key={item.title} className={index === 0 ? "focus" : ""}>
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.effort}</span>
                        </div>
                        <small>{item.share}</small>
                        {item.items.map((point) => <p key={point}>• {point}</p>)}
                      </article>
                    ))}
                  </div>
                  <div className="resource-heading">
                    <div>
                      <h3>学习资源</h3>
                      <p>3 条中文 + 3 条英文；易学度可由你覆盖编辑初评。</p>
                    </div>
                    <Segmented
                      value={resourceSort}
                      label="教程排序"
                      items={[
                        { value: "ease", label: "易学度" },
                        { value: "professional", label: "专业度" },
                      ]}
                      onChange={setResourceSort}
                    />
                  </div>
                  <div className="resource-list">
                    {[...selectedKnowledge.resources]
                      .sort((a, b) => {
                        const aKey = `${selectedKnowledge.id}-${a.title}`;
                        const bKey = `${selectedKnowledge.id}-${b.title}`;
                        const av = resourceSort === "ease" ? (resourceRatings[aKey] ?? a.ease) : a.professional;
                        const bv = resourceSort === "ease" ? (resourceRatings[bKey] ?? b.ease) : b.professional;
                        return bv - av;
                      })
                      .map((resource) => {
                        const key = `${selectedKnowledge.id}-${resource.title}`;
                        return (
                          <article key={resource.title}>
                            <div>
                              <span>{resource.lang}</span>
                              <small>{resource.provider}</small>
                            </div>
                            <a href={resource.url} target="_blank" rel="noreferrer">{resource.title} ↗</a>
                            <p>{resource.note}</p>
                            <div className="resource-scores">
                              <label>
                                易学度
                                <select value={resourceRatings[key] ?? resource.ease} onChange={(event) => rateResource(key, Number(event.target.value))}>
                                  {[5, 4.5, 4, 3.5, 3].map((value) => <option value={value} key={value}>{value}</option>)}
                                </select>
                                <em>{resourceRatings[key] ? "我的评价" : "编辑初评"}</em>
                              </label>
                              <span>专业度 <b>{resource.professional}</b> <em>编辑评估</em></span>
                            </div>
                          </article>
                        );
                      })}
                  </div>
                </aside>
              )}
            </div>
          </section>
        )}

        {activeTab === "roles" && (
          <section className="module shell">
            <div className="module-toolbar">
              <div>
                <h1>岗位机会</h1>
                <p>精确 JD 与官方招聘检索分开呈现；不把检索入口伪装成独立职位。</p>
              </div>
              <div className="evidence-summary">
                <span><b>{jobSignals.filter((item) => item.evidenceLevel === "精确 JD").length}</b> 精确 JD</span>
                <span><b>{jobSignals.filter((item) => item.evidenceLevel === "官方招聘检索").length}</b> 官方检索组合</span>
                <span><b>10</b> 岗位类型</span>
              </div>
            </div>

            <section className="role-ranking">
              <div className="section-heading">
                <div><h2>转型方向排序</h2><p>按你的前端年限计算迁移匹配度。</p></div>
                <Segmented
                  value={experience}
                  label="经验档位"
                  items={experienceLevels.map((item) => ({ value: item.id, label: item.label }))}
                  onChange={chooseExperience}
                />
              </div>
              <div className="role-rank-list">
                {[...rolePaths]
                  .sort((a, b) => b.fits[experience] - a.fits[experience])
                  .map((role, index) => (
                    <button
                      key={role.id}
                      className={targetRole === role.id ? "active" : ""}
                      onClick={() => { chooseTargetRole(role.id); setRoleFilter(role.id); }}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div><strong>{role.name}</strong><small>{role.bridge.slice(0, 2).join(" · ")}</small></div>
                      <b>{role.fits[experience]}%</b>
                    </button>
                  ))}
              </div>
            </section>

            <section className="job-library">
              <div className="job-filters">
                <input value={jobSearch} onChange={(event) => setJobSearch(event.target.value)} placeholder="搜索公司、职位或关键词" />
                <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                  <option>全部</option>
                  {rolePaths.map((role) => <option value={role.id} key={role.id}>{role.name}</option>)}
                </select>
                <select value={companyFilter} onChange={(event) => setCompanyFilter(event.target.value)}>
                  <option>全部</option>
                  {companySources.map((company) => <option value={company.name} key={company.id}>{company.name}</option>)}
                </select>
                <select value={evidenceFilter} onChange={(event) => setEvidenceFilter(event.target.value)}>
                  <option>全部</option>
                  <option>精确 JD</option>
                  <option>官方招聘检索</option>
                </select>
                <select value={jobSort} onChange={(event) => setJobSort(event.target.value as JobSortKey)}>
                  <option value="match">按匹配度</option>
                  <option value="captured">按采集日期</option>
                </select>
              </div>
              <div className="data-note">
                <b>数据口径</b>
                <span>精确 JD 记录职位 ID、发布时间和原始链接；官方检索组合用于持续侦察，打开后仍需核验城市、状态和薪资。角色薪资区间是北京同类岗位参考，不等于企业报价。</span>
              </div>
              <div className="job-table">
                {filteredJobs.slice(0, jobVisibleCount).map((job) => (
                  <article key={job.id}>
                    <div className="job-main">
                      <div className="job-company"><span>{job.company.slice(0, 1)}</span><strong>{job.company}</strong></div>
                      <div>
                        <div className="job-title-row">
                          <h3>{job.title}</h3>
                          <em className={job.evidenceLevel === "精确 JD" ? "verified" : ""}>{job.evidenceLevel}</em>
                        </div>
                        <p>{job.summary}</p>
                        <div className="chip-row">{job.keywords.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div>
                      </div>
                    </div>
                    <div className="job-facts">
                      <span><small>地点</small>{job.location}</span>
                      <span>
                        <small>薪资</small>{job.salary}
                        <a
                          className="salary-source"
                          href={`https://www.zhipin.com/web/geek/job?query=${encodeURIComponent(job.role)}&city=101010100`}
                          target="_blank"
                          rel="noreferrer"
                          title={job.salaryNote}
                        >
                          北京同类岗位检索 ↗
                        </a>
                      </span>
                      <span><small>经验</small>{job.experience}</span>
                      <span><small>职位 ID</small>{job.jobId}</span>
                      <span><small>发布 / 采集</small>{job.published} / {job.captured}</span>
                    </div>
                    <div className="job-actions">
                      <select
                        value={applications[job.id] ?? ""}
                        onChange={(event) => updateApplication(job.id, event.target.value as ApplicationStatus)}
                        aria-label={`更新 ${job.title} 进度`}
                      >
                        <option value="" disabled>加入跟进</option>
                        {applicationStatuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                      <a href={job.source} target="_blank" rel="noreferrer">{job.sourceLabel} ↗</a>
                    </div>
                  </article>
                ))}
              </div>
              {jobVisibleCount < filteredJobs.length && (
                <button className="load-more" onClick={() => setJobVisibleCount((value) => value + 20)}>
                  再显示 20 条 · 剩余 {filteredJobs.length - jobVisibleCount}
                </button>
              )}
            </section>
          </section>
        )}

        {activeTab === "interview" && (
          <section className="module shell">
            <div className="module-toolbar">
              <div>
                <h1>面试训练</h1>
                <p>练习模式可看提示与参考答案；正式模拟连续 5 题并隐藏答案。</p>
              </div>
              <div className="interview-mode-actions">
                {interviewMode === "practice" ? (
                  <button className="primary-action" onClick={startFormalInterview}>开始 5 题正式模拟</button>
                ) : (
                  <>
                    <span>正式模拟 {formalIndex + 1} / {formalQuestionIds.length}</span>
                    <button onClick={exitFormalInterview}>退出模拟</button>
                  </>
                )}
              </div>
            </div>

            <div className="interview-summary">
              {[
                ["有效回答", validAttempts.length],
                ["平均总分", averages.score || "—"],
                ["结构", averages.structure || "—"],
                ["证据", averages.evidence || "—"],
                ["深度", averages.depth || "—"],
              ].map(([label, value]) => (
                <span key={label as string}>
                  <small>{label}</small>
                  <b>{value}</b>
                </span>
              ))}
              <p>
                {validAttempts.length
                  ? `当前最弱维度是${weakestDimension[1]}；完成更多有效回答后再判断趋势。`
                  : "无效、重复或纯数字回答不会进入统计。"}
              </p>
            </div>

            <div className={`interview-layout ${interviewMode === "formal" ? "formal" : ""}`}>
              {interviewMode === "practice" && (
                <aside className="question-bank">
                  <div className="question-filter">
                    <label>岗位题库</label>
                    <select value={questionRole} onChange={(event) => setQuestionRole(event.target.value)}>
                      <option>全部</option>
                      {rolePaths.map((role) => <option value={role.id} key={role.id}>{role.name}</option>)}
                    </select>
                  </div>
                  <div className="question-list">
                    {filteredQuestions.map((question) => (
                      <button
                        key={question.id}
                        className={selectedQuestion.id === question.id ? "active" : ""}
                        onClick={() => chooseQuestion(question)}
                      >
                        <span><em>{question.category}</em><b>{question.frequency} 组来源</b></span>
                        <strong>{question.question}</strong>
                      </button>
                    ))}
                  </div>
                  <div className="source-method">
                    <b>{interviewEvidence.length} 个独立链接</b>
                    <p>频次按“该问题在多少个已标注来源中出现”统计，不把一篇汇总拆成多场面经。</p>
                  </div>
                </aside>
              )}

              <div className="interview-workspace">
                <section className="question-card">
                  <div className="question-meta">
                    <span>{selectedQuestion.category}</span>
                    <b>{selectedQuestion.frequency} / {interviewEvidence.length} 来源出现</b>
                    <em>{formatTime(seconds)}</em>
                  </div>
                  <h2>{selectedQuestion.question}</h2>
                  <div className="question-purpose">
                    <strong>面试官真正想看什么</strong>
                    <p><b>考察：</b>{selectedQuestion.purpose.tests}</p>
                    <p><b>期待：</b>{selectedQuestion.purpose.expects}</p>
                  </div>
                  {interviewMode === "practice" && (
                    <div className="answer-frame">
                      {selectedQuestion.answerFrame.map((item, index) => <span key={item}>{index + 1}. {item}</span>)}
                    </div>
                  )}
                </section>

                <section className="answer-studio">
                  <div className="answer-toolbar">
                    <Segmented
                      value={inputMode}
                      label="回答输入方式"
                      items={[{ value: "voice", label: "语音优先" }, { value: "text", label: "文本输入" }]}
                      onChange={setInputMode}
                    />
                    <span>{answer.length} 字</span>
                  </div>
                  {inputMode === "voice" && (
                    <button className={`voice-control ${isListening ? "listening" : ""}`} onClick={startVoiceInput}>
                      <i>{isListening ? "■" : "●"}</i>
                      <span><strong>{isListening ? "停止并保留转写" : "开始语音回答"}</strong><small>{voiceMessage}</small></span>
                    </button>
                  )}
                  <textarea
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder="按结论 → 方案 → 证据 → 取舍 → 复盘组织回答。语音转写也会实时写入这里。"
                    rows={10}
                  />
                  {voiceInterim && <p className="voice-live">实时：{voiceInterim}</p>}
                  {modelError && <p className="inline-alert">{modelError}</p>}
                  <button className="review-button" disabled={isReviewing || !answer.trim()} onClick={submitAnswer}>
                    {isReviewing ? "DeepSeek 正在评分…" : "提交评分"}
                  </button>
                </section>

                {review && (
                  <section className="review-panel">
                    <div className="review-score">
                      <strong>{review.score}</strong>
                      <div><b>{scoreLabel(review.score)}</b><span>{review.engine === "model" ? "DeepSeek 模型评分" : "本地结构评分"}</span></div>
                    </div>
                    <div className="dimension-grid">
                      {[["结构", review.structure], ["证据", review.evidence], ["深度", review.depth]].map(([label, value]) => (
                        <span key={label as string}><small>{label}</small><b>{value}</b><i><em style={{ width: `${value}%` }} /></i></span>
                      ))}
                    </div>
                    <div className="annotated-answer">
                      <small>回答标记 · 绿色为模型识别的有效亮点</small>
                      <p>
                        {answer.split(/(?<=[。！？；])/).map((sentence, index) => {
                          const strong =
                            review.annotations.some((item) => sentence.includes(item.quote)) ||
                            selectedQuestion.keywords.some((keyword) => sentence.toLowerCase().includes(keyword.toLowerCase())) ||
                            /\d|%|用户|指标|结果|成本/.test(sentence);
                          return strong ? <mark key={index}>{sentence}</mark> : <span key={index}>{sentence}</span>;
                        })}
                      </p>
                    </div>
                    <div className="review-columns">
                      <section>
                        <h3>优秀点</h3>
                        {review.strengths.length ? review.strengths.map((item) => <p key={item}>✓ {item}</p>) : <p className="muted">本次未识别到明确亮点。</p>}
                      </section>
                      <section>
                        <h3>不足与回答示例</h3>
                        {review.improvements.map((item) => (
                          <article key={item.point}><strong>{item.point}</strong><p>{item.example}</p></article>
                        ))}
                      </section>
                    </div>
                    <div className="weak-links">
                      <span>去补薄弱项</span>
                      <button onClick={() => {
                        const id = weakKnowledgeMap[selectedQuestion.category] ?? "eval";
                        setSelectedKnowledgeId(id);
                        switchTab("roadmap");
                      }}>学习路线：{knowledge.find((item) => item.id === (weakKnowledgeMap[selectedQuestion.category] ?? "eval"))?.name}</button>
                      <button onClick={() => {
                        setFlashcardModule(weakKnowledgeMap[selectedQuestion.category] ?? "eval");
                        setPracticeMode("flashcards");
                        switchTab("practice");
                      }}>刷对应闪卡</button>
                      <button onClick={() => {
                        setSelectedDrillId(weakKnowledgeMap[selectedQuestion.category] ?? "eval");
                        setPracticeMode("drills");
                        switchTab("practice");
                      }}>做专项任务</button>
                    </div>
                    <div className="review-actions">
                      <button onClick={retryQuestion}>重新回答本题</button>
                      <button className="primary-action" onClick={nextQuestion}>
                        {interviewMode === "formal" && formalIndex === formalQuestionIds.length - 1 ? "完成模拟" : "下一题"}
                      </button>
                    </div>
                  </section>
                )}

                {interviewMode === "practice" && (
                  <details className="reference-answer">
                    <summary>参考答案 <span>结构提纲 / 完整口述</span></summary>
                    <div className="reference-body">
                      <Segmented
                        value={referenceMode}
                        label="参考答案形态"
                        items={[{ value: "structured", label: "结构化提纲" }, { value: "full", label: "完整优质回答" }]}
                        onChange={setReferenceMode}
                      />
                      {referenceMode === "structured" ? (
                        <>
                          <blockquote>{selectedQuestion.reference.thesis}</blockquote>
                          <div className="reference-grid">
                            {selectedQuestion.reference.sections.map((section, index) => (
                              <article key={section.label}><span>{index + 1}</span><strong>{section.label}</strong><p>{section.content}</p></article>
                            ))}
                          </div>
                          <div className="reference-evidence">
                            <section><h3>必须有的证据</h3>{selectedQuestion.reference.evidence.map((item) => <p key={item}>+ {item}</p>)}</section>
                            <section><h3>常见失分点</h3>{selectedQuestion.reference.pitfalls.map((item) => <p key={item}>× {item}</p>)}</section>
                          </div>
                        </>
                      ) : (
                        <div className="full-answer"><p>{selectedQuestion.reference.fullAnswer}</p></div>
                      )}
                    </div>
                  </details>
                )}

                {questionAttempts.length > 0 && (
                  <section className="answer-history">
                    <div className="card-heading">
                      <div><small>当前设备保存</small><h2>本题进步曲线</h2></div>
                      <b>{questionAttempts.length} 次有效回答</b>
                    </div>
                    <ScoreTrend attempts={questionAttempts.slice(-8)} />
                    <div className="history-list">
                      {[...questionAttempts].reverse().map((attempt, index) => (
                        <details key={attempt.id}>
                          <summary>
                            <span>第 {questionAttempts.length - index} 次 · {formatTime(attempt.duration)}</span>
                            <b>{attempt.review.score} 分</b>
                            <time>{new Date(attempt.createdAt).toLocaleString("zh-CN")}</time>
                          </summary>
                          <div>
                            <p>{attempt.answer}</p>
                            {attempt.review.improvements.map((item) => <p key={item.point}><strong>{item.point}</strong> {item.example}</p>)}
                            <button className="danger-text" onClick={() => deleteAttempt(attempt.id)}>删除这次测试记录</button>
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                <details className="source-drawer">
                  <summary>查看本题 {selectedQuestionSources.length} 个独立来源</summary>
                  <div>
                    {selectedQuestionSources.map((source) => source && (
                      <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>
                        <span>{source.label}</span><small>{source.kind} · {source.published}</small>
                      </a>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </section>
        )}

        {activeTab === "practice" && (
          <section className="module shell">
            <div className="module-toolbar">
              <div>
                <h1>刻意练习</h1>
                <p>闪卡做间隔重复；脑图定位先修关系；专项任务提交真实产物并保留评审历史。</p>
              </div>
              <div className="practice-stats">
                <span><b>{dueFlashcards.length}</b> 今日待复习</span>
                <span><b>{masteredCards}</b> 稳定掌握</span>
                <span><b>{drillAttempts.length}</b> 任务提交</span>
              </div>
            </div>

            <Segmented
              value={practiceMode}
              label="刻意练习模式"
              items={[
                { value: "flashcards", label: "闪卡" },
                { value: "graph", label: "知识脑图" },
                { value: "drills", label: "专项任务" },
              ]}
              onChange={setPracticeMode}
            />

            {practiceMode === "flashcards" && (
              <div className="flashcard-lab">
                <div className="practice-toolbar">
                  <label>知识模块
                    <select value={flashcardModule} onChange={(event) => setFlashcardModule(event.target.value)}>
                      <option value="全部">全部 14 个模块</option>
                      {knowledge.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
                    </select>
                  </label>
                  <label>难度
                    <select value={flashcardDifficulty} onChange={(event) => setFlashcardDifficulty(event.target.value)}>
                      <option>全部</option><option>低</option><option>中</option><option>高</option>
                    </select>
                  </label>
                  <span className="keyboard-hint">← → 切题 · Space 翻面 · 1—4 评分</span>
                </div>
                <div className="flashcard-progress">
                  <span>{flashcardIndex + 1} / {Math.max(1, filteredFlashcards.length)}</span>
                  <i><em style={{ width: `${((flashcardIndex + 1) / Math.max(1, filteredFlashcards.length)) * 100}%` }} /></i>
                  <b>{dueFlashcards.length ? "当前为到期卡片" : "今日到期卡已清空"}</b>
                </div>
                <button className={`flashcard ${flashcardFlipped ? "flipped" : ""}`} onClick={() => setFlashcardFlipped((value) => !value)}>
                  <div className="flashcard-meta">
                    <span>{currentFlashcard.category}</span>
                    <b className={`difficulty-${currentFlashcard.difficulty}`}>{currentFlashcard.difficulty}难度</b>
                    <em>记忆等级 {flashcardSchedule[currentFlashcard.id]?.level ?? 0}</em>
                  </div>
                  <div className="flashcard-content">
                    <small>{flashcardFlipped ? "答案" : "问题"}</small>
                    <h2>{flashcardFlipped ? currentFlashcard.back : currentFlashcard.front}</h2>
                    <p>{flashcardFlipped ? "根据记忆难度评分，系统会安排下次复习。" : `提示：${currentFlashcard.hint}`}</p>
                  </div>
                  <span className="flip-hint">{flashcardFlipped ? "点击返回问题" : "点击查看答案"}</span>
                </button>
                <div className="flashcard-nav">
                  <button onClick={() => { setFlashcardFlipped(false); setFlashcardIndex((index) => (index - 1 + Math.max(1, filteredFlashcards.length)) % Math.max(1, filteredFlashcards.length)); }}>← 上一题</button>
                  <button onClick={() => { setFlashcardFlipped(false); setFlashcardIndex((index) => (index + 1) % Math.max(1, filteredFlashcards.length)); }}>下一题 →</button>
                </div>
                {flashcardFlipped && (
                  <div className="spaced-actions">
                    <button onClick={() => rateFlashcard("again")}><kbd>1</kbd><strong>忘记</strong><small>今天再来</small></button>
                    <button onClick={() => rateFlashcard("hard")}><kbd>2</kbd><strong>困难</strong><small>1 天后</small></button>
                    <button onClick={() => rateFlashcard("good")}><kbd>3</kbd><strong>记得</strong><small>至少 3 天</small></button>
                    <button onClick={() => rateFlashcard("easy")}><kbd>4</kbd><strong>轻松</strong><small>至少 7 天</small></button>
                  </div>
                )}
              </div>
            )}

            {practiceMode === "graph" && (
              <div className="mindmap-lab">
                <div className="mindmap-board">
                  <div className="mindmap-root">
                    <small>起点</small><strong>前端开发</strong><span>→ AI 产品工程</span>
                  </div>
                  <div className="mindmap-branches">
                    {mindMapBranches.map((branch, branchIndex) => (
                      <section key={branch.id} className={`branch branch-${branchIndex + 1}`}>
                        <header><span>{branchIndex + 1}</span><strong>{branch.title}</strong></header>
                        <div>
                          {branch.ids.map((id) => {
                            const item = knowledge.find((knowledgeItem) => knowledgeItem.id === id)!;
                            const progress = knowledgeProgress[id] ?? 0;
                            return (
                              <button
                                key={id}
                                className={`${selectedGraphNode === id ? "active" : ""} mastery-${progress}`}
                                onClick={() => setSelectedGraphNode(id)}
                              >
                                <span>{item.name}</span>
                                <small>{["未开始", "入门", "进阶", "精通"][progress]} · {item.days} 天</small>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
                <aside className="mindmap-inspector">
                  <small>{selectedGraph.category} · 当前节点</small>
                  <h2>{selectedGraph.name}</h2>
                  <p>{selectedGraph.why}</p>
                  <section>
                    <h3>先修知识</h3>
                    {prerequisites[selectedGraph.id]?.length ? prerequisites[selectedGraph.id].map((id) => {
                      const item = knowledge.find((knowledgeItem) => knowledgeItem.id === id)!;
                      return <button key={id} onClick={() => setSelectedGraphNode(id)}>{item.name} · {["未开始", "入门", "进阶", "精通"][knowledgeProgress[id] ?? 0]}</button>;
                    }) : <span>无硬性先修，可直接开始。</span>}
                  </section>
                  <section>
                    <h3>20 / 80 入门重点</h3>
                    {selectedGraph.levels[0].items.map((item) => <span key={item}>✓ {item}</span>)}
                  </section>
                  <section>
                    <h3>推荐下一节点</h3>
                    <span>{knowledge.find((item) => prerequisites[item.id]?.includes(selectedGraph.id) && (knowledgeProgress[item.id] ?? 0) === 0)?.name ?? "先完成当前节点的入门层"}</span>
                  </section>
                  <button className="primary-action" onClick={() => { setSelectedKnowledgeId(selectedGraph.id); switchTab("roadmap"); }}>打开学习详情</button>
                </aside>
              </div>
            )}

            {practiceMode === "drills" && (
              <div className="drill-lab">
                <aside className="drill-list">
                  <div><h2>14 个专项任务</h2><p>每个任务都对应一个知识大块和明确验收物。</p></div>
                  {practices.map((practice) => {
                    const attempts = drillAttempts.filter((item) => item.practiceId === practice.id);
                    return (
                      <button
                        key={practice.id}
                        className={selectedDrillId === practice.id ? "active" : ""}
                        onClick={() => { setSelectedDrillId(practice.id); setDrillSubmission(""); setDrillReview(null); }}
                      >
                        <span>{practice.tag}</span><small>{practice.difficulty} · {practice.minutes} 分钟 · {attempts.length} 次提交</small>
                      </button>
                    );
                  })}
                </aside>
                <div className="drill-workspace">
                  <section className="drill-brief">
                    <div><span>{selectedDrill.difficulty}</span><b>{selectedDrill.minutes} 分钟</b></div>
                    <h2>{selectedDrill.task}</h2>
                    <p><strong>交付物：</strong>{selectedDrill.deliverable}</p>
                    <div>
                      {selectedDrill.criteria.map((item) => <span key={item}>□ {item}</span>)}
                    </div>
                  </section>
                  <section className="submission-box">
                    <label>提交内容</label>
                    <textarea
                      value={drillSubmission}
                      onChange={(event) => setDrillSubmission(event.target.value)}
                      placeholder="粘贴方案、代码片段、产物链接、测试结果或复盘。不要只勾选完成。"
                      rows={10}
                    />
                    <button className="primary-action" onClick={submitDrill} disabled={isDrillReviewing}>
                      {isDrillReviewing ? "模型评审中…" : "提交并评审"}
                    </button>
                  </section>
                  {drillReview && (
                    <section className="drill-review">
                      <div><strong>{drillReview.score}</strong><span>{drillReview.engine === "model" ? "模型评审" : "本地检查"}</span></div>
                      <section><h3>做得好的</h3>{drillReview.strengths.length ? drillReview.strengths.map((item) => <p key={item}>✓ {item}</p>) : <p>尚未识别到明确亮点。</p>}</section>
                      <section><h3>需要补充</h3>{drillReview.improvements.map((item) => <p key={item}>• {item}</p>)}</section>
                      <p><strong>下一步：</strong>{drillReview.nextAction}</p>
                    </section>
                  )}
                  {drillAttempts.some((item) => item.practiceId === selectedDrill.id) && (
                    <section className="drill-history">
                      <h3>提交历史</h3>
                      {[...drillAttempts].reverse().filter((item) => item.practiceId === selectedDrill.id).map((attempt) => (
                        <details key={attempt.id}>
                          <summary><span>{new Date(attempt.createdAt).toLocaleString("zh-CN")}</span><b>{attempt.review.score} 分</b></summary>
                          <div><p>{attempt.submission}</p><p><strong>下一步：</strong>{attempt.review.nextAction}</p></div>
                        </details>
                      ))}
                    </section>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
