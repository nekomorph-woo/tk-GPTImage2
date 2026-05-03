import fs from "node:fs";
import path from "node:path";
import { loadDotEnv, ensureDir, slugify, timestamp } from "./lib/env.mjs";
import { createClient, defaultImageOptions, editOptions, writeImageResult, formatDuration, getImageDimensions } from "./lib/openai-image.mjs";

export async function generate({ prompt, name, outDir = "gen/outputs", size, quality, format, background, compression, n = 1 }) {
  loadDotEnv();
  const client = await createClient();
  const params = { ...defaultImageOptions({ size, quality, format, background, compression }), prompt, n };
  const start = Date.now();
  const result = await client.images.generate(params);
  return writeImageResult({ result, prompt, params, name, outDir, generation_time_ms: Date.now() - start });
}

export async function edit({ prompt, references, name, outDir = "gen/outputs", quality, format, compression, n = 1 }) {
  loadDotEnv();
  const client = await createClient();
  const params = { ...editOptions({ prompt, references, quality, format, compression }), n };
  const start = Date.now();
  const result = await client.images.edit(params);
  return writeImageResult({ result, prompt, params, name, outDir, generation_time_ms: Date.now() - start, references });
}

export async function chatGenerate({ prompt, references = [], name, outDir = "gen/outputs", model, n = 1 }) {
  loadDotEnv();
  const client = await createClient();
  const modelName = model || process.env.OPENAI_IMAGE_MODEL || "openai/gpt-5.4-image-2";

  const runId = `${timestamp()}-${slugify(name || prompt.slice(0, 48))}`;
  const dir = path.resolve(outDir, runId);
  ensureDir(dir);

  const written = [];
  const imageSizes = [];
  const totalStart = Date.now();

  for (let i = 0; i < n; i++) {
    const genStart = Date.now();

    const content = [];
    for (const ref of references) {
      const b64 = fs.readFileSync(ref).toString("base64");
      content.push({ type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } });
    }
    content.push({ type: "text", text: prompt });

    const result = await client.chat.completions.create({
      model: modelName,
      messages: [{ role: "user", content }],
      modalities: ["image", "text"],
    });

    const message = result.choices[0].message;
    if (!message.images?.length) {
      throw new Error(`第 ${i + 1} 张图片生成失败：响应中未包含图片`);
    }

    for (const [idx, img] of message.images.entries()) {
      const dataUrl = img.image_url.url;
      const b64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
      const imagePath = path.join(dir, `${String(written.length + 1).padStart(2, "0")}.png`);
      fs.writeFileSync(imagePath, Buffer.from(b64, "base64"));
      written.push(path.resolve(imagePath));
      imageSizes.push({ ...getImageDimensions(imagePath), generation_time_ms: Date.now() - genStart, generation_time: formatDuration(Date.now() - genStart) });
    }
  }

  const copied = [];
  for (const ref of references) {
    const dest = path.join(dir, `ref-${path.basename(ref)}`);
    fs.copyFileSync(ref, dest);
    copied.push(dest);
  }

  const metadata = {
    source: "chat-completions",
    prompt,
    params: { model: modelName, n, modalities: ["image", "text"] },
    generation_time_ms: Date.now() - totalStart,
    generation_time: formatDuration(Date.now() - totalStart),
    image_sizes: imageSizes,
    written,
    created_at: new Date().toISOString(),
  };
  if (copied.length) metadata.references = copied;
  fs.writeFileSync(path.join(dir, "metadata.json"), JSON.stringify(metadata, null, 2));

  return { dir, written };
}

// CLI 入口
const { parseArgs } = await import("./lib/args.mjs");
const { readTextMaybeFile, resolveReferences } = await import("./lib/env.mjs");
const args = parseArgs();
const prompt = readTextMaybeFile(args.prompt, args["prompt-file"]);

if (prompt) {
  const isChat = !!args.chat;
  const isEdit = !!args.edit;

  if (isChat) {
    let references = [];
    if (args.reference) {
      references = Array.isArray(args.reference) ? args.reference : [args.reference];
      references = await resolveReferences(references);
    }
    const saved = await chatGenerate({ prompt, references, name: args.name, model: args.model, n: Number(args.n || 1) });
    console.log(JSON.stringify(saved, null, 2));
  } else if (isEdit) {
    if (!args.reference) throw new Error("edit 模式需要 --reference 参数指定参考图路径");
    let references = Array.isArray(args.reference) ? args.reference : [args.reference];
    references = await resolveReferences(references);
    const saved = await edit({ prompt, references, name: args.name, quality: args.quality, format: args.format, compression: args.compression, n: Number(args.n || 1) });
    console.log(JSON.stringify(saved, null, 2));
  } else {
    const saved = await generate({ prompt, name: args.name, size: args.size, quality: args.quality, format: args.format, background: args.background, compression: args.compression, n: Number(args.n || 1) });
    console.log(JSON.stringify(saved, null, 2));
  }
}
