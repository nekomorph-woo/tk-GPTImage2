import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function loadDotEnv(file = ".env") {
  if (!fs.existsSync(file)) return;
  const body = fs.readFileSync(file, "utf8");
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "image";
}

export function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

export function getConfig(key, defaultValue = "") {
  loadDotEnv();
  return process.env[key] || defaultValue;
}

export function readTextMaybeFile(value, fallbackFile) {
  if (value) return value;
  if (fallbackFile) return fs.readFileSync(path.resolve(fallbackFile), "utf8").trim();
  return "";
}

export async function resolveReferences(references) {
  const proxy = process.env.CODEX_PROXY;
  const { ProxyAgent, fetch: undiciFetch } = proxy ? await import("undici") : { ProxyAgent: null, fetch: globalThis.fetch };
  const dispatcher = proxy ? new ProxyAgent(proxy) : undefined;

  const resolved = [];
  for (const ref of references) {
    if (/^https?:\/\//i.test(ref)) {
      const resp = await (undiciFetch || globalThis.fetch)(ref, dispatcher ? { dispatcher } : undefined);
      if (!resp.ok) throw new Error(`下载参考图失败: ${ref} (${resp.status})`);
      const buf = Buffer.from(await resp.arrayBuffer());
      const ext = path.extname(new URL(ref).pathname) || ".jpg";
      const tmp = path.join(os.tmpdir(), `url-ref-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
      fs.writeFileSync(tmp, buf);
      resolved.push(tmp);
    } else {
      resolved.push(ref);
    }
  }
  return resolved;
}
