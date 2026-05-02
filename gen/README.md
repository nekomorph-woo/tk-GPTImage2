# gen — 生图工作空间

`/generate-image` 技能的私有目录，存放生图相关的实验数据和输出结果。

## 子目录

| 目录 | 用途 |
|------|------|
| `experiments/` | 用户创建的实验矩阵 JSON（从 `references/` 模板复制） |
| `outputs/` | 生成的图片和 metadata.json（按时间戳+名称分子目录） |

## 实验矩阵模板

实验矩阵模板在 `.claude/skills/generate-image/references/` 下：

| 模板 | 用途 |
|------|------|
| `starter-template.json` | 入门模板：不同完整 prompt 各跑一次 |
| `axis-lab-template.json` | 单变量对照模板：共享 base prompt，每个 run 只改一个维度 |

使用时复制到 `gen/experiments/` 再修改：

```bash
cp .claude/skills/generate-image/references/starter-template.json gen/experiments/my-experiment.json
```

## 对应技能

`/generate-image` — 单张生成（API）、批量实验（API/Codex）、Codex CLI 生图（无需 API Key）。
