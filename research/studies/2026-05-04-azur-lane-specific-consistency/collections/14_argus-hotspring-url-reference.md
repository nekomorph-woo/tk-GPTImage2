# 14 Argus 温泉场景——URL 参考图的角色一致性

- **来源**: 项目内部生成记录（codex-cli）
- **来源类型**: 一手样本
- **可信度**: 一手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
Anime illustration, Azur Lane Argus in a navy bikini swimsuit, relaxing in a natural outdoor hot spring. Steam rises from the warm water. Argus has long light-colored hair with antenna-like strands, gentle smile. Warm evening lighting. Clean anime linework. No text, no watermark.
```

## 图片样例

- 生成 1 张，尺寸 1536x1024（横版）
- 参考图：ref-1777829390586-3942dx.jpg（Argus 网络图片 URL）
- 生成时间：约 3 分 16 秒

## 备注

这是使用网络 URL 图片作为参考图的测试。对碧蓝航线角色一致性研究的启示：

1. **URL 参考图同样有效**：GPT Image 2 可以接受 URL 图片作为参考图，无需本地文件
2. **非官方立绘也能作为参考**：参考图不一定是游戏官方立绘，同人图、截图等都可以作为角色参考
3. **"antenna-like strands"描述**：Argus 的标志性特征是头上的天线状发饰——碧蓝航线不同角色有不同的独特头饰/发饰，这些是 prompt 中需要精确描述的关键锚点
4. **角色描述的灵活性**：此 prompt 将"navy bikini swimsuit"作为新服装，同时保留了角色的核心特征（发色、发饰、表情），展示了参考图模式下"换装不改人"的能力

碧蓝航线角色应用：不同角色的标志性头饰（如 Argus 的天线、Enterprise 的猫耳/呆毛、Z52 的双马尾）是比舰装更稳定的识别锚点，应该在所有 prompt 中保留。
