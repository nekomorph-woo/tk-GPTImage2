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

### Edit 模式（参考图编辑）

传入参考图保持角色/产品一致性，使用 `/v1/images/edits` 端点。

```bash
# 单参考图
node .claude/skills/generate-image/scripts/api.mjs \
  --edit --reference character.png \
  --prompt "将角色放在海滩场景中" \
  --name beach-edit

# 多参考图（角色 + 服装分开）
node .claude/skills/generate-image/scripts/api.mjs \
  --edit --reference face.png --reference outfit.png \
  --prompt "..." \
  --name combo-edit
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `--edit` | 是 | 启用 edit 模式（与 generate 互斥） |
| `--reference` | 是 | 参考图路径（可多次使用，最多 16 张） |
| `--prompt` | 二选一 | 编辑指令 |
| `--prompt-file` | 二选一 | 编辑指令文件 |
| `--name` | 否 | 运行名称 |
| `--quality` | 否 | low/medium/high，默认 medium |
| `--format` | 否 | png/jpeg/webp，默认 png |
| `--compression` | 否 | JPEG 压缩质量 0-100 |
| `--n` | 否 | 生成数量，默认 1 |

Edit 模式自动设置 `input_fidelity: high`，最大化参考图特征保持。参考图会复制到输出目录（`ref-` 前缀），metadata.json 中记录参考图路径。

### Chat Completions 模式（OpenRouter 等第三方）

通过 Chat Completions API（`/v1/chat/completions`）+ `modalities: ["image", "text"]` 生图，适用于 OpenRouter 等第三方提供商。需在 `.env` 中设置 `OPENAI_BASE_URL`。

```bash
# 纯文本生图
node .claude/skills/generate-image/scripts/api.mjs \
  --chat --prompt "一只橘猫在窗台上看雨" \
  --name cat-chat

# 带参考图（角色一致性）
node .claude/skills/generate-image/scripts/api.mjs \
  --chat --reference character.png \
  --prompt "将角色放在海滩场景中" \
  --name beach-chat

# 指定模型
node .claude/skills/generate-image/scripts/api.mjs \
  --chat --model "openai/gpt-5.4-image-2" \
  --prompt "..." --name test
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `--chat` | 是 | 启用 Chat Completions 模式（与 generate/edit 互斥） |
| `--prompt` | 二选一 | 提示词文本 |
| `--prompt-file` | 二选一 | 提示词文件路径 |
| `--reference` | 否 | 参考图路径（可多次使用），转为 base64 放入消息 |
| `--model` | 否 | 模型名，默认 `openai/gpt-5.4-image-2` |
| `--name` | 否 | 运行名称 |
| `--n` | 否 | 生成数量，默认 1 |

Chat 模式不支持 `--size`/`--quality`/`--format`/`--background`/`--compression`。参考图通过 vision 输入传递（非专用 edit 端点），角色保持力度低于 Images API 的 edit 模式。

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
| `--proxy` | 否 | 代理地址（如 `http://127.0.0.1:7890`），改善连接稳定性 |

不需要 `OPENAI_API_KEY`。Codex 可能对 prompt 进行额外增强（augment），实际生成的图片可能与原始 prompt 有差异。单次调用最长等待 10 分钟。

代理优先级：`--proxy` 参数 > `.env` 中 `CODEX_PROXY` > 不使用代理。留空则直连。
