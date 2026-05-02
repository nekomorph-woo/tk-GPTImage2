# ChatGPT 模式

当用户希望通过 ChatGPT Plus 生图，而不是通过 OpenAI API 消耗单独账单时，使用这个模式。

## 目的

ChatGPT Plus 和 OpenAI API 分开计费。这个模式可以在不消耗 API 预算的情况下保留研究闭环：

```text
Codex 编写提示词队列
-> 用户在 ChatGPT 中生成图片
-> 用户下载图片
-> Codex 导入输出
-> Codex 评估并更新 recipes
```

## 命令

从一个提示词卡片创建队列：

```bash
npm run chatgpt:queue -- --prompt-file prompts/prompt-cards/product-poster.md --name product-poster
```

从实验矩阵创建队列：

```bash
npm run chatgpt:queue -- --matrix experiments/starter.json --name starter
```

导入已下载的 ChatGPT 图片：

```bash
npm run chatgpt:import -- --from ~/Downloads/chatgpt-images --name starter
```

## 文件夹规则

- `chatgpt-queue/`：准备粘贴到 ChatGPT 的提示词队列。
- `outputs/chatgpt/`：导入的 ChatGPT 生成图和 metadata。
- `studies/`：评估后的研究笔记。
- `recipes/` 和 `prompts/prompt-cards/`：被提升为稳定模式的套路。

## 评估

导入后使用 `prompts/REVIEW_RUBRIC.md` 评分。只有稳定或结构明显可复用的提示词，才应提升为 recipe。
