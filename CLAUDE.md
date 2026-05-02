# tk_GPTImage2 — GPT Image 2 研究与生图实验室

所有面向用户的说明、研究笔记、提示词手册、模板、评估记录使用**简体中文**编写。命令、文件名、参数名、模型名、环境变量名、JSON 键名和代码标识符保留英文。

## 项目概述

GPT Image 2 提示词研究与受控生图实验室。默认模型：`gpt-image-2`。

## 前置条件

1. Node.js >= 20 已安装
2. 项目根目录下已执行 `npm install`（安装 openai SDK）
3. `.env` 已根据 `.env.example` 创建并设置 `OPENAI_API_KEY`

## 项目地图

| 目录/文件 | 用途 |
|-----------|------|
| `GPT_IMAGE2_GRIMOIRE.zh-CN.md` | 提示词魔导书（8 大流派、公式、诊断） |
| `prompts/` | 提示词框架、约束、评分标准、可复用卡片 |
| `prompts/prompt-cards/` | 5 张现成提示词卡片 |
| `recipes/recipes.json` | 5 个稳定风格套路 |
| `experiments/` | 批量实验矩阵 |
| `inputs/` | 参考图和遮罩 |
| `outputs/` | API 生成图片和 metadata |
| `outputs/chatgpt/` | ChatGPT 手动导入图片 |
| `chatgpt-queue/` | ChatGPT Plus 提示词队列 |
| `studies/` | 研究笔记和案例拆解 |
| `collected/` | 从外部收集的 prompt（X、论坛等） |
| `sources/` | 公开研究来源列表 |

## 可用技能

### /generate-image

生图助手：单张生成、批量实验、参考图编辑、ChatGPT 队列模式。

### /image-research

提示词研究：收集来源、创建笔记、列出套路、健康检查。

## 默认工作流

当用户请求改进实验室、研究提示词、收集案例或构建生图套路时：

1. 先读取当前相关文件
2. 优先更新持久化文件，不只在对话里回答
3. 研究笔记保存到 `studies/`
4. 可复用提示词保存到 `prompts/prompt-cards/`
5. 稳定套路写入 `recipes/recipes.json`
6. 长期经验更新 `GPT_IMAGE2_GRIMOIRE.zh-CN.md`

## 数据策略

- 优先保存来源 URL、提示词结构和分析笔记，不默认下载大量公开图片
- API 生成图片放到 `outputs/`
- ChatGPT 手动生成图片放到 `outputs/chatgpt/`
- 不打印、不提交 API key。`.env` 是本地文件，已被忽略
- 对第三方图片和提示词，提炼结构和规律，不长段逐字复制

## 评估循环

```text
收集公开案例 → 拆解视觉结构 → 提取提示词套路 → 创建提示词变体
→ 生成测试批次 → 按评分表评估 → 修订提示词 → 沉淀稳定模式
```

不要因为某一次输出好看就把它视为稳定套路。只有经过受控变体测试，或结构上明显可复用时，才提升为 recipe。
