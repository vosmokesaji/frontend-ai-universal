import {
  knowledge as baseKnowledge,
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

export type LearningVerdict = "核心投入" | "继续学习" | "按岗位选学";

export type EvidenceSignal = {
  label: string;
  url: string;
};

export type KnowledgeV3 = Omit<Knowledge, "resources"> & {
  resources: LearningResource[];
  levels: KnowledgeLevel[];
  verdict: LearningVerdict;
  validation: string;
  signals: EvidenceSignal[];
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
  "ai-coding": [
    {
      title: "GitHub Copilot 中文文档",
      provider: "GitHub",
      url: "https://docs.github.com/zh/copilot",
      note: "从仓库上下文、指令到审查与测试，建立可复用的人机协作流程。",
      ease: 4.6,
      professional: 4.9,
      audience: "入门到进阶",
    },
    {
      title: "AI Skills for Everyone",
      provider: "Datawhale",
      url: "https://github.com/datawhalechina/ai-skills-for-everyone",
      note: "用中文案例练习任务描述、上下文组织、工具调用与结果验证。",
      ease: 4.8,
      professional: 4.5,
      audience: "入门",
    },
    {
      title: "AI 学习路线 3.0",
      provider: "Datawhale",
      url: "https://github.com/datawhalechina/datawhale-ai-learning-roadmap/blob/main/curriculum-v3.0.md",
      note: "从工程实践视角理解 AI 辅助开发与应用构建的能力边界。",
      ease: 4.3,
      professional: 4.6,
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
  "ai-coding": {
    entry: ["把需求写成验收标准", "让 Agent 先读代码再计划", "小步提交与 diff 审查", "单元 / 集成测试"],
    advanced: ["仓库级指令与上下文", "任务拆分与并行边界", "失败复现和回滚", "安全权限与沙箱"],
    mastery: ["Agent harness 设计", "自动评测与回归门禁", "多 Agent 协作治理", "团队工作流与效能度量"],
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

const learningDecisions: Record<
  string,
  { verdict: LearningVerdict; validation: string; signals: EvidenceSignal[] }
> = {
  ml: {
    verdict: "继续学习",
    validation: "保留统计、指标、实验设计和误差分析这 20% 高频基础；应用岗位不必先学完整训练理论。",
    signals: [
      { label: "百度 J102217：训练、评测与应用并重", url: "https://talent.baidu.com/jobs/detail/SOCIAL/f16d38a1-440b-4e7b-b09b-ddfdfaf643e4" },
      { label: "腾讯 / 百度大模型面经", url: "https://www.nowcoder.com/discuss/878600528970735616" },
    ],
  },
  python: {
    verdict: "核心投入",
    validation: "Python 仍是模型、数据、评测和服务生态的共同语言；前端转型至少要能写可测试的异步 API。",
    signals: [
      { label: "百度 J100679：Python、API、RAG、Agent", url: "https://talent.baidu.com/jobs/detail/GRADUATE/66a12645-f0f1-435c-8426-9fb91f1be330" },
      { label: "2026 面经：Python 与工程基础高频", url: "https://www.nowcoder.com/discuss/878600528970735616" },
    ],
  },
  llm: {
    verdict: "继续学习",
    validation: "理解 token、上下文、采样、KV Cache 与能力边界即可支撑大多数应用决策，不必先从头训练模型。",
    signals: [
      { label: "Stanford AI Index 2026", url: "https://hai.stanford.edu/assets/files/ai_index_report_2026.pdf" },
      { label: "百度 J102217：模型训练、评测与应用", url: "https://talent.baidu.com/jobs/detail/SOCIAL/f16d38a1-440b-4e7b-b09b-ddfdfaf643e4" },
    ],
  },
  prompt: {
    verdict: "核心投入",
    validation: "提示词技巧正在升级为上下文工程：管理系统指令、工具、数据、历史、预算和结构化输出。",
    signals: [
      { label: "Anthropic：Context Engineering", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
      { label: "百度 J100679：模型 API 与工具链", url: "https://talent.baidu.com/jobs/detail/GRADUATE/66a12645-f0f1-435c-8426-9fb91f1be330" },
    ],
  },
  "ai-coding": {
    verdict: "核心投入",
    validation: "AI 写代码能力提升后，人的重心转向规格、拆解、上下文、审查、测试和责任边界，这会成为开发基本功。",
    signals: [
      { label: "OpenAI：Agent 任务时长正在拉长", url: "https://openai.com/index/how-agents-are-transforming-work/" },
      { label: "GitHub：开发者转向理解、指导与验证", url: "https://github.blog/news-insights/octoverse/the-new-identity-of-a-developer-what-changes-and-what-doesnt-in-the-ai-era/" },
    ],
  },
  rag: {
    verdict: "核心投入",
    validation: "值得学的是数据接入、权限、混合检索、重排、引用和评测；只会切块、向量化、Top-K 已不够。",
    signals: [
      { label: "百度 J100679：RAG 与数据管道", url: "https://talent.baidu.com/jobs/detail/GRADUATE/66a12645-f0f1-435c-8426-9fb91f1be330" },
      { label: "2026 面经：RAG 质量与评测", url: "https://www.nowcoder.com/discuss/914178628659707904" },
    ],
  },
  agent: {
    verdict: "核心投入",
    validation: "Agent 已从演示进入 API、CLI、Skill 和业务流程；重点是工具契约、状态、恢复、权限与评测。",
    signals: [
      { label: "百度 J103341：Agent-friendly 工具链", url: "https://talent.baidu.com/jobs/detail/SOCIAL/a5ff8d15-b547-4a87-ba55-a128dae953cd" },
      { label: "Anthropic：先选最简单的有效 Agent 架构", url: "https://www.anthropic.com/engineering/building-effective-agents" },
    ],
  },
  eval: {
    verdict: "核心投入",
    validation: "模型迭代越快，越需要固定任务集、grader、trace 和回归门禁；否则无法判断升级是否真的更好。",
    signals: [
      { label: "Anthropic：Agent 评测方法", url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents" },
      { label: "百度 J101017：Agent 评测体系", url: "https://talent.baidu.com/jobs/detail/GRADUATE/02f73086-be71-4d09-8d6e-f1c6981b8b48" },
    ],
  },
  "ai-ui": {
    verdict: "核心投入",
    validation: "简单页面生成会更便宜，但流式、多模态、长任务状态、可视化与性能仍需要高级前端工程。",
    signals: [
      { label: "Anthropic：JS/HTML 与 UI/UX 居前", url: "https://www.anthropic.com/research/impact-software-development" },
      { label: "GitHub Octoverse 2025：TypeScript 使用上升", url: "https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/" },
    ],
  },
  "ai-ux": {
    verdict: "核心投入",
    validation: "AI 系统不确定、会等待、会调用工具；预期管理、可撤销、证据与用户控制直接决定产品是否可信。",
    signals: [
      { label: "OpenAI：判断、品味与责任更重要", url: "https://openai.com/index/built-to-benefit-everyone-our-plan/" },
      { label: "Anthropic：UI/UX 是 Coding Agent 高频任务", url: "https://www.anthropic.com/research/impact-software-development" },
    ],
  },
  backend: {
    verdict: "核心投入",
    validation: "长任务 Agent 把超时、队列、幂等、检查点、回滚和容量成本推到台前，后端可靠性是落地门槛。",
    signals: [
      { label: "百度 J100679：推理服务、Docker/K8s 与稳定性", url: "https://talent.baidu.com/jobs/detail/GRADUATE/66a12645-f0f1-435c-8426-9fb91f1be330" },
      { label: "2026 Agent 面经：生产问题与系统设计", url: "https://www.nowcoder.com/discuss/916347378695692288" },
    ],
  },
  security: {
    verdict: "核心投入",
    validation: "模型拥有工具和写权限后，Prompt 注入会变成真实动作风险；最小权限、确认、审计与回滚必须前置。",
    signals: [
      { label: "OWASP Agentic Top 10 2026", url: "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/" },
      { label: "MCP 2025-11 授权规范", url: "https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization" },
    ],
  },
  llmops: {
    verdict: "核心投入",
    validation: "多模型、快速版本与长链路要求完整版本、trace、灰度、回滚和成本归因，不能只看 QPS。",
    signals: [
      { label: "Anthropic：Agent trace 与 grader", url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents" },
      { label: "百度 J100679：速度与稳定性优化", url: "https://talent.baidu.com/jobs/detail/GRADUATE/66a12645-f0f1-435c-8426-9fb91f1be330" },
    ],
  },
  finetune: {
    verdict: "按岗位选学",
    validation: "算法、模型平台和私有化岗位需要；多数应用岗应先证明 Prompt、RAG 与评测基线仍无法达标。",
    signals: [
      { label: "百度 J102217：模型训练与应用算法岗", url: "https://talent.baidu.com/jobs/detail/SOCIAL/f16d38a1-440b-4e7b-b09b-ddfdfaf643e4" },
      { label: "2026 Agent 面经：应用、平台、算法分层", url: "https://www.nowcoder.com/discuss/916347378695692288" },
    ],
  },
  next: {
    verdict: "按岗位选学",
    validation: "现代全栈边界值得学，但 Next.js 只是实现选项，不是转 AI 的门票；按团队栈和目标岗位投入。",
    signals: [
      { label: "GitHub Octoverse 2025：TypeScript 位居首位", url: "https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/" },
      { label: "百度 J97670：工程基础与 AI Coding 工具", url: "https://talent.baidu.com/jobs/detail/INTERN/d1ed3134-5bd8-4743-a937-acca2773b1e7" },
    ],
  },
};

export const deprioritizedTopics = [
  { topic: "提示词魔法句式", reason: "技巧随模型变化，改学上下文、结构化输出与评测。" },
  { topic: "背框架 API", reason: "LangChain、LangGraph 与各家 SDK 更新快，改学状态、工具、恢复等原理。" },
  { topic: "朴素 RAG Demo", reason: "只会切块、向量化、Top-K 无法证明生产价值，补齐数据与评测闭环。" },
  { topic: "多 Agent 炫技", reason: "协调成本和失败面更大，先用可控 Workflow 或单 Agent。" },
  { topic: "把 Next.js 当 AI 前置课", reason: "按岗位和团队栈选学，不应挤占 Python、评测与可靠性时间。" },
  { topic: "每日追模型榜单", reason: "关注能力拐点与实测基线，避免把资讯消费当学习。" },
];

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
  ...learningDecisions[item.id],
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
  fullAnswer: string;
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

const fullReferenceAnswers = [
  "我先讲结论：这个项目解决的不是“接入一个模型”，而是把原来平均 18 分钟的资料检索与整理过程压缩到 3 分钟。目标用户是每天处理大量内部文档的运营同学，我负责前端交互、RAG 链路设计和评测闭环。架构上，文档经过清洗、切分、混合检索和重排后再进入模型，答案必须附带可点击引用。最大的取舍是没有直接使用开放式 Agent，而是采用确定性工作流，以换取可观测性和稳定性。上线灰度后，任务完成率从 61% 提升到 84%，首字延迟控制在 1.2 秒以内。复盘发现长表格仍是主要失败样本，后续通过结构化解析和专项测试集持续改进。",
  "我把 RAG 看成一条可测量的数据与检索管线。原始文档先做格式解析、去噪、权限继承和版本标记，再按语义边界切分并保留标题、来源、时间等元数据。检索阶段同时使用 BM25 和向量召回，融合结果后用重排模型筛选，最后按 token 预算组织上下文并要求模型输出逐条引用。评测不能只看最终答案：数据层检查解析完整率，检索层看 Recall@K 和 MRR，生成层看正确性、忠实度和引用命中率，线上再观察任务成功率、延迟、成本与无答案率。失败样本要回流黄金集，避免只凭主观感觉调整 Prompt。",
  "我的原则是选择满足目标的最简单架构。步骤固定、合规要求高、错误代价大的任务优先用工作流；需要在有限工具中自主选择路径、但目标仍清晰时使用单 Agent；只有当任务可以真正并行、不同子任务需要独立上下文或专业角色，而且收益明显高于协调成本时，才考虑多 Agent。无论哪种方案，都要设置最大步数、截止时间、状态检查点和人工升级。多 Agent 最常见的失败是重复劳动、信息丢失和责任不清，因此必须定义消息契约、共享状态和终止条件，并通过 trace 比较它是否真的优于单 Agent 基线。",
  "我会把一次 Agent 执行当作可能失败的分布式事务。入口先设置总截止时间、最大步骤和 token 预算，再把错误分成可重试、不可重试和需要人工处理三类。所有有副作用的工具调用都携带幂等键，执行前后写入状态与检查点；网络抖动使用指数退避，参数错误直接返回模型修正，权限或业务冲突则停止自动执行。跨系统写入无法原子提交时，用补偿动作或人工确认保证可恢复。监控上记录每一步输入摘要、工具结果、重试次数和最终状态，并对死循环、重复写入和超预算设置告警。这样即使模型判断错误，系统也能停得住、查得到、恢复得了。",
  "证明系统变好要从成功标准开始。我会先定义用户任务成功率、答案正确性、引用完整度、首字延迟和单次成本等指标，并从真实业务、边界条件、历史事故和拒答场景构建黄金集。每次修改模型、Prompt、检索或工具前后都跑同一套离线回归，与当前生产基线比较并按错误类型归因。上线时小流量灰度，观察任务完成率、重试率、人工接管率和用户反馈，同时保留可追溯的版本信息。人工评审采用明确 rubric 和双人抽样，线上失败样本经过脱敏后回流数据集。只有质量提升且延迟、成本没有越过预算，才认为改动真正有效。",
  "协议选择先看通信方向和基础设施：只需要服务端向浏览器推送时，SSE 简单且自带事件语义；需要读取 POST 响应体并精细控制取消时，我更常用 Fetch Streaming；只有持续双向低延迟通信才选 WebSocket。实现时复用同一个 TextDecoder 并开启 stream 模式，避免 UTF-8 字符跨分片乱码；解析层按事件边界累积，渲染层按动画帧批量提交，防止每个 token 都触发重排。用户取消通过 AbortController 贯穿请求和服务端，重连要携带事件游标或请求 ID。还要明确背压、超时、半完成内容和错误后的重试语义，让界面始终可解释、可恢复。",
  "我按生命周期和数据所有权区分三类信息。上下文保存当前会话正在讨论的内容，随 token 预算进行裁剪和摘要；Memory 保存经过用户同意、未来仍有价值的偏好或长期事实，需要写入门控、更新时间和删除能力；RAG 管理外部可更新知识，保留来源、权限和版本。构造请求时先取当前任务必要的会话片段，再检索相关记忆和外部知识，而不是把全部历史塞进窗口。冲突时优先使用更新、更权威且权限匹配的数据，并向用户暴露不确定性。摘要必须保留原文指针，重要事实定期重新验证，避免错误记忆不断累积。",
  "我的安全假设是模型输入和输出都不可信。内容层使用检索引用、结构化输出和事实校验降低幻觉；Prompt 注入不能只靠系统提示词，而要把外部内容当数据隔离，并限制它能影响的指令范围。工具层采用最小权限、白名单、参数 schema、服务端策略校验和短期凭证；涉及付款、删除、发送等高风险动作时，必须展示即将发生的操作并让用户明确确认。所有调用记录主体、参数摘要、结果和策略决定，支持撤销或补偿。还要用攻击样本持续做红队与回归测试，这样安全依赖多层控制，而不是期待模型永远听话。",
  "我会把模型 API 当作慢、贵且不稳定的外部依赖。入口按用户和租户设置并发、速率与 token 预算，超出后排队或返回可解释的降级结果。缓存要同时考虑语义相似度、权限、时效、模型版本和安全策略，不能只看 embedding 距离。长任务进入队列，支持状态查询、取消、幂等和失败重试；上游异常通过熔断隔离，并按任务复杂度路由到不同模型。监控每个功能的延迟分位数、错误率、输入输出 token 和单位成功任务成本。降级顺序应预先设计，例如缩短上下文、关闭非必要步骤、切换小模型或转人工，而不是故障发生时临时决定。",
  "AI 界面的核心是校准信任，而不是让系统看起来无所不能。任务开始前说明能力边界和预计耗时，执行中展示当前阶段、已使用的数据和可取消入口，而不是只有旋转图标。结果中区分事实、推断和待确认内容，提供来源、编辑、重试、对比与撤销。对高风险动作先生成计划和影响预览，必须由用户确认后执行；失败时保留已完成内容，解释原因并给出可操作的恢复路径。对于不确定结果，我会让用户能补充约束或选择候选，而不是只显示一个模糊置信度。这样用户始终知道系统在做什么、为什么这么做，以及自己还能控制什么。",
  "Function Calling 解决模型如何按约定提出一次工具调用，核心是函数名、参数 schema 和结果回传；MCP 进一步标准化宿主如何发现并连接外部工具、资源和提示；自定义 API 则承载具体业务逻辑、鉴权和数据一致性。设计工具 schema 时我会让每个工具职责单一、名称表达动作、必填项明确、枚举代替自由文本，并给出约束和示例。服务端仍需校验身份、权限、参数和业务状态，错误要区分可重试、需修改参数和禁止执行。版本演进优先向后兼容，高风险写操作增加幂等键、dry-run 和确认令牌，不能因为模型生成了合法 JSON 就直接执行。",
  "Token 是模型实际处理的离散单元。Self-attention 会把每个 token 映射成 Q、K、V：Q 表示它正在寻找什么，K 表示其他 token 可以被怎样匹配，点积得到权重后再聚合对应的 V，从而建立上下文依赖；位置编码补充顺序信息。对应用设计而言，这意味着输入不是免费且无限的：上下文越长，延迟和成本越高，关键信息还可能被稀释。因此我会做相关性检索、分层摘要和 token 预算，避免重复内容；结构化任务使用稳定采样参数，事实任务提供外部证据。理解原理的价值不是手推公式，而是能解释为什么要压缩上下文、控制输出并评测长文本效果。",
  "流式页面的性能策略是把高频小更新变成可控批次。网络层先累积 token，在 requestAnimationFrame 或固定时间片内更新一次；Markdown 采用增量解析并保持代码块状态，语法高亮放到 Worker，避免每次都重新解析全部历史。消息组件建立稳定 key 和 memo 边界，超长会话使用虚拟列表或内容可见性，只渲染视口附近节点。滚动锚点要区分用户主动浏览和自动跟随，代码块高度变化要避免反复跳动。我会用 Performance 面板、Long Task、INP、内存和每秒提交次数建立基线，再验证优化，而不是仅凭肉眼判断流畅。",
  "我会先复述题意并确认输入范围、重复元素和异常值，再给出最直接的朴素解法说明正确性，然后根据数据规模选择合适的数据结构优化。编码过程中把核心逻辑拆成可读的小步骤，明确不变量，并在完成后分析时间和空间复杂度。测试至少覆盖空输入、单元素、重复值、最大规模、边界下标和典型反例；如果使用递归，还要考虑栈深度。最后我会说明为什么没有选择另一种方案，以及当约束变化时如何调整。面试官不仅在看结果，也在看我能否澄清问题、持续验证并写出团队可维护的代码。",
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
      fullAnswer: fullReferenceAnswers[index] ?? fullReferenceAnswers[0],
    },
  };
});

export type Flashcard = {
  id: string;
  knowledgeId: string;
  category: string;
  difficulty: "低" | "中" | "高";
  front: string;
  back: string;
  hint: string;
};

type CardSeed = [Flashcard["difficulty"], string, string, string];

const flashcardBlueprints: Record<string, CardSeed[]> = {
  ml: [
    ["低", "训练集、验证集、测试集分别解决什么问题？", "训练集拟合参数，验证集选择方案和调参，测试集只用于最终无偏评估。", "三者不能混用"],
    ["低", "过拟合最常见的信号是什么？", "训练指标持续改善，但验证或线上指标停滞甚至变差。", "看泛化差距"],
    ["中", "分类不均衡时为什么不能只看准确率？", "多数类会掩盖少数类失败，应结合 Precision、Recall、F1、PR-AUC 和业务代价。", "错误成本不同"],
    ["中", "什么是数据泄漏？", "训练或特征中使用了预测时不可获得的信息，导致离线成绩虚高。", "未来信息偷跑"],
    ["高", "校准良好的概率意味着什么？", "预测为 0.8 的样本中，长期应约有 80% 真实为正例。", "概率可信度"],
    ["高", "如何判断指标提升是否值得上线？", "同时比较统计显著性、业务效应量、分群表现、成本与风险，而不只看平均值。", "统计与业务一起看"],
  ],
  python: [
    ["低", "Python 类型提示会在运行时自动阻止错误类型吗？", "不会；类型提示主要服务静态检查与 IDE，运行时校验需要 Pydantic 等工具。", "提示不是强制"],
    ["低", "async 函数适合解决哪类问题？", "大量等待网络、磁盘等 I/O 的并发问题，不会自动加速 CPU 密集计算。", "I/O 等待"],
    ["中", "协程里调用阻塞函数会发生什么？", "它会阻塞事件循环，拖慢所有并发请求，应改异步库或放到线程池。", "不要堵住 event loop"],
    ["中", "FastAPI 依赖注入最适合管理什么？", "鉴权、数据库会话、配置、共享客户端和可替换的测试依赖。", "横切关注点"],
    ["高", "如何给模型 API 客户端设置可靠超时？", "分别控制连接、读取和总截止时间，并让取消信号贯穿下游。", "超时不是一个数字"],
    ["高", "CPU 密集推理为何不应直接跑在事件循环？", "它会占满线程并阻塞其他请求，应使用进程池、任务队列或独立推理服务。", "并发模型不同"],
  ],
  llm: [
    ["低", "Token 和“一个汉字或单词”是同一概念吗？", "不是；token 由分词器决定，一个词可拆成多个 token，中文字符也可能按不同方式编码。", "模型的离散输入"],
    ["低", "温度升高通常怎样影响输出？", "提高低概率 token 被采样的机会，更多样但稳定性下降。", "随机性"],
    ["中", "Q、K、V 的直觉分别是什么？", "Q 表示当前 token 在找什么，K 表示能被怎样匹配，V 是匹配后被聚合的信息。", "查询、索引、内容"],
    ["中", "上下文窗口变大为什么不等于长期记忆？", "窗口只是一轮推理可见的 token；长期记忆还需要持久化、检索、更新和冲突处理。", "生命周期不同"],
    ["高", "长上下文为什么仍可能找不到关键信息？", "注意力会被无关内容稀释，并受位置、训练分布和检索方式影响。", "可见不等于会用"],
    ["高", "KV Cache 主要优化什么？", "自回归生成时复用历史 token 的 K/V，减少重复计算，但会增加显存占用。", "时间换空间"],
  ],
  prompt: [
    ["低", "高质量 Prompt 的第一步是什么？", "先定义成功标准、输入边界和可验证输出，而不是先堆技巧。", "先定义好答案"],
    ["低", "为什么结构化输出比自由文本更适合程序消费？", "字段和类型可验证，失败可重试，能降低解析歧义。", "契约"],
    ["中", "Few-shot 示例最主要的作用是什么？", "展示任务模式、边界和期望格式，帮助模型对齐而非提供更多知识。", "用例即规范"],
    ["中", "上下文工程与 Prompt 工程的区别？", "前者还负责选择、压缩、排序和隔离进入模型的动态信息。", "输入生命周期"],
    ["高", "如何避免 Prompt 改动造成静默回归？", "版本化模板，用固定数据集做离线回归并记录模型、参数和指标。", "可重复评测"],
    ["高", "什么时候应拆成多步 Prompt？", "任务包含可独立验证的中间结果，或单步指令冲突、上下文过载时。", "可验证的分解"],
  ],
  "ai-coding": [
    ["低", "把任务交给 Coding Agent 前先写什么？", "写清目标、非目标、约束、验收标准和可运行的验证命令。", "规格就是接口"],
    ["低", "为什么要让 Agent 先读代码再给计划？", "仓库结构、约定和既有实现决定改动边界，先读能减少重复与误改。", "先建立仓库模型"],
    ["中", "怎样审查 AI 生成的代码？", "看 diff、运行测试、检查边界与安全，再验证真实用户路径，而不是只看能否编译。", "验证结果而非语气"],
    ["中", "为什么要控制单次任务规模？", "小任务更容易给足上下文、定位失败、审查差异和安全回滚。", "缩短反馈回路"],
    ["高", "仓库级 Agent 指令应包含什么？", "架构约束、代码风格、测试命令、禁区、依赖策略和完成定义。", "把隐性规则显性化"],
    ["高", "如何衡量 Coding Agent 真正提高了效率？", "比较端到端交付时间、返工、缺陷、审查负担和任务完成率，而非生成代码行数。", "优化系统吞吐"],
  ],
  rag: [
    ["低", "RAG 的核心价值是什么？", "让模型使用可更新、可引用、受权限控制的外部知识。", "参数外知识"],
    ["低", "为什么切分时要保留元数据？", "来源、标题、时间、权限和层级用于过滤、引用与结果解释。", "片段不能失去身份"],
    ["中", "混合检索为什么常优于只用向量检索？", "向量擅长语义，BM25 擅长专名和精确匹配，融合后互补召回。", "语义 + 精确"],
    ["中", "重排模型解决什么问题？", "对初召回候选做更精细的相关性判断，提高进入上下文的精度。", "先广召回再精排"],
    ["高", "如何区分检索失败和生成失败？", "先看正确证据是否进入 Top-K，再在给定正确上下文时评估生成正确性。", "分层评测"],
    ["高", "增量索引最容易忽略什么？", "删除、版本、权限变化、重复内容和旧向量清理。", "更新不只是新增"],
  ],
  agent: [
    ["低", "什么时候工作流通常优于 Agent？", "步骤固定、规则明确、错误代价高且需要可预测结果时。", "确定性优先"],
    ["低", "工具调用 schema 为什么要职责单一？", "减少参数歧义和误调用，也让权限、错误和测试更清晰。", "一个工具一个动作"],
    ["中", "Agent 死循环的最小治理闭环是什么？", "最大步数、截止时间、状态检测、检查点和人工升级。", "预算、状态、兜底"],
    ["中", "MCP 与 Function Calling 的核心区别？", "Function Calling 是模型提出调用的契约；MCP 标准化宿主与外部能力的发现和连接。", "调用 vs 连接"],
    ["高", "多 Agent 的隐藏成本有哪些？", "协调 token、延迟、状态同步、责任不清、重复工作和更难评测。", "不是角色越多越好"],
    ["高", "Human-in-the-loop 应放在哪些节点？", "高风险写操作、低置信决策、权限变化和不可逆步骤之前。", "在代价发生前确认"],
  ],
  eval: [
    ["低", "黄金集应该包含哪些样本？", "主流程、边界、历史事故、高风险、对抗和无法回答样本。", "不只正常样本"],
    ["低", "离线评测和线上监控各回答什么？", "离线比较版本并复现问题；线上观察真实分布、体验和业务结果。", "实验室与真实世界"],
    ["中", "LLM-as-a-judge 为什么需要校准？", "评审模型可能偏好长度、措辞或自身答案，需要人工样本验证一致性。", "裁判也会偏"],
    ["中", "RAG 评测为什么要分检索和生成？", "端到端低分无法定位是没找到证据，还是拿到证据却答错。", "可归因"],
    ["高", "如何检测 Prompt 或模型升级回归？", "固定数据集、版本元数据、显著性比较和错误类别 diff。", "可重复基线"],
    ["高", "成本指标最好如何表达？", "用单位成功任务成本，而不是只看单次调用 token。", "成本与价值绑定"],
  ],
  "ai-ui": [
    ["低", "流式文本乱码首先检查什么？", "复用同一个 TextDecoder 并开启 stream 模式，处理跨 chunk 的 UTF-8 字节。", "字符可能跨分片"],
    ["低", "用户点击停止时至少要取消哪些层？", "界面状态、浏览器请求、服务端生成和下游工具，避免只是假停止。", "端到端取消"],
    ["中", "为什么不能每收到一个 token 就 setState？", "会造成高频渲染、布局和 Markdown 重解析，应按帧或时间片批量提交。", "批量刷新"],
    ["中", "工具调用状态应该如何展示？", "区分计划、等待确认、执行、成功、失败和可恢复动作。", "状态不是一个 loading"],
    ["高", "流式重连怎样避免内容重复？", "使用请求 ID、事件游标或序号，从确认位置续传并去重。", "可恢复协议"],
    ["高", "生成式 UI 最重要的安全边界是什么？", "模型只描述受限 schema，真实组件和行为由可信代码映射。", "模型不直接生成可执行 UI"],
  ],
  "ai-ux": [
    ["低", "什么是 AI 产品中的信任校准？", "让用户的信任程度与系统真实能力和不确定性相匹配。", "不是越信越好"],
    ["低", "为什么要保留编辑和撤销？", "AI 输出可能错，用户需要低成本纠正并保持最终控制权。", "可逆性"],
    ["中", "不确定性怎样转成可操作反馈？", "指出缺失信息、证据冲突或风险，并提供补充、选择或人工确认入口。", "不要只给置信度"],
    ["中", "长任务中什么反馈比进度条更有用？", "当前阶段、已完成成果、下一步、预计等待和取消/恢复方式。", "过程可解释"],
    ["高", "高风险动作的确认界面应展示什么？", "动作对象、具体变化、影响范围、不可逆点和撤销方案。", "知情确认"],
    ["高", "如何评测 AI UX 而不只看满意度？", "结合任务成功、修正次数、接管率、恢复率、信任校准和完成时间。", "行为指标"],
  ],
  backend: [
    ["低", "什么时候应该把任务放进队列？", "耗时长、需限并发、可异步、需要重试或削峰时。", "慢、贵、不稳定"],
    ["低", "为什么模型调用需要幂等键？", "超时重试可能造成工具重复写入、重复扣费或重复发送。", "重试不等于一次执行"],
    ["中", "熔断和重试分别解决什么？", "重试应对短暂故障；熔断在持续故障时快速失败，保护系统。", "不要无限重试"],
    ["中", "语义缓存不能只看什么？", "不能只看向量相似度，还要考虑用户、权限、时效、模型版本和策略。", "可复用上下文"],
    ["高", "分布式任务如何支持恢复？", "持久化状态机、检查点、幂等步骤、补偿动作和可重放事件。", "失败后从哪里继续"],
    ["高", "模型网关最关键的横切能力？", "鉴权、预算、路由、限流、重试、观测、审计和成本归因。", "统一治理入口"],
  ],
  security: [
    ["低", "Prompt 注入为什么不能只靠系统提示词解决？", "模型无法可靠区分指令和数据，还需要权限、隔离、策略与审计。", "纵深防御"],
    ["低", "最小权限对 Agent 意味着什么？", "每个工具只获得完成当前任务所需的最小数据和动作范围。", "能少给就少给"],
    ["中", "结构化输出是否等于安全输出？", "不等于；格式合法仍可能越权或违反业务规则，服务端必须再校验。", "合法 JSON 也会危险"],
    ["中", "外部文档中的指令应如何处理？", "作为不可信数据隔离，不允许覆盖系统策略或直接触发高风险工具。", "数据不是指令"],
    ["高", "Agent 审计日志至少记录什么？", "主体、策略版本、输入摘要、工具与参数、确认、结果和恢复动作。", "能追责与复盘"],
    ["高", "红队样本如何进入日常工程？", "沉淀为可版本化测试集，在模型、Prompt、工具变更时自动回归。", "攻击变测试"],
  ],
  llmops: [
    ["低", "为什么模型版本必须和 Prompt 一起记录？", "两者共同决定输出，缺一就无法复现和比较。", "完整运行身份"],
    ["低", "容器健康检查与业务就绪检查有何不同？", "进程存活不代表模型依赖、配置和下游服务已经可用。", "alive vs ready"],
    ["中", "AI 服务最值得看的三类指标？", "质量、延迟/可靠性和成本，并按版本与功能切分。", "不是只有 QPS"],
    ["中", "灰度发布怎样降低模型升级风险？", "小流量、固定基线、指标门槛、自动回滚和版本可追踪。", "逐步放量"],
    ["高", "Trace 为什么要跨越模型和工具？", "端到端问题常发生在检索、模型、工具和业务状态的交界处。", "完整因果链"],
    ["高", "何时需要模型路由？", "任务质量需求、时延预算、成本、区域或能力差异明显时。", "按任务选模型"],
  ],
  finetune: [
    ["低", "什么时候不该优先微调？", "知识需要频繁更新、问题可由 RAG 或提示解决、数据不足时。", "先用更轻的方法"],
    ["低", "LoRA 的核心思路是什么？", "冻结大部分原模型，只训练低秩适配参数，降低显存和训练成本。", "小参数适配"],
    ["中", "SFT 数据质量为何比数量更关键？", "错误、风格冲突和低信息样本会直接教坏模型行为。", "示范就是目标"],
    ["中", "量化主要在权衡什么？", "更低显存与更高吞吐，换取可能的精度损失和算子限制。", "效率与质量"],
    ["高", "微调效果如何与基座升级区分？", "同一评测集上比较基座、微调和提示/RAG 基线，控制其他变量。", "建立消融实验"],
    ["高", "开源模型上线前为什么要查许可证？", "训练、商用、分发和衍生模型可能受不同条款限制。", "技术可用不等于可商用"],
  ],
  next: [
    ["低", "Server Component 的主要价值是什么？", "在服务端取数和渲染，减少客户端 JavaScript，并安全访问后端资源。", "减少浏览器负担"],
    ["低", "什么时候组件必须使用 use client？", "需要状态、事件、Effect、浏览器 API 或客户端上下文时。", "交互边界"],
    ["中", "SSR、SSG、ISR 的核心差异？", "分别按请求生成、构建时生成、按策略增量再生成。", "生成时机"],
    ["中", "为什么不要把密钥放进 NEXT_PUBLIC 变量？", "这类变量会内联到客户端包，任何用户都能读取。", "公开前缀即公开"],
    ["高", "流式 RSC 与模型 token 流有什么不同？", "前者传输组件树分片，后者传输模型输出数据；生命周期和协议不同。", "UI 流与内容流"],
    ["高", "现代全栈项目如何划分缓存责任？", "明确浏览器、CDN、框架数据缓存、业务缓存和模型缓存的键、时效与失效策略。", "分层缓存"],
  ],
};

export const flashcards: Flashcard[] = knowledge.flatMap((item) =>
  (flashcardBlueprints[item.id] ?? []).map(([difficulty, front, back, hint], index) => ({
    id: `${item.id}-${index + 1}`,
    knowledgeId: item.id,
    category: item.name,
    difficulty,
    front,
    back,
    hint,
  })),
);

export const knowledgeGraph = {
  nodes: [
    { id: "ml", label: "机器学习直觉", group: "底层", x: 12, y: 15, description: "理解泛化、指标与数据泄漏。" },
    { id: "llm", label: "LLM 原理", group: "底层", x: 34, y: 15, description: "理解 token、attention 与推理约束。" },
    { id: "python", label: "Python", group: "工程", x: 57, y: 15, description: "进入 AI 服务生态的工程语言。" },
    { id: "next", label: "现代全栈", group: "前端", x: 82, y: 15, description: "补齐 Server Components 与服务端渲染。" },
    { id: "prompt", label: "上下文工程", group: "应用", x: 16, y: 38, description: "组织指令、示例与动态上下文。" },
    { id: "ai-coding", label: "AI 协作开发", group: "工程", x: 28, y: 50, description: "用规格、审查与测试驾驭 Coding Agent。" },
    { id: "rag", label: "RAG", group: "应用", x: 39, y: 38, description: "连接可更新、可引用的外部知识。" },
    { id: "ai-ui", label: "AI UI", group: "前端", x: 64, y: 38, description: "流式、多模态与生成式界面。" },
    { id: "ai-ux", label: "AI UX", group: "设计", x: 88, y: 38, description: "校准信任并保留用户控制。" },
    { id: "agent", label: "Agent", group: "应用", x: 18, y: 63, description: "编排工具、状态与人机协作。" },
    { id: "backend", label: "后端可靠性", group: "工程", x: 42, y: 63, description: "预算、队列、幂等与恢复。" },
    { id: "eval", label: "评测", group: "质量", x: 66, y: 63, description: "用数据证明系统变好。" },
    { id: "finetune", label: "微调与推理", group: "进阶", x: 88, y: 63, description: "适配开源模型与部署约束。" },
    { id: "security", label: "安全", group: "质量", x: 25, y: 86, description: "最小权限、策略、确认与审计。" },
    { id: "llmops", label: "LLMOps", group: "工程", x: 53, y: 86, description: "版本、观测、灰度与成本治理。" },
    { id: "product", label: "生产级 AI 产品", group: "结果", x: 82, y: 86, description: "把模型、体验、数据和可靠性组合成产品。" },
  ],
  edges: [
    ["ml", "eval"], ["llm", "prompt"], ["llm", "rag"], ["python", "rag"],
    ["python", "backend"], ["prompt", "ai-coding"], ["ai-coding", "ai-ui"], ["ai-coding", "backend"], ["prompt", "agent"], ["prompt", "ai-ui"],
    ["rag", "agent"], ["rag", "eval"], ["ai-ui", "ai-ux"], ["ai-ui", "agent"],
    ["agent", "backend"], ["agent", "security"], ["backend", "llmops"],
    ["eval", "llmops"], ["finetune", "llmops"], ["security", "product"],
    ["llmops", "product"], ["ai-ux", "product"], ["eval", "product"],
  ],
};

export type PracticeDrill = {
  id: string;
  tag: string;
  difficulty: "入门" | "进阶" | "挑战";
  minutes: number;
  task: string;
  deliverable: string;
  criteria: string[];
};

export const practices: PracticeDrill[] = [
  { id: "ml", tag: "机器学习直觉", difficulty: "入门", minutes: 25, task: "为一个内容推荐场景选择离线指标，并解释为什么不能只看准确率。", deliverable: "一页指标决策卡", criteria: ["包含业务目标与错误代价", "至少比较 3 个指标", "指出一种数据泄漏风险"] },
  { id: "python", tag: "Python 异步", difficulty: "进阶", minutes: 40, task: "实现一个并发调用两个模型、支持超时取消的 FastAPI 接口。", deliverable: "可运行接口 + 3 个测试", criteria: ["没有阻塞事件循环", "区分连接与总超时", "覆盖失败和取消"] },
  { id: "llm", tag: "LLM 原理", difficulty: "入门", minutes: 25, task: "不用公式，向前端同事讲清 token、attention、上下文窗口与成本的关系。", deliverable: "5 分钟讲解录音或提纲", criteria: ["Q/K/V 直觉正确", "连接到延迟和成本", "给出一个应用取舍"] },
  { id: "prompt", tag: "上下文工程", difficulty: "进阶", minutes: 35, task: "把一个自由文本 Prompt 改造成有输入契约、示例、JSON 输出与失败策略的版本。", deliverable: "前后版本 + 10 条测试集", criteria: ["定义成功标准", "输出可验证", "记录至少 2 个失败样本"] },
  { id: "ai-coding", tag: "AI 协作开发", difficulty: "进阶", minutes: 40, task: "把一个模糊需求改写成 Coding Agent 可执行的任务包，并完成一次 diff 审查。", deliverable: "任务规格 + 实施计划 + 审查记录", criteria: ["目标、非目标和验收标准明确", "包含可运行验证命令", "指出至少 2 个潜在风险"] },
  { id: "rag", tag: "RAG", difficulty: "挑战", minutes: 45, task: "白板讲清解析、切分、混合召回、重排、引用和分层评测，限时 8 分钟。", deliverable: "一张链路图 + 讲解录音", criteria: ["每层都有输入输出", "区分检索与生成指标", "包含权限和更新策略"] },
  { id: "agent", tag: "Agent 工作流", difficulty: "挑战", minutes: 45, task: "为一个可写数据库的 Agent 设计超时、幂等、检查点、补偿和人工确认。", deliverable: "状态图 + 失败处理表", criteria: ["列出终止条件", "写操作可幂等", "不可逆动作先确认"] },
  { id: "eval", tag: "评测", difficulty: "进阶", minutes: 40, task: "为作品集项目写 20 条黄金样本，并定义质量、延迟、成本三类门槛。", deliverable: "评测表 + 发布门禁", criteria: ["覆盖主流程与边界", "有当前基线", "失败能归因到层"] },
  { id: "ai-ui", tag: "流式 UI", difficulty: "挑战", minutes: 50, task: "不用 AI SDK，实现支持 Abort、UTF-8 分片、批量渲染和重连去重的流式输出。", deliverable: "可交互 Demo + 性能记录", criteria: ["实时停止生效", "无乱码和重复", "记录渲染频率"] },
  { id: "ai-ux", tag: "AI UX", difficulty: "进阶", minutes: 35, task: "为一个高风险 AI 动作设计计划预览、确认、执行反馈、失败恢复和撤销。", deliverable: "五状态交互原型", criteria: ["能力边界可见", "确认信息具体", "失败后可恢复"] },
  { id: "backend", tag: "后端可靠性", difficulty: "挑战", minutes: 45, task: "为高并发模型网关制定限流、队列、熔断、降级和成本预算。", deliverable: "架构图 + 容量预算表", criteria: ["给出数值预算", "区分重试与熔断", "降级顺序明确"] },
  { id: "security", tag: "AI 安全", difficulty: "挑战", minutes: 40, task: "对一个带工具调用的助手做威胁建模，并设计 10 条 Prompt 注入回归用例。", deliverable: "威胁模型 + 安全测试集", criteria: ["覆盖输入、模型、工具", "使用最小权限", "高风险动作可审计"] },
  { id: "llmops", tag: "LLMOps", difficulty: "进阶", minutes: 40, task: "为模型升级设计版本记录、灰度指标、自动回滚和 Trace 看板。", deliverable: "发布清单 + 看板草图", criteria: ["能复现任意运行", "有质量和成本门槛", "定义回滚触发器"] },
  { id: "finetune", tag: "微调与推理", difficulty: "挑战", minutes: 45, task: "为一个领域任务比较 Prompt、RAG、LoRA 三种方案，并设计消融实验。", deliverable: "方案决策表", criteria: ["数据需求明确", "包含质量与成本", "检查模型许可证"] },
  { id: "next", tag: "现代全栈", difficulty: "进阶", minutes: 40, task: "把一个纯客户端 AI 页面重构为服务端取数、客户端交互边界清晰的应用。", deliverable: "边界图 + 重构 PR 说明", criteria: ["密钥不进入客户端", "减少客户端 JavaScript", "缓存与失效策略明确"] },
];
