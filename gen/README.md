# gen — 生图工作空间

`/generate-image` 技能的私有目录，存放生图相关的输入、输出和实验数据。

## 子目录

| 目录 | 用途 |
|------|------|
| `experiments/` | 批量实验矩阵 JSON（如 `starter.json`、`axis-lab.json`） |
| `inputs/` | 参考图和遮罩，`refs/` 放参考图，`masks/` 放遮罩 |
| `outputs/` | API 生成的图片和 metadata.json（按时间戳+名称分子目录） |
| `chatgpt-queue/` | ChatGPT Plus 提示词队列文件（`.md` 格式） |

## 对应技能

`/generate-image` — 单张生成、批量实验、参考图编辑、ChatGPT 队列模式。
