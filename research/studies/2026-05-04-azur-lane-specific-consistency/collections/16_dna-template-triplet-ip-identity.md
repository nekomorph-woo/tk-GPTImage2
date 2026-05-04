# 16 三胞胎姐妹 DNA Template——多角色 IP 识别锚点策略

- **来源**: [OpenAI Community - polepole](https://community.openai.com/t/need-for-character-consistency-and-style-locking-in-image-generation/1232362)
- **来源类型**: 社区讨论
- **可信度**: 社区来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
All images must be wide size 3:2 aspect ratio watercolor anime style images.
In this session, we are creating a sequence of visual scenes titled 'The Harmony of Three'.
The focus is on capturing subtle emotional moments between triplet sisters Hi, Fu, and Mi.
Each image builds the atmosphere of quiet connection and narrative continuity.
Keep all visual elements stable across images: characters, style, tone, and background environment.
All scenes take place in a serene coastal village with sakura trees, paper lanterns, and pastel-toned skies.

This scene features three identical triplet sisters named Hi, Fu, and Mi.
All three girls have identical appearances:

- Light tan skin, round face with soft cheeks, and large almond-shaped hazel eyes.
- Straight, shoulder-length silky black hair with front bangs.
- They are average height, slender with graceful posture, and have flat stomachs and elegant proportions.
- They wear traditional pastel pink dresses with slight variation:
  - Hi wears a pink hair ribbon
  - Fu wears a silver pendant
  - Mi holds a small light brown diary
- Their expressions are calm and emotionally reflective.
  Their appearance must remain perfectly consistent in every image.

Render in soft anime watercolor style, with gentle linework and muted pastel tones.
Use ambient diffused lighting, with no hard shadows or saturation changes between scenes.
Backgrounds should use soft, desaturated colors with a gentle painterly effect.
Maintain a cinematic horizontal composition with medium-wide shot unless otherwise specified.

I will provide scenes. and you will create one by one, and each one is wide size 3:2 aspect ratio watercolor anime style images.
```

## 备注

这个 prompt 对碧蓝航线多角色一致性的直接启示：

1. **差异化标记物策略**：三姐妹的基础外观完全相同，通过微小的差异标记物（丝带/吊坠/日记本）区分——碧蓝航线同一阵营的角色可能有相似的配色方案，也可以用类似的标记物策略区分（如不同的发饰、武器类型、阵营标识位置）
2. **"must remain perfectly consistent in every image"**——显式的一致性声明在多角色场景中尤其重要
3. **全局锁定**：在 DNA Template 中锁定格式（3:2）、风格（watercolor anime）、环境（coastal village with sakura）——碧蓝航线的多角色场景也应该锁定阵营配色和游戏美术风格
4. **碧蓝航线应用**：同阵营角色（如白鹰阵营的多角色场景）可以使用类似的 DNA Template 结构，将阵营的共享视觉元素作为全局锁定，角色个体差异作为标记物
