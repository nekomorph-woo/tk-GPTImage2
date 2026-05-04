# 07 Enterprise 樱花场景编辑——设定页作为参考图的角色一致性

- **来源**: 项目内部生成记录（codex-cli）
- **来源类型**: 一手样本
- **可信度**: 一手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
Using the character from the uploaded reference sheet, create a serene spring scene with cherry blossom petals falling. The character sits on a wooden bench in a Japanese garden, looking up at the pink blossoms with a gentle smile.

Preserve unchanged:
- Face, hairstyle (including ahoge), hair color, eye color
- Body proportions and skin tone
- Outfit design, colors, and all accessories including carrier rigging and cat ears headband
- All distinctive features

Change only:
- Environment: Japanese cherry blossom garden with wooden bench
- Pose: sitting on bench, looking up, gentle smile
- Lighting: soft pink-tinted natural light from cherry blossoms overhead

Keep everything else the same. Do not alter the character's identity or appearance in any way.
```

## 图片样例

- 生成 2 张，尺寸 941x1672（竖版）
- 参考图：enterprise-azur-lane-character-sheet.png（设定页）
- 生成时间：约 4 分钟/张

## 备注

这是使用角色设定页（而非单张参考图）作为编辑输入的测试。关键观察：

1. **设定页 vs 单张参考图**：设定页包含多角度信息，理论上应提供更完整的角色理解，但实际效果需对比验证
2. **舰装在非战斗场景中的保留**："including carrier rigging and cat ears headband"——舰装是否应在日常场景中保留是一个设计决策点
3. **表情变化**：从参考图的"confident smile"变为"gentle smile"——这是在 Preserve/Change 框架下允许的合理变化
4. **粉色光线对角色色彩的影响**：樱花粉色光线可能与碧蓝航线的海军蓝/银白色系产生冲突，需要在 prompt 中注意光线色彩的克制
