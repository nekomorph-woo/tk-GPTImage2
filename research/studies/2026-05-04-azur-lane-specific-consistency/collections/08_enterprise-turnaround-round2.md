# 08 Enterprise 简化转角度表——Round 2 迭代优化

- **来源**: 项目内部生成记录（codex-cli）
- **来源类型**: 一手样本
- **可信度**: 一手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
A professional Japanese character setting page of Enterprise, Azur Lane.

Character:
- Name: Enterprise
- Faction: Eagle Union
- Hair: Long silver-white hair with a prominent ahoge (cowlick), twin-tails
- Eyes: Gray-blue, sharp
- Body: Slender, medium height
- Outfit: White and blue navy uniform with gold trim, short pleated skirt, thigh-high stockings
- Accessories: Cat-ear headband with anchors, mechanical rigging (aircraft carrier flight deck structure) attached to arms and back, bow-shaped weapon
- Distinctive features: Silver-white ahoge, anchor-motif cat ears, mechanical aircraft carrier rigging

Layout (16:9 horizontal):
Full body turnaround only: front view (center), side view (right), back view (left), A-pose, consistent proportions across all views.
Text labels: 'Front', 'Side', 'Back' under each view, 'Enterprise - Azur Lane' at top.
Color palette bar at bottom with 6 color swatches.

Style: professional Japanese character setting page, anime, clean line art
Background: clean warm-gray (#D5D0C8) studio backdrop
Lighting: even studio lighting, soft shadows

Consistent proportions, exact same face across all views. Natural hands, correct finger count, proper neck proportions.
```

## 图片样例

- 生成 2 张，尺寸 1672x941（16:9）
- 生成时间：约 1-2 分钟/张

## 备注

这是 Enterprise 角色设定页的第二轮迭代，相比第一轮做了以下简化：

1. **去除了表情面板和服装分解**——只保留转角度，降低单图信息密度
2. **舰装描述调整**：从"skeletal metal wings with red tips"变为"aircraft carrier flight deck structure attached to arms and back, bow-shaped weapon"——更接近游戏实际设计（弓形武器是 Enterprise 的标志性元素）
3. **服装描述微调**：从"dark navy-blue naval officer's jacket"变为"white and blue navy uniform"——更接近游戏立绘的配色
4. **增加 bow-shaped weapon**——这是 Enterprise 的核心识别特征，第一轮遗漏了

这个迭代展示了碧蓝航线角色 prompt 优化的典型过程：每一轮都需要对照游戏实际立绘来校准描述，确保舰装形态、服装配色、标志性武器的准确性。
