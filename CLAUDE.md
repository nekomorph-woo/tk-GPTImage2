# tk_GPTImage2 — GPT Image 2 研究与生图实验室

所有面向用户的说明、研究笔记、提示词手册、模板、评估记录使用**简体中文**编写。命令、文件名、参数名、模型名、环境变量名、JSON 键名和代码标识符保留英文。

## 前置条件

1. Node.js >= 20 已安装
2. 项目根目录下已执行 `npm install`（安装 openai SDK）
3. `.env` 已根据 `.env.example` 创建并设置 `OPENAI_API_KEY`

## 技能总览

```
┌─────────────────────────────────────────────────────────────┐
│                    tk_GPTImage2                              │
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────────┐   │
│  │ /generate-    │  │ /image-       │  │ /collect-image │   │
│  │ image         │  │ research      │  │ -2-prompt      │   │
│  │               │  │               │  │                │   │
│  │ gen/          │  │ research/     │  │ collected/     │   │
│  └───────┬───────┘  └───────┬───────┘  └───────┬────────┘   │
│          │                  │                  │            │
│          └──────────┬───────┘                  │            │
│                     │                          │            │
│              ┌──────┴──────┐                   │            │
│              │  共享资源    │                   │            │
│              │ prompts/    │                   │            │
│              │ recipes/    │                   │            │
│              │ GRIMOIRE    │                   │            │
│              └─────────────┘                   │            │
└─────────────────────────────────────────────────────────────┘
```

## /generate-image — 生图助手

单张生成、批量实验、Codex CLI 生图（无需 API Key，消耗 ChatGPT Plus 额度）。

**工作空间**：`gen/`

| 目录 | 用途 |
|------|------|
| `gen/experiments/` | 用户创建的实验矩阵 JSON（模板在 skill 的 references/ 下） |
| `gen/outputs/` | API 和 Codex CLI 生成的图片和 metadata（按时间戳+名称分子目录） |

**共享资源**（构造提示词时按优先级参考）：

1. `prompts/prompt-cards/` — 可复用提示词卡片
2. `recipes/recipes.json` — 稳定风格套路
3. `prompts/PROMPT_FRAMEWORK.md` — 标准提示词结构
4. `prompts/NEGATIVE_CONSTRAINTS.md` — 失败规避短语
5. `GPT_IMAGE2_GRIMOIRE.zh-CN.md` — 完整魔导书

## /image-research — 提示词研究

收集公开研究来源、创建研究笔记队列、列出提示词套路、运行项目健康检查。

**工作空间**：`research/`

| 目录 | 用途 |
|------|------|
| `research/sources/` | 公开研究来源列表（JSON） |
| `research/studies/` | 研究笔记和案例拆解 |
| `research/studies/collections/` | collect 脚本生成的队列 |

**共享资源**：

- `prompts/REVIEW_RUBRIC.md` — 图片评分标准（7 维度 1-5 分）
- `recipes/recipes.json` — 研究成果沉淀为稳定套路
- `prompts/prompt-cards/` — 研究成果提取为可复用卡片

**研究工作流**：收集来源 → 逐个研究 → 拆解结构 → 提取 recipe → 保存笔记 → 更新共享资源 → 运行 doctor 验证

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
| `prompts/REVIEW_RUBRIC.md` | 图片评分标准 | image-research |
| `prompts/prompt-cards/` | 可复用提示词卡片 | generate-image, image-research |
| `recipes/recipes.json` | 稳定风格套路 | generate-image, image-research |
| `GPT_IMAGE2_GRIMOIRE.zh-CN.md` | 完整提示词魔导书 | generate-image, image-research |

## 数据策略

- 优先保存来源 URL、提示词结构和分析笔记，不默认下载大量公开图片
- API 生成图片放到 `gen/outputs/`
- Codex CLI 生成图片放到 `gen/outputs/`（metadata 中 `source: "codex-cli"`）
- 不打印、不提交 API key。`.env` 是本地文件，已被忽略
- 对第三方图片和提示词，提炼结构和规律，不长段逐字复制

## 评估循环

```text
收集公开案例 → 拆解视觉结构 → 提取提示词套路 → 创建提示词变体
→ 生成测试批次 → 按评分表评估 → 修订提示词 → 沉淀稳定模式
```

不要因为某一次输出好看就把它视为稳定套路。只有经过受控变体测试，或结构上明显可复用时，才提升为 recipe。
