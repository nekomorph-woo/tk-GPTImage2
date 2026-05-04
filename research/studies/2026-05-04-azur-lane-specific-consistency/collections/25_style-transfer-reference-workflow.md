# 25 官方风格迁移工作流——碧蓝航线官方美术风格的保持

- **来源**: [OpenAI Cookbook - Style Transfer](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide)
- **来源类型**: 官方文档
- **可信度**: 一手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```python
# 将输入图片的风格应用到新主体上
prompt = """
Use the same style from the input image and generate a man riding a motorcycle on a white background.
"""

result = client.images.edit(
    model="gpt-image-2",
    image=[
        open("input_images/pixels.png", "rb"),
    ],
    prompt=prompt,
    size="1024x1536",
    quality="medium",
)
```

## 备注

OpenAI 官方提供的风格迁移示例，虽然关注的是"风格一致性"而非"角色一致性"，但对碧蓝航线角色有以下启示：

1. **碧蓝航线的官方美术风格保持**：可以使用风格迁移策略——上传碧蓝航线官方立绘作为风格参考，生成新角色时使用"Use the same style from the input image"
2. **风格与角色分离**：风格迁移展示了"保留风格、更换主体"的能力——反过来也可以"保留角色、更换风格"或"同时保持角色和风格"
3. **碧蓝航线不同画师风格的差异**：碧蓝航线由多位画师创作不同角色，每个角色都有独特的美术风格。Enterprise（画师：ako）和 Z52（画师：saru）的画风差异明显。如果需要保持特定角色的画风，可以上传该角色的官方立绘作为风格参考。
4. **编辑端点适合风格保持**：官方示例使用 edit 端点实现风格迁移，这比 generate 端点更适合需要同时保持角色和风格的场景
