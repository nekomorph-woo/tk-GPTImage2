# 20 官方儿童绘本：角色锚点 + 故事延续工作流

- **来源**: [OpenAI Cookbook - Children's Book Illustration](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide)
- **来源类型**: 官方文档
- **可信度**: 一手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

### Step 1 — 创建角色锚点（Character Anchor）

```python
prompt = """
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
"""

result = client.images.generate(
    model="gpt-image-2",
    prompt=prompt,
    size="1024x1536",
    quality="medium",
)
```

### Step 2 — 故事延续（Story Continuation）

```python
prompt = """
Continue the children's book story using the same character.

Scene:
The same young forest hero is gently helping a frightened squirrel
out of a fallen tree after a winter storm.
The character kneels beside the squirrel, offering reassurance.

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
"""
result = client.images.edit(
    model="gpt-image-2",
    image=[
        open("childrens_book_illustration_1.png", "rb"),
    ],
    prompt=prompt,
    size="1024x1536",
    quality="medium",
)
```

## 备注

这是 OpenAI 官方提供的完整角色锚点工作流示例。关键设计：(1) Step 1 使用 `generate` 创建纯净背景下的角色参考图——"Plain forest background to clearly showcase the character"确保没有场景干扰；(2) Step 2 使用 `edit` 传入 Step 1 的输出作为参考图，并在 prompt 中列出"Character Consistency"不变量清单（服装、面部特征、比例、色板、性格）。官方特别说明这是"designed for multi-page illustration pipelines where character drift is unacceptable"。
