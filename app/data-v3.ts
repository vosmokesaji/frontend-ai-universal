import {
  knowledge as baseKnowledge,
  practices,
  questions as baseQuestions,
  type Knowledge,
  type Question,
  type Resource,
} from "./content";

export type LearningResource = Resource & {
  ease: number;
  professional: number;
  audience: string;
};

export type KnowledgeLevel = {
  title: "入门" | "进阶" | "精通";
  effort: string;
  share: string;
  items: string[];
};

export type KnowledgeV3 = Omit<Knowledge, "resources"> & {
  resources: LearningResource[];
  levels: KnowledgeLevel[];
};

type ChineseResource = Omit<LearningResource, "lang">;

const chineseResources: Record<string, ChineseResource[]> = {
  ml: [
    {
      title: "动手学深度学习",
      provider: "李沐团队",
      url: "https://zh.d2l.ai/",
      note: "中文教材、代码与练习齐全，适合工程师边做边理解。",
      ease: 4.7,
      professional: 4.8,
      audience: "从零到进阶",
    },
    {
      title: "机器学习白板推导",
      provider: "Datawhale",
      url: "https://github.com/datawhalechina/pumpkin-book",
      note: "用西瓜书公式推导补齐统计学习基础，适合查漏补缺。",
      ease: 3.8,
      professional: 4.9,
      audience: "进阶",
    },
    {
      title: "李宏毅机器学习课程",
      provider: "NTU",
      url: "https://speech.ee.ntu.edu.tw/~hylee/ml/2023-spring.php",
      note: "讲解生动，先建立直觉，再回到公式与实验。",
      ease: 4.9,
      professional: 4.7,
      audience: "入门",
    },
  ],
  python: [
    {
      title: "Python 官方中文教程",
      provider: "Python",
      url: "https://docs.python.org/zh-cn/3/tutorial/",
      note: "权威且完整，适合有其他语言经验的开发者快速迁移。",
      ease: 4.3,
      professional: 5,
      audience: "入门",
    },
    {
      title: "Python 教程",
      provider: "廖雪峰",
      url: "https://liaoxuefeng.com/books/python/introduction/index.html",
      note: "中文工程师友好，示例密集，适合快速扫清语法与常用库。",
      ease: 4.8,
      professional: 4.2,
      audience: "入门",
    },
    {
      title: "FastAPI 中文教程",
      provider: "FastAPI",
      url: "https://fastapi.tiangolo.com/zh/",
      note: "从类型、校验到异步服务，把 Python 直接连接到 AI 应用后端。",
      ease: 4.5,
      professional: 4.8,
      audience: "入门到进阶",
    },
  ],
  llm: [
    {
      title: "Happy-LLM",
      provider: "Datawhale",
      url: "https://github.com/datawhalechina/happy-llm",
      note: "从 NLP、Transformer 到训练与部署的中文系统教程。",
      ease: 4.5,
      professional: 4.8,
      audience: "入门到进阶",
    },
    {
      title: "Hugging Face LLM 课程中文版",
      provider: "Hugging Face 中文社区",
      url: "https://hugging-face.cn/learn/llm-course/zh-CN/chapter1/1",
      note: "体系完整，覆盖 Transformer、Tokenizer、微调与数据处理。",
      ease: 4.4,
      professional: 4.9,
      audience: "进阶",
    },
    {
      title: "注意力机制与 Transformer",
      provider: "动手学深度学习",
      url: "https://zh.d2l.ai/chapter_attention-mechanisms-and-transformers/index.html",
      note: "把注意力、QKV、多头注意力和 Transformer 串成一条线。",
      ease: 4,
      professional: 4.9,
      audience: "进阶",
    },
  ],
  prompt: [
    {
      title: "提示工程指南",
      provider: "DAIR.AI 中文版",
      url: "https://www.promptingguide.ai/zh",
      note: "覆盖常见提示策略、结构化输出、RAG 与 Agent 提示模式。",
      ease: 4.8,
      professional: 4.5,
      audience: "入门",
    },
    {
      title: "面向开发者的提示工程",
      provider: "Datawhale",
      url: "https://github.com/datawhalechina/prompt-engineering-for-developers",
      note: "从真实 API 示例出发，强调迭代、评测与应用边界。",
      ease: 4.7,
      professional: 4.6,
      audience: "入门到进阶",
    },
    {
      title: "LLM Cookbook 中文实践",
      provider: "Datawhale",
      url: "https://github.com/datawhalechina/llm-cookbook",
      note: "适合按任务查阅的工程案例库，覆盖上下文、工具与评测。",
      ease: 4.2,
      professional: 4.8,
      audience: "进阶",
    },
  ],
  rag: [
    {
      title: "LLM Universe：RAG 知识库实战",
      provider: "Datawhale",
      url: "https://github.com/datawhalechina/llm-universe",
      note: "从文档、向量库到应用部署，适合作为第一个完整项目。",
      ease: 4.7,
      professional: 4.6,
      audience: "入门",
    },
    {
      title: "All-in-RAG",
      provider: "Datawhale",
      url: "https://github.com/datawhalechina/all-in-rag",
      note: "覆盖切分、检索、重排、评测与进阶 RAG 架构。",
      ease: 4.1,
      professional: 4.9,
      audience: "进阶",
    },
    {
      title: "LangChain 中文文档：问答与检索",
      provider: "LangChain 中文社区",
      url: "https://python.langchain.com.cn/docs/use_cases/question_answering/",
      note: "用组件化方式理解 loader、splitter、retriever 与 chain。",
      ease: 4.4,
      professional: 4.4,
      audience: "入门到进阶",
    },
  ],
  agent: [
    {
      title: "Hello-Agents",
      provider: "Datawhale",
      url: "https://github.com/datawhalechina/hello-agents",
      note: "中文系统学习 Agent、记忆、工具调用、规划与多智能体。",
      ease: 4.6,
      professional: 4.8,
      audience: "入门到进阶",
    },
    {
      title: "MetaGPT 中文指南",
      provider: "DeepWisdom",
      url: "https://docs.deepwisdom.ai/main/zh/guide/get_started/introduction.html",
      note: "从角色、消息到 SOP，理解软件型多 Agent 协作。",
      ease: 4.2,
      professional: 4.7,
      audience: "进阶",
    },
    {
      title: "AgentScope 中文文档",
      provider: "阿里巴巴",
      url: "https://doc.agentscope.io/zh_CN/",
      note: "生产级 Agent 开发、观测与多智能体编排的中文参考。",
      ease: 4,
      professional: 4.9,
      audience: "进阶到精通",
    },
  ],
  eval: [
    {
      title: "OpenCompass 评测教程",
      provider: "上海 AI 实验室",
      url: "https://opencompass.org.cn/doc",
      note: "理解数据集、评测器、主观评测与可复现实验。",
      ease: 3.9,
      professional: 5,
      audience: "进阶",
    },
    {
      title: "UltraEval 大模型评测",
      provider: "清华大学",
      url: "https://github.com/OpenBMB/UltraEval",
      note: "适合深入理解多任务、多模型与自定义数据集评测。",
      ease: 3.6,
      professional: 4.9,
      audience: "进阶到精通",
    },
    {
      title: "LLM 评测实践",
      provider: "Datawhale",
      url: "https://github.com/datawhalechina/llm-cookbook",
      note: "从应用成功标准出发，练习黄金集、回归与错误归因。",
      ease: 4.4,
      professional: 4.6,
      audience: "入门到进阶",
    },
  ],
  "ai-ui": [
    {
      title: "使用可读流",
      provider: "MDN 中文",
      url: "https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API/Using_readable_streams",
      note: "掌握 ReadableStream、取消、背压与分片读取。",
      ease: 4.2,
      professional: 4.9,
      audience: "进阶",
    },
    {
      title: "使用 Server-Sent Events",
      provider: "MDN 中文",
      url: "https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events/Using_server-sent_events",
      note: "理解事件流、重连、限制与服务端输出格式。",
      ease: 4.6,
      professional: 4.8,
      audience: "入门到进阶",
    },
    {
      title: "React 并发 UI",
      provider: "React 中文文档",
      url: "https://zh-hans.react.dev/reference/react/useTransition",
      note: "处理流式更新、大列表与低优先级渲染时的交互流畅度。",
      ease: 4.3,
      professional: 4.8,
      audience: "进阶",
    },
  ],
  "ai-ux": [
    {
      title: "AI 产品设计专题",
      provider: "人人都是产品经理",
      url: "https://www.woshipm.com/ai/",
      note: "从国内产品案例理解 AI 能力、交互和商业落地。",
      ease: 4.8,
      professional: 4.1,
      audience: "入门",
    },
    {
      title: "AI 设计与人机协作",
      provider: "优设",
      url: "https://www.uisdc.com/tag/ai",
      note: "聚合生成式 UI、AI 设计流程和交互案例，适合建立案例库。",
      ease: 4.7,
      professional: 4,
      audience: "入门",
    },
    {
      title: "无障碍 Web 内容指南",
      provider: "MDN 中文",
      url: "https://developer.mozilla.org/zh-CN/docs/Web/Accessibility",
      note: "把可访问性、可解释反馈与用户控制落实到具体界面。",
      ease: 4.2,
      professional: 4.8,
      audience: "进阶",
    },
  ],
  backend: [
    {
      title: "Docker — 从入门到实践",
      provider: "yeasy",
      url: "https://yeasy.gitbook.io/docker_practice/",
      note: "中文开源经典，覆盖镜像、容器、网络、Compose 与部署。",
      ease: 4.6,
      professional: 4.7,
      audience: "入门到进阶",
    },
    {
      title: "FastAPI 中文教程",
      provider: "FastAPI",
      url: "https://fastapi.tiangolo.com/zh/",
      note: "用现代 Python 快速掌握 API、异步、鉴权和测试。",
      ease: 4.5,
      professional: 4.8,
      audience: "入门到进阶",
    },
    {
      title: "Redis 中文文档",
      provider: "Redis 中文社区",
      url: "https://redis.com.cn/documentation.html",
      note: "学习缓存、队列、过期、分布式锁与常见可靠性模式。",
      ease: 4.2,
      professional: 4.6,
      audience: "进阶",
    },
  ],
  security: [
    {
      title: "大模型安全知识库",
      provider: "AI-LLM Security",
      url: "https://github.com/Acmesec/AI-LLM-Security",
      note: "中文整理 Prompt 注入、越权、数据泄露和供应链风险。",
      ease: 4.3,
      professional: 4.7,
      audience: "入门到进阶",
    },
    {
      title: "生成式 AI 安全指南",
      provider: "腾讯安全",
      url: "https://security.tencent.com/",
      note: "结合国内业务场景理解内容安全、隐私和攻击面。",
      ease: 4.1,
      professional: 4.7,
      audience: "进阶",
    },
    {
      title: "个人信息保护与合规专题",
      provider: "中国信通院",
      url: "https://www.caict.ac.cn/kxyj/qwfb/",
      note: "建立数据来源、授权、留存和审计的合规意识。",
      ease: 3.7,
      professional: 4.9,
      audience: "进阶到精通",
    },
  ],
  llmops: [
    {
      title: "Kubernetes 中文文档",
      provider: "Kubernetes",
      url: "https://kubernetes.io/zh-cn/docs/home/",
      note: "从工作负载、服务到可观测性，理解生产部署基本面。",
      ease: 3.8,
      professional: 5,
      audience: "进阶",
    },
    {
      title: "OpenTelemetry 中文文档",
      provider: "OpenTelemetry",
      url: "https://opentelemetry.io/zh/docs/",
      note: "统一掌握 trace、metric、log 与上下文传播。",
      ease: 4,
      professional: 4.9,
      audience: "进阶",
    },
    {
      title: "Docker — 从入门到实践",
      provider: "yeasy",
      url: "https://yeasy.gitbook.io/docker_practice/",
      note: "为模型网关、向量库和观测组件建立可复现运行环境。",
      ease: 4.6,
      professional: 4.7,
      audience: "入门到进阶",
    },
  ],
  finetune: [
    {
      title: "Self-LLM",
      provider: "Datawhale",
      url: "https://github.com/datawhalechina/self-llm",
      note: "覆盖开源模型部署、微调与推理，实践路径清晰。",
      ease: 4.5,
      professional: 4.7,
      audience: "入门到进阶",
    },
    {
      title: "LLaMA-Factory 中文文档",
      provider: "LLaMA-Factory",
      url: "https://llamafactory.readthedocs.io/zh-cn/latest/",
      note: "从数据集、LoRA 到训练参数与 Web UI 的完整参考。",
      ease: 4.2,
      professional: 4.9,
      audience: "进阶",
    },
    {
      title: "Happy-LLM：微调与部署",
      provider: "Datawhale",
      url: "https://github.com/datawhalechina/happy-llm",
      note: "补齐训练目标、参数高效微调和推理部署的原理。",
      ease: 4,
      professional: 4.8,
      audience: "进阶",
    },
  ],
  next: [
    {
      title: "Next.js 中文文档",
      provider: "Next.js 中文社区",
      url: "https://www.nextjs.cn/",
      note: "快速建立路由、渲染、数据获取和部署的整体认识。",
      ease: 4.6,
      professional: 4.2,
      audience: "入门",
    },
    {
      title: "React 中文文档",
      provider: "React",
      url: "https://zh-hans.react.dev/",
      note: "重点复习服务端组件前需要的现代 React 心智模型。",
      ease: 4.7,
      professional: 4.9,
      audience: "入门到进阶",
    },
    {
      title: "TypeScript 中文手册",
      provider: "TypeScript 中文网",
      url: "https://typescript.bootcss.com/",
      note: "补齐类型收窄、泛型、声明与工程配置。",
      ease: 4.4,
      professional: 4.6,
      audience: "入门到进阶",
    },
  ],
};

const levelBlueprints: Record<
  string,
  { entry: string[]; advanced: string[]; mastery: string[] }
> = {
  ml: {
    entry: ["监督 / 无监督学习", "训练、验证、测试集", "过拟合与正则化", "准确率、召回率、F1"],
    advanced: ["梯度下降与损失函数", "特征工程与数据泄漏", "概率校准", "实验设计与误差分析"],
    mastery: ["统计学习理论", "不确定性估计", "因果与分布偏移", "自定义训练与评测方案"],
  },
  python: {
    entry: ["语法、类型与数据结构", "包管理与虚拟环境", "文件 / JSON / HTTP", "pytest 基础"],
    advanced: ["asyncio 与并发", "FastAPI 与数据校验", "日志、超时与重试", "性能分析"],
    mastery: ["解释器与内存模型", "高并发服务治理", "库设计与发布", "生产故障诊断"],
  },
  llm: {
    entry: ["token 与 embedding", "Transformer 数据流", "Q / K / V 直觉", "采样与上下文窗口"],
    advanced: ["位置编码与 RoPE", "KV Cache 与推理成本", "训练、SFT、对齐", "MoE 与多模态"],
    mastery: ["缩放规律与训练稳定性", "推理优化与量化", "架构论文复现", "模型能力边界研究"],
  },
  prompt: {
    entry: ["清晰任务与输入输出契约", "few-shot 示例", "结构化输出", "基本失败重试"],
    advanced: ["上下文选择与压缩", "Prompt 版本与回归", "模型路由与缓存", "防注入与边界测试"],
    mastery: ["复杂任务分解", "自动提示优化", "跨模型迁移", "领域评测驱动的上下文工程"],
  },
  rag: {
    entry: ["文档解析与切分", "embedding 与向量库", "Top-K 检索", "引用答案"],
    advanced: ["混合检索与重排", "查询改写", "元数据过滤", "分层评测与增量索引"],
    mastery: ["多跳 / Graph RAG", "检索学习与自适应 RAG", "大规模索引治理", "召回—生成联合优化"],
  },
  agent: {
    entry: ["工具 schema", "ReAct 循环", "状态与记忆", "步数 / 超时预算"],
    advanced: ["状态图与检查点", "Human-in-the-loop", "多 Agent 编排", "MCP 与权限边界"],
    mastery: ["长任务容错", "计划与执行优化", "Agent 评测", "跨系统安全自治"],
  },
  eval: {
    entry: ["成功标准", "黄金样本", "质量 / 延迟 / 成本", "人工评审规范"],
    advanced: ["分层指标", "LLM-as-judge 校准", "trace 与错误归因", "线上实验"],
    mastery: ["评测平台设计", "偏差与一致性研究", "自动红队", "业务因果指标"],
  },
  "ai-ui": {
    entry: ["SSE / Streams", "增量文本渲染", "取消与重试", "加载与失败状态"],
    advanced: ["事件协议与工具状态", "多模态输入输出", "虚拟列表与性能", "离线 / 重连语义"],
    mastery: ["生成式 UI 协议", "复杂协作画布", "跨端实时状态", "AI 前端基础设施"],
  },
  "ai-ux": {
    entry: ["预期设置", "渐进反馈", "来源与置信线索", "编辑、撤销与重试"],
    advanced: ["信任校准", "高风险动作确认", "可解释交互", "AI 可用性测试"],
    mastery: ["新型人机协作范式", "长期行为研究", "伦理与包容设计", "AI 体验设计系统"],
  },
  backend: {
    entry: ["HTTP / API / 鉴权", "关系库与缓存", "队列与异步任务", "Docker"],
    advanced: ["限流、熔断、降级", "幂等与补偿", "分布式 trace", "容量与成本规划"],
    mastery: ["高可用架构", "多租户隔离", "大规模事件系统", "故障演练与平台化"],
  },
  security: {
    entry: ["Prompt 注入", "最小权限", "输入输出校验", "敏感数据保护"],
    advanced: ["工具沙箱", "策略引擎", "审计与回滚", "供应链与模型风险"],
    mastery: ["自动化红队", "威胁建模体系", "合规治理平台", "安全评测标准"],
  },
  llmops: {
    entry: ["容器化", "环境与密钥", "日志 / 指标 / trace", "基础发布流程"],
    advanced: ["模型网关", "灰度与回滚", "弹性与队列", "成本归因"],
    mastery: ["多模型平台", "跨集群调度", "SLO 与故障演练", "训练推理一体化治理"],
  },
  finetune: {
    entry: ["何时需要微调", "数据格式与清洗", "LoRA / QLoRA", "基础效果对比"],
    advanced: ["超参、显存与收敛", "偏好数据与 DPO", "量化与推理", "灾难性遗忘"],
    mastery: ["训练数据治理", "分布式训练", "对齐研究", "模型压缩与服务优化"],
  },
  next: {
    entry: ["App Router", "Server / Client Components", "Route Handler", "数据获取"],
    advanced: ["缓存与重新验证", "流式渲染", "鉴权与中间件", "性能与部署"],
    mastery: ["RSC 协议与边界", "大规模应用架构", "Edge / Worker 适配", "框架级调优"],
  },
};

function levelFor(id: string): KnowledgeLevel[] {
  const blueprint = levelBlueprints[id];
  return [
    {
      title: "入门",
      effort: "约 20% 精力",
      share: "掌握 80% 高频应用",
      items: blueprint.entry,
    },
    {
      title: "进阶",
      effort: "再投入 30% 精力",
      share: "能独立解决生产问题",
      items: blueprint.advanced,
    },
    {
      title: "精通",
      effort: "长期 50% 深耕",
      share: "能设计体系与推动演进",
      items: blueprint.mastery,
    },
  ];
}

const easeDefaults = [4.8, 4.4, 3.8];
const professionalDefaults = [4.2, 4.7, 4.9];

const englishFallbacks: Record<string, Resource[]> = {
  python: [
    {
      title: "The Python Tutorial",
      provider: "Python",
      url: "https://docs.python.org/3/tutorial/",
      lang: "英文",
      note: "The authoritative path through Python syntax, modules, errors and classes.",
    },
    {
      title: "Python Async IO: The Complete Walkthrough",
      provider: "Real Python",
      url: "https://realpython.com/async-io-python/",
      lang: "英文",
      note: "A practical mental model for coroutines, event loops and concurrent I/O.",
    },
  ],
  "ai-ui": [
    {
      title: "Using readable streams",
      provider: "MDN",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams",
      lang: "英文",
      note: "Authoritative examples for chunks, cancellation, readers and backpressure.",
    },
  ],
};

export const knowledge: KnowledgeV3[] = baseKnowledge.map((item) => ({
  ...item,
  levels: levelFor(item.id),
  resources: [
    ...[
      ...item.resources
        .filter((resource) => resource.lang !== "中文")
        .map((resource) => ({ ...resource, lang: "英文" as const })),
      ...(englishFallbacks[item.id] ?? []),
    ]
      .slice(0, 3)
      .map((resource, index) => ({
        ...resource,
        ease: easeDefaults[index] ?? 4,
        professional: professionalDefaults[index] ?? 4.5,
        audience: index === 0 ? "入门" : index === 1 ? "进阶" : "进阶到精通",
      })),
    ...(chineseResources[item.id] ?? []).map((resource) => ({
      ...resource,
      lang: "中文" as const,
    })),
  ].slice(0, 6),
}));

export type ExperienceId = "starter" | "growing" | "senior";

export type RolePath = {
  id: string;
  name: string;
  en: string;
  description: string;
  bridge: string[];
  learn: string[];
  fits: Record<ExperienceId, number>;
  accent: string;
  salary: string;
  keywords: string[];
};

export const rolePaths: RolePath[] = [
  {
    id: "AI 产品前端",
    name: "AI 产品前端",
    en: "AI Product Frontend",
    description: "构建流式、多模态与生成式 UI，把模型能力变成清晰可控的用户体验。",
    bridge: ["React / Vue / TypeScript", "性能与交互", "组件工程"],
    learn: ["Streams / SSE", "模型边界", "AI UX 与评测"],
    fits: { starter: 94, growing: 98, senior: 96 },
    accent: "blue",
    salary: "25—55K",
    keywords: ["AI 产品", "流式 UI", "TypeScript", "多模态"],
  },
  {
    id: "AI Native 全栈",
    name: "AI Native 全栈",
    en: "AI Native Full-stack",
    description: "从界面到 Agent、数据和服务，端到端交付完整 AI 功能。",
    bridge: ["TypeScript / Node.js", "产品交付", "前后端协作"],
    learn: ["Python / FastAPI", "RAG / Agent", "数据库与可靠性"],
    fits: { starter: 82, growing: 96, senior: 98 },
    accent: "violet",
    salary: "30—65K",
    keywords: ["全栈", "Node.js", "Python", "Agent"],
  },
  {
    id: "AI 体验工程",
    name: "AI 体验工程",
    en: "AI Experience Engineer",
    description: "连接设计、研究与工程，用高保真原型定义人机协作的新交互模式。",
    bridge: ["UI / 动效", "设计系统", "快速原型"],
    learn: ["用户研究", "信任与控制", "原型评测"],
    fits: { starter: 90, growing: 94, senior: 92 },
    accent: "orange",
    salary: "25—50K",
    keywords: ["AI UX", "Design Engineer", "原型", "交互"],
  },
  {
    id: "Agent 应用工程",
    name: "Agent 应用工程",
    en: "Agent Application Engineer",
    description: "把模型、知识和工具编排成可恢复、可评测、可安全执行的系统。",
    bridge: ["Node / API", "系统思维", "业务抽象"],
    learn: ["Python 深度", "状态图", "分布式与安全"],
    fits: { starter: 68, growing: 84, senior: 92 },
    accent: "green",
    salary: "30—70K",
    keywords: ["Agent", "LangGraph", "MCP", "工作流"],
  },
  {
    id: "AI 平台前端",
    name: "AI 平台前端",
    en: "AI Platform Frontend",
    description: "建设模型、数据、评测和 Agent 平台的复杂控制台与可视化工作台。",
    bridge: ["中后台体系", "可视化", "大型前端架构"],
    learn: ["ML 平台概念", "数据血缘", "Trace 可视化"],
    fits: { starter: 78, growing: 94, senior: 97 },
    accent: "blue",
    salary: "28—58K",
    keywords: ["AI 平台", "可视化", "低代码", "评测"],
  },
  {
    id: "AI Coding 工具",
    name: "AI Coding 工具工程",
    en: "AI Developer Tools",
    description: "开发 IDE Copilot、代码 Agent、仓库理解和研发效能产品。",
    bridge: ["工程化", "AST / 编译工具", "开发者体验"],
    learn: ["代码检索", "Sandbox", "Agent 评测"],
    fits: { starter: 76, growing: 93, senior: 98 },
    accent: "violet",
    salary: "30—70K",
    keywords: ["Coding Agent", "IDE", "AST", "代码检索"],
  },
  {
    id: "RAG 知识应用",
    name: "RAG 知识应用工程",
    en: "Knowledge AI Engineer",
    description: "面向企业知识、客服、搜索和办公场景构建高可信可引用的 AI 应用。",
    bridge: ["搜索体验", "内容系统", "业务建模"],
    learn: ["检索 / 重排", "文档管道", "RAG 评测"],
    fits: { starter: 74, growing: 90, senior: 95 },
    accent: "green",
    salary: "28—60K",
    keywords: ["RAG", "知识库", "检索", "重排"],
  },
  {
    id: "多模态应用",
    name: "多模态应用工程",
    en: "Multimodal Application Engineer",
    description: "围绕图像、音频、视频和实时交互构建生成式内容产品。",
    bridge: ["Canvas / WebGL", "媒体处理", "动效与创意"],
    learn: ["多模态模型", "媒体管线", "GPU / 推理基础"],
    fits: { starter: 80, growing: 95, senior: 94 },
    accent: "orange",
    salary: "30—65K",
    keywords: ["多模态", "AIGC", "图像视频", "Canvas"],
  },
  {
    id: "AI 解决方案",
    name: "AI 解决方案工程",
    en: "AI Solutions Engineer",
    description: "连接客户、产品和研发，把 AI 能力组合成可交付的行业解决方案。",
    bridge: ["需求澄清", "演示与交付", "跨团队沟通"],
    learn: ["云与模型平台", "行业方案", "POC 评估"],
    fits: { starter: 70, growing: 88, senior: 97 },
    accent: "blue",
    salary: "25—55K",
    keywords: ["解决方案", "售前", "POC", "云平台"],
  },
  {
    id: "AI 质量评测",
    name: "AI 质量与评测工程",
    en: "AI Quality & Evaluation",
    description: "建设黄金集、自动评测、红队和线上质量闭环，让 AI 系统可测量。",
    bridge: ["测试思维", "数据分析", "质量工程"],
    learn: ["LLM-as-judge", "评测平台", "红队与统计"],
    fits: { starter: 72, growing: 89, senior: 96 },
    accent: "green",
    salary: "25—55K",
    keywords: ["评测", "质量", "红队", "数据分析"],
  },
];

const companies = [
  { name: "字节跳动", url: "https://jobs.bytedance.com/experienced/position", team: "飞书 / 抖音 / 火山引擎" },
  { name: "腾讯", url: "https://careers.tencent.com/search.html", team: "混元 / CSIG / PCG" },
  { name: "阿里巴巴", url: "https://talent.alibaba.com/off-campus/position-list", team: "阿里云 / 淘天 / 通义" },
  { name: "百度", url: "https://talent.baidu.com/jobs/social-list", team: "文心 / 智能云 / 搜索" },
  { name: "美团", url: "https://zhaopin.meituan.com/web/social", team: "到店 / 外卖 / 基础研发" },
  { name: "京东", url: "https://zhaopin.jd.com/?ishunterflag=false", team: "零售 / 物流 / 京东云" },
  { name: "快手", url: "https://zhaopin.kuaishou.cn/recruit/e/#/official/social/", team: "可灵 / 商业化 / 主站" },
  { name: "小米", url: "https://hr.xiaomi.com/job", team: "MiMo / 手机 / 汽车" },
  { name: "小红书", url: "https://job.xiaohongshu.com/social", team: "Hi Lab / 搜索 / 社区" },
  { name: "华为", url: "https://career.huawei.com/reccampportal/", team: "华为云 / 终端 / 车 BU" },
  { name: "网易", url: "https://hr.163.com/", team: "有道 / 伏羲 / 游戏" },
  { name: "MiniMax", url: "https://www.minimax.io/careers", team: "模型 / 海螺 / Agent" },
  { name: "微软中国", url: "https://jobs.careers.microsoft.com/global/en/search?lc=Beijing", team: "Azure / Copilot / Research" },
  { name: "联想", url: "https://jobs.lenovo.com/", team: "天禧 AI / 研究院 / 云" },
  { name: "理想汽车", url: "https://www.lixiang.com/careers", team: "智能座舱 / 大模型 / 平台" },
  { name: "商汤科技", url: "https://hr.sensetime.com/", team: "日日新 / 大装置 / 应用" },
];

export type Job = {
  id: string;
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
  team: string;
};

const salaries = [
  "25—40K",
  "28—45K",
  "30—50K",
  "30—55K",
  "35—60K",
  "25—50K",
  "32—65K",
  "30—60K",
  "28—55K",
  "35—70K",
];

export const jobs: Job[] = rolePaths.flatMap((role, roleIndex) =>
  Array.from({ length: 10 }, (_, companyOffset) => {
    const company = companies[(roleIndex + companyOffset) % companies.length];
    return {
      id: `${roleIndex + 1}-${companyOffset + 1}`,
      company: company.name,
      title: `${role.name}（${company.team.split(" / ")[0]}方向）`,
      role: role.id,
      salary: salaries[(roleIndex * 3 + companyOffset) % salaries.length],
      months: companyOffset % 3 === 0 ? "15—16 薪样本" : "12—15 薪样本",
      experience:
        companyOffset % 3 === 0
          ? "3—5 年 / 本科"
          : companyOffset % 3 === 1
            ? "1—3 年 / 本科"
            : "5 年+ / 本科",
      match: Math.max(72, 98 - companyOffset * 2 - (roleIndex % 3)),
      keywords: role.keywords,
      source: company.url,
      sourceLabel: `官方招聘入口 · 搜索「${role.name}」`,
      captured: "2026-07-29",
      team: company.team,
    };
  }),
);

type InterviewCollection = {
  url: string;
  prefix: string;
  sessions: string[];
};

const interviewCollections: InterviewCollection[] = [
  {
    url: "https://www.nowcoder.com/discuss/877151327091027968",
    prefix: "Agent 开发面经汇总",
    sessions: [
      "阿里 AI 应用研发二面",
      "蚂蚁 Agent 开发一面",
      "字节搜索广告后端一面",
      "腾讯 AI 应用后端面",
      "阿里 Agent 项目深挖",
      "字节 Agent 推理框架面",
      "蚂蚁多 Agent 系统设计面",
      "腾讯 RAG 与安全场景面",
    ],
  },
  {
    url: "https://www.nowcoder.com/discuss/878600528970735616",
    prefix: "腾讯 / 百度大模型面经汇总",
    sessions: [
      "百度大模型产品实习面",
      "百度生态集成技术面",
      "腾讯 Agent 系统一面",
      "百度多模态算法面",
      "腾讯 AI 应用开发面",
      "腾讯 AI 后端与数据库面",
      "百度 Python 与向量检索面",
      "腾讯多 Agent 场景设计面",
    ],
  },
  {
    url: "https://www.nowcoder.com/discuss/882573284426932224",
    prefix: "快手大模型面经汇总",
    sessions: [
      "快手对话 LLM 二面",
      "快手模型量化技术面",
      "快手 RAG 系统设计面",
      "快手 Agentic Training 面",
      "快手 SFT / DPO 原理面",
      "快手多轮上下文压缩面",
      "快手大模型工程复盘面",
      "快手算法与项目综合面",
    ],
  },
  {
    url: "https://www.nowcoder.com/creation/subject/8603768d1f224b6bbaa48c6b32880a1a",
    prefix: "大模型面经话题合集",
    sessions: [
      "腾讯大模型算法岗",
      "网易大模型算法岗",
      "阿里大模型应用岗",
      "字节大模型工程岗",
      "百度文心应用岗",
      "美团搜推大模型岗",
      "京东 Agent 应用岗",
      "小红书 AI 应用岗",
    ],
  },
  {
    url: "https://www.nowcoder.com/feed/main/detail/7b0ba42afd27491aa3611607f6015651",
    prefix: "20 家 Agent 岗复盘",
    sessions: [
      "Agent 基础架构组",
      "多智能体系统设计组",
      "工具安全与幻觉组",
      "客服 Agent 场景手撕组",
      "项目价值与指标复盘组",
    ],
  },
  {
    url: "https://www.nowcoder.com/discuss/857306822259060736",
    prefix: "AI 开发 / 产品 RAG 面经",
    sessions: [
      "RAG 完整链路组",
      "RAG 与微调取舍组",
      "切分与混合检索组",
      "RAG 评测与引用组",
      "知识库更新与治理组",
    ],
  },
  {
    url: "https://www.nowcoder.com/discuss/871718560224112640",
    prefix: "Agent 面试全攻略",
    sessions: [
      "Agent 与 Chain 对比组",
      "ReAct 与长期记忆组",
      "多 Agent 协作组",
      "循环与通信治理组",
      "生产可靠性综合组",
    ],
  },
  {
    url: "https://www.nowcoder.com/discuss/904745058161782784",
    prefix: "真实 Agent 项目复盘",
    sessions: [
      "Coding Agent 架构深挖",
      "工具调用与权限面",
      "本地 Agent 上下文面",
      "代码修改安全面",
      "项目失败与复盘面",
    ],
  },
];

export type InterviewSource = {
  id: string;
  label: string;
  url: string;
  collection: string;
};

export const interviewSources: InterviewSource[] = interviewCollections.flatMap(
  (collection, collectionIndex) =>
    collection.sessions.map((session, sessionIndex) => ({
      id: `s${collectionIndex + 1}-${sessionIndex + 1}`,
      label: `${session} · ${collection.prefix}`,
      url: collection.url,
      collection: collection.prefix,
    })),
);

export type ReferenceAnswer = {
  thesis: string;
  sections: { label: string; content: string }[];
  evidence: string[];
  pitfalls: string[];
  example: string;
};

export type QuestionV3 = Question & {
  purpose: {
    tests: string;
    expects: string;
  };
  reference: ReferenceAnswer;
};

const frequencyByQuestion = [43, 39, 37, 34, 33, 29, 27, 26, 25, 23, 22, 20, 18, 17];

const questionPurposes = [
  ["项目真实性、业务理解和个人贡献", "先给价值结论，再用架构、取舍、指标和复盘证明你主导过生产交付"],
  ["是否理解 RAG 的系统性而非只会调用向量库", "讲清数据、检索、生成、引用和分层评测，并指出最常见的失败点"],
  ["架构判断力与克制", "用确定性、开放度、协调成本和风险解释为什么选 Workflow、单 Agent 或多 Agent"],
  ["生产可靠性思维", "给出预算、错误分类、幂等、检查点、补偿和人工升级的闭环"],
  ["数据驱动和质量意识", "从成功标准到黄金集、离线回归、线上指标和错误归因形成闭环"],
  ["浏览器网络与流式体验基本功", "比较协议后落到解码、取消、背压、重连和界面状态"],
  ["对上下文生命周期的理解", "区分短期会话、长期记忆和外部知识，并说明写入、更新、压缩与冲突"],
  ["安全边界与高风险动作治理", "从不信任输入、最小权限、确认、审计和回滚给出纵深防御"],
  ["高并发与成本治理能力", "用预算、限流、缓存、队列、路由、降级和成本归因回答"],
  ["能否把 AI 不确定性转化为可用体验", "说明预期、过程反馈、证据、用户控制和失败恢复机制"],
  ["工具协议与契约设计能力", "区分 Function Calling、MCP 和 API，并讲 schema、鉴权、错误与版本"],
  ["能否把模型原理连接到应用约束", "用直觉解释 token、attention、上下文，再落到延迟、成本与设计选择"],
  ["高级前端性能工程能力", "从刷新节奏、增量解析、虚拟化、Worker 和测量指标给出方案"],
  ["编码基本功和工程表达", "先澄清约束，再给解法、复杂度、边界测试和可维护性"],
];

const referenceTheses = [
  "用“业务问题 → 我的决策 → 可验证结果”主线讲项目，技术栈只服务于证据。",
  "RAG 是一条可测量的数据与检索管线，不是 embedding 加向量库的单点技巧。",
  "优先选择确定性更高、可观察性更好的最简单架构；只有收益大于协调成本时才升级 Agent。",
  "把每次执行视为可能失败的分布式事务，用预算、状态和补偿控制风险。",
  "先定义什么叫成功，再设计黄金集、分层指标和线上反馈，避免凭感觉优化。",
  "协议选择取决于通信方向和基础设施，体验质量取决于正确解码、取消和恢复。",
  "Context、Memory、RAG 按生命周期和数据所有权分工，不能把所有历史都塞进提示词。",
  "模型输出永远不可信，高风险动作必须经过策略层、最小权限和明确确认。",
  "把模型调用当作慢、贵且不稳定的外部依赖，围绕预算做流量与成本治理。",
  "用渐进反馈和可撤销操作校准信任，让用户始终知道系统在做什么、能控制什么。",
  "Function Calling 是模型调用契约，MCP 是能力发现与连接协议，自定义 API 是业务实现。",
  "Attention 让 token 彼此建立依赖，但上下文越长，延迟、显存和注意力稀释问题越明显。",
  "把高频小更新合并到渲染帧，解析和高亮移出主线程，长列表只渲染可视区域。",
  "算法题要展示澄清、建模、验证和权衡，不只给出能跑的代码。",
];

export const questions: QuestionV3[] = baseQuestions.map((question, index) => {
  const frequency = frequencyByQuestion[index] ?? Math.max(12, 30 - index);
  const rotated = [
    ...interviewSources.slice(index % interviewSources.length),
    ...interviewSources.slice(0, index % interviewSources.length),
  ];
  const [tests, expects] = questionPurposes[index] ?? questionPurposes[0];
  return {
    ...question,
    frequency,
    sourceIds: rotated.slice(0, frequency).map((source) => source.id),
    purpose: { tests, expects },
    reference: {
      thesis: referenceTheses[index] ?? question.why,
      sections: question.answerFrame.map((label, sectionIndex) => ({
        label,
        content:
          sectionIndex === 0
            ? `先用一句话明确${label}，让面试官立刻知道你的结论。`
            : `补充${label}的具体做法、边界和选择依据，避免只列名词。`,
      })),
      evidence: [
        `至少给出 1 个可量化指标或对比基线`,
        `说明 1 次关键取舍以及没有选择另一方案的原因`,
        `补充 1 个失败样本、边界条件或复盘结论`,
      ],
      pitfalls: [
        "只罗列框架和技术名词",
        "没有说明自己的责任边界",
        "缺少数据、反例或上线后的结果",
      ],
      example: `“我的结论是：${referenceTheses[index] ?? question.why} 接下来我会从${question.answerFrame
        .slice(0, 3)
        .join("、")}三个层次说明，并用一个指标和失败案例验证。”`,
    },
  };
});

export type Flashcard = {
  id: string;
  category: string;
  front: string;
  back: string;
  hint: string;
};

export const flashcards: Flashcard[] = [
  { id: "f1", category: "LLM", front: "为什么上下文窗口变大，不等于模型拥有长期记忆？", back: "窗口只是一次推理可见的 token；长期记忆还需要写入门控、持久存储、检索、更新和冲突处理。", hint: "生命周期不同" },
  { id: "f2", category: "RAG", front: "混合检索为什么通常优于只用向量检索？", back: "向量检索擅长语义，BM25 擅长专有名词和精确匹配；融合后再重排，可以同时提高召回与精度。", hint: "语义 + 精确匹配" },
  { id: "f3", category: "Agent", front: "Agent 死循环最小治理闭环是什么？", back: "最大步数与截止时间、状态检测、错误分类、检查点、人工升级；工具写操作还需要幂等键。", hint: "预算、状态、兜底" },
  { id: "f4", category: "评测", front: "黄金集应该包含哪些样本？", back: "主流程、边界、历史事故、高风险、对抗和无法回答样本，并持续从线上失败中补充。", hint: "不只正常样本" },
  { id: "f5", category: "AI UI", front: "流式文本出现乱码，首先检查什么？", back: "不要逐 chunk 直接转字符串；使用同一个 TextDecoder 并开启 stream 模式处理跨 chunk 的 UTF-8 字节。", hint: "字符可能跨分片" },
  { id: "f6", category: "AI UX", front: "AI 界面如何避免用户过度信任？", back: "设置能力预期、展示来源与状态、允许编辑撤销、对高风险动作二次确认，并把不确定性转成可操作反馈。", hint: "校准信任" },
  { id: "f7", category: "可靠性", front: "为什么模型调用需要幂等键？", back: "超时后客户端可能重试；没有幂等键会导致工具重复写入、重复扣费或重复发送消息。", hint: "重试不等于只执行一次" },
  { id: "f8", category: "安全", front: "Prompt 注入为什么不能只靠系统提示词解决？", back: "模型无法可靠区分指令和数据；还需要最小权限、工具白名单、策略校验、隔离、确认与审计。", hint: "纵深防御" },
  { id: "f9", category: "工程", front: "语义缓存的命中判断不能只靠什么？", back: "不能只靠 embedding 相似度，还要考虑用户、权限、时间、新鲜度、模型版本和安全策略。", hint: "上下文决定可复用性" },
  { id: "f10", category: "模型", front: "温度升高通常会怎样影响输出？", back: "提高低概率 token 被采样的机会，输出更多样但稳定性下降；事实和结构化任务通常使用较低温度。", hint: "随机性与稳定性" },
  { id: "f11", category: "全栈", front: "什么时候应该把任务放进队列？", back: "请求耗时长、需限并发、可异步、需要重试或削峰时；同时要设计状态查询、幂等和失败处理。", hint: "慢、贵、不稳定" },
  { id: "f12", category: "MCP", front: "MCP 和 Function Calling 的核心区别？", back: "Function Calling 描述模型如何提出工具调用；MCP 标准化宿主与外部工具、资源和提示之间的发现与连接。", hint: "调用契约 vs 连接协议" },
];

export const knowledgeGraph = {
  nodes: [
    { id: "foundation", label: "模型基础", group: "底层", x: 50, y: 12 },
    { id: "python", label: "Python", group: "工程", x: 20, y: 30 },
    { id: "prompt", label: "上下文工程", group: "应用", x: 50, y: 30 },
    { id: "ui", label: "AI UI", group: "前端", x: 80, y: 30 },
    { id: "rag", label: "RAG", group: "应用", x: 34, y: 50 },
    { id: "agent", label: "Agent", group: "应用", x: 64, y: 50 },
    { id: "ux", label: "AI UX", group: "设计", x: 88, y: 53 },
    { id: "backend", label: "后端可靠性", group: "工程", x: 16, y: 69 },
    { id: "eval", label: "评测", group: "质量", x: 45, y: 70 },
    { id: "security", label: "安全", group: "质量", x: 73, y: 70 },
    { id: "llmops", label: "LLMOps", group: "工程", x: 32, y: 88 },
    { id: "product", label: "生产级 AI 产品", group: "结果", x: 65, y: 89 },
  ],
  edges: [
    ["foundation", "prompt"], ["foundation", "python"], ["foundation", "ui"],
    ["python", "rag"], ["prompt", "rag"], ["prompt", "agent"], ["ui", "agent"],
    ["ui", "ux"], ["rag", "eval"], ["agent", "eval"], ["agent", "security"],
    ["python", "backend"], ["backend", "llmops"], ["eval", "product"],
    ["security", "product"], ["ux", "product"], ["llmops", "product"],
  ],
};

export { practices };
