---
name: controlled-experiment
description: 受控变量实验助手。自动设计实验矩阵、执行生图、评分、对比分析、输出结论。Use when 用户要求"A/B 测试"、"对比..."、"实验..."、"哪个更好"、"变量测试"、"controlled experiment"。
---

# 受控变量实验

全自动实验闭环：理解意图 → 设计矩阵 → 执行生图 → 自动评分 → 对比分析 → 输出结论。

## 架构

```
.claude/skills/controlled-experiment/
└── references/
    └── experiment-report-template.md ← 实验报告模板

.claude/agents/
├── image-runner.md ← 通用批量生图 agent（步骤 2 委派）
└── evaluator.md    ← 图片评分 agent（步骤 3 委派）

共享资源（只读引用）：
├── generate-image/scripts/api.mjs      ← API 生图执行
├── generate-image/scripts/codex.mjs    ← Codex 生图执行
├── generate-image/references/prompt-guide.md ← 提示词构造
├── prompts/REVIEW_RUBRIC.md            ← 7 维评分标准
└── gen/outputs/                        ← 生图输出（只读引用）
```

## 前置检查

确认用户是否有 API 预算：
- 有预算 → `mode: api`
- 无预算 → `mode: codex`（消耗 ChatGPT Plus 额度，固定输出 1254x1254）

## 工作空间

所有实验产出保存到 `experiments/<YYYY-MM-DD>-<slug>/`：

| 文件 | 用途 |
|------|------|
| `matrix.json` | 实验矩阵（base + runs） |
| `evaluation.json` | 评分结果（evaluator agent 输出） |
| `report.md` | 实验报告（假设 → 矩阵 → 评分 → 分析 → 结论） |

## 工作流

用户启动实验后，执行 6 个步骤。

### 步骤 0：理解实验意图

- 解析用户自然语言输入，提取：
  - **实验假设**：用户想验证什么（如"暖光比冷光更有高级感"）
  - **变量维度**：要对比的是什么（如光线色温）
  - **变量值**：具体的对比组（如暖光、冷光）
  - **测试主体**：用什么场景/物体来测试（如哑光黑色无线音箱）
- 使用 AskUserQuestion 向用户确认/修正解析结果
- 确认后进入步骤 1

### 步骤 1：设计实验矩阵

根据实验意图，按类型选择矩阵结构：

#### 单变量 A/B 测试

`base` 包含完整主体描述 + 固定维度，每个 `run` 只改变一个变量值：

```json
{
  "base": {
    "prompt": "创建一张高级产品海报：[主体描述]。\n构图：[固定构图]。\n色彩：[固定色彩]。",
    "size": "1024x1024",
    "n": 1
  },
  "runs": [
    { "name": "axis-lighting-warm", "prompt": "光线：暖色台灯，色温 3200K，柔和阴影。" },
    { "name": "axis-lighting-cool", "prompt": "光线：冷色自然光，色温 6500K，清晰阴影。" }
  ]
}
```

#### 多风格快速对比

`base` 只有默认参数，每个 `run` 携带完整独立 prompt：

```json
{
  "base": { "size": "1024x1024", "n": 1 },
  "runs": [
    { "name": "cinematic-grounded", "prompt": "创建一张电影剧照：..." },
    { "name": "premium-product", "prompt": "创建一张高级产品海报：..." },
    { "name": "chinese-editorial", "prompt": "创建一张竖版中文编辑海报：..." }
  ]
}
```

**提示词构造**：参考 `generate-image/references/prompt-guide.md` 的核心公式（格式 → 主体 → 构图 → 风格 → 光线 → 材质 → 色彩 → 文字 → 质量约束）。

**命名规范**：`axis-<变量名>-<值>`（单变量测试）或 `<风格>-<场景>`（多风格对比）。

**保存**：matrix JSON 写入 `experiments/<YYYY-MM-DD>-<slug>/matrix.json`。

### 步骤 2：执行生图（委派 image-runner agent）

将 matrix 的 runs 转为 image-runner 的 tasks 格式：

- `base.prompt` 和 `run.prompt` 用 `\n\n` 拼接
- `size`、`n` 等 run 优先，fallback 到 base
- 使用 Agent 工具委派给 `image-runner`（`.claude/agents/image-runner.md`）

**委派消息**：
```json
{
  "mode": "<api|codex>",
  "tasks": [
    { "prompt": "base.prompt + run.prompt", "name": "run.name", "size": "...", "n": 1 },
    ...
  ],
  "project_root": "/绝对路径"
}
```

**主流程职责**：
- 等待 image-runner 返回结果
- 检查 `failed` 列表，如有失败任务，可再次委派重试
- 收集所有 `completed` 任务的图片路径，传递给步骤 3

### 步骤 3：自动评分（委派 evaluator agent）

使用 Agent 工具委派给 `evaluator`（`.claude/agents/evaluator.md`）。

**委派消息**：
```json
{
  "images": [
    { "name": "run.name", "file": "/abs/path/to/gen/outputs/.../01.png" },
    ...
  ],
  "rubric_path": "/abs/path/to/prompts/REVIEW_RUBRIC.md",
  "output_path": "/abs/path/to/experiments/<date>-<slug>/evaluation.json",
  "experiment": "实验名称",
  "project_root": "/abs路径"
}
```

**主流程职责**：
- 等待 evaluator 返回结果
- 确认 `evaluation.json` 已写入

### 步骤 4：对比分析

读取 `evaluation.json`，执行跨 run 对比分析：

- **总分排名**：哪个 run 得分最高
- **维度级对比**：每个维度上各 run 的分数差异
- **关键差异识别**：哪个维度上差异最大（说明该变量对效果影响最大）
- **胜出组合**：综合得分最高的变量值

分析示例：
```
暖光在材质质量(4 vs 3)和商业可用性(4 vs 2)上明显优于冷光。
构图方面两者持平(3 vs 3)。
冷光在提示词遵循度上略高(5 vs 4)。
结论：暖光更符合"高级感"假设。
```

### 步骤 5：输出结论

按 [references/experiment-report-template.md](references/experiment-report-template.md) 格式保存实验报告到 `experiments/<YYYY-MM-DD>-<slug>/report.md`。

报告必须包含：
1. 实验假设（来自步骤 0）
2. 实验矩阵摘要（引用 matrix.json）
3. 评分结果（引用 evaluation.json）
4. 对比分析（来自步骤 4）
5. 结论：假设是否成立
6. 改进建议：如有，下一步实验方向

## 共享资源

| 路径 | 用途 |
|------|------|
| `generate-image/references/prompt-guide.md` | 提示词构造公式 |
| `prompts/REVIEW_RUBRIC.md` | 7 维评分标准 |
| `.claude/agents/image-runner.md` | 批量生图 agent |
| `.claude/agents/evaluator.md` | 图片评分 agent |

## 约束

1. **一次一变量** — 单变量测试中每个 run 只改变一个维度
2. **生图委派** — 步骤 2 必须委派 image-runner agent，主流程不直接调用脚本
3. **评分委派** — 步骤 3 必须委派 evaluator agent，主流程不直接读图评分
4. **结论有据** — 所有结论必须引用评分数据，不凭主观判断
5. **保存优先** — 实验矩阵、评分、报告全部写入文件
6. **不显示图片** — 只报告文件路径，不展示图片内容
