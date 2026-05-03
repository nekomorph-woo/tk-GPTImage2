(() => {
  // 展开 Show more 按钮
  const showMoreBtn = document.querySelector('button[data-testid="tweet-text-show-more-link"]');
  if (showMoreBtn) showMoreBtn.click();

  // 提取图片（仅主推文 article 内的 pbs.twimg.com/media 图片）
  const article = document.querySelector('article');
  const images = [];
  if (article) {
    const imgs = article.querySelectorAll('img');
    for (const img of imgs) {
      const src = img.src || '';
      if (src.includes('pbs.twimg.com/media') && !images.includes(src)) {
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
