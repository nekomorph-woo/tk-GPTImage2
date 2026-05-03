# 命令参考

所有命令从项目根目录执行。

## api.mjs — 单张生成（API）

```bash
node .claude/skills/generate-image/scripts/api.mjs \
  --prompt "创建一张高级产品海报..." \
  --name product-test

# 使用提示词文件
node .claude/skills/generate-image/scripts/api.mjs \
  --prompt-file prompts/my-prompt.md \
  --name product-test
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `--prompt` | 二选一 | 直接提供提示词文本 |
| `--prompt-file` | 二选一 | 提示词文件路径 |
| `--name` | 否 | 运行名称，用于输出目录命名 |
| `--size` | 否 | 图片尺寸，不传则由模型决定 |
| `--quality` | 否 | low/medium/high，默认 medium |
| `--format` | 否 | png/jpeg/webp，默认 png |
| `--compression` | 否 | JPEG 压缩质量 0-100 |
| `--background` | 否 | 背景处理 |
| `--n` | 否 | 同一提示词生成数量，默认 1 |

## codex.mjs — 单张生成（Codex CLI）

通过 Codex CLI 内置 image_gen 工具生成图片（使用 ChatGPT Plus 订阅，不需要 API key）。

```bash
# 基本用法
node .claude/skills/generate-image/scripts/codex.mjs \
  --prompt "创建一张高级产品海报..." \
  --name codex-test

# 使用提示词文件
node .claude/skills/generate-image/scripts/codex.mjs \
  --prompt-file prompts/my-prompt.md \
  --name codex-test

# 多张生成
node .claude/skills/generate-image/scripts/codex.mjs \
  --prompt "创建一张高级产品海报..." \
  --name codex-test --n 3
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `--prompt` | 二选一 | 直接提供提示词文本 |
| `--prompt-file` | 二选一 | 提示词文件路径 |
| `--name` | 否 | 运行名称，用于输出目录命名 |
| `--n` | 否 | 生成数量，默认 1 |

不需要 `OPENAI_API_KEY`。Codex 可能对 prompt 进行额外增强（augment），实际生成的图片可能与原始 prompt 有差异。单次调用最长等待 10 分钟。
