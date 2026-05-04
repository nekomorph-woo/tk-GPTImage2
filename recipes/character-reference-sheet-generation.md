# Recipe：日系动漫角色设定集

生成日系动漫风格的角色设定集（turnaround + 表情 + 服装细节 + 色板），作为后续场景生成的参考基础。

## 适用场景

需要为动漫/游戏角色（如碧蓝航线舰娘）建立完整视觉 baseline，用于后续多场景、多姿态、多表情生成。特别适合需要大量同角色产出的场景。

## 核心原理

```
Step 1: Generate（生成角色设定集）
  日系设定页关键词 + 完整角色描述 + 标准组件布局 → 输出多视角设定集

Step 2: Edit（基于设定集生成新场景）
  设定集作为参考图 + 不变量声明 + 新场景描述 → 输出保持身份的新场景图
```

## 提示词结构

### Step 1：生成日系角色设定集

```text
A professional Japanese character setting page of [角色名], [作品名].

Character:
- Name: [角色名]
- Faction: [阵营]
- Age: [年龄]
- Hair: [发型], [发色], [发型细节如 ahoge/twin-tails]
- Eyes: [眼睛颜色和形状]
- Body: [体型]
- Outfit: [完整服装描述，包含材质]
- Accessories: [所有配饰，逐个描述]
- Distinctive features: [最独特的 2-3 个视觉标识]

Layout (16:9 horizontal):
Left section: Full body turnaround (front view, side view, back view), A-pose, consistent proportions across all views
Right section top: 6 facial expressions (neutral, happy, angry, sad, surprised, shy)
Right section middle: Outfit breakdown with close-up details of accessories, rigging, and weapons
Right section bottom: Color palette (6-8 color swatches)

Style: professional Japanese character setting page, anime, clean line art
Background: clean warm-gray (#D5D0C8) studio backdrop, no clutter
Lighting: even studio lighting, soft shadows, no harsh shadows
Text labels: "Front", "Side", "Back" under each view, character name at top

Maintain exact same face and body proportions across all panels.
Consistent proportions, identical styling throughout.
Natural hands, correct finger count, proper neck proportions, symmetrical shoulders.
```

### Step 2：基于设定集生成新场景

```text
Using the character from the uploaded reference sheet, create [场景描述].

Preserve unchanged:
- Face, hairstyle, hair color, eye color, expression
- Body proportions and skin tone
- Outfit design, colors, materials, and accessories
- All distinctive features and rigging

Change only:
- [新环境/背景]
- [新姿态/动作]

Keep everything else the same. Do not alter the character's identity or appearance in any way.
```

## 关键参数

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| size | 1536x1024 | 16:9 横版，设定集需要横向空间 |
| quality | medium | 身份敏感场景用 medium |
| 风格关键词 | "professional Japanese character setting page" | 日系设定页专用关键词 |
| 画幅 | 16:9 横版 | 内容丰富的设定集推荐比例 |

## 一致性关键词清单

在 prompt 尾部作为约束指令：
- `consistent proportions`
- `exact same face`
- `identical styling`
- `maintain exact same face and body proportions across all panels`
- `do not change appearance`

## 负面约束

在 prompt 末尾添加：
- `Natural hands, correct finger count`
- `Proper neck proportions, symmetrical shoulders`
- `Consistent limb lengths`
- `Do not mix multiple art styles`
- `Consistent shadow direction`

## 变体

- **变体 A：Reference-Interference 提取**：已有碧蓝航线官方立绘时，传入角色立绘 + 空白转角度模板，使用 "extract the character from image 1 using the turnaround format from image 2" 句式。省去手动描述步骤。
- **变体 B：3x3 表情/姿势表**：将 16:9 布局改为 3x3 网格，9 个格子分别指定表情和姿势名称。适合专门生成表情集或姿势集。
- **变体 C：Production Bible 完整设定集**：扩展为 11 板块完整设定集（参考 recipe `reference-driven-character-consistency` 中的变体 A），适合需要最全面角色记录的场景。

## 失败规避

- 角色描述词必须逐字复用，不可使用近义词替换
- 从简单布局（仅 turnaround）开始，确认一致性后再增加表情/细节面板
- 避免在 prompt 中出现 "reference sheet" / "multiple views"，可能触发模型自行展开
- 设定集作为参考图后，编辑 prompt 必须声明参考图来源
- 色板组件不可省略，影响后续生成的色彩一致性

## 验证记录

- 2026-05-04：❌ 未通过，2 轮验证均未达 70% 阈值。Round 1（完整设定集布局）19.5/30，Round 2（简化为仅三视角turnaround+色板）19.5/30。核心瓶颈：GPT Image 2 无法在单次生成中可靠产出结构化多视角设定集。Step 2 编辑模式有效但 Step 1 设定集生成不稳定。推荐使用 `reference-driven-character-consistency` recipe 作为替代。来源 `research/studies/2026-05-04-character-reference-sheet/`
