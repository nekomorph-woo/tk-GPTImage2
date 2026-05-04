# Recipe：碧蓝航线角色一致性

碧蓝航线（Azur Lane）舰娘角色在 GPT Image 2 中高一致性生成的专项方案，覆盖舰装还原、阵营标识、IP 角色锚点等碧蓝航线专属挑战。

## 适用场景

需要生成碧蓝航线角色图片并保持与游戏原始设计高度一致时。覆盖航母、驱逐舰、轻航、重巡等不同舰种角色的生成需求。

## 核心原理

```
Step 1: 生成/获取角色参考图
  官方立绘（最佳）或纯文本生成 → 纯净背景全身图（含舰装）

Step 2: 基于参考图编辑场景
  参考图 + 完整不变量声明（含舰装）+ 新场景描述 → 输出保持身份的新场景图
```

## 提示词结构

### 角色DNA 文档（碧蓝航线专用格式）

```text
[Format]: [画幅], [构图]
[Style]: anime

Character DNA — [角色名], Azur Lane:
- Identity: [年龄], [阵营英文名], [舰种], female
- Hair: [发型], [发色], [发型细节]
- Eyes: [眼睛颜色和形状]
- Face: [脸型], [肤色]
- Body: [体型], [比例]
- Outfit: [完整服装描述，包含阵营配色和军种标识]
- Rigging: [舰装描述——按以下层次组织]
  - Overall: [舰装整体形态和规模]
  - Position: [舰装与身体的连接方式和位置]
  - Materials: [舰装材质（金属/能量/机械）]
  - Effects: [能量效果（发光线条/粒子/光束）]
  - Weapons: [武器系统（主炮/飞行甲板/鱼雷等）]
- Accessories: [非舰装配饰，如头饰、耳环、丝带等]
- Distinctive features: [最独特的 2-3 个视觉标识]

[Consistency]: This is [角色名]'s character reference — do not redesign her appearance, outfit, rigging, or accessories.
```

### 场景编辑（基于参考图）

```text
Using the reference character from the uploaded image, create [场景描述].

Preserve unchanged:
- Face, hairstyle, hair color, eye color
- Body proportions and skin tone
- Outfit design, colors, and materials
- Rigging structure, position, materials, and energy effects
- All accessories and distinctive features
- Faction colors and insignia

Change only:
- [新环境/背景]
- [新姿态/动作]

Keep everything else the same. Do not alter the character's identity, appearance, outfit, or rigging in any way.
```

## 舰装描述分层法

碧蓝航线舰装是最复杂的视觉元素，必须使用分层描述：

| 层级 | 描述内容 | 示例（Enterprise） |
|------|---------|------------------|
| Overall | 舰装整体形态 | aircraft carrier flight deck structure |
| Position | 连接方式和位置 | attached to arms and back |
| Materials | 材质 | gray metal with gold trim |
| Effects | 能量效果 | glowing cyan energy lines |
| Weapons | 武器系统 | bow-shaped weapon, catapult mechanisms |

**关键**：使用精确海军装备术语（flight deck / turret arrays / torpedo launchers / anchor chains），不要用笼统的"mechanical parts"或"weapons"。

## 识别锚点优先级

碧蓝航线角色的识别锚点按稳定性排序：

1. **标志性头饰**（最稳定）：Enterprise 猫耳头带、Z52 双马尾、Bismarck 鹿角
2. **发色 + 呆毛/特殊发型**：银白发 + ahoge、金发、红发等
3. **舰装形态**：航母甲板型、战列主炮型、驱逐鱼雷型
4. **阵营配色**：白鹰（白蓝金）、铁血（黑红）、皇家（白金红）
5. **特殊配饰**：船锚、链条、军事徽章

## 关键参数

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| size | 1024x1536 | 竖版更适合展示全身+舰装 |
| quality | medium | 身份敏感场景用 medium |
| 参考图 | 官方立绘（最佳）或生成参考图 | edit 端点传入 |
| 风格锚点 | anime | 碧蓝航线日系动漫风格 |

## 变体

- **变体 A：官方立绘直用**：直接上传碧蓝航线官方立绘作为参考图 + 简洁场景描述。还原度最高，适合不需要修改服装的场景。
- **变体 B：多参考图组合**：上传同一角色多角度官方立绘（正面+侧面+背面），让模型综合理解。适合复杂角色。
- **变体 C：风格迁移**：上传官方立绘作为风格参考 + 纯文本角色描述，保持碧蓝航线画风但生成不同角色。
- **变体 D：同阵营多角色**：建立阵营 DNA Template，包含共享视觉元素（配色、军装基础），角色个体差异用标记物区分。

## 失败规避

- 舰装必须在参考图阶段就完整包含，不要在后续阶段才添加
- 纯文本模式中角色描述信息密度不足是识别度下降的主因——舰装描述不可省略
- 新服装描述会覆盖参考图中的军装，如需换装需在 Change only 中明确说明
- 碧蓝航线 prompt 容易过度复杂化——分层次组织：核心外貌（必选）→ 舰装（推荐）→ 阵营标识（按需）
- 标志性头饰比舰装更稳定，确保头饰描述精确
- 使用竖版比例（1024x1536）展示全身+舰装，正方形裁剪会丢失舰装

## 验证记录

- 2026-05-04：⚠️ 部分通过，测试主体 Z52（铁血驱逐舰）。Step 1 参考图 21/30（70%）刚好通过，Step 2 海战场景 16/25（64%）未通过。核心特征（阵营配色、标志性头饰）还原良好，但驱逐舰小型舰装在复杂场景中一致性下降。航母角色（Enterprise）效果显著优于驱逐舰。来源 `research/studies/2026-05-04-azur-lane-specific-consistency/evaluations/round-1.json`
