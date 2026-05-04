# Recipe：参考图驱动的角色一致性

使用参考图 + 编辑模式实现 GPT Image 2 角色 95%+ 一致性生图的两步工作流。

## 适用场景

需要在不同场景、姿态、表情下保持同一角色外观高度一致时。特别适合动漫/游戏角色（如碧蓝航线舰娘）的跨场景生成。

## 核心原理

```
Step 1: Generate（创建角色参考图）
  纯净背景 + 标准站姿 + 完整外观描述 + 柔和棚拍光 → 输出高质量参考图

Step 2: Edit（基于参考图生成新场景）
  参考图 + 不变量声明 + 新场景描述 → 输出保持身份的新场景图
```

## 提示词结构

### Step 1：创建角色参考图

```text
A full-body character reference image of [角色名], [游戏/作品名].

Appearance:
- Face: [脸型], [眼睛颜色和形状], [表情]
- Hair: [发型], [发色], [发型细节]
- Body: [体型], [身高比例]
- Outfit: [完整服装描述，从头到脚]
- Accessories: [所有配饰，逐个描述]
- Distinctive features: [最独特的 2-3 个视觉标识]

Style: [单一风格锚点，如 anime / stylized 3D / cinematic realism]
Background: clean warm-gray studio backdrop, centered composition
Pose: standing, three-quarter front view, face and hands clearly visible
Lighting: soft even studio lighting, no dramatic shadows
Color palette: [3-5 个主色]

No text, no watermark, no extra props, no clutter.
```

### Step 2：编辑模式生成新场景

```text
Using the reference character from the uploaded image, create [场景描述].

Preserve unchanged:
- Face, hairstyle, hair color, eye color, expression
- Body proportions and skin tone
- Outfit design, colors, and accessories
- All distinctive features

Change only:
- [新环境/背景]
- [新姿态/动作]
- [新光线/氛围]

Keep everything else the same. Do not alter the character's identity, appearance, or outfit in any way.
```

## 关键参数

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| size | 1024x1024 | 参考图推荐正方形，场景图按需调整 |
| quality | medium | 身份敏感场景用 medium，high 偶尔过度美化导致漂移 |
| 参考图 | 1 张参考图 | edit 端点传入 Step 1 的输出 |
| 风格锚点 | 仅 1 个 | 混合多种风格会降低一致性 |

## 不变量声明清单

编辑 prompt 中必须包含不变量声明，以下维度按需选用：

- **必选**：Face, hairstyle, hair color, eye color
- **推荐**：Body proportions, skin tone, outfit design, outfit colors
- **按需**：Accessories, distinctive features, expression, pose energy

声明格式：
- 正面：`preserve [特征列表]`
- 否定：`Do not change [特征列表]`
- 最佳实践：两种结合使用

## 变体

- **变体 A：角色设计表覆盖**：Step 1 改为生成角色设计表（多角度/多表情/多姿态/色板），将设计表作为 Step 2 的参考图。适合需要大量产出的场景。
- **变体 B：链式编辑迭代**：Step 2 的输出作为下一次 Step 2 的输入，逐步微调。适合精细化调整角色表现。
- **变体 C：多参考图合成**：Step 2 传入多张参考图（如全身图 + 面部特写 + 配饰细节），API 支持最多 16 张。适合复杂角色。

## 失败规避

- 参考图必须有纯净背景，场景元素会干扰角色特征提取
- 每次编辑 prompt 开头必须声明参考图来源（"the uploaded image / the reference character"）
- 长对话中角色会漂移，定期 Fresh Chat + 重传参考图
- 一次只改一个变量（环境 OR 姿态 OR 光线），便于定位偏移来源
- 避免在 prompt 中出现 "reference sheet" / "multiple views" 等词，会触发模型自行展开

## 验证记录

- 2026-05-04：✅ confirmed，测试主体 Enterprise（碧蓝航线），4 张图平均 29.5/30（98.3%），角色一致性 95%+。来源 `research/studies/2026-05-04-reference-driven-consistency/evaluations/round-1.json`
