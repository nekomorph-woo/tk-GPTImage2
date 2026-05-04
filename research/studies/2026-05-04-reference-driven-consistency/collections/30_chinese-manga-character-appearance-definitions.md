# 30 中文漫画长篇叙事（角色外貌在多场景中保持）

- **来源**: [@dotey](https://x.com/dotey/status/2046778077905056068)
- **来源类型**: 社区画廊
- **可信度**: 社区来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
Generate a full color Chinese-text manga about this OpenAI research scientist, 陈博远 (first picture), who works on improving the text rendering capability of ChatGPT Image 2 model for the upcoming release. (in the background there is boba tea and a banana taped to the wall with a single slice of duct tape). The model can render insanely small Chinese text when he tried generating some detailed and beautiful multilingual infographics handdrawn-style poster about his hometown, 无锡 on his computer screen. His hard work pays off and the team was impressed by the absurdly good quality of multilingual text performance of his model, seeing all the languages it can write. When he takes a break with one hand holding his phone, he received a translated text message from Sam Altman on his phone (avatar attached as second picture), asking him to take a look at the rendered multilingual text in an image he just generated to congrat the team, since Sam only knows English. However, make it funny by let Boyuan outrage (typical manga style) at the end by seeing Sam's generated image contains a "稳稳地接住你" phrase at the central location in an otherwise perfectly rendered image that's used to congrat the team, because this sentence has been memed as an unnatural but funny Chinese sentence GPT likes to use on Chinese internet. Boyuan should rage "天呐! 它又学会了接住!" (with teammates as tiny heads on the side, sweating and saying in Chinese "we are working hard to fix it!"). At the very bottom of the manga, add a tiny line of footnote (very tiny) in Chinese that "note: the entire manga, including this footnote and picture in picture, are all generated with gpt image 2 at once without editing or multiple steps。"

Additional Instructions: Use vertical 1440x2560 image layout, with first row about this researcher working hard, second row about his result on 无锡 with multiple languages, third row shows the team excitement, fourth row split into left and right where left shows he takes a break and the phone received a message, right panel shows Sam's text message, and fifth row shows Sam's picture and 陈博远's reaction. No narration except for the first row. Avoid Chinese map. All characters should be in manga style. The banana background should only appear in the first panel and the tape should be a single slice of tape, not a cross tape. The banana and tape decoration should be small as a insignificant easter egg for people to find. OpenAI logo shall only appear on 陈博远's cloth, not elsewhere. No mugs in the scene since we already have the boba. Sam should only appear in the text message panel.
```

## 图片样例

- ![样例 1](https://pbs.twimg.com/media/HGedwzEWsAAv40i?format=jpg&name=small)
- ![样例 2](https://pbs.twimg.com/media/HGc-Y7XWMAAbiS6?format=jpg&name=small)

## 备注

这是一个超长叙事漫画 prompt，在 5 行分镜中需要保持陈博远的角色一致性。关键技巧：(1) 使用真实人物照片（"first picture"）作为角色参考；(2) 在 "Additional Instructions" 中逐面板定义布局和约束；(3) 多处否定约束（"No mugs"、"No Chinese map"、"Sam should only appear in the text message panel"）防止元素漂移。该 prompt 证明了即使是非常长的叙事 prompt，只要角色参考图清晰且约束明确，GPT Image 2 也能在多面板中保持角色一致性。
