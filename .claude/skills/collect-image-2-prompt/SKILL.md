---
name: collect-image-2-prompt
description: 在 X 上搜索 GPT Image 2 的提示词并收集整理。Use when 用户要求搜索、收集、整理 GPT Image 2 提示词，或提到 "搜提示词"、"找 prompt"、"收集生图关键词"。
---

# 收集 GPT Image 2 提示词

## 前置条件

- bb-browser 已安装且 daemon 正在运行
- 浏览器中已登录 X（x.com）

### 前置检查

#### 1. 提取输入参数（必须）

从用户输入中提取搜索词和目标数量，使用 [scripts/extract-input-params.sh](scripts/extract-input-params.sh)：

```
RESULT=$(bash .claude/skills/collect-image-2-prompt/scripts/extract-input-params.sh "<用户输入内容>")
QUERY=$(echo "$RESULT" | cut -d'|' -f1)
COUNT=$(echo "$RESULT" | cut -d'|' -f2)
```

输出格式：`<URL编码搜索词>|<数量>`，数量未提供时默认为 5。

**如果 `$QUERY` 为空，立即终止执行并输出：**

> 未提供搜索词，无法执行。请在输入中包含以下格式的内容：
>
> `本次执行搜索词：{你要搜索的内容}`
>
> 可选附加数量：`本次执行数量：{数量}`（默认 5）
>
> 示例：`/collect-image-2-prompt 本次执行搜索词：gpt-image-2 prompt JSON 本次执行数量：3`

#### 2. 检查浏览器标签页

```
bb-browser tab list
```

确认标签页中存在 x.com。如缺少：
- 缺少 X → `bb-browser open "https://x.com"`

## 通用脚本

- [scripts/smart-scroll.js](scripts/smart-scroll.js) — 根据页面元素高度动态计算滚动距离
- [scripts/cleanup-overlays.sh](scripts/cleanup-overlays.sh) — 清理 snapshot 产生的覆盖层和 ref 数字标签
  - 用法：`bash .claude/skills/collect-image-2-prompt/scripts/cleanup-overlays.sh <tab-id>`
  - 每次 `snapshot` 后必须立即调用
- [scripts/dedup-check.py](scripts/dedup-check.py) — 去重检查，Jaccard 词集相似度 >= 0.75 判为重复
  - 用法：`python3 scripts/dedup-check.py "<prompt文本>" "collected/"`
  - 输出 JSON：`{"duplicate": true/false, "matched_file": "...", "jaccard": 0.xx}`
- [reference/judgment-rules.md](reference/judgment-rules.md) — 步骤 3.4 语义判断规则，发现新规则时自动追加
- [reference/skip-list.md](reference/skip-list.md) — 已跳过推文名单，R3/R4 触发时自动追加

## 工作流程

整体流程：步骤 1 仅首次，步骤 2-7 循环直至达到目标数量：

```
步骤 1: 搜索 X（仅首次）
循环 {
  步骤 2: 智能滚动列表，找到一条完整推文
  步骤 3: 进入推文详情页，提取完整内容（按判断规则过滤）
  步骤 4: 去重检查（重复则跳过，返回列表）
  步骤 5: 获取图片样例
  步骤 6: 结构化记录
  步骤 7: 返回搜索列表
  判断: 已收集数量 >= 目标数量？→ 结束循环
}
```

### 步骤 1: 搜索 X

检查当前浏览器是否已在目标搜索页，避免重复搜索：

```
bb-browser eval "window.location.href" --tab <x-tab>
```

- 当前 URL 包含 `search?q=` 且搜索词匹配 `$QUERY` → 跳过本步骤，直接进入步骤 2
- 不匹配 → 执行搜索：

```
bb-browser open "https://x.com/search?q=$QUERY&src=typed_query&f=top" --tab <x-tab>
```

### 步骤 2: 智能滚动，定位一条完整推文

使用智能滚动让新推文进入视窗，然后用 JS 确认可见的推文列表：

```
bb-browser eval "$(cat .claude/skills/collect-image-2-prompt/scripts/smart-scroll.js)" --tab <x-tab>
sleep 2
bb-browser eval "document.querySelectorAll('[data-testid=\"tweetText\"]').length" --tab <x-tab>
```

当一条新的推文完整出现在视窗中时，进入步骤 3。

### 步骤 3: 进入推文详情页，提取完整内容

#### 3.1 进入详情页

通过 `data-testid="tweetText"` 精准定位推文文字元素，用 `dispatchEvent` 触发点击进入详情页（无需猜 ref，且 `back` 后滚动位置保持）：

```
# 进入第 N 条推文的详情页（N 从 0 开始）
bb-browser eval "document.querySelectorAll('[data-testid=\"tweetText\"]')[N].dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}))" --tab <x-tab>
```

验证已进入详情页（URL 格式为 `x.com/<username>/status/<id>`）。

#### 3.1a 快速跳过检查

获取当前推文 URL 后，依次执行两项检查，任一命中即跳过：

```
# 获取当前 URL
bb-browser eval "window.location.href" --tab <x-tab>
```

**检查 1 — 已收集推文**：在 `collected/` 目录中搜索该 URL，匹配到说明已成功提取过：

```
grep -rl "<当前推文URL>" collected/
```

**检查 2 — 跳过名单**：读取 [reference/skip-list.md](reference/skip-list.md)，检查 URL 是否在 R3/R4 跳过名单中。

- 任一命中 → 执行步骤 7 返回搜索列表，继续下一条推文
- 均未命中 → 继续步骤 3.2

#### 3.2 展开完整文本

检查是否有 "Show more" 按钮，如有则点击展开：

```
bb-browser eval "const btn = document.querySelector('button[data-testid=\"tweet-text-show-more-link\"]'); if (btn) btn.click(); btn ? 'clicked Show more' : 'no Show more'" --tab <x-tab>
```

#### 3.3 智能滚动详情页

如果推文内容较长，使用智能滚动确保全部加载：

```
bb-browser eval "$(cat .claude/skills/collect-image-2-prompt/scripts/smart-scroll.js)" --tab <x-tab>
sleep 2
```

重复滚动直到 JS 检测到 "Post your reply" 出现在页面中：

```
bb-browser eval "document.body.textContent.includes('Post your reply') ? 'complete' : 'keep scrolling'" --tab <x-tab>
```

#### 3.4 提取完整推文内容

提取主推文正文：

```
bb-browser eval "document.querySelector('[data-testid=\"tweetText\"]')?.textContent" --tab <x-tab>
```

**语义判断**：按 [reference/judgment-rules.md](reference/judgment-rules.md) 规则匹配提取到的内容：
- R1（正文含 prompt）→ 跳过 3.4a，进入步骤 4
- R2（引导文案）→ 执行 3.4a
- R3（外部链接）→ 跳过该条，返回列表
- R4（非 prompt 内容）→ 跳过该条，返回列表

#### 3.4a 滚动评论区，提取博主评论中的 prompt（按需）

仅在主推文正文是引导文案时执行。先获取博主用户名，再滚动评论区获取评论：

```
# 获取博主用户名
bb-browser eval "document.querySelector('[data-testid=\"User-Name\"]')?.textContent" --tab <x-tab>

# 滚动到评论区
bb-browser eval "window.scrollBy({top: 600, behavior: 'smooth'})" --tab <x-tab>
sleep 2
```

获取前 5 条评论及作者，筛选博主本人的评论：

```
bb-browser eval "
(() => {
  const all = document.querySelectorAll('[data-testid=\"tweetText\"]');
  const replies = [];
  for (let i = 1; i < all.length && replies.length < 5; i++) {
    const article = all[i].closest('article');
    const author = article?.querySelector('[data-testid=\"User-Name\"]')?.textContent || '';
    replies.push({index: i, author: author, text: all[i].textContent.substring(0, 80).replace(/\\n/g, ' ')});
  }
  return JSON.stringify(replies);
})();
" --tab <x-tab>
```

筛选出博主本人的评论，对包含 prompt 内容的评论点击 Show more 后提取完整文本：

```
# 提取博主第 M 条评论的完整内容
bb-browser eval "document.querySelectorAll('[data-testid=\"tweetText\"]')[M]?.textContent" --tab <x-tab>
```

**语义判断**：按 [reference/judgment-rules.md](reference/judgment-rules.md) 规则，判断博主评论是否包含实际 prompt 内容。找到后输出该 prompt；若均为社交回复，按 R4 跳过该条。

### 步骤 4: 去重检查

使用 [scripts/dedup-check.py](scripts/dedup-check.py) 对提取到的 prompt 做去重（仅比较 `## Prompt` 节内容）：

```
RESULT=$(python3 .claude/skills/collect-image-2-prompt/scripts/dedup-check.py "<prompt文本>" "collected/")
```

- `duplicate: true` → 跳过该条，不入库，返回搜索列表继续下一条
- `duplicate: false` → 继续执行步骤 5

### 步骤 5: 获取图片样例

提取主推文中的图片原始 URL。在详情页中，主推文的图片位于第一个 `article` 内：

```
bb-browser eval "
(() => {
  const article = document.querySelector('article');
  if (!article) return JSON.stringify({images: []});
  const imgs = article.querySelectorAll('img');
  const urls = [];
  for (const img of imgs) {
    const src = img.src || '';
    // 过滤头像、图标等小图，只保留内容图片（pbs.twimg.com 域名）
    if (src.includes('pbs.twimg.com/media') && !urls.includes(src)) {
      urls.push(src);
    }
  }
  return JSON.stringify({images: urls});
})();
" --tab <x-tab>
```

如果评论区也包含博主发布的图片（prompt 在评论区的情况），同样提取。

### 步骤 6: 结构化记录

按 [reference/prompt-template.md](reference/prompt-template.md) 模板，将提取到的 prompt 保存到 `collected/` 目录。使用 Write 工具写入文件。

填写规则：
- **用途**：根据 prompt 内容和图片样例，一句话概括该 prompt 生成什么效果的图片（≤150字）
- **标签**：提取 prompt 涉及的风格、技术、场景等关键词，逗号分隔（如 `cinematic, mirror-selfie, phone-photography`）

### 步骤 7: 返回搜索列表

```
bb-browser back --tab <x-tab>
sleep 2
```

验证 URL 已回到搜索页 (`x.com/search?...`)。

## 检查清单

- [ ] 前置检查已执行（搜索词已提取，x.com tab 存在）
- [ ] 每次收集循环：快速跳过检查（已收集 + 跳过名单）→ 提取完整内容（含评论区）→ 去重检查 → 获取图片样例 → 结构化记录 → 成功返回列表
- [ ] R3/R4 跳过的推文已追加到 `reference/skip-list.md`
- [ ] 每轮收集循环结束前，已将提取到的 prompt 结构化保存到 `collected/` 目录（含用途和标签）
- [ ] 主推文正文是引导文案时，已滚动评论区提取博主评论中的 prompt
- [ ] 语义判断：区分实际 prompt 内容与引导文案/社交回复
