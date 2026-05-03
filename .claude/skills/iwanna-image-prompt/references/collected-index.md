# Collected 素材检索策略

`collected/` 目录包含从 X 平台收集的结构化 prompt。每条记录包含 `## Prompt`、`## 用途`、`## 标签`、`## 图片样例`、`## 原始文本`。

## 检索方式

使用 Grep 工具搜索 `collected/` 目录，不要手动逐个文件浏览。

### 按用途搜索

```bash
grep -rl "搜索关键词" collected/ --include="*.md"
```

搜索 `## 用途` 字段，匹配用户需求描述。

### 按标签搜索

```bash
grep -l "标签关键词" collected/*.md
```

搜索 `## 标签` 行，匹配标签关键词。

### 优先推荐 template

含 `template` 标签的条目是可泛化模板，优先推荐：

```bash
grep -l "template" collected/*.md
```

## 用途类别

| 类别 | 典型标签 | 检索关键词 |
|------|---------|-----------|
| 人像摄影 | portrait, street-portrait, flash-photography, bokeh | 人像、照片、自拍、portrait |
| 商业海报 | poster, commercial, campaign, product-photography | 海报、广告、商业、poster |
| 时尚杂志 | fashion, magazine-cover, editorial, luxury | 时尚、杂志、封面、fashion |
| 信息图 | infographic, isometric-3D, technical-annotation | 信息图、数据、infographic |
| 品牌设计 | brand-identity, logo, design-system, mockup | 品牌、logo、设计系统 |
| 故事板 | storyboard, grid-layout, sequential-narrative | 故事板、分镜、连续、storyboard |
| 插画绘画 | watercolor, crayon, hand-drawn, comic, manga | 插画、水彩、漫画、蜡笔 |
| 图片编辑 | image-edit, doodle, overlay, transformation | 编辑、叠加、转换、image-edit |
| 角色游戏 | character-design, pixel-art, anime, kawaii | 角色、游戏、像素、动漫 |
| 食物 Zine | food-photography, zine, collage | 美食、zine、拼贴 |

## 检索流程

1. 从用户描述中提取关键词
2. 按用途类别匹配 → Grep 搜索 `## 用途` 字段
3. 按标签关键词匹配 → Grep 搜索 `## 标签` 行
4. 如果匹配到 template 标签条目，优先推荐
5. 最多选取 3 条，读取完整 `## Prompt` 作为写法参考
6. 展示格式：`#编号 — 用途描述（标签列表）`

## 检索结果使用

读取匹配到的文件，参考其 Prompt 结构和措辞：
- 学习 prompt 的组织方式（段落结构、维度排列顺序）
- 借鉴具体的视觉描述措辞（材质、光线、色彩的表达方式）
- 不要逐字复制，而是理解结构后按用户需求重新构造
