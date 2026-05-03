# 反推提示词分析指南

基于 PROMPT_FRAMEWORK 的 10 个要素，从图片中系统性提取视觉特征并转化为 prompt 语言。

## 分析流程

对每张图片，按以下维度依次分析。不必每个维度都有内容——没有就是没有，不要编造。

### 1. 目的

**观察**：这张图承担什么任务？

| 类型 | 识别线索 | prompt 关键词 |
|------|----------|--------------|
| 海报 | 有文字排版、强烈的视觉层级 | poster, movie poster, editorial |
| 产品渲染 | 主体是商品，背景干净 | product photography, commercial |
| 角色设计 | 展示角色全貌或关键特征 | character design, concept art |
| 场景图 | 环境为主，人物为辅 | environment, landscape, establishing shot |
| 编辑图 | 杂志风格、时尚感 | editorial photography, fashion |
| 人像 | 人物面部或半身为主 | portrait, headshot, beauty photography |

**输出**：一句话描述图片的目的类型。

### 2. 主体

**观察**：主要对象是什么？有哪些可见特征？

- **人物**：年龄、性别、种族、发型、服装、表情、姿态
- **物品**：类型、品牌特征、颜色、状态（新/旧/使用中）
- **场景**：地点、时间、天气、氛围
- **动物**：种类、姿态、表情

**prompt 技巧**：描述具体、精确。不要说"一个人"，说"一个穿着深色西装的亚洲男性，短发，面带微笑"。

### 3. 构图

**观察**：镜头如何框定画面？

| 维度 | 常见选项 |
|------|----------|
| 角度 | eye-level, low-angle, high-angle, bird's-eye, worm's-eye, Dutch angle |
| 距离 | extreme close-up, close-up, medium shot, full shot, wide shot |
| 裁切 | tight crop, centered, rule-of-thirds, golden ratio |
| 布局 | foreground/midground/background 分层、对称、留白、negative space |

**prompt 技巧**：从画面边缘推断裁切方式，从透视关系推断镜头角度。

### 4. 风格锚点

**观察**：整体视觉语言是什么风格？只选一个强锚点。

| 大类 | 子风格 |
|------|--------|
| 写实 | photorealism, documentary, journalistic |
| 电影 | cinematic still, film noir, neo-noir, Wong Kar-wai style |
| 时尚 | editorial, Vogue-style, lookbook |
| 动漫 | anime, Ghibli, cyberpunk, Makoto Shinkai |
| 插画 | watercolor, oil painting, digital illustration, flat design |
| 3D | Unreal Engine render, Blender, Pixar-style, claymation |
| 复古 | Polaroid, film grain, 35mm, medium format, sepia |
| 设计 | brutalist, minimalism, Swiss design, Bauhaus |

**prompt 技巧**：一个强风格锚点 + 具体视觉细节，不要堆叠多个风格名。

### 5. 光线

**观察**：光从哪里来？什么质感？

| 维度 | 常见选项 |
|------|----------|
| 方向 | front-lit, side-lit, backlit, rim light, top-lit, under-lit |
| 质感 | soft/diffused, hard/direct, natural, studio |
| 色温 | warm (golden hour), cool (blue hour), neutral, mixed |
| 对比 | high contrast, low contrast, chiaroscuro |
| 特殊 | neon glow, volumetric light, lens flare, god rays |

**prompt 技巧**：注意阴影方向推断光源位置；注意高光区域推断光线质感。

### 6. 材质细节

**观察**：表面质感是什么？

| 材质 | 描述关键词 |
|------|-----------|
| 皮肤 | matte, dewy, textured, freckled, wrinkled |
| 织物 | silk, cotton, denim, leather, velvet, knit |
| 金属 | polished, brushed, matte, oxidized, chrome |
| 玻璃 | transparent, frosted, tinted, reflective |
| 纸张 | matte, glossy, textured, aged, cream |
| 木材 | polished, rough, grainy, weathered |
| 其他 | plastic, ceramic, stone, concrete, marble |

**prompt 技巧**：关注表面的反光和纹理。材质是让 prompt 产出"高级感"的关键。

### 7. 色彩策略

**观察**：主色是什么？色彩关系如何？

- 列出 2-4 个主色
- 识别强调色（如果有的话）
- 描述饱和度：vibrant / muted / desaturated / monochrome
- 描述色彩关系：complementary / analogous / triadic

**prompt 技巧**：直接列出色板，如 `color palette: navy blue, gold, cream`。也可以描述氛围：`warm tones`, `cool tones`, `pastel color scheme`。

### 8. 文字规则

**观察**：图中是否有文字？

- **有文字**：记录文字内容、语言、位置、字体气质（bold/serif/sans-serif/handwritten）
- **无文字**：在 prompt 中明确声明 `no text`

**prompt 技巧**：精确文字放在引号中，如 `text "SALE" in bold sans-serif, top center`。

### 9. 约束

**观察**：这张图有什么需要避免的失败点？

参考 `prompts/NEGATIVE_CONSTRAINTS.md`，根据图片类型选择：

- **人物类**：no extra fingers, natural hands, natural face proportions
- **产品类**：single product only, accurate proportions, no floating parts
- **文字类**：only specified text, no random letters, legible font
- **通用类**：no watermark, no logo, clean background, no distortion

### 10. 迭代指令

**不适用**。反推场景不涉及迭代编辑，跳过此维度。

## 蒸馏：从分析到 prompt

分析阶段追求全面（10 维不遗漏），但 prompt 追求精准——风格锚点已经隐含了大量视觉信息，逐维度罗列反而冗余甚至冲突。

### 蒸馏规则

| 规则 | 说明 |
|------|------|
| 1 个强风格锚点 | 不堆叠风格名，选最能概括这张图的 1 个 |
| 主体抓 2-3 个关键特征 | 不描述整个人物/场景，只写区分这张图中主体的特征 |
| 只显式指定偏离预期的维度 | 风格锚点已隐含的（构图、光线、色彩等），不重复写 |
| 文字必须精确引用 | 有文字时，内容和位置是核心指令，用引号包裹 |
| 约束只写高概率失败点 | 不罗列全部负面约束，只写这类图最容易出错的地方 |
| 参照 collected/ 校准 | 找 2-3 条同类风格已收集 prompt，匹配其详细程度和措辞风格 |

### 蒸馏检查清单

对分析结果的每个维度，写入 prompt 前逐条确认：

1. **这一维度的内容是否已被风格锚点覆盖？** → 是则跳过
2. **这一维度的内容是否是区分这张图的关键？** → 否则省略或压缩为 1 个关键词

### 输出格式

蒸馏后的 prompt 应该是一段自然语言（1-3 句话），而非结构化检查清单：

```
[风格锚点] featuring [主体关键特征], [偏离预期的具体元素]。文字: [精确引用] or 无文字。约束: [高概率失败点]。
```

也可以使用 JSON 结构化格式，参考 `collected/` 中已有的 JSON prompt 示例。无论格式，核心原则是**只写风格锚点无法自动推断的部分**。

## 推文文本的利用

如果推文包含博主心得，可以用于：

1. **确认图片类型** — 博主可能直接说明了目的
2. **获取技术参数** — 如 "使用了 GPT Image 2"、"DALL-E"
3. **了解创作意图** — 如 "想要赛博朋克风格的城市"
4. **不要盲从** — 以实际图片为准，博主描述可能有偏差
