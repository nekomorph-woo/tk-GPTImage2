---
name: image-research
description: 收集公开研究来源、创建研究笔记队列、列出提示词套路、运行项目健康检查。Use when 用户要求"研究一下..."、"收集来源..."、"列出套路..."、"检查环境..."、"有哪些 recipe..."、"健康检查..."、"研究提示词套路"。
---

# 提示词研究工具

使用本技能管理 GPT Image 2 的提示词研究工作流。

## 命令参考

所有命令从项目根目录执行。

### 创建研究来源队列

读取来源列表，生成研究队列文件：

```bash
node .claude/skills/image-research/scripts/collect.mjs
```

指定来源文件：

```bash
node .claude/skills/image-research/scripts/collect.mjs \
  --sources sources/gpt-image2-public-sources.json
```

输出到 `studies/collections/<timestamp>-source-queue.md`。

### 列出提示词套路

```bash
node .claude/skills/image-research/scripts/list-recipes.mjs
```

列出所有 recipe 的 id、名称和适用场景。

### 项目健康检查

```bash
node .claude/skills/image-research/scripts/doctor.mjs
```

检查项：package.json 存在、API key 已配置、recipes 文件存在、提示词框架存在。

## 工作流

### 自动研究循环

当用户要求"研究提示词套路"或"研究最新的提示词技巧"时：

1. **收集来源**：运行 collect 脚本生成研究队列
2. **逐个研究**：对队列中的每个来源，使用 WebSearch 或浏览器研究
3. **拆解结构**：按分析维度拆解提示词（见下方框架）
4. **提取 recipe**：只有结构明显可复用的才提取为 recipe
5. **保存笔记**：写入 `studies/` 下，参考 `references/research-template.md` 格式
6. **更新数据**：新 recipe 加入 `recipes/recipes.json`，新 prompt card 加入 `prompts/prompt-cards/`
7. **验证**：运行 doctor 确认文件完整性

### 提示词分析维度

分析任何提示词或生成图片时，按以下维度拆解：

- **主体清晰度**：是否具体、可识别
- **构图策略**：镜头角度、裁切、主体位置、留白
- **风格锚点**：是否单一、具体（避免堆叠多个风格）
- **光线描述**：方向、软硬、色温、阴影
- **材质细节密度**：表面纹理、物件质感
- **色彩策略**：主色、强调色、调性
- **文字规则**：精确文字、位置、字体规则
- **失败规避**：针对常见问题的约束

### 评分标准

参考 `prompts/REVIEW_RUBRIC.md` 对生成图片进行 1-5 分评分，7 个维度：主体清晰度、构图、提示词遵循度、材质质量、文字质量、稳定性、商业可用性。

## 研究数据路径

| 路径 | 用途 |
|------|------|
| `sources/gpt-image2-public-sources.json` | 公开研究来源列表 |
| `studies/` | 研究笔记和案例拆解 |
| `studies/collections/` | collect 脚本生成的队列 |
| `recipes/recipes.json` | 提取的稳定风格套路 |
| `prompts/prompt-cards/` | 可复用提示词卡片 |
| `prompts/PROMPT_FRAMEWORK.md` | 标准提示词结构 |
| `prompts/NEGATIVE_CONSTRAINTS.md` | 失败规避短语 |
| `prompts/REVIEW_RUBRIC.md` | 图片评分标准 |
| `GPT_IMAGE2_GRIMOIRE.zh-CN.md` | 完整提示词魔导书 |
| `references/research-template.md` | 研究笔记模板 |

## 约束

1. **提炼而非照搬** — 对第三方提示词，提炼结构和规律，不长段逐字复制
2. **可复用性门槛** — 只有经过受控变体测试或结构明显可复用的才提升为 recipe
3. **保存优先** — 研究成果要写入文件，不只留在对话里
4. **来源标注** — 每条研究笔记标注来源 URL 和可信度
5. **区分事实与推断** — 明确哪些是观察到的事实，哪些是推断出的提示词成分
