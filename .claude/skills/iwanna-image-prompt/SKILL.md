---
name: iwanna-image-prompt
description: 从模糊想法到完整生图提示词。Use when 用户说"帮我写 prompt"、"我不知道怎么写提示词"、"我想生成一张图但不知道怎么描述"、"iwanna"。
---

# 想要图片提示词

从用户的模糊想法出发，通过引导对话和项目资源，构造完整的 GPT Image 2 提示词。仅输出提示词文本到控制台，不执行生图。

## 前置条件

无。不需要 API Key、不需要浏览器、不需要网络。

## 共享资源

| 资源 | 引用方式 | 用途 |
|------|---------|------|
| [references/genre-matching.md](references/genre-matching.md) | 直接读取 | 流派匹配 + 核心公式 + 失败诊断 |
| [references/collected-index.md](references/collected-index.md) | 直接读取 | collected/ 素材检索策略 |
| `recipes/*.md` | Glob 扫描 + 按需读取 | 已验证的稳定套路（最高优先级） |
| `prompts/PROMPT_FRAMEWORK.md` | 直接读取 | 十维度框架 |
| `prompts/NEGATIVE_CONSTRAINTS.md` | 直接读取 | 按场景注入负面约束 |
| `collected/*.md` | Grep 搜索 + 按需 Read | 参考素材 |

## 工作流

```
用户输入模糊想法
    ↓
步骤 1: 需求澄清（AskUserQuestion）
    ↓
步骤 2: 素材检索 + 流派匹配
    ↓
步骤 3: 构造提示词
    ↓
步骤 4: 质量预检
    ↓
步骤 5: 输出到控制台
```

### 步骤 1: 需求澄清

当用户输入已包含主体 + 风格/用途（如"赛博朋克城市夜景海报"、"iPhone 质感的街拍人像"）时，跳过此步。

否则，使用 AskUserQuestion 向用户提问。每次最多 4 个问题，提供选项式回答：

**澄清维度**：

| 维度 | 问题 | 选项 |
|------|------|------|
| 目的/用途 | 这张图用于什么场景？ | 社媒帖子 / 海报广告 / 产品展示 / 个人收藏 / 杂志内页 / 其他 |
| 风格偏好 | 偏好什么视觉风格？ | 写实摄影 / 电影剧照 / 产品海报 / 中文字体海报 / 插画绘画 / 信息图 / 3D 图标 / 角色设计 / 其他 |
| 画幅 | 需要什么比例？ | 自动(推荐) / 1:1 / 4:5 / 9:16 / 16:9 |
| 是否含文字 | 图中需要文字吗？ | 无文字 / 英文标题 / 中文标题 / 其他 |

引导原则：
- 提供有意义的选项，避免纯开放式提问
- 风格选项直接对应八大流派（参见 [references/genre-matching.md](references/genre-matching.md)）
- 如果用户选了"其他"，追问具体想法
- 1 轮对话即可完成澄清，不要反复追问

### 步骤 2: 素材检索 + 流派匹配

#### 2.1 检查 recipes/（最高优先级）

使用 Glob 扫描 `recipes/` 目录中非 README/TEMPLATE 的 .md 文件。如果存在：
- 读取每个 recipe 的"适用场景"和"提示词结构"
- confirmed 状态且适用场景匹配 → 直接使用，跳过 2.2 和 2.3
- draft 状态的 recipe → 作为参考，继续正常流程

#### 2.2 流派匹配

参考 [references/genre-matching.md](references/genre-matching.md) Part 2：
- 从用户描述 + 步骤 1 回答中提取特征词
- 匹配最合适的 1 个流派（一个 prompt 一个强风格锚点）
- 匹配到 2 个候选时，使用 AskUserQuestion 让用户选择
- 匹配不到任何流派时，按通用公式（十维度骨架）构造

#### 2.3 collected/ 素材检索

参考 [references/collected-index.md](references/collected-index.md)：
- 使用 Grep 搜索 `collected/` 中的 `## 用途` 和 `## 标签` 字段
- 优先匹配用途类别，其次匹配标签关键词
- 含 `template` 标签的条目优先推荐
- 最多选取 3 条，读取完整 `## Prompt` 作为写法参考

### 步骤 3: 构造提示词

#### 有 confirmed recipe 时

recipe 已包含验证过的完整提示词结构，不需要流派匹配和 collected 检索。微调流程：

1. **填入用户主体**：将用户描述的主体填入 recipe 模板的 `[主体]` 占位符
2. **处理用户特殊需求**（仅当用户在步骤 1 中表达了与 recipe 不同的偏好时）：
   - 用户要求不同色彩 → 替换 recipe 的色彩策略段落
   - 用户要求特定文字 → 替换 recipe 的文字规则段落
   - 用户要求不同构图 → 替换 recipe 的构图段落
   - 用户未提出特殊需求 → 保持 recipe 原样，不做任何修改
3. **注入负面约束**：读取 NEGATIVE_CONSTRAINTS.md，按场景自动追加（与无 recipe 流程相同）
4. 跳过步骤 2.2（流派匹配）和 2.3（collected 检索）

#### 无 recipe 时

按以下优先级构造：

1. **匹配流派的公式**（genre-matching.md 中的流派公式）— 提供结构骨架
2. **十维度框架**（PROMPT_FRAMEWORK.md）— 确保维度完整，检查是否有遗漏
3. **collected/ 参考 prompt** — 提供具体写法和措辞参考（学习结构，不逐字复制）
4. **负面约束自动注入**（NEGATIVE_CONSTRAINTS.md）— 根据场景拼接

输出格式使用 genre-matching.md 的"万用提示词骨架"（自然语言段落），不使用 JSON 格式。

### 步骤 4: 质量预检

对照 [references/genre-matching.md](references/genre-matching.md) Part 4 的失败诊断表，检查 8 种常见失败模式：

| 检查项 | 验证内容 |
|--------|---------|
| 图很普通？ | 是否包含具体地点、真实物件、风格锚点 |
| 图很乱？ | 主体、背景、文字是否在抢焦点 |
| 角色漂移？ | 是否需要角色一致性流程（参考图 + 编辑） |
| 产品变形？ | 是否需要"保留准确轮廓和比例"声明 |
| 中文乱码？ | 中文是否精简，是否有"只出现精确文字"约束 |
| 像 AI 图？ | 是否堆叠了模糊质量词 |
| 构图散？ | 是否有明确的主体位置、镜头角度和留白 |
| 质感廉价？ | 是否有具体的材质、反射、阴影描述 |

发现问题自动修正，不做交互式确认。

### 步骤 5: 输出

仅输出到控制台，不写入文件。

输出由三部分组成：提示词 + 元信息 + 教学卡。格式参见 [references/output-format.md](references/output-format.md)。

## 检查清单

- [ ] 需求澄清：缺失信息已通过 AskUserQuestion 补全（或输入足够具体已跳过）
- [ ] recipes/ 已检查，confirmed recipe 存在时已优先使用
- [ ] 流派匹配：从用户描述中提取特征词，匹配到具体流派
- [ ] 素材检索：collected/ 已搜索，最多 3 条参考已读取
- [ ] 提示词结构：遵循万用提示词骨架，维度完整
- [ ] 负面约束：按场景自动注入（NEGATIVE_CONSTRAINTS.md）
- [ ] 质量预检：8 种失败模式已检查并修正
- [ ] 输出格式：提示词代码块 + 元信息 + ASCII 教学卡
- [ ] 教学卡：包含流派选择原因、关键心法、规避的坑，内容从 genre-matching.md 教学要点中按上下文选取
