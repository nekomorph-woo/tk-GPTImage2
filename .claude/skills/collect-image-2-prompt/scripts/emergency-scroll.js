// 紧急滚动：大幅向下滚动触发 X 无限滚动加载新内容
// 用法: bb-browser eval "$(cat scripts/emergency-scroll.js)" --tab <n>
// 返回 JSON: {articlesBefore, scrollDistance}
// 注意：不修改 smart-scroll.js，本脚本独立使用

(() => {
  const before = document.querySelectorAll('article').length;
  window.scrollBy({ top: 3000, behavior: 'instant' });
  return JSON.stringify({ articlesBefore: before, scrollDistance: 3000 });
})();
