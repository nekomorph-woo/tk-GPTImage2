# 40 官方场景合成：多参考图人物插入

- **来源**: [OpenAI Cookbook - Person-in-Scene Compositing](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide)
- **来源类型**: 官方文档
- **可信度**: 一手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```python
# 将一只狗从图片2插入到图片1的场景中
prompt = """
Place the dog from the second image into the setting of image 1, right next to the woman, use the same style of lighting, composition and background. Do not change anything else.
"""

result = client.images.edit(
    model="gpt-image-2",
    input_fidelity="high",
    image=[
        open("output_images/test_woman.png", "rb"),
        open("output_images/test_woman_2.png", "rb"),
    ],
    prompt=prompt,
    size="1024x1536",
    quality="medium",
)
```

## 备注

这个官方示例展示了多参考图的"人物/元素提取+场景合成"工作流。关键技巧：(1) 按索引引用参考图（"the dog from the second image"、"the setting of image 1"）；(2) 使用 `input_fidelity="high"` 增强参考图保真度；(3) "Do not change anything else"——最小化编辑范围以减少漂移。虽然这个例子涉及的是狗而非角色，但同样的工作流可以用于将角色插入不同场景——传入角色参考图和场景参考图，让模型合成一张角色在新场景中的图片。
