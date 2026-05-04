# 19 官方虚拟试穿：身份保留编辑 API 示例

- **来源**: [OpenAI Cookbook - Virtual Try-On](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide)
- **来源类型**: 官方文档
- **可信度**: 一手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

### Generate（生成原始参考图）

```python
# 使用原图作为输入，生成穿着新服装的结果
result = client.images.edit(
    model="gpt-image-2",
    image=[
        open("input_images/woman_in_museum.png", "rb"),
        open("input_images/tank_top.png", "rb"),
        open("input_images/jacket.png", "rb"),
        open("input_images/tank_top.png", "rb"),
        open("input_images/boots.png", "rb"),
    ],
    prompt="""
Edit the image to dress the woman using the provided clothing images. Do not change her face, facial features, skin tone, body shape, pose, or identity in any way. Preserve her exact likeness, expression, hairstyle, and proportions. Replace only the clothing, fitting the garments naturally to her existing pose and body geometry with realistic fabric behavior. Match lighting, shadows, and color temperature to the original photo so the outfit integrates photorealistically, without looking pasted on. Do not change the background, camera angle, framing, or image quality, and do not add accessories, text, logos, or watermarks.
""",
    size="1024x1536",
    quality="medium",
)
```

### 场景合成（保持身份不变）

```python
result = client.images.edit(
    model="gpt-image-2",
    input_fidelity="high",
    image=[
        open("input_images/woman_in_museum.png", "rb"),
    ],
    prompt="""
Generate a highly realistic action scene where this person is running away from a large, realistic brown bear attacking a campsite. The image should look like a real photograph someone could have taken, not an overly enhanced or cinematic movie-poster image.
She is centered in the image but looking away from the camera, wearing outdoorsy camping attire, with dirt on her face and tears in her clothing. She is clearly afraid but focused on escaping, running away from the bear as it destroys the campsite behind her.
The campsite is in Yosemite National Park, with believable natural details. The time of day is dusk, with natural lighting and realistic colors. Everything should feel grounded, authentic, and unstyled, as if captured in a real moment. Avoid cinematic lighting, dramatic color grading, or stylized composition.
""",
    size="1024x1536",
    quality="medium",
)
```

## 备注

这两个官方 API 示例展示了参考图驱动角色一致性的两种模式：(1) 多图输入编辑——同时传入人物照片和多张服装图片，模型会替换服装而保留人物身份；(2) 场景合成——传入人物照片并生成全新的场景，使用 `input_fidelity="high"` 增强身份保真度。关键技巧：在 prompt 中用"Do not change"开头的长列表显式声明不变量，以及使用 "this person" 而非重新描述角色特征。
