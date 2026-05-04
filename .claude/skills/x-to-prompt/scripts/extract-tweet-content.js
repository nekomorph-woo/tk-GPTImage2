// extract-tweet-content.js
// 从推文详情页提取完整内容：作者、正文、图片、博主评论
// 用法: bb-browser eval "$(cat .claude/skills/x-to-prompt/scripts/extract-tweet-content.js)" --tab <n>
// 输出 JSON: {author, text, images, author_comments: [{index, text}]}

(() => {
  // 1. 展开 Show more
  const showMoreBtn = document.querySelector('button[data-testid="tweet-text-show-more-link"]');
  if (showMoreBtn) showMoreBtn.click();

  // 2. 提取作者（取 User-Name 第一行，通常是 @username）
  const authorEl = document.querySelector('[data-testid="User-Name"]');
  const author = authorEl ? authorEl.textContent.split('\n')[0].trim() : '';

  // 3. 提取主推文文本
  const tweetText = document.querySelector('[data-testid="tweetText"]');
  const text = tweetText ? tweetText.textContent : '';

  // 4. 提取图片（仅主推文，通过 status ID 排除引用推文图片）
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

  // 5. 滚动到评论区
  window.scrollBy({ top: 600, behavior: 'smooth' });

  // 6. 获取前 5 条评论及作者
  const allTexts = document.querySelectorAll('[data-testid="tweetText"]');
  const replies = [];
  for (let i = 1; i < allTexts.length && replies.length < 5; i++) {
    const replyArticle = allTexts[i].closest('article');
    const replyAuthorName = replyArticle
      ?.querySelector('[data-testid="User-Name"]')
      ?.textContent.split('\n')[0].trim() || '';
    replies.push({
      index: i,
      author: replyAuthorName,
      text: allTexts[i].textContent.substring(0, 80).replace(/\n/g, ' '),
    });
  }

  // 7. 筛选博主本人的评论，提取完整文本
  const authorComments = [];
  for (const reply of replies) {
    if (reply.author === author) {
      const fullText = allTexts[reply.index]?.textContent || '';
      authorComments.push({ index: reply.index, text: fullText });
    }
  }

  // 8. 滚回顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });

  return JSON.stringify({
    author,
    text,
    images,
    author_comments: authorComments,
  });
})();
