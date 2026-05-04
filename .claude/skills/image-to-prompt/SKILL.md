---
name: image-to-prompt
description: 从 X 博文图片反推 GPT Image 2 生图提示词。Use when 用户提供一个 X 博文链接并要求反推/逆向工程/分析图片的提示词，或提到 "反推提示词"、"图片转 prompt"、"识图写 prompt"。每次只接受一个链接，多个链接需多次调用。
---

# 图片反推提示词

从 X 博文图片出发，多模态分析反推可复现的 GPT Image 2 生图 prompt，保存到 `collected/`。

## 前置条件

- bb-browser 已安装且 daemon 正在运行
- 浏览器中已登录 X（x.com）

## 脚本

- [scripts/extract-post-images.js](scripts/extract-post-images.js) — 从推文详情页提取图片 URL、作者和文本

## 工作流程

### 步骤 1：提取推文内容

导航到推文详情页，提取图片和文本：

```
bb-browser open "<X post URL>" --tab <x-tab>
sleep 3
bb-browser eval "$(cat .claude/skills/image-to-prompt/scripts/extract-post-images.js)" --tab <x-tab>
```

输出 JSON：`{"images": ["url1", ...], "author": "@username", "text": "推文原文"}`

如推文有 "Show more" 按钮未自动展开，手动点击后再执行提取。

### 步骤 1a：前置 URL 去重检查

提取完成后，在 `collected/` 中搜索该推文 URL：

```
grep -rl "<X post URL>" collected/
```

**命中** → 该推文已在 collect 流程中收集过，终止流程并报告用户。

**未命中** → 继续步骤 2。

### 步骤 2：逐图分析并写入文件

对提取到的图片**逐张处理**（不并行），每张图片完成分析 → 反推 → 去重 → 写入后再处理下一张。

#### 2.1 获取图片并分析

通过 bb-browser 在浏览器中 fetch 图片，转为 base64 data URL（系统会自动渲染为临时图片），再使用 MCP analyze_image 分析渲染后的临时 URL：

```
bb-browser eval "fetch('<图片URL>').then(r=>r.blob()).then(b=>{const fr=new FileReader();fr.onload=()=>fr.result;return fr.readAsDataURL(b)})" --tab <x-tab>
```

系统渲染出临时图片后，对临时 URL 调用：

```
mcp__4_5v_mcp__analyze_image(imageSource="<临时URL>", prompt="...")
```

分析 prompt 参考 [reference/reverse-prompt-guide.md](reference/reverse-prompt-guide.md) 的 10 个要素。

#### 2.2 反推 prompt

结合分析结果和推文文本（博主心得作为辅助线索，但以实际图片为准）生成 prompt：

- prompt 格式参考 `prompts/PROMPT_FRAMEWORK.md` 的稳定提示词公式
- 负面约束参考 `prompts/NEGATIVE_CONSTRAINTS.md`，按图片类型选择
- 目标：使用该 prompt 可生成视觉上相似的结果

#### 2.3 去重检查

```
RESULT=$(python3 .claude/skills/collect-image-2-prompt/scripts/dedup-check.py "<prompt文本>" "collected/")
```

`duplicate: true` → 跳过该图片，继续处理下一张。

#### 2.4 写入文件

**文件名**：`<编号>_<作者>@<平台>_<关键词>.md`

- 编号取 `collected/` 现有最大编号 +1（全局递增）
- 关键词取标签中第一个；同源多图关键词相同时，末尾加序号后缀 `-2`、`-3`...
- 示例：`068_@AI_nekotanu_x_magazine-cover.md`、`069_@AI_nekotanu_x_magazine-cover-2.md`

按 [reference/prompt-template.md](reference/prompt-template.md) 格式保存到 `collected/`，适配字段：

| 模板字段 | 填写规则 |
|----------|----------|
| 来源 | `[@作者](X post URL)` |
| 采集时间 | 当天日期 |
| Prompt 位置 | `反推` |
| 搜索词 | `反推` |
| 组 | 同源多图时，填首图编号（如 `068`）；单图时省略此字段 |
| Prompt | 反推出的 prompt |
| 用途 | 一句话概括（≤150字） |
| 标签 | 从 prompt 提取关键词，逗号分隔 |
| 图片样例 | **必须包含**，填入当前图片 URL |
| 原始文本 | 推文原文 |

写入完成后继续处理下一张图片，重复步骤 2.1 — 2.4。

## 检查清单

- [ ] 图片已从推文中提取（`pbs.twimg.com/media` URL）
- [ ] 前置 URL 去重检查已执行（命中则终止）
- [ ] 推文文本已提取（博主心得作为辅助线索）
- [ ] 图片通过 bb-browser fetch → base64 → MCP 临时 URL 路径分析
- [ ] 逐张处理：每张图分析完立即反推、去重、写入，再处理下一张
- [ ] 反推的 prompt 结构完整，可复现
- [ ] 去重检查已通过
- [ ] 同源多图：关键词重复时加序号后缀，文件内标注「组」字段
- [ ] 落地文件格式与 collect 一致，包含图片样例
