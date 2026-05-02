// 智能滚动脚本：根据推文高度计算下一次滚动距离
// 用法: bb-browser eval "$(cat scripts/smart-scroll.js)" --tab <n>
// 返回 JSON: {currentScroll, targetScroll, actualScroll, totalArticles}

(() => {
  const els = document.querySelectorAll('article');
  const vh = window.innerHeight;
  const sy = window.scrollY;
  let target = null;

  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.top < vh && r.bottom > vh) {
      target = sy + (r.bottom - vh) + 80;
      break;
    }
  }

  if (target === null) {
    const last = Array.from(els).find(
      el => el.getBoundingClientRect().top < vh && el.getBoundingClientRect().bottom > 0
    );
    if (last) {
      target = sy + last.getBoundingClientRect().bottom + 80;
    } else {
      target = sy + 600;
    }
  }

  const dist = Math.min(Math.round(target - sy), 800);
  window.scrollBy({ top: dist, behavior: 'smooth' });

  return JSON.stringify({
    currentScroll: Math.round(sy),
    targetScroll: Math.round(target),
    actualScroll: dist,
    totalArticles: els.length
  });
})();
