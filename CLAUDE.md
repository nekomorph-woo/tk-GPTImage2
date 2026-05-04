# tk_GPTImage2 — GPT Image 2 研究与生图实验室

所有面向用户的说明使用**简体中文**。命令、文件名、参数名、环境变量名、代码标识符保留英文。

## 项目概述

GPT Image 2 提示词研究与生图实验室。围绕 Claude Code 的技能（Skills）和子代理（Agents）构建，覆盖提示词收集、构造、研究、生图验证、受控实验的全流程。

技术栈：Node.js >= 20（ESM）、OpenAI SDK、Codex CLI、Claude Code。

## 技能与子代理

8 个技能定义在 `.claude/skills/`，各有独立 `SKILL.md`。4 个共享子代理定义在 `.claude/agents/`。

| 技能 | 触发场景 |
|------|----------|
| `/generate-image` | 用户要求生成图片 |
| `/iwanna-image-prompt` | 用户需要帮忙构造提示词 |
| `/image-research` | 用户要求研究提示词技巧 |
| `/controlled-experiment` | 用户要求 A/B 测试、变量对比 |
| `/collect-image-2-prompt` | 用户要求从 X 平台收集提示词 |
| `/image-to-prompt` | 用户提供 X 博文链接要求反推提示词 |
| `/x-to-prompt` | 用户提供 X 推文链接要求提取其中的 prompt |
| `/prepare-collection` | 用户要求分析覆盖度或准备收集 |

`/controlled-experiment` 和 `/image-research` 共享 `image-runner`（批量生图）和 `evaluator`（7 维度评分）两个子代理。

## 工作空间

| 目录 | 归属技能 | 内容 |
|------|----------|------|
| `gen/outputs/` | generate-image | 生成的图片 + metadata.json + 参考图副本 |
| `ideas/` | iwanna-image-prompt | 概念塑造旅程（源头→概念→提示词→生成记录） |
| `collected/` | collect-image-2-prompt, x-to-prompt, image-to-prompt | 结构化 prompt（按编号命名） |
| `research/studies/` | image-research | 研究会话（收集素材 + 报告 + 评分） |
| `experiments/` | controlled-experiment | 实验矩阵 + 评分 + 结论 |

所有生图输出统一到 `gen/outputs/<timestamp>-<name>/`，包含 `metadata.json`（prompt、参数、耗时、尺寸、来源）和参考图副本（`ref-` 前缀）。

## 生图关键行为

- **参考图**：`--reference` 支持本地路径和网络 URL，URL 通过 `CODEX_PROXY` 代理下载
- **代理策略**（codex.mjs）：无参考图走代理，有参考图直连 OpenAI，避免大请求体超时
- **失败清理**：生图失败时，输出目录为空则自动删除，有部分结果保留
- **不显示图片**：`/generate-image` 只报告输出文件路径，不渲染图片

## 共享资源

| 路径 | 用途 |
|------|------|
| `prompts/PROMPT_FRAMEWORK.md` | 十维度提示词框架 |
| `prompts/NEGATIVE_CONSTRAINTS.md` | 按场景的负面约束 |
| `prompts/REVIEW_RUBRIC.md` | 7 维度图片评分标准（image-research、controlled-experiment 使用） |
| `recipes/` | 稳定风格套路（draft / confirmed） |
| `GPT_IMAGE2_GRIMOIRE.zh-CN.md` | 完整提示词魔导书 |

## 数据策略

- 不打印、不提交 API key。`.env` 是本地文件，已被 `.gitignore` 忽略
- 优先保存来源 URL、提示词结构和分析笔记，不默认下载大量公开图片
- 对第三方图片和提示词，提炼结构和规律，不长段逐字复制
- 评估标准：不因某一次输出好看就视为稳定套路。只有经过受控变体测试且自动评分达标，或结构上明显可复用时，才提升为 recipe
