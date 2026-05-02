import fs from "node:fs";
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

export function readTextMaybeFile(value, fallbackFile) {
  if (value) return value;
  if (fallbackFile) return fs.readFileSync(path.resolve(fallbackFile), "utf8").trim();
  return "";
}
