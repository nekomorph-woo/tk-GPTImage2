# prepare-collection 输出规范

## 用户输入不得篡改

用户明确指定的搜索词、数量、排序等参数，必须原样传递给脚本，不得添加前缀、修改拼写或"补全"。脚本返回的命令字符串同样原样输出，不得截断或简化。

**Why:** 用户指定搜索词 "product advertising poster design" 时擅自添加 "gpt-image-2" 前缀、输出 ralph-loop 命令时截断为 "/ralph-loop"——两次都是篡改用户输入/脚本输出导致行为偏离预期。
