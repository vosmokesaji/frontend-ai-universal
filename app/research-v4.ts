"use client";

import {
  questions as baseQuestions,
  rolePaths,
  type QuestionV3,
} from "./data-v3";

export type JobEvidenceLevel = "精确 JD" | "官方招聘检索";
export type JobStatus = "官网可访问" | "需打开核验";

export type JobSignal = {
  id: string;
  company: string;
  title: string;
  role: string;
  location: string;
  salary: string;
  salaryNote: string;
  experience: string;
  match: number;
  keywords: string[];
  source: string;
  sourceLabel: string;
  evidenceLevel: JobEvidenceLevel;
  jobId: string;
  published: string;
  captured: string;
  status: JobStatus;
  summary: string;
};

type CompanySource = {
  id: string;
  name: string;
  url: string;
  team: string;
};

export const companySources: CompanySource[] = [
  {
    id: "bytedance",
    name: "字节跳动",
    url: "https://jobs.bytedance.com/experienced/position",
    team: "豆包 / 飞书 / 火山引擎 / 抖音",
  },
  {
    id: "tencent",
    name: "腾讯",
    url: "https://careers.tencent.com/search.html",
    team: "混元 / CSIG / PCG / TEG",
  },
  {
    id: "alibaba",
    name: "阿里巴巴",
    url: "https://talent.alibaba.com/off-campus/position-list",
    team: "通义 / 阿里云 / 淘天 / 钉钉",
  },
  {
    id: "baidu",
    name: "百度",
    url: "https://talent.baidu.com/jobs/social-list",
    team: "文心 / 智能云 / 搜索 / MEG",
  },
  {
    id: "meituan",
    name: "美团",
    url: "https://zhaopin.meituan.com/web/social",
    team: "到店 / 外卖 / 搜索 / 基础研发",
  },
  {
    id: "jd",
    name: "京东",
    url: "https://zhaopin.jd.com/?ishunterflag=false",
    team: "京东零售 / 京东科技 / 搜索 / 京东云",
  },
  {
    id: "kuaishou",
    name: "快手",
    url: "https://zhaopin.kuaishou.cn/recruit/e/#/official/social/",
    team: "可灵 / 商业化 / 搜索 / 主站",
  },
  {
    id: "xiaomi",
    name: "小米",
    url: "https://hr.xiaomi.com/job",
    team: "MiMo / 手机 / 汽车 / 互联网业务",
  },
  {
    id: "huawei",
    name: "华为",
    url: "https://career.huawei.com/reccampportal/portal5/social-recruitment.html",
    team: "华为云 / 终端 / 车 BU / 2012 实验室",
  },
  {
    id: "microsoft",
    name: "微软中国",
    url: "https://jobs.careers.microsoft.com/global/en/search?lc=Beijing",
    team: "Azure / Copilot / Microsoft Research",
  },
];

const exactJobs: JobSignal[] = [
  {
    id: "baidu-j85687",
    company: "百度",
    title: "大模型算法工程师",
    role: "多模态应用",
    location: "北京",
    salary: "官网未公开",
    salaryNote: "薪资以招聘方沟通为准；站内角色区间仅用于北京市场参考。",
    experience: "社招 · 硕士及以上优先",
    match: 78,
    keywords: ["LLM", "多模态", "SFT", "Prompt", "部署"],
    source:
      "https://talent.baidu.com/jobs/detail/SOCIAL/01c9d3a6-7d36-45de-b122-bb671b2b50a6",
    sourceLabel: "百度官方职位详情",
    evidenceLevel: "精确 JD",
    jobId: "J85687",
    published: "2026-07-21",
    captured: "2026-07-31",
    status: "官网可访问",
    summary: "面向出行场景研发和优化语言/视觉大模型，覆盖微调、知识增强、评测与部署。",
  },
  {
    id: "baidu-j93602",
    company: "百度",
    title: "高级多模态算法工程师",
    role: "多模态应用",
    location: "北京",
    salary: "官网未公开",
    salaryNote: "薪资以招聘方沟通为准；站内角色区间仅用于北京市场参考。",
    experience: "社招 · 硕士及以上",
    match: 80,
    keywords: ["多模态", "对话", "生成", "检索", "Web"],
    source:
      "https://talent.baidu.com/jobs/detail/SOCIAL/3674af56-7c3e-4bc9-8069-d45f20f2d428",
    sourceLabel: "百度官方职位详情",
    evidenceLevel: "精确 JD",
    jobId: "J93602",
    published: "2026-07-21",
    captured: "2026-07-31",
    status: "官网可访问",
    summary: "多模态对话、生成、检索和问答，需与产品、设计、前端协作推动 Web 与端侧落地。",
  },
  {
    id: "baidu-j100679",
    company: "百度",
    title: "大模型研发工程师",
    role: "AI Native 全栈",
    location: "北京",
    salary: "官网未公开",
    salaryNote: "薪资以招聘方沟通为准；站内角色区间仅用于北京市场参考。",
    experience: "校招 · 本科及以上",
    match: 92,
    keywords: ["Python", "RAG", "Agent", "API", "Docker"],
    source:
      "https://talent.baidu.com/jobs/detail/GRADUATE/66a12645-f0f1-435c-8426-9fb91f1be330",
    sourceLabel: "百度官方职位详情",
    evidenceLevel: "精确 JD",
    jobId: "J100679",
    published: "2026-07-21",
    captured: "2026-07-31",
    status: "官网可访问",
    summary: "研发大模型应用系统、推理服务、工具链和数据管道，构建 RAG 与 Agent 应用。",
  },
  {
    id: "baidu-j98569",
    company: "百度",
    title: "大模型 / 多模态安全算法工程师",
    role: "AI 质量评测",
    location: "北京",
    salary: "官网未公开",
    salaryNote: "薪资以招聘方沟通为准；站内角色区间仅用于北京市场参考。",
    experience: "社招 · 硕士及以上",
    match: 74,
    keywords: ["AI 安全", "智能体", "评测", "PyTorch", "强化学习"],
    source:
      "https://talent.baidu.com/jobs/detail/SOCIAL/07db5863-f0f9-4eb7-b661-cbf87d064912",
    sourceLabel: "百度官方职位详情",
    evidenceLevel: "精确 JD",
    jobId: "J98569",
    published: "2026-07-21",
    captured: "2026-07-31",
    status: "官网可访问",
    summary: "建设大模型和智能体安全能力，并支持集团 AI 平台与应用的安全落地。",
  },
  {
    id: "baidu-j96228",
    company: "百度",
    title: "大模型算法工程师",
    role: "Agent 应用工程",
    location: "北京",
    salary: "官网未公开",
    salaryNote: "薪资以招聘方沟通为准；站内角色区间仅用于北京市场参考。",
    experience: "社招 · 硕士及以上",
    match: 76,
    keywords: ["Agent", "RAG", "后训练", "Python", "业务应用"],
    source:
      "https://talent.baidu.com/jobs/detail/SOCIAL/80dc23aa-5483-4272-afd6-851c58d107f3",
    sourceLabel: "百度官方职位详情",
    evidenceLevel: "精确 JD",
    jobId: "J96228",
    published: "2026-07-21",
    captured: "2026-07-31",
    status: "官网可访问",
    summary: "面向业务场景做文本专精模型优化，并探索 RAG、Agent 等应用方案。",
  },
  {
    id: "baidu-j15136",
    company: "小度科技",
    title: "多模态算法工程师",
    role: "多模态应用",
    location: "北京",
    salary: "官网未公开",
    salaryNote: "薪资以招聘方沟通为准；站内角色区间仅用于北京市场参考。",
    experience: "社招 · 项目落地经验优先",
    match: 82,
    keywords: ["VLM", "Prompt", "Agent", "Tool", "评测"],
    source:
      "https://talent.baidu.com/jobs/detail/SOCIAL/a77c208b-f6f0-4245-b44e-6f90f4b5e7a2",
    sourceLabel: "百度 / 小度官方职位详情",
    evidenceLevel: "精确 JD",
    jobId: "J15136",
    published: "2026-07-21",
    captured: "2026-07-31",
    status: "官网可访问",
    summary: "推动 VLM/LLM 在视觉问答、跨模态检索和内容生成中的应用与评测。",
  },
  {
    id: "baidu-j82981",
    company: "百度",
    title: "大模型应用策略算法工程师",
    role: "AI 产品前端",
    location: "北京",
    salary: "官网未公开",
    salaryNote: "薪资以招聘方沟通为准；站内角色区间仅用于北京市场参考。",
    experience: "社招 · 硕士及以上",
    match: 79,
    keywords: ["对话", "内容生成", "交互", "用户体验", "多模态"],
    source:
      "https://talent.baidu.com/jobs/detail/SOCIAL/d1881f5f-6b80-424f-9d68-5579e2572723",
    sourceLabel: "百度官方职位详情",
    evidenceLevel: "精确 JD",
    jobId: "J82981",
    published: "2026-07-21",
    captured: "2026-07-31",
    status: "官网可访问",
    summary: "负责大模型应用层算法与新型人机交互，围绕真实产品指标优化用户体验。",
  },
  {
    id: "jd-186482",
    company: "京东",
    title: "后端开发工程师（AIGC 平台）",
    role: "AI Native 全栈",
    location: "北京",
    salary: "官网未公开",
    salaryNote: "薪资以招聘方沟通为准；站内角色区间仅用于北京市场参考。",
    experience: "5 年以上 · 本科及以上",
    match: 86,
    keywords: ["AIGC", "Agent", "RAG", "平台", "高可用"],
    source: "https://zhaopin.jd.com/web/job-info-detail?requementId=186482",
    sourceLabel: "京东官方职位详情",
    evidenceLevel: "精确 JD",
    jobId: "186482",
    published: "2025-05-12",
    captured: "2026-07-31",
    status: "需打开核验",
    summary: "AIGC 平台架构与核心模块研发，覆盖 Agent、模型服务、数据处理和前端系统。",
  },
  {
    id: "jd-196343",
    company: "京东",
    title: "AI 算法工程师",
    role: "RAG 知识应用",
    location: "北京",
    salary: "官网未公开",
    salaryNote: "薪资以招聘方沟通为准；站内角色区间仅用于北京市场参考。",
    experience: "社招 · 计算机/AI 相关专业",
    match: 73,
    keywords: ["搜索", "RAG", "Agent", "知识图谱", "LLM"],
    source: "https://zhaopin.jd.com/web/job-info-detail?requementId=196343",
    sourceLabel: "京东官方职位详情",
    evidenceLevel: "精确 JD",
    jobId: "196343",
    published: "2025-07-31",
    captured: "2026-07-31",
    status: "需打开核验",
    summary: "面向搜索推荐研发 LLM、RAG、Agent、知识图谱和信息检索能力。",
  },
  {
    id: "byte-7507149279867177234",
    company: "字节跳动",
    title: "大模型应用框架研发工程师",
    role: "Agent 应用工程",
    location: "北京 / 多地",
    salary: "官网未公开",
    salaryNote: "薪资以招聘方沟通为准；站内角色区间仅用于北京市场参考。",
    experience: "校招专项 · 以官网为准",
    match: 88,
    keywords: ["大模型应用框架", "Agent", "平台", "工程化"],
    source:
      "https://jobs.bytedance.com/campus/position/7507149279867177234/detail",
    sourceLabel: "字节跳动官方职位详情",
    evidenceLevel: "精确 JD",
    jobId: "7507149279867177234",
    published: "官网未标注",
    captured: "2026-07-31",
    status: "需打开核验",
    summary: "大模型应用框架和跨平台工程方向，具体职责与城市以官网实时页面为准。",
  },
  {
    id: "byte-7508789092391569671",
    company: "字节跳动",
    title: "大模型应用算法工程师（生活服务）",
    role: "RAG 知识应用",
    location: "北京 / 上海 / 成都",
    salary: "官网未公开",
    salaryNote: "薪资以招聘方沟通为准；站内角色区间仅用于北京市场参考。",
    experience: "校招专项 · 以官网为准",
    match: 75,
    keywords: ["大模型应用", "生活服务", "RAG", "算法"],
    source:
      "https://jobs.bytedance.com/campus/position/7508789092391569671/detail",
    sourceLabel: "字节跳动官方职位详情",
    evidenceLevel: "精确 JD",
    jobId: "7508789092391569671",
    published: "官网未标注",
    captured: "2026-07-31",
    status: "需打开核验",
    summary: "生活服务大模型应用算法方向，具体职责与任职要求以官网实时页面为准。",
  },
  {
    id: "byte-7533461335213459730",
    company: "字节跳动",
    title: "大模型应用工程师（技术风险）",
    role: "AI 质量评测",
    location: "北京 / 以官网为准",
    salary: "官网未公开",
    salaryNote: "薪资以招聘方沟通为准；站内角色区间仅用于北京市场参考。",
    experience: "校招 · 以官网为准",
    match: 80,
    keywords: ["大模型应用", "技术风险", "安全", "工程化"],
    source:
      "https://jobs.bytedance.com/campus/position/7533461335213459730/detail",
    sourceLabel: "字节跳动官方职位详情",
    evidenceLevel: "精确 JD",
    jobId: "7533461335213459730",
    published: "官网未标注",
    captured: "2026-07-31",
    status: "需打开核验",
    summary: "技术风险场景的大模型应用工程职位，具体信息以官网实时页面为准。",
  },
];

const roleSalary = new Map(rolePaths.map((role) => [role.id, role.salary]));

export const officialRoleRadar: JobSignal[] = rolePaths.flatMap((role, roleIndex) =>
  companySources.map((company, companyIndex) => ({
    id: `radar-${roleIndex + 1}-${company.id}`,
    company: company.name,
    title: `${role.name}招聘雷达`,
    role: role.id,
    location: "北京（请在官网筛选）",
    salary: roleSalary.get(role.id) ?? "以招聘方为准",
    salaryNote: "角色区间来自北京同类岗位观察，不代表该公司具体职位报价。",
    experience: "请在官网按经验筛选",
    match: Math.max(70, role.fits.growing - companyIndex),
    keywords: role.keywords,
    source: company.url,
    sourceLabel: `官方招聘入口 · 建议搜索「${role.keywords.slice(0, 2).join(" / ")}」`,
    evidenceLevel: "官方招聘检索" as const,
    jobId: "—",
    published: "实时检索",
    captured: "2026-07-31",
    status: "需打开核验" as const,
    summary: `${company.team}；这是官方招聘检索任务，不伪装成独立职位。打开后请确认城市、发布时间和在招状态。`,
  })),
);

export const jobSignals: JobSignal[] = [...exactJobs, ...officialRoleRadar];

export type InterviewEvidence = {
  id: string;
  label: string;
  url: string;
  published: string;
  kind: "真实面经" | "面经汇总";
  topics: string[];
};

export const interviewEvidence: InterviewEvidence[] = [
  ["n01", "大模型算法面经｜京东", "https://www.nowcoder.com/discuss/696466506158268416", "2024-12-12", "真实面经", ["项目深挖", "RAG", "LLM", "算法"]],
  ["n02", "AI 开发 / 产品通用面经｜RAG", "https://www.nowcoder.com/discuss/857306822259060736", "2026-02-28", "面经汇总", ["RAG", "评测"]],
  ["n03", "Agent 开发面经｜阿里 / 蚂蚁 / 字节", "https://www.nowcoder.com/discuss/877151327091027968", "2026-04-24", "面经汇总", ["项目深挖", "Agent", "RAG", "可靠性", "流式 UI", "MCP"]],
  ["n04", "腾讯 / 百度大模型面经汇总", "https://www.nowcoder.com/discuss/878600528970735616", "2026-04-28", "面经汇总", ["项目深挖", "Agent", "RAG", "Python", "后端"]],
  ["n05", "快手大模型面经汇总", "https://www.nowcoder.com/discuss/882573284426932224", "2026-05-09", "面经汇总", ["项目深挖", "RAG", "Agent", "LLM", "评测"]],
  ["n06", "大模型 Agent 面试全攻略", "https://www.nowcoder.com/discuss/871718560224112640", "2026-04", "面经汇总", ["Agent", "RAG", "上下文"]],
  ["n07", "面试官视角｜AI 大模型岗全流程", "https://www.nowcoder.com/discuss/860823766656372736", "2026-03-10", "面经汇总", ["项目深挖", "Prompt", "RAG", "评测"]],
  ["n08", "AI 应用开发常见面试题 50 道", "https://www.nowcoder.com/discuss/908080887516921856", "2026-07", "面经汇总", ["Agent", "RAG", "MCP", "上下文", "安全", "LLM"]],
  ["n09", "字节大模型算法面经分享", "https://www.nowcoder.com/feed/main/detail/84f8d10f0b994be6aeeea786b63070d9", "2026-03-15", "真实面经", ["项目深挖", "LLM", "算法"]],
  ["n10", "阿里淘工厂大模型一面", "https://www.nowcoder.com/feed/main/detail/d553eddb3de84dff87496a440f370f3b", "2025-12-11", "真实面经", ["项目深挖", "LLM", "Agent", "评测"]],
  ["n11", "阿里算法面经（已 OC）", "https://www.nowcoder.com/feed/main/detail/e0f2796280284250ac11ec39c0d10610", "2023-09-21", "真实面经", ["项目深挖", "LLM", "算法"]],
  ["n12", "理想汽车大模型面经", "https://www.nowcoder.com/feed/main/detail/6b0d7eee6bbc416b9bbdff47270cdda7", "2025-10", "真实面经", ["项目深挖", "RAG", "LLM", "评测"]],
  ["n13", "腾讯混元大模型面经", "https://www.nowcoder.com/feed/main/detail/49da5905094e4501aaf1301078e1d228", "2025-04-24", "真实面经", ["项目深挖", "LLM", "算法"]],
  ["n14", "滴滴大模型面经", "https://www.nowcoder.com/feed/main/detail/33d030dffa85446693b54eea9517e059", "2026", "真实面经", ["LLM", "评测"]],
  ["n15", "阿里 AI Agent 解决方案一面", "https://www.nowcoder.com/feed/main/detail/6824ff169697496fbf261f8158276780", "2026-02-02", "真实面经", ["Agent", "MCP", "LLMOps"]],
  ["n16", "字节 AI 应用后端一二三面", "https://www.nowcoder.com/feed/main/detail/82d633b7a0954b6283059e5c3f5fb402", "2026-04-01", "真实面经", ["Agent", "上下文", "项目深挖", "算法"]],
  ["n17", "字节 AI 应用开发一面", "https://www.nowcoder.com/feed/main/detail/3e22dc2df03d4227ab70ea9c2d896086", "2026-07-14", "真实面经", ["项目深挖", "Agent", "上下文", "可靠性"]],
  ["n18", "百度大模型后端（千帆组）", "https://www.nowcoder.com/feed/main/detail/29eeea466acd4d3381fa57f212d443cf", "2024-07-21", "真实面经", ["项目深挖", "后端", "算法"]],
  ["n19", "腾讯 TEG 大模型算法面经", "https://www.nowcoder.com/feed/main/detail/962171d1693c48df8e0573cf466bedf2", "2024", "真实面经", ["RAG", "LLM", "算法"]],
  ["n20", "淘天多模态算法实习面经", "https://www.nowcoder.com/feed/main/detail/acc9278989d341bb88065f4b65e2b2fa", "2026-03-27", "真实面经", ["多模态", "项目深挖", "评测"]],
  ["n21", "阿里淘天 AI Agent 二面", "https://www.nowcoder.com/feed/main/detail/a8cce58f881d4304b2b994b704069724", "2026-07", "真实面经", ["RAG", "评测", "LLM", "算法"]],
  ["n22", "字节 Agent 开发二面", "https://www.nowcoder.com/feed/main/detail/eccea78e38b447c9a3ae73570c5d00b6", "2026-07-18", "真实面经", ["项目深挖", "Agent", "上下文", "MCP", "RAG"]],
  ["n23", "商汤研究院多模态算法面经", "https://www.nowcoder.com/feed/main/detail/a84b8c9f8f57404489ac11a9ccb562a8", "2026", "真实面经", ["多模态", "LLM", "算法"]],
  ["n24", "AI 应用开发面经（青岛）", "https://www.nowcoder.com/feed/main/detail/608db09326b64fb2baca67168e7665b4", "2026-05-15", "真实面经", ["Agent", "RAG", "LLM", "Python"]],
  ["n25", "字节多模态搜索算法面经", "https://www.nowcoder.com/feed/main/detail/67312a5472be4f85812eed8c9a67dffa", "2026-03-31", "真实面经", ["多模态", "LLM", "算法"]],
  ["n26", "第四范式 Agent 开发实习面经", "https://www.nowcoder.com/feed/main/detail/77a81a03b55143c89d1caf76833676d9", "2026-03-13", "真实面经", ["项目深挖", "Agent", "上下文", "可靠性", "MCP"]],
  ["n27", "字节后端 Agent 开发实习一面", "https://www.nowcoder.com/feed/main/detail/d73020680b3b42c3ac579e2f25721d90", "2026-04-19", "真实面经", ["项目深挖", "RAG", "上下文", "MCP", "算法"]],
  ["n28", "教育行业 Agent 开发面经", "https://www.nowcoder.com/feed/main/detail/505159fb5f874d909c0c252f3f959ea0", "2026-04-09", "真实面经", ["项目深挖", "RAG", "流式 UI", "后端"]],
  ["n29", "蚂蚁后端一面（含 AI）", "https://www.nowcoder.com/feed/main/detail/1eac2e754a8d4160a47f95bbb787e3c6", "2026-04-21", "真实面经", ["Agent", "RAG", "MCP", "后端", "算法"]],
  ["n30", "美团大模型算法一面", "https://www.nowcoder.com/feed/main/detail/82c63a9ff6804eef8b28321436e9f10f", "2024-09-23", "真实面经", ["项目深挖", "RAG", "评测", "多模态"]],
  ["n31", "美团搜推大模型面经", "https://www.nowcoder.com/feed/main/detail/c98cd7825bb443378e31ee820e8c14f5", "2025-11-11", "真实面经", ["项目深挖", "LLM", "算法"]],
  ["n32", "美团大模型算法完整面经", "https://www.nowcoder.com/feed/main/detail/b264abf14d4d4c44bc022c9ea1dce981", "2026-07-05", "真实面经", ["Agent", "上下文", "LLM", "评测", "算法"]],
  ["n33", "小米 AI Agent 一面", "https://www.nowcoder.com/feed/main/detail/118907dfa4854f338e22c0a6b8ff7fca", "2026-03-25", "真实面经", ["项目深挖", "Agent", "LLM"]],
  ["n34", "20 家 AI Agent 岗真题", "https://www.nowcoder.com/feed/main/detail/7b0ba42afd27491aa3611607f6015651", "2026-07-10", "面经汇总", ["Agent", "RAG", "安全", "项目深挖"]],
  ["n35", "AI Agent 应用开发一面", "https://www.nowcoder.com/feed/main/detail/416c3118a9c84fe0a43dc00f9eb9bec2", "2026-03-03", "真实面经", ["项目深挖", "Agent", "上下文", "MCP", "多模态"]],
  ["n36", "美团到店大模型算法面经", "https://www.nowcoder.com/feed/main/detail/11261a3d1837435c8075a67cd8991fce", "2026", "真实面经", ["安全", "LLM", "RAG", "MCP", "算法"]],
  ["n37", "快手大模型算法面经", "https://www.nowcoder.com/feed/main/detail/9d24592752804d2790557f81230df62d", "2025-11-11", "真实面经", ["LLM", "算法"]],
  ["n38", "商汤大模型算法应用实习面经", "https://www.nowcoder.com/feed/main/detail/2762070c2c52472da06bf9ee59518d79", "2026-07-18", "真实面经", ["项目深挖", "RAG", "Agent", "多模态", "算法"]],
  ["n39", "大模型应用开发面经（5 年经验）", "https://www.nowcoder.com/feed/main/detail/129eaa1c20444651ac3b932e200d3da4", "2025-07-27", "真实面经", ["项目深挖", "Agent", "RAG", "MCP", "可靠性", "评测", "后端"]],
  ["n40", "快手大模型应用面经", "https://www.nowcoder.com/feed/main/detail/13208853f0324dcea5d3c081933bf5da", "2024-08-14", "真实面经", ["项目深挖", "RAG", "LLM"]],
  ["n41", "字节大模型应用算法三面", "https://www.nowcoder.com/feed/main/detail/0e879c4d37b14065b43b6643eb4c7ebf", "2026-04-01", "真实面经", ["RAG", "上下文", "LLM", "后端", "算法"]],
  ["n42", "AI 全栈实习一面", "https://www.nowcoder.com/feed/main/detail/1323d3769e6d415c91e062da3dd3fb87", "2026-07", "真实面经", ["项目深挖", "RAG", "后端"]],
  ["n43", "南京 AIGC 实习面经", "https://www.nowcoder.com/feed/main/detail/76dfdb7cc6d64ccfa189255750957c99", "2026", "真实面经", ["项目深挖", "后端", "算法"]],
  ["n44", "京东科技 AI 全栈 Agent 一面", "https://www.nowcoder.com/feed/main/detail/e80b257b1c064970a72c9679c2177585", "2026", "真实面经", ["项目深挖", "Agent", "上下文", "可靠性", "后端"]],
  ["n45", "淘天 AI Agent 一面", "https://www.nowcoder.com/feed/main/detail/a00f89eb057d4476bd67f3b24679cdb8", "2026", "真实面经", ["Agent", "上下文", "MCP", "可靠性"]],
  ["n46", "阿里 AI Agent 应用开发一面", "https://www.nowcoder.com/feed/main/detail/2a62a9d9e4f84613af9c3d2c602554ca", "2026-07", "真实面经", ["项目深挖", "Agent", "RAG", "MCP", "可靠性", "多模态"]],
  ["n47", "大模型应用开发题单", "https://www.nowcoder.com/feed/main/detail/2c454e8f9e8044d39c5c930e23efa0ac", "2026", "面经汇总", ["LLM", "RAG"]],
  ["n48", "大模型面经话题合集", "https://www.nowcoder.com/creation/subject/8603768d1f224b6bbaa48c6b32880a1a", "持续更新", "面经汇总", ["项目深挖", "LLM", "RAG", "算法"]],
  ["n49", "Agent 开发 80 道面试题", "https://www.nowcoder.com/discuss/867373725035872256", "2026", "面经汇总", ["Agent", "RAG", "MCP", "可靠性"]],
  ["n50", "真实 Coding Agent 项目复盘", "https://www.nowcoder.com/discuss/904745058161782784", "2026", "真实面经", ["项目深挖", "Agent", "安全", "上下文"]],
].map(([id, label, url, published, kind, topics]) => ({
  id: id as string,
  label: label as string,
  url: url as string,
  published: published as string,
  kind: kind as InterviewEvidence["kind"],
  topics: topics as string[],
}));

const questionTopics: Record<number, string[]> = {
  1: ["项目深挖"],
  2: ["RAG"],
  3: ["Agent"],
  4: ["可靠性"],
  5: ["评测"],
  6: ["流式 UI"],
  7: ["上下文"],
  8: ["安全"],
  9: ["后端", "可靠性"],
  10: ["项目深挖"],
  11: ["MCP"],
  12: ["LLM"],
  13: ["流式 UI", "后端"],
  14: ["算法"],
};

export const tracedQuestions: QuestionV3[] = baseQuestions.map((question) => {
  const topics = questionTopics[question.id] ?? [question.category];
  const matchedSources = interviewEvidence.filter((source) =>
    topics.some((topic) => source.topics.includes(topic)),
  );
  return {
    ...question,
    frequency: matchedSources.length,
    sourceIds: matchedSources.map((source) => source.id),
  };
});
