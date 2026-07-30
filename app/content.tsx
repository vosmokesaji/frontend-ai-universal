"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";

export type Resource = {
  title: string;
  provider: string;
  url: string;
  lang: "中文" | "英文" | "中英";
  note: string;
};

export type Knowledge = {
  id: string;
  phase: string;
  category: string;
  name: string;
  why: string;
  outcome: string;
  importance: number;
  difficulty: number;
  days: number;
  fit: number;
  optional?: boolean;
  resources: Resource[];
};

export type Job = {
  company: string;
  title: string;
  role: string;
  salary: string;
  months: string;
  experience: string;
  match: number;
  keywords: string[];
  source: string;
  sourceLabel: string;
  captured: string;
};

export type InterviewSource = {
  id: string;
  label: string;
  url: string;
};

export type Question = {
  id: number;
  role: string[];
  category: string;
  frequency: number;
  question: string;
  why: string;
  answerFrame: string[];
  keywords: string[];
  sourceIds: string[];
};

export const knowledge: Knowledge[] = [
  {
    id: "ml",
    phase: "0—30 天",
    category: "底层",
    name: "机器学习与统计直觉",
    why: "理解损失函数、过拟合、概率与评估，才能判断模型结果，不被新名词牵着走。",
    outcome: "能解释训练 / 验证 / 推理差异，能选择基础指标并识别数据泄漏。",
    importance: 5,
    difficulty: 3,
    days: 14,
    fit: 82,
    resources: [
      {
        title: "Machine Learning Crash Course",
        provider: "Google",
        url: "https://developers.google.com/machine-learning/crash-course",
        lang: "英文",
        note: "交互式入门；先学损失、泛化、分类与 embedding。",
      },
      {
        title: "Neural Networks",
        provider: "3Blue1Brown",
        url: "https://www.3blue1brown.com/topics/neural-networks",
        lang: "英文",
        note: "用视觉直觉理解神经网络、梯度下降与反向传播。",
      },
      {
        title: "Practical Deep Learning for Coders",
        provider: "fast.ai",
        url: "https://course.fast.ai/",
        lang: "英文",
        note: "代码先行，适合工程师建立端到端实践感。",
      },
    ],
  },
  {
    id: "python",
    phase: "0—30 天",
    category: "工程",
    name: "Python 工程化与异步",
    why: "AI 应用生态的共同语言。重点不是语法，而是类型、依赖、测试、async 与服务化。",
    outcome: "用 FastAPI 写有类型、测试、超时与并发控制的模型网关。",
    importance: 5,
    difficulty: 3,
    days: 18,
    fit: 90,
    resources: [
      {
        title: "Python 官方教程",
        provider: "Python",
        url: "https://docs.python.org/zh-cn/3/tutorial/",
        lang: "中文",
        note: "用 TS / Node 经验对照学习，跳过已熟悉的通用概念。",
      },
      {
        title: "asyncio — 异步 I/O",
        provider: "Python",
        url: "https://docs.python.org/zh-cn/3/library/asyncio.html",
        lang: "中文",
        note: "AI 服务高并发、流式与工具调用的必修地基。",
      },
      {
        title: "FastAPI Tutorial",
        provider: "FastAPI",
        url: "https://fastapi.tiangolo.com/tutorial/",
        lang: "中英",
        note: "边做边学类型校验、依赖注入、鉴权与异步接口。",
      },
    ],
  },
  {
    id: "llm",
    phase: "0—30 天",
    category: "底层",
    name: "LLM / Transformer 原理",
    why: "模型会变，token、attention、上下文、训练与推理的基本约束不会快速变化。",
    outcome: "能画出 Transformer 数据流，解释 token、QKV、采样、上下文窗口与幻觉。",
    importance: 5,
    difficulty: 4,
    days: 16,
    fit: 78,
    resources: [
      {
        title: "LLM Course",
        provider: "Hugging Face",
        url: "https://huggingface.co/learn/llm-course/en/chapter1/1",
        lang: "英文",
        note: "从 Transformer 到推理、微调与数据，体系完整且免费。",
      },
      {
        title: "The Illustrated Transformer",
        provider: "Jay Alammar",
        url: "https://jalammar.github.io/illustrated-transformer/",
        lang: "英文",
        note: "最适合视觉型学习者的 Transformer 图解。",
      },
      {
        title: "Language Modeling from Scratch",
        provider: "Stanford CS336",
        url: "https://cs336.stanford.edu/",
        lang: "英文",
        note: "进阶选修；理解模型构建、训练、缩放与评估全链路。",
      },
    ],
  },
  {
    id: "prompt",
    phase: "31—60 天",
    category: "应用",
    name: "模型 API、Prompt 与上下文工程",
    why: "稳定输出来自输入契约、示例、结构化结果、上下文选择与失败策略，不来自“咒语”。",
    outcome: "建立可版本化 Prompt、结构化输出、缓存、模型路由与上下文压缩。",
    importance: 5,
    difficulty: 2,
    days: 10,
    fit: 94,
    resources: [
      {
        title: "Prompt engineering overview",
        provider: "Anthropic",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
        lang: "英文",
        note: "从成功标准与评测出发，而不是堆提示词技巧。",
      },
      {
        title: "Prompt engineering best practices",
        provider: "OpenAI",
        url: "https://help.openai.com/en/articles/6654000-how-to-use-advanced-prompt-engineering",
        lang: "英文",
        note: "清晰指令、示例、格式与分步任务的实用清单。",
      },
      {
        title: "The Prompt Report",
        provider: "arXiv",
        url: "https://arxiv.org/abs/2406.06608",
        lang: "英文",
        note: "用系统分类理解 prompting 技术与适用边界。",
      },
    ],
  },
  {
    id: "rag",
    phase: "31—60 天",
    category: "应用",
    name: "RAG 与信息检索",
    why: "企业 AI 的长期核心：把私有、可更新、可引用的知识送进模型。",
    outcome: "完成文档清洗、切分、稀疏 / 稠密混合检索、重排、引用与增量索引。",
    importance: 5,
    difficulty: 4,
    days: 18,
    fit: 88,
    resources: [
      {
        title: "Build a custom RAG agent",
        provider: "LangGraph",
        url: "https://docs.langchain.com/oss/python/langgraph/agentic-rag",
        lang: "英文",
        note: "用可控图结构实现检索、判断与生成。",
      },
      {
        title: "RAG from scratch",
        provider: "LlamaIndex",
        url: "https://docs.llamaindex.ai/en/stable/understanding/rag/",
        lang: "英文",
        note: "从 ingestion、index 到 query 的完整心智模型。",
      },
      {
        title: "Retrieval-Augmented Generation",
        provider: "原始论文",
        url: "https://arxiv.org/abs/2005.11401",
        lang: "英文",
        note: "理解 RAG 为什么出现，以及参数知识与外部知识的分工。",
      },
    ],
  },
  {
    id: "agent",
    phase: "61—90 天",
    category: "应用",
    name: "Agent、工具调用、MCP 与工作流",
    why: "框架会换，但任务分解、状态、工具契约、权限、重试与人机协作长期存在。",
    outcome: "实现可中断、可恢复、可观测的单 Agent；知道何时不该用多 Agent。",
    importance: 5,
    difficulty: 4,
    days: 20,
    fit: 92,
    resources: [
      {
        title: "Model Context Protocol — Introduction",
        provider: "MCP",
        url: "https://modelcontextprotocol.io/docs/getting-started/intro",
        lang: "英文",
        note: "掌握 host / client / server、能力暴露与安全边界。",
      },
      {
        title: "LangGraph overview",
        provider: "LangChain",
        url: "https://docs.langchain.com/oss/python/langgraph/overview",
        lang: "英文",
        note: "学习状态图、持久化、human-in-the-loop 与长任务。",
      },
      {
        title: "AI Agents Course",
        provider: "Hugging Face",
        url: "https://huggingface.co/learn/agents-course/en/unit0/introduction",
        lang: "英文",
        note: "免费课程，覆盖 agent 基础、框架与实践作业。",
      },
    ],
  },
  {
    id: "eval",
    phase: "61—90 天",
    category: "质量",
    name: "评测、可观测性与成本",
    why: "这是把 Demo 变产品的分水岭：先定义“好”，再优化模型与系统。",
    outcome: "建立黄金数据集、离线回归、在线指标、trace、人工反馈与成本预算。",
    importance: 5,
    difficulty: 4,
    days: 14,
    fit: 96,
    resources: [
      {
        title: "Evaluation concepts",
        provider: "LangSmith",
        url: "https://docs.langchain.com/langsmith/evaluation-concepts",
        lang: "英文",
        note: "理解 evaluator、数据集、离线评测与线上监控。",
      },
      {
        title: "Evaluate a simple LLM application",
        provider: "Ragas",
        url: "https://docs.ragas.io/en/stable/getstarted/evals/",
        lang: "英文",
        note: "上手 RAG / LLM 质量指标与可重复评测。",
      },
      {
        title: "Evaluate a RAG application",
        provider: "LangChain",
        url: "https://docs.langchain.com/langsmith/evaluate-rag-tutorial",
        lang: "英文",
        note: "从测试集、运行实验到正确性与检索质量评估。",
      },
    ],
  },
  {
    id: "ai-ui",
    phase: "31—60 天",
    category: "前端",
    name: "AI 前端：流式、多模态与生成式 UI",
    why: "这是你的第一杠杆。AI 界面不是聊天框：要处理不确定性、渐进结果、取消与可恢复状态。",
    outcome: "实现 SSE / Fetch Streams、Abort、富文本增量渲染、工具状态与长列表性能。",
    importance: 5,
    difficulty: 3,
    days: 12,
    fit: 100,
    resources: [
      {
        title: "AI SDK Documentation",
        provider: "Vercel",
        url: "https://ai-sdk.dev/docs/introduction",
        lang: "英文",
        note: "TS / React 构建流式文本、工具调用与生成式 UI。",
      },
      {
        title: "Streams API",
        provider: "MDN",
        url: "https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API",
        lang: "中文",
        note: "掌握背压、分片、解码与流式数据处理底层。",
      },
      {
        title: "Using server-sent events",
        provider: "MDN",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events",
        lang: "英文",
        note: "理解 SSE 生命周期、重连与浏览器限制。",
      },
    ],
  },
  {
    id: "ai-ux",
    phase: "31—60 天",
    category: "设计",
    name: "Human-AI Interaction / AI UX",
    why: "你的第二杠杆。核心是校准信任、提供控制、解释边界，并设计好失败体验。",
    outcome: "完成一个 AI 产品的心智模型、反馈机制、可控自动化、容错与透明度设计。",
    importance: 5,
    difficulty: 3,
    days: 12,
    fit: 100,
    resources: [
      {
        title: "People + AI Guidebook",
        provider: "Google PAIR",
        url: "https://pair.withgoogle.com/guidebook-v2/",
        lang: "英文",
        note: "最系统的人本 AI 产品方法、设计模式与案例。",
      },
      {
        title: "HAX Toolkit",
        provider: "Microsoft",
        url: "https://www.microsoft.com/en-us/haxtoolkit/",
        lang: "英文",
        note: "把人机交互指南转化为可执行的产品检查表。",
      },
      {
        title: "Shape of AI",
        provider: "Emily Campbell",
        url: "https://www.shapeof.ai/",
        lang: "英文",
        note: "AI 交互模式库，适合设计师与前端建立界面语言。",
      },
    ],
  },
  {
    id: "backend",
    phase: "91—120 天",
    category: "工程",
    name: "后端、数据与可靠性",
    why: "生产级 Agent 的大部分难题是超时、并发、状态、存储、幂等、降级与日志。",
    outcome: "设计 API、队列、缓存、数据库与对象存储；实现重试、熔断、幂等与回滚。",
    importance: 5,
    difficulty: 4,
    days: 20,
    fit: 86,
    resources: [
      {
        title: "Designing Data-Intensive Applications",
        provider: "Martin Kleppmann",
        url: "https://dataintensive.net/",
        lang: "英文",
        note: "数据系统、复制、分区、一致性与流处理的长期经典。",
      },
      {
        title: "FastAPI Advanced User Guide",
        provider: "FastAPI",
        url: "https://fastapi.tiangolo.com/advanced/",
        lang: "中英",
        note: "中间件、异步、WebSocket、测试、部署与高级服务能力。",
      },
      {
        title: "Cloud Design Patterns",
        provider: "Microsoft",
        url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/",
        lang: "中英",
        note: "重试、熔断、队列、舱壁、补偿事务等工程模式。",
      },
    ],
  },
  {
    id: "security",
    phase: "91—120 天",
    category: "质量",
    name: "AI 安全、隐私与负责任 AI",
    why: "Agent 能调用工具与数据后，Prompt 注入、越权、泄露和错误行动都变成产品风险。",
    outcome: "完成威胁建模、最小权限、数据分级、内容安全与高风险动作确认。",
    importance: 4,
    difficulty: 3,
    days: 10,
    fit: 88,
    resources: [
      {
        title: "Top 10 for LLM Applications",
        provider: "OWASP",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
        lang: "英文",
        note: "Prompt 注入、敏感信息泄露、过度代理等核心风险。",
      },
      {
        title: "MITRE ATLAS",
        provider: "MITRE",
        url: "https://atlas.mitre.org/",
        lang: "英文",
        note: "用对抗战术与技术构建 AI 威胁模型。",
      },
      {
        title: "Secure AI Framework",
        provider: "Google",
        url: "https://saif.google/",
        lang: "英文",
        note: "从组织与系统层理解安全 AI 的完整框架。",
      },
    ],
  },
  {
    id: "llmops",
    phase: "121—150 天",
    category: "工程",
    name: "部署、容器与 LLMOps",
    why: "模型接口只是依赖；真正的交付要关注环境、可复现、灰度、监控与成本。",
    outcome: "用 Docker 交付服务，配置 CI/CD、监控、限流、灰度与回滚。",
    importance: 4,
    difficulty: 4,
    days: 15,
    fit: 82,
    resources: [
      {
        title: "Docker — Get started",
        provider: "Docker",
        url: "https://docs.docker.com/get-started/",
        lang: "英文",
        note: "从镜像、容器、Compose 到生产构建。",
      },
      {
        title: "Learn Kubernetes Basics",
        provider: "Kubernetes",
        url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
        lang: "中英",
        note: "理解部署、扩缩容、更新与故障恢复。",
      },
      {
        title: "LLM Bootcamp",
        provider: "Full Stack Deep Learning",
        url: "https://fullstackdeeplearning.com/llm-bootcamp/",
        lang: "英文",
        note: "从 Prompt、UX 到 LLMOps 的免费全栈课程。",
      },
    ],
  },
  {
    id: "finetune",
    phase: "151—180 天",
    category: "进阶",
    name: "微调与开源模型推理",
    why: "重要但不是第一落点。先会评测与 RAG，再判断微调是否真的创造收益。",
    outcome: "理解 LoRA / SFT、数据质量、推理服务与显存 / 延迟 / 吞吐权衡。",
    importance: 3,
    difficulty: 5,
    days: 14,
    fit: 65,
    optional: true,
    resources: [
      {
        title: "PEFT Documentation",
        provider: "Hugging Face",
        url: "https://huggingface.co/docs/peft/index",
        lang: "英文",
        note: "参数高效微调的主流方法与工程实践。",
      },
      {
        title: "LoRA: Low-Rank Adaptation",
        provider: "原始论文",
        url: "https://arxiv.org/abs/2106.09685",
        lang: "英文",
        note: "理解低秩适配的原理、收益与边界。",
      },
      {
        title: "vLLM Documentation",
        provider: "vLLM",
        url: "https://docs.vllm.ai/",
        lang: "英文",
        note: "学习高吞吐推理服务、连续批处理与部署。",
      },
    ],
  },
  {
    id: "next",
    phase: "0—30 天",
    category: "前端",
    name: "Next.js 与现代全栈补课",
    why: "北京 AI 产品前端 JD 高频出现 Next.js、React、BFF 与端到端交付。",
    outcome: "掌握 App Router、Server Components、Route Handlers、缓存与鉴权边界。",
    importance: 3,
    difficulty: 2,
    days: 8,
    fit: 96,
    resources: [
      {
        title: "Next.js Learn",
        provider: "Vercel",
        url: "https://nextjs.org/learn",
        lang: "英文",
        note: "用完整项目串起路由、数据、缓存、错误与鉴权。",
      },
      {
        title: "Next.js Documentation",
        provider: "Vercel",
        url: "https://nextjs.org/docs",
        lang: "英文",
        note: "重点读 App Router、RSC、Route Handlers 与缓存。",
      },
      {
        title: "React Server Components",
        provider: "React",
        url: "https://react.dev/reference/rsc/server-components",
        lang: "英文",
        note: "理解服务端 / 客户端组件的边界与数据流。",
      },
    ],
  },
];

export const jobs: Job[] = [
  {
    company: "BOSS直聘",
    title: "高级前端开发工程师（AI 产品）",
    role: "AI 产品前端",
    salary: "30—45K",
    months: "16 薪",
    experience: "1—3 年 / 本科",
    match: 98,
    keywords: ["Vue3", "TypeScript", "AI 产品", "技术方案"],
    source:
      "https://m.zhipin.com/zhaopin/5b333a0b7ab3e8f10nVz2Nu1FQ~~/",
    sourceLabel: "BOSS 公开职位页",
    captured: "2026-07-28",
  },
  {
    company: "字节跳动",
    title: "高级前端开发工程师（大模型方向）",
    role: "AI 平台前端",
    salary: "30—50K",
    months: "15 薪",
    experience: "5—10 年 / 本科",
    match: 96,
    keywords: ["大模型平台", "BFF", "组件沉淀", "机器学习"],
    source:
      "https://www.zhipin.com/zhaopin/3e182014a73760b90Hx93ty1/",
    sourceLabel: "BOSS 公开职位页",
    captured: "2026-07-28",
  },
  {
    company: "字节跳动 · 即梦",
    title: "AI Native 工程师",
    role: "AI Native 全栈",
    salary: "40—70K",
    months: "15 薪",
    experience: "1—3 年 / 本科",
    match: 92,
    keywords: ["多模态", "生成链路", "AI 编排", "用户体验"],
    source:
      "https://www.zhipin.com/zhaopin/3e182014a73760b90Hx93ty1/",
    sourceLabel: "BOSS 公开职位页",
    captured: "2026-07-28",
  },
  {
    company: "雷石天地",
    title: "AI Native 全栈工程师",
    role: "AI Native 全栈",
    salary: "40—60K",
    months: "月薪",
    experience: "经验不限 / 本科",
    match: 95,
    keywords: ["Agent 主力交付", "全栈", "AI Coding", "产品工程"],
    source:
      "https://m.zhipin.com/zhaopin/567b1e9c05f635dc03N72t2-Ew~~/",
    sourceLabel: "BOSS 公开职位页",
    captured: "2026-07-28",
  },
  {
    company: "生智数据科技",
    title: "资深 AI 全栈工程师",
    role: "AI Native 全栈",
    salary: "30—40K",
    months: "月薪",
    experience: "5—10 年 / 本科",
    match: 97,
    keywords: ["Next.js", "React", "Agent 产品", "端到端交付"],
    source:
      "https://m.zhipin.com/zhaopin/567b1e9c05f635dc03N72t2-Ew~~/",
    sourceLabel: "BOSS 公开职位页",
    captured: "2026-07-28",
  },
  {
    company: "美团",
    title: "AI Agent 全栈工程师",
    role: "AI Native 全栈",
    salary: "30—60K",
    months: "月薪",
    experience: "1—3 年 / 本科",
    match: 88,
    keywords: ["Java / Go", "Agent", "后端架构", "AI Coding"],
    source:
      "https://m.zhipin.com/zhaopin/567b1e9c05f635dc03N72t2-Ew~~/",
    sourceLabel: "BOSS 公开职位页",
    captured: "2026-07-28",
  },
  {
    company: "阿里巴巴",
    title: "AI 应用研发工程师",
    role: "Agent 应用工程",
    salary: "25—40K",
    months: "16 薪",
    experience: "2 年+ / 本科",
    match: 86,
    keywords: ["Agent 工程", "观测评测", "高并发", "JS / Python"],
    source: "https://www.nowcoder.com/jobs/hr/113603",
    sourceLabel: "牛客职位页",
    captured: "2026-07-28",
  },
  {
    company: "字节跳动",
    title: "Agent 开发工程师",
    role: "Agent 应用工程",
    salary: "30—40K",
    months: "12 薪",
    experience: "1—3 年 / 本科",
    match: 80,
    keywords: ["多模态", "Python / Go", "RAG", "中间件"],
    source: "https://www.nowcoder.com/jobs/detail/430944",
    sourceLabel: "牛客职位页",
    captured: "2026-07-28",
  },
  {
    company: "科大讯飞",
    title: "AI Agent 开发",
    role: "Agent 应用工程",
    salary: "25—35K",
    months: "15 薪",
    experience: "校招 / 本科",
    match: 78,
    keywords: ["LangChain", "RAG", "向量数据库", "Multi-Agent"],
    source: "https://www.nowcoder.com/jobs/detail/450132",
    sourceLabel: "牛客职位页",
    captured: "2026-07-28",
  },
  {
    company: "美团",
    title: "大模型应用算法工程师",
    role: "大模型应用算法",
    salary: "35—55K",
    months: "15 薪",
    experience: "社招 / 北京",
    match: 58,
    keywords: ["办公 AI", "大模型应用", "算法", "工程协作"],
    source: "https://www.nowcoder.com/jobs/detail/378657",
    sourceLabel: "牛客职位页",
    captured: "2026-07-28",
  },
  {
    company: "百度",
    title: "资深交互设计师（AI 产品）",
    role: "AI 体验 / 原型",
    salary: "20—40K",
    months: "16 薪",
    experience: "社招 / 北京",
    match: 91,
    keywords: ["AI 研发产品", "交互设计", "体验验证", "设计规范"],
    source: "https://www.zhipin.com/zhaopin/8cb989b8bdf8006e1nd82tq9/",
    sourceLabel: "BOSS 公开职位页",
    captured: "2026-07-28",
  },
  {
    company: "冰迅智能科技",
    title: "前端开发（AIGC 产品方向）",
    role: "AI 产品前端",
    salary: "20—40K",
    months: "月薪",
    experience: "1—3 年 / 大专",
    match: 94,
    keywords: ["AI 内容", "图片 / 视频", "交互优化", "SaaS"],
    source:
      "https://m.zhipin.com/zhaopin/5b333a0b7ab3e8f10nVz2Nu1FQ~~/",
    sourceLabel: "BOSS 公开职位页",
    captured: "2026-07-28",
  },
];

export const interviewSources: InterviewSource[] = [
  {
    id: "taotian",
    label: "淘天 Agent 社招一面 · 2026-07",
    url: "https://www.nowcoder.com/discuss/909920471301226496",
  },
  {
    id: "agentmix",
    label: "阿里 / 蚂蚁 / 字节 Agent 面经汇总 · 2026-04",
    url: "https://www.nowcoder.com/discuss/877151327091027968",
  },
  {
    id: "baidu",
    label: "百度 AI Agent 前端研发面经 · 2026-06",
    url: "https://www.nowcoder.com/feed/main/detail/0ee219e39f254208bef730ca1e928fcc",
  },
  {
    id: "frontend",
    label: "前端 AI 项目高频追问 · 2026-04",
    url: "https://www.nowcoder.com/feed/main/detail/e17421f1011649018c99aad1427ad902",
  },
  {
    id: "sensetime",
    label: "商汤大模型算法应用面经 · 2026-07",
    url: "https://www.nowcoder.com/feed/main/detail/2762070c2c52472da06bf9ee59518d79",
  },
  {
    id: "bytedance",
    label: "字节大模型应用算法三面 · 2026-04",
    url: "https://www.nowcoder.com/feed/main/detail/0e879c4d37b14065b43b6643eb4c7ebf",
  },
  {
    id: "jd",
    label: "京东 Agent 二面 · 2026-07",
    url: "https://www.nowcoder.com/feed/main/detail/b51047e32faa44678b3e0fffb798c17d",
  },
  {
    id: "ragcorp",
    label: "企业知识库 RAG 一面 · 2026-06",
    url: "https://www.nowcoder.com/feed/main/detail/1a85477771e0493086facc1e97cc3a48",
  },
];

export const questions: Question[] = [
  {
    id: 1,
    role: ["全部", "AI 产品前端", "AI Native 全栈", "Agent 应用工程"],
    category: "项目深挖",
    frequency: 8,
    question: "请用 3 分钟讲清一个 AI 项目的业务价值、架构、你的贡献、关键取舍与结果。",
    why: "几乎所有面试都会从项目切入，面试官要判断你是否只跑通 Demo。",
    answerFrame: ["场景与用户", "可量化问题", "架构与责任边界", "一次关键取舍", "结果与复盘"],
    keywords: ["业务", "用户", "架构", "贡献", "取舍", "指标", "结果"],
    sourceIds: ["taotian", "agentmix", "baidu", "frontend", "sensetime", "bytedance", "jd", "ragcorp"],
  },
  {
    id: 2,
    role: ["全部", "AI Native 全栈", "Agent 应用工程", "大模型应用算法"],
    category: "RAG",
    frequency: 7,
    question: "从原始文档到可引用答案，完整讲一遍 RAG 链路，以及每一层如何评测。",
    why: "只说 embedding + 向量库远远不够，真实难点在数据、召回、重排和评测。",
    answerFrame: ["解析清洗", "切分与元数据", "混合召回", "重排与上下文", "引用生成", "分层指标"],
    keywords: ["切分", "元数据", "向量", "BM25", "混合检索", "重排", "召回率", "引用"],
    sourceIds: ["taotian", "agentmix", "sensetime", "bytedance", "jd", "ragcorp", "frontend"],
  },
  {
    id: 3,
    role: ["全部", "AI Native 全栈", "Agent 应用工程"],
    category: "Agent",
    frequency: 7,
    question: "什么时候用工作流、单 Agent、多 Agent？请给出决策标准与失败边界。",
    why: "面试官在排除为了炫技而堆 Agent 的候选人。",
    answerFrame: ["确定性", "任务开放度", "并行收益", "协调成本", "可观测性", "人工兜底"],
    keywords: ["确定性", "工作流", "单Agent", "多Agent", "状态", "成本", "兜底"],
    sourceIds: ["taotian", "agentmix", "baidu", "sensetime", "jd", "bytedance", "ragcorp"],
  },
  {
    id: 4,
    role: ["全部", "AI Native 全栈", "Agent 应用工程"],
    category: "可靠性",
    frequency: 6,
    question: "Agent 超时、死循环、工具失败或重复执行时，如何做到安全重试、幂等与恢复？",
    why: "生产系统的分水岭不是模型聪明度，而是失败是否可控。",
    answerFrame: ["截止时间 / 步数预算", "错误分类", "幂等键", "检查点", "补偿 / 回滚", "人工升级"],
    keywords: ["超时", "重试", "幂等", "检查点", "回滚", "熔断", "人工"],
    sourceIds: ["agentmix", "baidu", "sensetime", "taotian", "jd", "frontend"],
  },
  {
    id: 5,
    role: ["全部", "AI Native 全栈", "Agent 应用工程", "大模型应用算法"],
    category: "评测",
    frequency: 6,
    question: "你如何证明系统变好了？请设计离线评测、线上指标与人工反馈闭环。",
    why: "“感觉回答更好”无法支撑产品决策，也无法防止模型或 Prompt 回归。",
    answerFrame: ["成功标准", "黄金集", "分层指标", "基线对比", "线上实验", "错误归因"],
    keywords: ["黄金集", "基线", "准确率", "成功率", "延迟", "成本", "人工评审", "回归"],
    sourceIds: ["taotian", "agentmix", "baidu", "frontend", "sensetime", "bytedance"],
  },
  {
    id: 6,
    role: ["全部", "AI 产品前端", "AI Native 全栈"],
    category: "流式 UI",
    frequency: 5,
    question: "SSE、Fetch Streaming、WebSocket 如何选择？分片、乱码、中断、背压和重连怎么处理？",
    why: "AI 前端最常见的专项题，能同时检验网络、浏览器与体验设计。",
    answerFrame: ["单 / 双向通信", "协议与代理兼容", "TextDecoder 增量解码", "Abort", "背压", "重连语义"],
    keywords: ["SSE", "WebSocket", "ReadableStream", "TextDecoder", "AbortController", "背压", "重连"],
    sourceIds: ["baidu", "frontend", "agentmix", "taotian", "ragcorp"],
  },
  {
    id: 7,
    role: ["全部", "AI 产品前端", "AI Native 全栈", "Agent 应用工程"],
    category: "上下文",
    frequency: 5,
    question: "长对话的上下文、Memory 与 RAG 分别存什么？如何压缩、更新与解决冲突？",
    why: "三个概念经常被混用，回答要体现生命周期和数据语义。",
    answerFrame: ["短期会话", "长期偏好 / 经验", "外部知识", "写入门控", "摘要 / 检索", "冲突策略"],
    keywords: ["上下文", "Memory", "RAG", "摘要", "写入门控", "冲突", "token"],
    sourceIds: ["taotian", "frontend", "sensetime", "bytedance", "jd"],
  },
  {
    id: 8,
    role: ["全部", "AI 产品前端", "AI Native 全栈", "Agent 应用工程"],
    category: "安全",
    frequency: 5,
    question: "如何约束幻觉、Prompt 注入、越权工具调用和高风险动作？",
    why: "工具一旦能写数据，模型错误就从内容问题升级成系统安全问题。",
    answerFrame: ["不信任输入", "结构化输出", "最小权限", "策略层", "动作确认", "审计与回滚"],
    keywords: ["Prompt注入", "最小权限", "结构化", "确认", "审计", "回滚", "白名单"],
    sourceIds: ["taotian", "agentmix", "baidu", "frontend", "bytedance"],
  },
  {
    id: 9,
    role: ["全部", "AI Native 全栈", "Agent 应用工程"],
    category: "工程",
    frequency: 5,
    question: "模型 API 高并发时，如何做限流、缓存、队列、熔断、降级和成本控制？",
    why: "AI 服务仍是分布式系统，只是依赖更慢、更贵、更不确定。",
    answerFrame: ["请求预算", "并发 / 限流", "语义缓存", "队列", "模型路由", "降级", "成本归因"],
    keywords: ["限流", "缓存", "队列", "熔断", "降级", "模型路由", "token成本"],
    sourceIds: ["agentmix", "baidu", "frontend", "sensetime", "bytedance"],
  },
  {
    id: 10,
    role: ["全部", "AI 产品前端", "AI Native 全栈"],
    category: "AI UX",
    frequency: 4,
    question: "AI 结果不确定、延迟高且可能失败时，界面如何校准信任并保留用户控制？",
    why: "这是你最能形成差异化的题：把交互细节上升为产品机制。",
    answerFrame: ["预期设置", "渐进反馈", "来源 / 置信线索", "可编辑", "撤销 / 重试", "失败恢复"],
    keywords: ["预期", "渐进", "来源", "可编辑", "撤销", "重试", "用户控制"],
    sourceIds: ["frontend", "baidu", "taotian", "sensetime"],
  },
  {
    id: 11,
    role: ["全部", "AI Native 全栈", "Agent 应用工程"],
    category: "工具调用",
    frequency: 4,
    question: "Function Calling、MCP 与自定义 API 集成各自解决什么问题？工具 schema 如何设计？",
    why: "面试官关注的是契约、发现、权限和错误语义，不是背协议名词。",
    answerFrame: ["模型侧调用", "协议标准化", "schema 约束", "鉴权", "错误分类", "版本兼容"],
    keywords: ["Function Calling", "MCP", "schema", "鉴权", "错误", "版本", "能力发现"],
    sourceIds: ["agentmix", "baidu", "frontend", "taotian"],
  },
  {
    id: 12,
    role: ["全部", "大模型应用算法", "Agent 应用工程"],
    category: "模型原理",
    frequency: 4,
    question: "解释 self-attention、Q/K/V、token 与上下文窗口；它们如何影响应用设计？",
    why: "应用岗通常不要求推导全部公式，但要能把原理连接到延迟、成本和效果。",
    answerFrame: ["token 化", "Q/K/V 直觉", "attention", "位置", "上下文复杂度", "应用约束"],
    keywords: ["token", "Q", "K", "V", "attention", "位置编码", "上下文", "复杂度"],
    sourceIds: ["sensetime", "bytedance", "taotian", "jd"],
  },
  {
    id: 13,
    role: ["全部", "AI 产品前端", "AI Native 全栈"],
    category: "前端基础",
    frequency: 4,
    question: "流式 Markdown、代码块与超长聊天记录如何避免频繁重排和主线程卡顿？",
    why: "高级前端岗位仍会回到渲染、调度、内存与可访问性基本功。",
    answerFrame: ["批量刷新", "增量解析", "虚拟列表", "memo 边界", "Worker", "测量指标"],
    keywords: ["批量", "增量解析", "虚拟列表", "memo", "Worker", "性能指标"],
    sourceIds: ["frontend", "baidu", "agentmix", "taotian"],
  },
  {
    id: 14,
    role: ["全部", "AI Native 全栈", "Agent 应用工程", "大模型应用算法"],
    category: "编码",
    frequency: 4,
    question: "请完成一道中等算法题，并说明复杂度、边界用例与测试策略。",
    why: "Agent 岗没有取消编码基本功；多份面经仍包含手撕与数据结构。",
    answerFrame: ["澄清输入", "朴素解", "优化", "复杂度", "边界", "测试"],
    keywords: ["复杂度", "边界", "测试", "时间", "空间", "优化"],
    sourceIds: ["agentmix", "sensetime", "bytedance", "jd"],
  },
];

export const roles = [
  {
    id: "AI 产品前端",
    rank: "01",
    title: "AI 产品前端 / 生成式 UI 工程师",
    fit: 98,
    salary: "20—50K · 最高样本 70K",
    bridge: "React / Vue / TS → 流式 UI、工具状态、多模态、AI UX",
    gap: "补模型边界、SSE / Streams、评测与 Next.js",
    pitch: "把“动效与细节”升级成 AI 不确定性下的信任、控制与反馈系统。",
  },
  {
    id: "AI Native 全栈",
    rank: "02",
    title: "AI Native 全栈 / AI 产品工程师",
    fit: 95,
    salary: "20—60K · 最高样本 70K",
    bridge: "TS / Node → Next.js、Python API、RAG、Agent、端到端交付",
    gap: "补 Python、数据库、Docker、可靠性与观测",
    pitch: "最适合 10 年工程经验变现：不只做页面，而是独立把 AI 功能交付上线。",
  },
  {
    id: "AI 体验 / 原型",
    rank: "03",
    title: "AI 交互体验工程师 / Design Engineer",
    fit: 93,
    salary: "20—40K · 岗位较少",
    bridge: "UI / 交互 / 动效 → AI 原型、生成式交互、人机协作机制",
    gap: "补用户研究、AI 评测、作品集叙事与快速原型",
    pitch: "稀缺的“能设计、能做出来、懂 AI 边界”的混合型人才。",
  },
  {
    id: "Agent 应用工程",
    rank: "04",
    title: "LLM / Agent 应用工程师",
    fit: 84,
    salary: "25—55K · 算法向门槛更高",
    bridge: "Node / 工程经验 → Python、RAG、工具调用、评测、服务化",
    gap: "补 Python 深度、检索、后端 / 分布式与模型原理",
    pitch: "建议作为第二跳：先以 AI 前端 / 全栈入场，再向 Agent 核心工程加深。",
  },
];

export const practices = [
  { tag: "RAG", task: "白板讲清切分 → 混合召回 → 重排 → 引用 → 评测，限时 8 分钟。", minutes: 25 },
  { tag: "可靠性", task: "为一个可写数据库的 Agent 画出超时、幂等、重试、补偿与人工确认。", minutes: 30 },
  { tag: "流式 UI", task: "不用 SDK，实现一个支持 Abort、UTF-8 分片与批量渲染的流式输出。", minutes: 40 },
  { tag: "评测", task: "为作品集项目写 20 条黄金样本，定义质量、延迟、成本三类门槛。", minutes: 35 },
  { tag: "项目深挖", task: "把一个老前端项目改写成“问题—取舍—指标—复盘”的 3 分钟故事。", minutes: 20 },
];

function ScoreBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="scorebar" aria-label={`${value} / ${max}`}>
      {Array.from({ length: max }, (_, index) => (
        <i key={index} className={index < value ? "on" : ""} />
      ))}
    </span>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

export default function Home() {
  const [sortKey, setSortKey] = useState<"importance" | "difficulty" | "days">(
    "importance",
  );
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [category, setCategory] = useState("全部");
  const [expandedKnowledge, setExpandedKnowledge] = useState<string | null>("ai-ui");
  const [jobRole, setJobRole] = useState("全部");
  const [jobSearch, setJobSearch] = useState("");
  const [questionRole, setQuestionRole] = useState("全部");
  const [questionSort, setQuestionSort] = useState<"hot" | "category">("hot");
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [review, setReview] = useState<null | {
    overall: number;
    structure: number;
    evidence: number;
    depth: number;
    missing: string[];
  }>(null);
  const [completedPractice, setCompletedPractice] = useState<string[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("ai-transition-practice");
    if (saved) setCompletedPractice(JSON.parse(saved) as string[]);
  }, []);

  useEffect(() => {
    if (!activeQuestion || review) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [activeQuestion, review]);

  const sortedKnowledge = useMemo(() => {
    return knowledge
      .filter((item) => category === "全部" || item.category === category)
      .sort((a, b) => {
        const delta = a[sortKey] - b[sortKey];
        return sortDirection === "desc" ? -delta : delta;
      });
  }, [category, sortDirection, sortKey]);

  const filteredJobs = useMemo(() => {
    const query = jobSearch.trim().toLowerCase();
    return jobs.filter((job) => {
      const roleMatch = jobRole === "全部" || job.role === jobRole;
      const text = `${job.company}${job.title}${job.keywords.join("")}`.toLowerCase();
      return roleMatch && (!query || text.includes(query));
    });
  }, [jobRole, jobSearch]);

  const filteredQuestions = useMemo(() => {
    const list = questions.filter(
      (item) => questionRole === "全部" || item.role.includes(questionRole),
    );
    return [...list].sort((a, b) =>
      questionSort === "hot"
        ? b.frequency - a.frequency
        : a.category.localeCompare(b.category, "zh-CN"),
    );
  }, [questionRole, questionSort]);

  function beginInterview(question?: Question) {
    setActiveQuestion(question ?? filteredQuestions[0] ?? questions[0]);
    setAnswer("");
    setSeconds(0);
    setReview(null);
    window.setTimeout(
      () => document.querySelector("#simulator")?.scrollIntoView({ behavior: "smooth" }),
      10,
    );
  }

  function submitAnswer() {
    if (!activeQuestion) return;
    const normalized = answer.toLowerCase();
    const keywordHits = activeQuestion.keywords.filter((word) =>
      normalized.includes(word.toLowerCase()),
    );
    const density = keywordHits.length / activeQuestion.keywords.length;
    const lengthScore = Math.min(answer.trim().length / 500, 1);
    const structure = Math.round(45 + lengthScore * 30 + density * 25);
    const evidence = Math.round(
      35 +
        (/\d|%|万|ms|秒|天|用户|指标/.test(answer) ? 35 : 0) +
        density * 25,
    );
    const depth = Math.round(
      38 +
        (/(取舍|因为|权衡|失败|边界|复盘|对比)/.test(answer) ? 30 : 0) +
        density * 28,
    );
    const overall = Math.min(
      96,
      Math.round(structure * 0.35 + evidence * 0.3 + depth * 0.35),
    );
    const missing = activeQuestion.keywords.filter(
      (word) => !normalized.includes(word.toLowerCase()),
    );
    setReview({
      overall,
      structure: Math.min(98, structure),
      evidence: Math.min(98, evidence),
      depth: Math.min(98, depth),
      missing: missing.slice(0, 4),
    });
  }

  function nextQuestion() {
    if (!activeQuestion) return;
    const current = filteredQuestions.findIndex(
      (item) => item.id === activeQuestion.id,
    );
    const next = filteredQuestions[(current + 1) % filteredQuestions.length] ?? questions[0];
    setActiveQuestion(next);
    setAnswer("");
    setSeconds(0);
    setReview(null);
  }

  function togglePractice(tag: string) {
    const next = completedPractice.includes(tag)
      ? completedPractice.filter((item) => item !== tag)
      : [...completedPractice, tag];
    setCompletedPractice(next);
    window.localStorage.setItem("ai-transition-practice", JSON.stringify(next));
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="AI 转型指南首页">
          <span className="brand-mark">A›</span>
          <span>
            AI TRANSITION
            <small>WEB → INTELLIGENCE</small>
          </span>
        </a>
        <nav aria-label="主导航">
          <a href="#roadmap">路线图</a>
          <a href="#roles">岗位</a>
          <a href="#interview">面试训练</a>
          <a href="#practice">刻意练习</a>
        </nav>
        <a className="header-cta" href="#interview">
          开始训练 <span>↗</span>
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>为 10 年前端定制</span> · 北京 · 2026</p>
          <h1>
            别追每次浪潮，
            <br />
            学会<span className="scribble">造船。</span>
          </h1>
          <p className="hero-lede">
            AI 迭代很快，但<strong>问题定义、工程可靠性、评测、人机交互与学习能力</strong>
            不会快速过时。你的前端经验不是包袱，而是进入 AI 应用层最短的桥。
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#roadmap">
              查看 180 天路线 <span>↓</span>
            </a>
            <button className="button button-ghost" onClick={() => beginInterview()}>
              先来一道真题 <span>→</span>
            </button>
          </div>
        </div>
        <aside className="profile-card">
          <div className="profile-top">
            <span>YOUR UNFAIR ADVANTAGE</span>
            <span className="live-dot">LIVE PLAN</span>
          </div>
          <div className="profile-years">
            <strong>10</strong>
            <span>YEARS<br />WEB FRONTEND</span>
          </div>
          <div className="profile-path">
            <span>jQuery</span><b>→</b><span>Vue / React</span><b>→</b><span className="active">AI Native</span>
          </div>
          <dl className="profile-grid">
            <div><dt>强项</dt><dd>交互 · 动效 · 细节</dd></div>
            <div><dt>可迁移</dt><dd>TS · Node · 产品感</dd></div>
            <div><dt>优先补齐</dt><dd>Python · RAG · 评测</dd></div>
            <div><dt>第一目标</dt><dd>AI 产品前端</dd></div>
          </dl>
          <div className="profile-stamp">
            <span>最佳切口</span>
            <strong>AI × EXPERIENCE</strong>
          </div>
        </aside>
      </section>

      <div className="ticker" aria-hidden="true">
        <div>
          <span>MODEL CHANGES</span><b>✦</b><span>FUNDAMENTALS COMPOUND</span><b>✦</b>
          <span>SHIP · MEASURE · LEARN</span><b>✦</b><span>MODEL CHANGES</span><b>✦</b>
          <span>FUNDAMENTALS COMPOUND</span><b>✦</b><span>SHIP · MEASURE · LEARN</span>
        </div>
      </div>

      <section className="principles section-shell">
        <div className="section-kicker">00 / 先定方向</div>
        <div className="principles-intro">
          <h2>“学了也白学”只说对了一半。</h2>
          <p>
            会过时的是具体模型名、框架 API 与榜单；会复利的是把不确定的模型变成可靠产品的能力。
            学习策略应该是 <strong>70% 长期能力 + 20% 当前主流栈 + 10% 探索。</strong>
          </p>
        </div>
        <div className="principle-grid">
          <article className="principle-card lasting">
            <span className="card-label">COMPOUND / 长期复利</span>
            <h3>不会轻易过时</h3>
            <ul>
              <li><b>01</b><span>问题定义与产品判断</span><em>WHY</em></li>
              <li><b>02</b><span>数据、检索与评测</span><em>MEASURE</em></li>
              <li><b>03</b><span>系统设计与可靠性</span><em>SHIP</em></li>
              <li><b>04</b><span>Human-AI Interaction</span><em>TRUST</em></li>
              <li><b>05</b><span>安全、隐私与责任边界</span><em>SAFE</em></li>
            </ul>
          </article>
          <article className="principle-card changing">
            <span className="card-label">RENT / 按需租用</span>
            <h3>快速变化，项目中学</h3>
            <div className="change-cloud">
              <span>模型版本</span><span>Agent 框架</span><span>向量数据库</span>
              <span>推理服务</span><span>Prompt 小技巧</span><span>榜单</span>
              <span>SDK API</span><span>热门术语</span>
            </div>
            <p>掌握接口与评价标准，不把职业身份绑定在单一厂商或框架上。</p>
          </article>
        </div>
      </section>

      <section className="roadmap section-shell" id="roadmap">
        <div className="section-heading">
          <div>
            <div className="section-kicker">01 / 知识路线图</div>
            <h2>14 块知识，按价值排序。</h2>
          </div>
          <p>时间为有前端工程经验者的“专注学习日”估算；建议每周 15—20 小时，边学边做一个贯穿项目。</p>
        </div>
        <div className="table-tools">
          <div className="filter-pills" aria-label="知识分类">
            {["全部", "底层", "前端", "应用", "设计", "工程", "质量", "进阶"].map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="sort-controls">
            <label>
              排序
              <select value={sortKey} onChange={(event) => setSortKey(event.target.value as typeof sortKey)}>
                <option value="importance">重要程度</option>
                <option value="difficulty">难度</option>
                <option value="days">预计时长</option>
              </select>
            </label>
            <button
              className="direction-button"
              aria-label={sortDirection === "desc" ? "当前降序" : "当前升序"}
              onClick={() => setSortDirection((value) => (value === "desc" ? "asc" : "desc"))}
            >
              {sortDirection === "desc" ? "↓" : "↑"}
            </button>
          </div>
        </div>

        <div className="knowledge-table" role="table" aria-label="AI 转型知识路线图">
          <div className="knowledge-head" role="row">
            <span>知识模块</span><span>阶段</span><span>重要</span><span>难度</span><span>时间</span><span>匹配</span><span />
          </div>
          {sortedKnowledge.map((item) => {
            const open = expandedKnowledge === item.id;
            return (
              <article className={`knowledge-row ${open ? "open" : ""}`} key={item.id}>
                <button
                  className="knowledge-summary"
                  onClick={() => setExpandedKnowledge(open ? null : item.id)}
                  aria-expanded={open}
                >
                  <span className="knowledge-name">
                    <small>{item.category}{item.optional ? " · 选修" : ""}</small>
                    <strong>{item.name}</strong>
                    <em>{item.why}</em>
                  </span>
                  <span className="phase-cell">{item.phase}</span>
                  <span><ScoreBar value={item.importance} /></span>
                  <span><ScoreBar value={item.difficulty} /></span>
                  <span className="days-cell"><b>{item.days}</b> 天</span>
                  <span className="fit-cell"><b>{item.fit}</b>%</span>
                  <span className="expand-icon">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <div className="knowledge-detail">
                    <div className="outcome">
                      <small>完成标准 / OUTPUT</small>
                      <p>{item.outcome}</p>
                    </div>
                    <div className="resource-list">
                      {item.resources.map((resource, index) => (
                        <a href={resource.url} target="_blank" rel="noreferrer" key={resource.title}>
                          <span className="resource-index">0{index + 1}</span>
                          <span>
                            <small>{resource.provider} · {resource.lang}</small>
                            <strong>{resource.title}</strong>
                            <em>{resource.note}</em>
                          </span>
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

      <section className="roles section-shell" id="roles">
        <div className="section-heading">
          <div>
            <div className="section-kicker">02 / 岗位推荐</div>
            <h2>先从“相邻可能”切入。</h2>
          </div>
          <p>不建议第一步硬转大模型训练 / 算法研究。先把已有 10 年经验转换成 AI 产品交付优势，再逐步向模型与 Agent 深处移动。</p>
        </div>
        <div className="role-stack">
          {roles.map((role) => (
            <article className="role-card" key={role.id}>
              <div className="role-rank">{role.rank}</div>
              <div className="role-main">
                <small>RECOMMENDED ROLE</small>
                <h3>{role.title}</h3>
                <p>{role.pitch}</p>
              </div>
              <div className="role-data">
                <div><span>匹配度</span><strong>{role.fit}%</strong></div>
                <div><span>北京样本薪资</span><strong>{role.salary}</strong></div>
              </div>
              <div className="role-bridge">
                <p><span>可迁移</span>{role.bridge}</p>
                <p><span>补齐</span>{role.gap}</p>
              </div>
              <button onClick={() => { setQuestionRole(role.id === "AI 体验 / 原型" ? "AI 产品前端" : role.id); document.querySelector("#interview")?.scrollIntoView({ behavior: "smooth" }); }}>
                练这个岗位 <span>↗</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="job-library section-shell">
        <div className="library-banner">
          <div>
            <div className="section-kicker light">北京岗位样本库 / 可溯源</div>
            <h2>12 条公开 JD，不拿“市场价”拍脑袋。</h2>
          </div>
          <div className="salary-note">
            <strong>25—50K</strong>
            <span>与你最匹配岗位的主流月薪带宽<br />样本更新时间 2026-07-28</span>
          </div>
        </div>
        <div className="job-tools">
          <label className="search-box">
            <span>⌕</span>
            <input value={jobSearch} onChange={(event) => setJobSearch(event.target.value)} placeholder="搜公司、岗位或技术关键词" />
          </label>
          <select value={jobRole} onChange={(event) => setJobRole(event.target.value)}>
            <option>全部</option>
            {[...new Set(jobs.map((job) => job.role))].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="job-grid">
          {filteredJobs.map((job, index) => (
            <article className="job-card" key={`${job.company}-${job.title}`}>
              <div className="job-card-top">
                <span className="job-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="match-chip">{job.match}% 匹配</span>
              </div>
              <small>{job.company} · 北京</small>
              <h3>{job.title}</h3>
              <div className="salary"><strong>{job.salary}</strong><span>{job.months}</span></div>
              <p className="experience">{job.experience}</p>
              <div className="job-tags">{job.keywords.map((word) => <span key={word}>{word}</span>)}</div>
              <div className="job-source">
                <span>{job.sourceLabel}<br />采集 {job.captured}</span>
                <a href={job.source} target="_blank" rel="noreferrer">查看原始 JD ↗</a>
              </div>
            </article>
          ))}
        </div>
        <p className="source-disclaimer">
          说明：岗位与薪资是公开页面快照，不等于录用承诺；月薪通常为税前，年包还受奖金、股票与职级影响。职位可能下线，链接仍用于溯源当时样本。
        </p>
      </section>

      <section className="interview section-shell" id="interview">
        <div className="section-heading">
          <div>
            <div className="section-kicker">03 / 面经题库</div>
            <h2>不是背答案，是练证据。</h2>
          </div>
          <p>频次按 8 组 2026 年公开面经样本“是否命中同类主题”聚合；它反映样本热度，不冒充全市场统计。</p>
        </div>
        <div className="interview-toolbar">
          <div className="filter-pills">
            {["全部", "AI 产品前端", "AI Native 全栈", "Agent 应用工程", "大模型应用算法"].map((item) => (
              <button key={item} className={questionRole === item ? "active" : ""} onClick={() => setQuestionRole(item)}>{item}</button>
            ))}
          </div>
          <select value={questionSort} onChange={(event) => setQuestionSort(event.target.value as typeof questionSort)}>
            <option value="hot">按热度排序</option>
            <option value="category">按题型排序</option>
          </select>
        </div>
        <div className="question-list">
          {filteredQuestions.map((question, index) => (
            <article className="question-card" key={question.id}>
              <div className="question-meta">
                <span className="question-number">Q{String(index + 1).padStart(2, "0")}</span>
                <span className="question-category">{question.category}</span>
                <span className="frequency">
                  <b>{question.frequency}/8</b>
                  <span>{Array.from({ length: 8 }, (_, dot) => <i key={dot} className={dot < question.frequency ? "on" : ""} />)}</span>
                </span>
              </div>
              <div className="question-body">
                <h3>{question.question}</h3>
                <p>{question.why}</p>
                <details>
                  <summary>查看答题骨架与来源</summary>
                  <div className="answer-frame">
                    {question.answerFrame.map((step, stepIndex) => <span key={step}><b>{stepIndex + 1}</b>{step}</span>)}
                  </div>
                  <div className="question-sources">
                    {question.sourceIds.map((id) => {
                      const source = interviewSources.find((item) => item.id === id);
                      return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a> : null;
                    })}
                  </div>
                </details>
              </div>
              <button className="practice-question" onClick={() => beginInterview(question)}>模拟回答 ↗</button>
            </article>
          ))}
        </div>
      </section>

      <section className="simulator section-shell" id="simulator">
        <div className="simulator-copy">
          <div className="section-kicker light">04 / 模拟面试室</div>
          <h2>说出来，才算会。</h2>
          <p>选择题目后，先口述，再把关键点写下来。系统按结构、证据与深度给本地即时复盘；你的回答不会上传。</p>
          <div className="privacy-note"><span>●</span> DEVICE-LOCAL REVIEW</div>
        </div>
        <div className="simulator-panel">
          {!activeQuestion ? (
            <div className="simulator-empty">
              <span>READY?</span>
              <h3>从最高频问题开始</h3>
              <p>目标不是一次答满，而是暴露薄弱点并进入下一轮练习。</p>
              <button className="button button-acid" onClick={() => beginInterview()}>开始模拟面试 →</button>
            </div>
          ) : (
            <>
              <div className="simulator-head">
                <span>{activeQuestion.category} · 热度 {activeQuestion.frequency}/8</span>
                <time>{formatTime(seconds)}</time>
              </div>
              <h3>{activeQuestion.question}</h3>
              <div className="frame-mini">
                {activeQuestion.answerFrame.map((item, index) => <span key={item}>{index + 1}. {item}</span>)}
              </div>
              <label className="answer-box">
                <span>写下你刚才口述的关键证据</span>
                <textarea
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="建议 300—600 字：先给结论，再讲场景、取舍、数据和复盘……"
                  disabled={Boolean(review)}
                />
                <small>{answer.length} 字</small>
              </label>
              {!review ? (
                <button className="submit-answer" disabled={answer.trim().length < 80} onClick={submitAnswer}>
                  提交并复盘 <span>↗</span>
                </button>
              ) : (
                <div className="review-card">
                  <div className="review-score">
                    <strong>{review.overall}</strong><span>/ 100<br />本轮表现</span>
                  </div>
                  <div className="review-bars">
                    {[["结构", review.structure], ["证据", review.evidence], ["深度", review.depth]].map(([label, value]) => (
                      <div key={label as string}><span>{label}</span><i><b style={{ width: `${value}%` }} /></i><em>{value}</em></div>
                    ))}
                  </div>
                  <div className="review-advice">
                    <small>下一轮刻意补齐</small>
                    <p>{review.missing.length ? `回答里还缺少：${review.missing.join("、")}。请补一个真实失败案例与量化结果。` : "关键概念覆盖完整。下一轮压缩到 2 分钟，并增加反例与取舍。"}</p>
                  </div>
                  <button onClick={nextQuestion}>下一题 →</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="deliberate section-shell" id="practice">
        <div className="section-heading">
          <div>
            <div className="section-kicker">05 / 刻意练习</div>
            <h2>弱点不是标签，是下一次训练计划。</h2>
          </div>
          <div className="practice-progress">
            <strong>{completedPractice.length}/{practices.length}</strong>
            <span>本轮完成</span>
          </div>
        </div>
        <div className="practice-board">
          {practices.map((practice, index) => {
            const done = completedPractice.includes(practice.tag);
            return (
              <article className={done ? "done" : ""} key={practice.tag}>
                <button onClick={() => togglePractice(practice.tag)} aria-label={`${done ? "取消完成" : "标记完成"} ${practice.tag}`}>
                  {done ? "✓" : ""}
                </button>
                <span className="practice-index">0{index + 1}</span>
                <div>
                  <small>{practice.tag} · {practice.minutes} MIN</small>
                  <p>{practice.task}</p>
                </div>
                <em>{done ? "DONE" : "NEXT"}</em>
              </article>
            );
          })}
        </div>
      </section>

      <section className="timeline section-shell">
        <div className="timeline-title">
          <div className="section-kicker">06 / 180 天行动</div>
          <h2>用一个项目，串起所有知识。</h2>
          <p>建议作品：<strong>“前端设计评审 Agent”</strong>——读取设计稿 / 页面 / 规范，给出可引用的 UI、交互、可访问性与性能建议，并支持人工确认后生成修改任务。</p>
        </div>
        <div className="timeline-track">
          {[
            ["01", "0—30 天", "地基", "Python 服务 + LLM 原理 + Next.js；做出可流式对话的最小版本。"],
            ["02", "31—60 天", "可用", "接入规范知识库、混合检索与引用；打磨生成式 UI 与失败体验。"],
            ["03", "61—90 天", "可测", "增加工具调用、状态图、20—50 条黄金集、trace 与成本面板。"],
            ["04", "91—120 天", "可靠", "补鉴权、队列、幂等、超时、重试、Prompt 注入防护与人工确认。"],
            ["05", "121—150 天", "上线", "Docker + CI/CD + 监控；找 5 位真实用户，记录失败并迭代。"],
            ["06", "151—180 天", "求职", "写架构文档、3 分钟 Demo、指标复盘；每周 3 次模拟面试。"],
          ].map(([num, time, title, text]) => (
            <article key={num}>
              <span>{num}</span>
              <small>{time}</small>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="closing">
        <div>
          <span className="big-arrow">↘</span>
          <h2>你不是离开前端。<br />你是在把“界面”扩展到<strong>智能行为。</strong></h2>
        </div>
        <a href="#roadmap">从第 1 天开始 <span>↑</span></a>
      </section>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark">A›</span>
          <strong>AI TRANSITION<br /><small>FOR EXPERIENCED FRONTEND</small></strong>
        </div>
        <p>
          研究快照：2026-07-28 · 北京<br />
          路线图基于公开 JD、真实面经与官方学习资源整理。频次为小样本主题聚合，薪资为公开岗位标注，不构成招聘或薪酬承诺。
        </p>
        <div className="footer-links">
          <a href="#roadmap">路线图 ↑</a>
          <a href="#roles">岗位库 ↑</a>
          <a href="#interview">面试训练 ↑</a>
        </div>
      </footer>
    </main>
  );
}
