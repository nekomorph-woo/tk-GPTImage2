# 05 Enterprise 海战场景编辑——参考图驱动的 IP 角色场景迁移

- **来源**: 项目内部生成记录（codex-cli）
- **来源类型**: 一手样本
- **可信度**: 一手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
Using the reference character from the uploaded image, create an epic naval battle scene at sunset on the open ocean. The character stands on the deck of an aircraft carrier, wind blowing through her hair, aircraft flying overhead against an orange sky.

Preserve unchanged:
- Face, hairstyle (including ahoge), hair color, eye color, expression
- Body proportions and skin tone
- Outfit design, colors, and all accessories
- Carrier rigging on back, cat ears headband, gold anchor pendant

Change only:
- Environment: open ocean aircraft carrier deck at sunset
- Pose: standing on deck with wind, dynamic stance
- Lighting: golden sunset lighting with dramatic clouds

Keep everything else the same. Do not alter the character's identity, appearance, or outfit in any way.
```

## 图片样例

- 生成 2 张，尺寸 1024x1536
- 参考图：enterprise-azur-lane-anime-reference-01.png
- 生成时间：约 4-5 分钟/张

## 备注

这是 Enterprise 参考图工作流的 Step 2——场景编辑。prompt 采用了"Preserve unchanged / Change only"的显式分区结构，这是处理碧蓝航线等复杂配饰 IP 角色的关键技巧：

1. **Preserve 区**显式列出所有需要保留的角色特征，特别是舰装（"Carrier rigging on back"）和标志性配饰（"cat ears headband, gold anchor pendant"）
2. **Change 区**限定只改变环境、姿势和光线
3. **最终声明**"Do not alter the character's identity, appearance, or outfit in any way"作为兜底指令

实际观察：编辑模式下舰装的一致性比纯文本生成显著提升，但复杂舰装细节（如飞行甲板的具体形态）仍可能发生形变。
