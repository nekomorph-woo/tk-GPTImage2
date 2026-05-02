---
name: image-research
description: 按主题研究 GPT Image 2 提示词技巧，收集信息源数据，自动评分验证，沉淀稳定套路。Use when 用户要求"研究..."、"分析提示词..."、"哪些 recipe..."、"健康检查..."。
---

# 提示词研究

按主题驱动的研究技能：确定方向 → 收集 prompt → 分析结构 → 提取 recipe → 生图验证 → 自动评分 → 沉淀。

## 前置检查

```bash
node .claude/skills/image-research/scripts/doctor.mjs
```

## 架构

```
scripts/
├── doctor.mjs        ← 项目健康检查
└── lib/              ← 通用工具（args, env）
references/
├── analysis-guide.md ← 8 维分析 + 多轮评分格式
├── collection-template.md ← 收集素材模板
└── research-template.md ← 报告模板
agents/（.claude/agents/）
├── collector.md      ← 素材收集 agent（步骤 2 委派）
└── analyst.md        ← 素材分析 agent（步骤 3 委派）
```

## 工作流

用户启动研究后，执行 10 个步骤。

### 步骤 0：确定研究方向

- 分析用户输入，理解研究意图
- 扫描现有 `recipes/`（哪些风格已有 confirmed recipe，哪些是空白）
- 扫描 `collected/`（最近收集了哪些风格的素材但尚未研究）
- 结合 `GPT_IMAGE2_GRIMOIRE.zh-CN.md` 的八大流派，识别覆盖缺口
- 使用 AskUserQuestion 向用户推荐 5 个研究方向（含选题理由），用户可选择推荐项或自行输入
- 确定研究方向后，作为元信息写入后续步骤 1 的 `report.md` 头部

推荐方向的生成依据：

| 依据 | 示例 |
|------|------|
| recipes/ 空白流派 | "写实摄影流派尚无 confirmed recipe" |
| collected/ 未研究素材 | "collected/ 中有 8 条动画风格素材待研究" |
| 魔导书流派覆盖 | "八大流派中 3D 图标与小物件无 recipe" |
| 用户历史兴趣 | 基于本次输入推断的关注领域 |
| 当前热门趋势 | WebSearch 近期 GPT Image 2 社区讨论热点 |

### 步骤 1：创建研究目录

- 解析确定的研究方向，生成 slug（kebab-case）
- 创建 `research/studies/<YYYY-MM-DD>-<slug>/`，内含 `collections/` 和 `evaluations/` 子目录
- 按 [references/research-template.md](references/research-template.md) 初始化 `report.md`，**头部元信息**包含：研究方向、选择理由、涉及信息源、日期

### 步骤 2：收集素材（委派 collector agent）

使用 Agent 工具将素材收集任务委派给 collector agent（`.claude/agents/collector.md`），避免大量收集操作占用主流程上下文。

**委派消息**必须包含以下参数：

| 参数 | 值 |
|------|-----|
| `topic` | 步骤 0 确定的研究方向 |
| `study_dir` | 步骤 1 创建的研究目录绝对路径 |
| `collections_dir` | `collections/` 子目录绝对路径 |
| `min_guide` | 1 |
| `min_prompt` | 40 |

**collector agent 职责**（详见 `.claude/agents/collector.md`）：
- 读取 `research/sources/*.json` 获取所有信息源
- 外部 URL：WebSearch + WebFetch 获取；失败时返回需 bb-browser 回退的 URL 列表
- 本地目录（如 `collected/`）：扫描相关文件
- 按素材类型差异化收集：guide 提炼指导要点，prompt 保留原文
- 每条素材拷贝到 `collections/`，标注来源、类型、可信度
- 完成后返回收集统计（guide 数量、prompt 数量、使用的信息源）

**主流程职责**：
- 发送委派消息，等待 collector agent 返回结果
- 检查 `fallback_needed`：如为 true，使用 bb-browser 回退收集 agent 标记的失败 URL（主流程执行，因 bb-browser 需要交互式浏览器操作）
- 验证收集数量是否达标（guide ≥ 1，prompt ≥ 40）
- 如不达标，可再次委派 collector 补充收集

### 步骤 3：分析结构（委派 analyst agent）

使用 Agent 工具将素材分析任务委派给 analyst agent（`.claude/agents/analyst.md`），避免大量分析结果占用主流程上下文。

**委派消息**必须包含以下参数：

| 参数 | 值 |
|------|-----|
| `topic` | 步骤 0 确定的研究方向 |
| `study_dir` | 步骤 1 创建的研究目录绝对路径 |
| `collections_dir` | `collections/` 子目录绝对路径 |
| `report_path` | `report.md` 的绝对路径 |

**analyst agent 职责**（详见 `.claude/agents/analyst.md`）：
- 读取 `collections/` 中所有素材文件
- guide 类型 → 提炼核心原则、技巧模式、反面案例、可操作项 → 写入 `report.md` 的「来源」章节
- prompt 类型 → 按 8 维度逐条拆解（主体清晰度、构图策略、风格锚点、光线描述、材质细节密度、色彩策略、文字规则、失败规避）→ 写入 `report.md` 的「提示词结构拆解」章节
- 所有分析结论交叉引用素材编号（如 `[02]`、`[05-08]`）
- 完成后返回分析统计（分析数量、关键发现、识别的 pattern 数量）

**主流程职责**：
- 发送委派消息，等待 analyst agent 返回结果
- 检查 `report.md` 是否已正确写入「来源」和「提示词结构拆解」章节
- 审阅 analyst 返回的 `key_findings`，为步骤 4 提取 recipe 做准备

### 步骤 4：提取 recipe

- 从分析结果中识别**结构上可复用**的 pattern
- 仅当 pattern 明显可复用时才提取，不因单次效果好就提取
- 按 [recipes/TEMPLATE.md](../../recipes/TEMPLATE.md) 格式写入 `recipes/<name>.md`，状态为 draft

### 步骤 5：生图验证

- 选择一个与主题相关的**具体测试主体**填充 recipe 结构，生成测试提示词
- 使用 Agent 工具委派 `image-runner`（`.claude/agents/image-runner.md`）执行生图
- **委派消息**必须包含：`mode`（api 或 codex）、`tasks`（含 prompt、name、size、n）、`project_root`
- 生成 2-4 张测试图，图片保存到 `gen/outputs/` 下

### 步骤 6：自动评分

- 使用 Read 工具或 MCP 读图工具读取生成的图片，按 `prompts/REVIEW_RUBRIC.md` 的 7 个维度（1-5 分）评分
- 首轮 `stability` 记为 null，后续轮次可根据复现情况打分
- 评分结果写入 `evaluations/round-<N>.json`（格式见 [references/analysis-guide.md](references/analysis-guide.md)）

### 步骤 7：修订或确认

- **通过标准**：每个已评维度 ≥ 3 分，且总分 / 满分 ≥ 70%（首轮 ≥ 21/30，后续 ≥ 25/35）
- 通过 → 进入步骤 8
- 未通过 → 修订提示词（**一次只改一个变量**：光线、构图、色彩、材质或文字），返回步骤 5，下一轮评分写入 `round-<N+1>.json`
- 最多修订 3 轮，仍不通过则记录失败原因，保持 draft

### 步骤 8：保存报告

- 补全 `report.md` 所有章节：来源、发现、提示词结构拆解、提取的 pattern、验证结果、结论
- 引用 `evaluations/` 下各轮评分数据
- 结论中明确：哪些确认有效、哪些需要进一步验证

### 步骤 9：更新 recipes/

- **通过验证**：在 `recipes/<name>.md` 的「验证记录」章节添加日期、结论和引用，状态提升为 confirmed
- **未通过验证**：保持 draft，在验证记录中注明失败原因和改进建议

### 步骤 10：更新研究方向索引

- 检查本次研究是否补全了某个流派空白，如有，记录到 `research/coverage.md`（如不存在则创建）
- 为下一次步骤 0 提供更准确的覆盖缺口分析

## 共享资源

| 路径 | 用途 |
|------|------|
| `research/sources/*.json` | 信息源注册表 |
| `prompts/REVIEW_RUBRIC.md` | 评分标准（7 维度 1-5 分） |
| `prompts/PROMPT_FRAMEWORK.md` | 提示词结构 |
| `prompts/NEGATIVE_CONSTRAINTS.md` | 失败规避 |
| `recipes/` | 稳定套路（draft / confirmed） |
| `.claude/agents/collector.md` | 素材收集 subagent（步骤 2） |
| `.claude/agents/analyst.md` | 素材分析 subagent（步骤 3） |

## 约束

1. **提炼而非照搬** — 提炼结构和规律，不长段逐字复制
2. **可复用性门槛** — 经过受控变体测试或结构明显可复用时才提升为 recipe
3. **保存优先** — 研究成果写入文件，不只留在对话里
4. **来源标注** — 每条研究笔记标注来源和可信度
5. **区分事实与推断** — 明确哪些是观察到的事实，哪些是推断
6. **一次一变量** — 修订时每次只改一个变量，便于定位效果来源
7. **subagent 委派** — 步骤 2（收集）和步骤 3（分析）必须委派给对应 subagent 执行，主流程只负责编排和监督
8. **上下文隔离** — subagent 在独立上下文中运行，主流程不直接读取大量素材内容，只接收 agent 返回的统计摘要
