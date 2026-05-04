(() => {
  // 展开 Show more 按钮
  const showMoreBtn = document.querySelector('button[data-testid="tweet-text-show-more-link"]');
  if (showMoreBtn) showMoreBtn.click();

  // 提取图片（仅主推文，排除引用推文的图片）
  // 通过 photo link 的 status ID 区分：photo link 指向当前页面 URL 的才是主推文图片
  const currentStatusId = window.location.pathname.match(/\/status\/(\d+)/)?.[1] || '';
  const article = document.querySelector('article');
  const images = [];
  if (article) {
    const photoLinks = article.querySelectorAll('a[href*="/status/"][href*="/photo/"]');
    for (const link of photoLinks) {
      if (currentStatusId && !link.href.includes(`/status/${currentStatusId}/photo/`)) continue;
      const img = link.querySelector('img[src*="pbs.twimg.com/media"]');
      const src = img?.src || '';
      if (src && !images.includes(src)) {
        images.push(src);
      }
    }
  }

  // 提取作者（取第一行，通常是 @username）
  const authorEl = document.querySelector('[data-testid="User-Name"]');
  const author = authorEl ? authorEl.textContent.split('\n')[0].trim() : '';

  // 提取推文文本（主推文的第一个 tweetText）
  const tweetText = document.querySelector('[data-testid="tweetText"]');
  const text = tweetText ? tweetText.textContent : '';

  return JSON.stringify({ images, author, text });
})();
