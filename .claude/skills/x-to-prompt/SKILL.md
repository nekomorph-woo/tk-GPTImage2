---
name: x-to-prompt
description: 从单个 X 推文 URL 提取文本 prompt 并保存到 collected/。Use when 用户提供一个 X 推文链接并要求提取其中的 prompt，或提到 "提取 prompt"、"收集这条推文"、"提取这条 tweet"、"这个 URL 里有好的 prompt"。每次只接受一个链接。
---

# 提取 X 推文 Prompt

从单个 X 推文 URL 提取文本 prompt，保存到 `collected/`。

## 前置条件

- bb-browser 已安装且 daemon 正在运行
- 浏览器中已登录 X（x.com）

## 脚本

- [scripts/extract-tweet-content.js](scripts/extract-tweet-content.js) — 从推文详情页提取作者、正文、图片、博主评论
- [scripts/dedup-check.py](scripts/dedup-check.py) — Jaccard 词集相似度去重检查

## 工作流程

### 步骤 0：前置检查

从用户输入中提取 X 推文 URL（匹配 `x.com/<username>/status/<id>` 模式）。如无有效 URL，提示用法并终止。

确认 bb-browser 标签页存在：

```bash
bb-browser tab list
```

如无 x.com 标签页，用 `bb-browser open "https://x.com" --tab new` 打开。

### 步骤 1：URL 去重检查

检查该 URL 是否已被处理过：

```bash
grep -rl "<推文 URL>" collected/
```

命中 → 报告用户该推文已收集过，终止流程。
未命中 → 继续步骤 2。

### 步骤 2：导航到推文详情页

```bash
bb-browser open "<推文 URL>" --tab <x-tab>
sleep 3
```

验证页面已加载（推文详情页 URL 包含 `/status/`）：

```bash
bb-browser eval "window.location.href" --tab <x-tab>
```

如未跳转到详情页，等待后重试。确认页面底部出现 "Post your reply" 表示加载完成：

```bash
bb-browser eval "document.body.textContent.includes('Post your reply') ? 'complete' : 'loading'" --tab <x-tab>
```

如返回 `loading`，等待 2 秒后重试。

### 步骤 3：提取推文内容

运行提取脚本：

```bash
bb-browser eval "$(cat .claude/skills/x-to-prompt/scripts/extract-tweet-content.js)" --tab <x-tab>
```

输出 JSON：
```json
{
  "author": "@username",
  "text": "主推文正文完整内容",
  "images": ["https://pbs.twimg.com/media/...", ...],
  "author_comments": [
    {"index": 1, "text": "博主评论完整内容"},
    ...
  ]
}
```

如推文有 "Show more" 按钮未自动展开（脚本已处理，但以防万一），手动点击后再执行提取。

### 步骤 4：语义判断

阅读提取到的主推文正文，按 [reference/judgment-rules.md](reference/judgment-rules.md) 的 R1-R4 规则匹配：

- **R1**（正文包含完整 prompt）→ 使用 `text` 作为 prompt，标记 Prompt 位置为 `主推文`，进入步骤 5
- **R2**（引导文案，prompt 在评论区）→ 检查 `author_comments` 数组：
  - 找到包含 prompt 的评论 → 使用该评论作为 prompt，标记 Prompt 位置为 `博主评论`，进入步骤 5
  - 博主评论都是社交回复 → 视为 R4 处理
- **R3**（外部链接）→ 报告用户："该推文的 prompt 在外部链接中，无法直接提取"。终止流程
- **R4**（非 prompt 内容）→ 报告用户："该推文不包含 prompt 内容"。终止流程

### 步骤 5：图片样例

步骤 3 已提取图片 URL（`images` 字段）。如 `images` 为空且推文无配图，在最终文件中删除「图片样例」节。

### 步骤 6：Prompt 去重检查

```bash
RESULT=$(python3 .claude/skills/x-to-prompt/scripts/dedup-check.py "<prompt文本>" "collected/")
```

`duplicate: true` → 报告用户该 prompt 与已有文件重复（`matched_file`），终止流程。
`duplicate: false` → 继续步骤 7。

### 步骤 7：结构化保存

按 [reference/prompt-template.md](reference/prompt-template.md) 格式保存到 `collected/`。

**文件名**：`<编号>_<作者>@<平台>_<关键词>.md`
- 编号取 `collected/` 现有最大编号 +1
- 平台固定为 `x`
- 关键词取标签中第一个；同源多图关键词相同时加序号后缀 `-2`、`-3`

**字段填写规则**：

| 模板字段 | 填写规则 |
|----------|---------|
| 来源 | `[@author](推文 URL)` |
| 采集时间 | 当天日期 |
| Prompt 位置 | `主推文`（R1）或 `博主评论`（R2） |
| 搜索词 | `单条提取` |
| Prompt | 提取到的 prompt 内容 |
| 用途 | 一句话概括（≤150字） |
| 标签 | 从 prompt 提取关键词，逗号分隔 |
| 图片样例 | 填入图片 URL；无图片则删除此节 |
| 原始文本 | 推文或评论完整原文 |

### 步骤 8：报告结果

**成功**：显示保存的文件路径、prompt 摘要和标签列表。

**跳过**（R3/R4）：显示匹配的规则和跳过原因。

**重复**（URL 去重或 Prompt 去重）：显示匹配的已有文件。

## 检查清单

- [ ] 从用户输入中提取到有效的 X 推文 URL
- [ ] URL 去重检查已执行（命中则终止）
- [ ] 页面加载完成（"Post your reply" 可见）
- [ ] extract-tweet-content.js 执行成功
- [ ] R1-R4 语义判断已正确应用
- [ ] R2 路径：博主评论已检查
- [ ] Prompt 去重检查已通过
- [ ] 文件已写入 `collected/`，编号正确递增
- [ ] 文件格式与 collect 一致
