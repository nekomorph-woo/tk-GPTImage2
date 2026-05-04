# 06 Enterprise 日系角色设定页——含舰装细节的完整设定表

- **来源**: 项目内部生成记录（codex-cli）
- **来源类型**: 一手样本
- **可信度**: 一手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
A professional Japanese character setting page of Enterprise (企业), Azur Lane (碧蓝航线).

Character:
- Name: Enterprise (企业)
- Faction: Eagle Union (白鹰)
- Hair: long silver-white hair reaching waist, distinctive ahoge (antenna-like strand) on top, twin-tails with black ribbons
- Eyes: piercing gray-blue eyes with sharp determined gaze
- Body: slender and athletic build, tall
- Outfit: dark navy-blue naval officer's jacket with gold trim and anchor buttons, white sailor collar, black pleated skirt, white thigh-high stockings, black leather ankle boots, gold epaulettes on shoulders
- Accessories: aircraft carrier flight deck rigging on back (skeletal metal wings with red tips), black cat ears headband with gold anchors, black choker with gold anchor pendant, white gloves
- Distinctive features: silver-white hair with ahoge, carrier rigging on back, cat ears headband, gray-blue eyes

Layout (16:9 horizontal):
Left section: Full body turnaround (front view, side view, back view), A-pose, consistent proportions across all views
Right section top: 6 facial expressions (neutral, happy, angry, sad, surprised, shy)
Right section middle: Outfit breakdown with close-up details of accessories, rigging, and weapons
Right section bottom: Color palette (6-8 color swatches)

Style: professional Japanese character setting page, anime, clean line art
Background: clean warm-gray (#D5D0C8) studio backdrop, no clutter
Lighting: even studio lighting, soft shadows, no harsh shadows
Text labels: "Front", "Side", "Back" under each view, character name "Enterprise" at top

Maintain exact same face and body proportions across all panels.
Consistent proportions, identical styling throughout.
Natural hands, correct finger count, proper neck proportions, symmetrical shoulders.
```

## 图片样例

- 生成 2 张，尺寸 1672x941（16:9）
- 生成时间：约 2-3 分钟/张

## 备注

这是专门为碧蓝航线 Enterprise 角色设计的日系设定页 prompt。关键设计决策：

1. **角色描述完全复用参考图 prompt 的 DNA**——确保设定页与参考图的一致性
2. **Outfit breakdown 特别包含"rigging, and weapons"**——碧蓝航线角色的舰装是最复杂的配饰，需要专门特写
3. **Layout 设计为左（转角度）右（表情+服装分解+色板）**——适合 16:9 横版画幅
4. **负面约束精确到解剖细节**："Natural hands, correct finger count, proper neck proportions, symmetrical shoulders"——碧蓝航线角色因复杂配饰导致手部遮挡，生成时容易出现手部错误
5. **色板数量指定为 6-8**——碧蓝航线角色的色彩系统较复杂（海军蓝、银白、金色、黑色、灰蓝），需要足够的色板展示
