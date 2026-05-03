export function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      if (key in args) {
        if (Array.isArray(args[key])) {
          args[key].push(next);
        } else {
          args[key] = [args[key], next];
        }
      } else {
        args[key] = next;
      }
      i += 1;
    }
  }
  return args;
}

export function requireArg(args, key, message) {
  if (!args[key]) {
    throw new Error(message || `缺少必填参数 --${key}`);
  }
  return args[key];
}
