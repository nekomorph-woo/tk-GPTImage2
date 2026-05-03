# #004

- **来源**: [@tadasgedgaudas](https://x.com/tadasgedgaudas/status/2046877643929166330)
- **采集时间**: 2026-05-03
- **Prompt 位置**: 主推文
- **搜索词**: gpt-image-2 prompt

## Prompt

```json
{"image_settings": {"aspect_ratio": "3:4", "resolution": {"width": 1152, "height": 1536}}, "prompt": {"identity_lock": {"reference": "input_photo", "preserve": ["face", "facial proportions", "eye shape", "nose", "lips", "skin tone", "skin texture", "hairline", "overall identity"], "rules": ["no face swap", "no beautify", "no smoothing", "no reshaping", "no AI look"]}, "scene": {"camera_angle": "high-angle downward shot, POV", "composition": "MacBook screen fills most of the frame, thin strip of physical keyboard visible at the bottom", "screen_surface": ["visible RGB pixel grid", "subtle moire effect", "micro dust on glass", "faint fingerprints", "soft ambient reflections"]}, "digital_interface": {"os": "macOS dark mode", "background_app": {"name": "Spotify", "view": "Liked Songs", "visible_tracks": ["Blank Space – Taylor Swift", "Shake It Off – Taylor Swift", "Cruel Summer – Taylor Swift", "Love Story – Taylor Swift"]}, "foreground_app": {"name": "Photo Booth", "state": "live preview window", "position": "floating, center-right"}}, "photo_booth_content": {"environment": {"room": "dim bedroom", "background": "off-white wall, rumpled bedding", "lighting": "low-light, nocturnal, cool screen glow mixed with warm skin tones"}, "subject": {"pose": "lying down, relaxed, candid", "expression": "natural, slightly relaxed", "outfit": "light-colored tank top", "prop": {"item": "iPhone 15 Pro", "hand": "right hand"}}}, "realism_rules": ["this is a photo of a screen, not a screenshot", "raw smartphone photo look", "natural noise", "imperfect glass", "no studio lighting", "no HD polish"]}, "negative_prompt": ["screenshot", "flat UI", "perfect screen", "clean glass", "studio lighting", "beauty filter", "cartoon", "3d render", "painting", "watermark", "blurred face"]}
```

## 用途

生成一张高角度俯拍的 MacBook 屏幕照片，屏幕上显示 macOS 暗色模式桌面（Spotify + Photo Booth），Photo Booth 窗口中呈现暗光卧室中的人像自拍，整体模拟手机拍摄屏幕的真实质感，包含摩尔纹、指纹、灰尘等细节。

## 标签

identity-lock, screen-photography, photo-booth, macos-dark-mode, spotify, high-angle, POV, realism, moire-effect, candid-portrait

## 图片样例

- ![样例 1](https://pbs.twimg.com/media/HGf4UAFXUAEljhB?format=jpg&name=small)
- ![样例 2](https://pbs.twimg.com/media/HGf4T-WWMAApqXd?format=jpg&name=small)
- ![样例 3](https://pbs.twimg.com/media/HGf326bW4AAAiUx?format=jpg&name=small)
- ![样例 4](https://pbs.twimg.com/media/HGf326cXgAA16Ua?format=jpg&name=small)

## 原始文本

GPT-Image-2 VS Nano Banana

Prompt:

{"image_settings": {"aspect_ratio": "3:4", "resolution": {"width": 1152, "height": 1536}}, "prompt": {"identity_lock": {"reference": "input_photo", "preserve": ["face", "facial proportions", "eye shape", "nose", "lips", "skin tone", "skin texture", "hairline", "overall identity"], "rules": ["no face swap", "no beautify", "no smoothing", "no reshaping", "no AI look"]}, "scene": {"camera_angle": "high-angle downward shot, POV", "composition": "MacBook screen fills most of the frame, thin strip of physical keyboard visible at the bottom", "screen_surface": ["visible RGB pixel grid", "subtle moire effect", "micro dust on glass", "faint fingerprints", "soft ambient reflections"]}, "digital_interface": {"os": "macOS dark mode", "background_app": {"name": "Spotify", "view": "Liked Songs", "visible_tracks": ["Blank Space – Taylor Swift", "Shake It Off – Taylor Swift", "Cruel Summer – Taylor Swift", "Love Story – Taylor Swift"]}, "foreground_app": {"name": "Photo Booth", "state": "live preview window", "position": "floating, center-right"}}, "photo_booth_content": {"environment": {"room": "dim bedroom", "background": "off-white wall, rumpled bedding", "lighting": "low-light, nocturnal", "cool screen glow mixed with warm skin tones"}, "subject": {"pose": "lying down, relaxed, candid", "expression": "natural, slightly relaxed", "outfit": "light-colored tank top", "prop": {"item": "iPhone 15 Pro", "hand": "right hand"}}}, "realism_rules": ["this is a photo of a screen, not a screenshot", "raw smartphone photo look", "natural noise", "imperfect glass", "no studio lighting", "no HD polish"]}, "negative_prompt": ["screenshot", "flat UI", "perfect screen", "clean glass", "studio lighting", "beauty filter", "cartoon", "3d render", "painting", "watermark", "blurred face"]}}
