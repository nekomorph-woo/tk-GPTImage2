# 31 官方儿童绘本角色锚点（纯文本 Character Consistency 声明）

- **来源**: [OpenAI Cookbook - Children's Book Illustration](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide)
- **来源类型**: 官方文档
- **可信度**: 一手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

**角色锚点 Prompt：**

```
Create a children's book illustration introducing a main character.

Character:
A young, storybook-style hero inspired by a little forest outlaw,
wearing a simple green hooded tunic, soft brown boots, and a small belt pouch.
The character has a kind expression, gentle eyes, and a brave but warm demeanor.
Carries a small wooden bow used only for helping, never harming.

Theme:
The character protects and rescues small forest animals like squirrels, birds, and rabbits.

Style:
Children's book illustration, hand-painted watercolor look,
soft outlines, warm earthy colors, whimsical and friendly.
Proportions suitable for picture books (slightly oversized head, expressive face).

Constraints:
- Original character (no copyrighted characters)
- No text
- No watermarks
- Plain forest background to clearly showcase the character
```

**故事延续 Prompt（Character Consistency 部分）：**

```
Continue the children's book story using the same character.

Scene:
The same young forest hero is gently helping a frightened squirrel
out of a fallen tree after a winter storm.

Character Consistency:
- Same green hooded tunic
- Same facial features, proportions, and color palette
- Same gentle, heroic personality

Style:
Children's book watercolor illustration,
soft lighting, snowy forest environment,
warm and comforting mood.

Constraints:
- Do not redesign the character
- No text
- No watermarks
```

## 备注

OpenAI 官方提供的角色锚点 + 故事延续工作流。纯文本一致性技巧：(1) 角色锚点中包含完整的服装/表情/性格/比例描述；(2) 故事延续 prompt 中有独立的 "Character Consistency" 段落，逐项列出不变量（Same green hooded tunic / Same facial features / Same personality）；(3) "Do not redesign the character" 是标准的防漂移声明；(4) 风格锁定覆盖到比例级别（"slightly oversized head, expressive face"）。官方将此设计为 "multi-page illustration pipelines where character drift is unacceptable"。
