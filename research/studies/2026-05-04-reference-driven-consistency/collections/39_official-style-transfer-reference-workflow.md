# 39 官方风格迁移参考工作流（保留风格 + 更换主体）

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

这是 OpenAI 官方提供的风格迁移示例。虽然它关注的是"风格一致性"而非"角色一致性"，但展示了参考图的另一种使用模式：保留参考图的视觉语言（色调、纹理、笔触、胶片颗粒等），同时完全更换主体。这种模式可以与角色一致性结合使用——先创建一个角色的风格参考图，然后在后续生成中同时保持角色身份和风格一致。关键的简洁指令："Use the same style from the input image"。
