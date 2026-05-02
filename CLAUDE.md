# tk_GPTImage2 — GPT Image 2 研究与生图实验室

所有面向用户的说明、研究笔记、提示词手册、模板、评估记录使用**简体中文**编写。命令、文件名、参数名、模型名、环境变量名、JSON 键名和代码标识符保留英文。

## 前置条件

1. Node.js >= 20 已安装
2. 项目根目录下已执行 `npm install`（安装 openai SDK）
3. `.env` 已根据 `.env.example` 创建并设置 `OPENAI_API_KEY`

## 技能总览

```
┌──────────────────────────────────────────────────────────────────┐
│                         tk_GPTImage2                              │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ /generate-   │  │ /controlled- │  │ /image-      │           │
│  │ image        │  │ experiment   │  │ research     │           │
│  │ (纯生图)     │  │ (受控实验)   │  │ (主题研究)   │           │
│  │              │  │              │  │              │           │
│  │ gen/outputs/ │  │ experiments/ │  │ research/    │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                    │
│         │    ┌────────────┼────────────┐    │                    │
│         │    │ image-runner agent      │    │                    │
│         └────┤ evaluator agent         ├────┘                    │
│              │ (共享 subagents)        │                         │
│              └────────────┬────────────┘                         │
│                           │                                     │
│                   ┌───────┴───────┐                             │
│                   │  共享资源      │                             │
│                   │ prompts/      │                             │
│                   │ recipes/      │                             │
│                   │ GRIMOIRE      │                             │
│                   └───────────────┘                             │
└──────────────────────────────────────────────────────────────────┘
```

## /generate-image — 生图助手

单张生成（API）、Codex CLI 生图（无需 API Key，消耗 ChatGPT Plus 额度）。

**工作空间**：`gen/`

| 目录 | 用途 |
|------|------|
| `gen/outputs/` | API 和 Codex CLI 生成的图片和 metadata（按时间戳+名称分子目录） |

**共享资源**（构造提示词时按优先级参考）：

1. `recipes/` — 稳定风格套路（每个套路一个 .md 文件，draft 或 confirmed）
2. `prompts/PROMPT_FRAMEWORK.md` — 标准提示词结构
3. `prompts/NEGATIVE_CONSTRAINTS.md` — 失败规避短语
4. `GPT_IMAGE2_GRIMOIRE.zh-CN.md` — 完整魔导书

## /image-research — 提示词研究

按主题研究 GPT Image 2 提示词技巧，从信息源收集 prompt，分析结构，提取 recipe，生图验证并自动评分。

**工作空间**：`research/`

| 目录 | 用途 |
|------|------|
| `research/sources/` | 信息源注册表（JSON，URL 和本地目录） |
| `research/studies/` | 按主题分目录的研究会话（`<date>-<topic>/`） |

每次研究创建独立目录：`research/studies/<date>-<topic>/`，内含 `collections/`（收集素材）、`report.md`（研究报告）、`evaluation.json`（评分结果）。

**共享资源**：

- `prompts/REVIEW_RUBRIC.md` — 图片评分标准（7 维度 1-5 分）
- `recipes/` — 研究成果沉淀为稳定套路

**研究工作流**：创建研究目录 → 从信息源收集素材 → 拆解结构 → 提取 recipe → 生图验证（委派 image-runner）→ 自动评分 → 保存报告 → 更新 recipes/

## /controlled-experiment — 受控变量实验

自动设计实验矩阵、批量生图、自动评分、对比分析、输出结论。

**工作空间**：`experiments/`

| 目录 | 用途 |
|------|------|
| `experiments/` | 实验产出（矩阵、评分、报告），按 `<YYYY-MM-DD>-<slug>` 分目录 |

**工作流**：理解意图 → 设计矩阵 → 委派 image-runner 生图 → 委派 evaluator 评分 → 对比分析 → 输出结论

## /collect-image-2-prompt — 外部 Prompt 收集

在 X 上搜索 GPT Image 2 的提示词并收集整理，支持 Ralph Loop 批量执行。

**工作空间**：`collected/`

| 目录 | 用途 |
|------|------|
| `collected/` | 从 X 等平台收集的结构化 prompt（按编号命名） |

## 共享资源

| 路径 | 用途 | 使用方 |
|------|------|--------|
| `prompts/PROMPT_FRAMEWORK.md` | 标准提示词结构 | generate-image, image-research |
| `prompts/NEGATIVE_CONSTRAINTS.md` | 失败规避短语 | generate-image, image-research |
| `prompts/REVIEW_RUBRIC.md` | 图片评分标准 | image-research, controlled-experiment |
| `recipes/` | 稳定风格套路（draft / confirmed） | generate-image, image-research |
| `GPT_IMAGE2_GRIMOIRE.zh-CN.md` | 完整提示词魔导书 | generate-image, image-research |

## 数据策略

- 优先保存来源 URL、提示词结构和分析笔记，不默认下载大量公开图片
- API 生成图片放到 `gen/outputs/`
- Codex CLI 生成图片放到 `gen/outputs/`（metadata 中 `source: "codex-cli"`）
- 实验矩阵、评分、报告放到 `experiments/`
- 不打印、不提交 API key。`.env` 是本地文件，已被忽略
- 对第三方图片和提示词，提炼结构和规律，不长段逐字复制

## 评估循环

image-research 的核心工作流（步骤 1-9）即为完整的评估循环，详见 `/image-research`。不要因为某一次输出好看就把它视为稳定套路。只有经过受控变体测试且自动评分达标，或结构上明显可复用时，才提升为 recipe。
