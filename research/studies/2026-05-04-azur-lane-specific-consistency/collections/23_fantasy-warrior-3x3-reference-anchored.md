# 23 奇幻战士 3x3 网格——参考图锚定的动作一致性

- **来源**: [SelfieLab](https://selfielab.me/blog/chatgpt-image-gen-character-sheet-mastery-tutorial-20260220)
- **来源类型**: 博客示例
- **可信度**: 社区来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
Using this reference image exactly for the character's face, build, and skin tone: create a fantasy warrior character sheet showing 9 poses in a 3x3 grid layout. Each cell should be a distinct pose: (1) front standing, (2) side profile, (3) back view, (4) drawing sword, (5) shield block, (6) battle roar, (7) kneeling wounded, (8) victory stance, (9) casual rest. Maintain the exact same face, body proportions, and skin tone across all 9 panels. Do not change any character features. Style: dark fantasy illustration, dramatic lighting, detailed armor and weapons. Clean grid layout with thin border lines separating each pose.
```

## 备注

SelfieLab 的参考图锚定模板。对碧蓝航线战斗角色的直接启示：

1. **"Using this reference image exactly for the character's face, build, and skin tone"**——这是参考图锚定的标准写法，碧蓝航线角色可以扩展为"for the character's face, build, skin tone, rigging, and faction accessories"
2. **9 个动作编号明确指定**：碧蓝航线角色的动作网格可以包含战斗姿势（舰装展开）、日常姿势、表情变化等
3. **"detailed armor and weapons"**——碧蓝航线的舰装本身就是"armor and weapons"的组合，这个描述可以直接使用
4. **"Maintain the exact same face, body proportions, and skin tone across all 9 panels"**——碧蓝航线角色应额外添加"and rigging structure across all panels"
5. **动作网格 vs 转角度网格**：转角度网格（front/side/back）用于锁定静态外貌，动作网格（standing/combat/wounded）用于测试动态一致性。碧蓝航线角色需要两者兼备——舰装在不同姿势下的形态变化是一致性的最大挑战
