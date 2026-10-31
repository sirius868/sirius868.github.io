import { test, expect } from '@playwright/test';

test('home, article flow and draft exclusion', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.brand-logo')).toBeVisible();
  await expect(page.getByRole('link', { name: 'blog 首页' })).toContainText('blog');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.orbit-one')).toHaveCSS('animation-name', 'orbit-clockwise');
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  await expect(page.getByRole('heading', { name: /来聊聊技术/ })).toBeVisible();
  await expect(page.getByText('隐秘茉莉专用测试词')).toHaveCount(0);
  await page.getByRole('link', { name: '阅读文章' }).click();
  await expect(page).toHaveURL(/\/blog\/$/);
  await expect(page.getByRole('link', { name: '下一页' })).toBeVisible();
  await page.getByRole('link', { name: '下一页' }).click();
  await expect(page).toHaveURL(/\/blog\/page\/2\/$/);
  await page.goto('/blog/page/999/');
  await expect(page.getByRole('heading', { name: '这页走丢了.' })).toBeVisible();
  await page.goto('/blog/page/2/');
  await page.getByRole('link', { name: '上一页' }).click();
  await page.goto('/blog/slow-notes/');
  await expect(page.getByRole('heading', { name: '从摘录走向自己的问题' })).toBeVisible();
  await expect(page.getByRole('img', { name: '从记录、追问、回看到重写的四步流程' })).toBeVisible();
  await expect(page.getByRole('link', { name: '全部文章' })).toBeVisible();
  await expect(page.locator('blockquote')).toHaveCount(1);
  await page.goto('/blog/private-draft/');
  await expect(page.getByRole('heading', { name: '这页走丢了.' })).toBeVisible();
});

test('home wheel advances one section and keeps header behavior scoped to home', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 850 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /来聊聊技术/ })).toBeVisible();
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type', 'y mandatory');
  await expect(page.locator('.home-panel')).toHaveCount(4);
  await expect(page.locator('.site-header')).toHaveAttribute('data-home-header-sync', 'true');
  await page.mouse.wheel(0, 460);
  await expect(page.locator('html')).toHaveClass(/home-on-contrast/);
  await expect(page.locator('#featured-heading')).toBeInViewport();
  await expect(page.locator('.home-contrast-panel').first()).toHaveCSS('color', 'rgb(245, 245, 243)');
  await expect(page.locator('.desktop-nav a[aria-current=page]')).toHaveCSS('background-image', /rgba\(100, 100, 105, 0\.62\)/);
  await expect(page.locator('.desktop-nav a').nth(1)).toHaveCSS('background-image', /rgba\(72, 72, 76, 0\.52\)/);
  await page.waitForTimeout(750);
  await page.mouse.wheel(0, 460);
  await expect(page.locator('#recent-heading')).toBeInViewport();
  await expect(page.locator('html')).not.toHaveClass(/home-on-contrast/);
  await expect(page.locator('.site-header')).toHaveClass(/is-hidden/);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('.site-header')).not.toHaveClass(/is-hidden/);
  await page.goto('/blog/');
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type', 'none');
  await expect(page.locator('.site-header')).not.toHaveAttribute('data-home-header-sync', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type', 'none');
});

test('home footer scrolls back to the closing section before recent posts', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 850 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect(page.locator('.site-footer')).toBeInViewport();
  await page.mouse.wheel(0, -460);
  await expect(page.getByRole('heading', { name: /值得认真拆解/ })).toBeInViewport();
  await expect(page.locator('html')).toHaveClass(/home-on-contrast/);
  await page.waitForTimeout(750);
  await page.mouse.wheel(0, -460);
  await expect(page.locator('#recent-heading')).toBeInViewport();
});

test('tag, about, search and theme work on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/blog/');
  expect(await page.evaluate(() => document.body.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/blog-mobile.png', fullPage: true });
  await page.getByRole('button', { name: '展开标签' }).click();
  await page.getByRole('link', { name: '写作' }).first().click();
  await expect(page.getByRole('heading', { name: '写作.' })).toBeVisible();
  await expect(page.getByRole('link', { name: '尚未发布的手稿' })).toHaveCount(0);
  await page.goto('/blog/quiet-tools/');
  await expect(page.locator('pre')).toBeVisible();
  expect(await page.evaluate(() => document.body.scrollWidth <= window.innerWidth)).toBe(true);
  await page.goto('/about/');
  await expect(page.getByRole('heading', { name: '你好，我是 yh。' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '教育经历' })).toBeVisible();
  await expect(page.getByRole('link', { name: '华南师范大学' })).toBeVisible();
  await expect(page.getByRole('img', { name: '华南师范大学校徽' })).toBeVisible();
  await expect(page.getByText('2024–2028')).toBeVisible();
  await expect(page.getByRole('heading', { name: '经历', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: '选择主题' }).click();
  await page.getByRole('menuitemradio', { name: '深色' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.goto('/search/?q=好奇心');
  await expect(page.getByText(/找到 .* 条/)).toBeVisible();
  await expect(page.getByRole('link', { name: /阅读时，给好奇心留一条岔路/ })).toBeVisible();
  await page.goto('/search/?q=隐秘茉莉专用测试词');
  await expect(page.getByText(/没有找到/)).toBeVisible();
  await page.goto('/search/?q=打开一扇小窗');
  await expect(page.getByRole('link', { name: /把小观察带回家/ })).toBeVisible();
  await page.goto('/search/?q=MARKDOWN');
  await expect(page.getByRole('link', { name: /喜欢那些安静的工具/ })).toBeVisible();
  await page.goto('/search/');
  await expect(page.getByText('输入关键词，搜索文章、笔记和项目。')).toBeVisible();
  await page.locator('.mobile-menu summary').click();
  await expect(page.getByRole('navigation', { name: '移动端主导航' }).getByRole('link', { name: '首页' })).toBeVisible();
});

test('search groups published articles and notes without indexing the about page', async ({ page, request }) => {
  const response = await request.get('/search-index.json');
  expect(response.ok()).toBe(true);
  const items = await response.json() as { type: string; url: string }[];
  expect(items.some((item) => item.type === 'article')).toBe(true);
  expect(items.some((item) => item.type === 'note')).toBe(true);
  expect(items.some((item) => item.type === 'project')).toBe(true);
  expect(items.some((item) => item.url === '/about/' || item.url.includes('private-'))).toBe(false);

  await page.goto('/search/?q=问题');
  await expect(page.getByRole('region', { name: '文章' })).toBeVisible();
  await expect(page.getByRole('region', { name: '笔记' })).toBeVisible();
  await expect(page.getByRole('region', { name: '笔记' }).getByRole('link', { name: /为什么还要写下来/ })).toBeVisible();
  await page.goto('/search/?q=searchDocs');
  await expect(page.getByRole('region', { name: '文章' }).getByRole('link', { name: /AI Agent 的工程结构/ })).toBeVisible();
  await page.goto('/search/?q=缓存击穿');
  const cacheResult = page.getByRole('region', { name: '文章' }).getByRole('link', { name: /Caffeine \+ Redis/ });
  await expect(cacheResult.getByText('匹配位置 · 三种常见的“缓存被打穿”')).toBeVisible();
  await expect(cacheResult.locator('mark')).toHaveText('缓存击穿');
  await expect(cacheResult).toHaveAttribute('href', /#.+/);
  await page.goto('/search/?q=脑海里');
  const noteResult = page.getByRole('region', { name: '笔记' }).getByRole('link', { name: /为什么还要写下来/ });
  await expect(noteResult.getByText('匹配位置 · 正文')).toBeVisible();
  await expect(noteResult.locator('mark')).toHaveText('脑海里');
  await page.goto('/search/?q=一点帮助');
  await expect(page.getByText(/没有找到/)).toBeVisible();
});

test('projects, bilingual search material, and browser favicon are connected', async ({ page, request }) => {
  await page.goto('/projects/');
  await expect(page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '项目' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('[data-deck-card][data-state="front"]')).toContainText('Blog');
  await page.getByRole('button', { name: '下一个项目' }).click();
  await expect(page.locator('[data-deck-card][data-state="front"]')).toContainText('WhaleMall');
  await expect(page.locator('[data-deck-card][data-state="front"]').getByRole('link', { name: '查看源码' })).toHaveCount(0);
  await page.locator('[data-deck-card][data-state="front"]').getByRole('link', { name: '查看项目' }).click();
  await expect(page).toHaveURL(/\/projects\/whalemall\/$/);
  await expect(page.getByRole('heading', { name: 'WhaleMall' })).toBeVisible();
  await expect(page.locator('.project-detail a[href*="github.com"]')).toHaveCount(0);
  await page.goto('/projects/');
  await page.getByRole('button', { name: '下一个项目' }).click();
  await page.getByRole('button', { name: '01Blog' }).click();
  await expect(page.locator('[data-deck-card][data-state="front"]')).toContainText('Blog');
  await page.getByRole('link', { name: '查看项目' }).click();
  await expect(page).toHaveURL(/\/projects\/blog-site\/$/);
  await expect(page.getByRole('heading', { name: '想解决什么' })).toBeVisible();
  await page.getByRole('link', { name: 'Switch to English' }).click();
  await expect(page).toHaveURL(/\/en\/projects\/blog-site\/$/);
  await expect(page.getByRole('heading', { name: 'What it solves' })).toBeVisible();
  await page.goto('/search/?q=阅读体验');
  await expect(page.getByRole('region', { name: '项目' }).getByRole('link', { name: /Blog/ })).toBeVisible();
  const chineseMaterial = await page.locator('.liquid-search').evaluate((element) => getComputedStyle(element).backgroundImage);
  await page.goto('/en/search/?q=static');
  await expect(page.getByRole('region', { name: 'Projects' }).getByRole('link', { name: /Blog/ })).toBeVisible();
  await expect(page.locator('.glass-search-button')).toBeVisible();
  expect(await page.locator('.liquid-search').evaluate((element) => getComputedStyle(element).backgroundImage)).toBe(chineseMaterial);
  const icon = await request.get('/favicon.png');
  expect(icon.ok()).toBe(true);
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/projects/');
  expect(await page.evaluate(() => document.body.scrollWidth <= window.innerWidth)).toBe(true);
});

test('article table of contents and circular reading progress work on desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto('/blog/backend-multi-level-cache/');
  const progress = page.getByRole('progressbar', { name: '文章阅读进度' });
  const desktopToc = page.locator('.article-toc');
  await expect(desktopToc).toBeVisible();
  await expect(progress.locator('.progress-value')).toContainText('%');
  await desktopToc.getByRole('link', { name: '更新时，真正难的是“旧答案”' }).click();
  expect(await page.evaluate(() => decodeURIComponent(location.hash))).toBe('#更新时真正难的是旧答案');
  await expect.poll(async () => Number(await progress.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(progress).toHaveAttribute('aria-valuenow', '100');
  await expect(progress.locator('.progress-value')).toHaveText('100%');

  await page.setViewportSize({ width: 320, height: 700 });
  await page.reload();
  await expect(desktopToc).toBeHidden();
  const mobileToc = page.locator('.article-toc-mobile');
  await expect(mobileToc).toBeVisible();
  await mobileToc.locator('summary').click();
  await expect(mobileToc.getByRole('link', { name: 'Caffeine 到底是什么' })).toBeVisible();
  expect(await page.evaluate(() => document.body.scrollWidth <= window.innerWidth)).toBe(true);
});

test('English interface keeps navigation local and labels untranslated content', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Switch to English' }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Articles' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Articles' }).click();
  await expect(page).toHaveURL(/\/en\/blog\/$/);
  await page.getByRole('link', { name: /Caffeine \+ Redis/ }).first().click();
  await expect(page.getByText('This article is available in Chinese only.')).toBeVisible();
  await expect(page.locator('.article-body')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('link', { name: 'Switch to Chinese' })).toHaveAttribute('href', '/blog/backend-multi-level-cache/');
  await page.goto('/en/notes/why-i-write/');
  await expect(page.getByRole('heading', { name: 'Why I Still Write Things Down' })).toBeVisible();
  await expect(page.locator('.article-body')).toHaveAttribute('lang', 'en');
  await page.goto('/en/search/?q=idea');
  await expect(page.getByRole('region', { name: 'Notes' }).getByRole('link', { name: /Why I Still Write Things Down/ })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/en/blog/');
  await expect(page.getByRole('button', { name: 'Show tags' })).toBeVisible();
  await page.getByRole('button', { name: 'Show tags' }).click();
  await expect(page.getByRole('button', { name: 'Hide tags' })).toHaveAttribute('aria-expanded', 'true');
  expect(await page.evaluate(() => document.body.scrollWidth <= window.innerWidth)).toBe(true);
});

test('keyboard navigation and reduced motion remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '跳到正文' })).toBeFocused();
  await page.getByRole('link', { name: '跳到正文' }).press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await expect(page.locator('.orbit-one')).toHaveCSS('animation-name', 'none');
});

test('theme follows system and survives unavailable storage', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: '选择主题' }).click();
  await page.getByRole('menuitemradio', { name: '跟随系统' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.screenshot({ path: 'test-results/home-dark.png', fullPage: true });
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('unavailable'); } });
  });
  await page.reload();
  await page.getByRole('button', { name: '选择主题' }).click();
  await page.getByRole('menuitemradio', { name: '深色' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('hero light tracks pointer and header compacts while scrolling', async ({ page }) => {
  await page.goto('/');
  const button = page.locator('[data-glow-button]');
  await expect(button).toBeVisible();
  await button.hover({ position: { x: 15, y: 12 } });
  const leftX = await button.evaluate((element) => element.style.getPropertyValue('--glow-x'));
  await button.hover({ position: { x: 95, y: 12 } });
  const rightX = await button.evaluate((element) => element.style.getPropertyValue('--glow-x'));
  expect(parseFloat(rightX)).toBeGreaterThan(parseFloat(leftX));

  const header = page.locator('.site-header');
  await page.evaluate(() => scrollTo(0, 300));
  await expect(header).toHaveClass(/is-scrolled/);
  await page.evaluate(() => scrollTo(0, 900));
  await expect(header).toHaveClass(/is-hidden/);
  await page.evaluate(() => scrollTo(0, 400));
  await expect(header).not.toHaveClass(/is-hidden/);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(header).not.toHaveClass(/is-scrolled/);
});

test('theme menu supports keyboard navigation and dismissal', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: '选择主题' });
  await trigger.focus();
  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('menuitemradio', { name: '浅色' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitemradio', { name: '深色' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

for (const width of [1100, 320]) {
  test(`pagination controls stay aligned at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/blog/');
    const first = await page.locator('.page-count').evaluate((element) => element.getBoundingClientRect().top + scrollY);
    const next = await page.getByRole('link', { name: '下一页' }).boundingBox();
    await page.getByRole('link', { name: '下一页' }).click();
    const second = await page.locator('.page-count').evaluate((element) => element.getBoundingClientRect().top + scrollY);
    const nextSlot = await page.locator('.pagination > :last-child').boundingBox();
    expect(first && second && next && nextSlot).toBeTruthy();
    expect(Math.abs(first - second)).toBeLessThan(35);
    expect(Math.abs(next!.x - nextSlot!.x)).toBeLessThan(2);
  });
}

test('page number input jumps to a valid article page', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.getByRole('spinbutton', { name: '目标页码' })).toHaveCSS('border-top-width', '1px');
  await expect(page.locator('.page-jump span')).toHaveCSS('border-top-width', '0px');
  await page.getByRole('spinbutton', { name: '目标页码' }).fill('2');
  await page.getByRole('button', { name: '跳转到指定页' }).click();
  await expect(page).toHaveURL(/\/blog\/page\/2\/$/);
  await page.getByRole('spinbutton', { name: '目标页码' }).fill('1');
  await page.getByRole('button', { name: '跳转到指定页' }).click();
  await expect(page).toHaveURL(/\/blog\/$/);
  await page.getByRole('spinbutton', { name: '目标页码' }).fill('99');
  await page.getByRole('button', { name: '跳转到指定页' }).click();
  await expect(page).toHaveURL(/\/blog\/$/);
});

test('header navigation gives smooth hover and press feedback', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveCSS('scrollbar-gutter', 'stable');
  const nav = page.getByRole('navigation', { name: '主导航' });
  await expect(nav.getByRole('link', { name: '笔记' })).toHaveCSS('backdrop-filter', /blur/);
  const homeShellX = await page.locator('.site-shell').evaluate((element) => element.getBoundingClientRect().x);
  await page.goto('/search/');
  const searchShellX = await page.locator('.site-shell').evaluate((element) => element.getBoundingClientRect().x);
  expect(Math.abs(homeShellX - searchShellX)).toBeLessThan(1);
  for (const label of ['首页', '文章', '笔记', '关于', '搜索']) {
    const link = nav.getByRole('link', { name: label });
    await link.hover();
    await expect(link).toHaveCSS('transition-property', /transform/);
    await expect(link).toHaveCSS('transform', /matrix/);
  }
  await nav.getByRole('link', { name: '文章' }).click();
  await expect(page).toHaveURL(/\/blog\/$/);
});

test('notes list and detail exclude drafts', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '笔记' }).click();
  await expect(page).toHaveURL(/\/notes\/$/);
  await expect(page.getByRole('heading', { name: '为什么还要写下来' })).toBeVisible();
  await expect(page.getByText('未发布的笔记')).toHaveCount(0);
  await expect(page.locator('.note-item')).toHaveCount(4);
  await page.getByRole('spinbutton', { name: '目标页码' }).fill('2');
  await page.getByRole('button', { name: '跳转到指定页' }).click();
  await expect(page).toHaveURL(/\/notes\/page\/2\/$/);
  await expect(page.getByRole('heading', { name: '先完成第一小步' })).toBeVisible();
  await page.getByRole('link', { name: '上一页' }).click();
  await page.getByRole('link', { name: /为什么还要写下来/ }).click();
  await expect(page).toHaveURL(/\/notes\/why-i-write\/$/);
  await expect(page.getByText('一个想法如果只留在脑海里')).toBeVisible();
  await page.goto('/notes/private-thought/');
  await expect(page.getByRole('heading', { name: '这页走丢了.' })).toBeVisible();
  await page.goto('/notes/page/999/');
  await expect(page.getByRole('heading', { name: '这页走丢了.' })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/notes/');
  expect(await page.evaluate(() => document.body.scrollWidth <= window.innerWidth)).toBe(true);
});

test('tag filters collapse to one row and expand on demand', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/blog/');
  const filter = page.locator('[data-tag-filter]');
  const toggle = page.getByRole('button', { name: '展开标签' });
  await expect(toggle).toBeVisible();
  await expect(filter).toHaveClass(/is-collapsed/);
  const firstRowFits = await filter.locator('.pill-row').evaluate((element) => {
    const firstTag = element.querySelector('a');
    return firstTag !== null && firstTag.getBoundingClientRect().bottom <= element.getBoundingClientRect().bottom;
  });
  expect(firstRowFits).toBe(true);
  const visibleRowHeight = await filter.locator('.pill-row').evaluate((element) => element.getBoundingClientRect().height);
  const hiddenTags = filter.locator('a[aria-hidden="true"]');
  expect(await hiddenTags.count()).toBeGreaterThan(0);
  await toggle.click();
  await expect(filter).not.toHaveClass(/is-collapsed/);
  await expect(page.getByRole('button', { name: '收起标签' })).toHaveAttribute('aria-expanded', 'true');
  expect(await filter.locator('.pill-row').evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThan(visibleRowHeight);
  await expect(hiddenTags).toHaveCount(0);
  await page.getByRole('button', { name: '收起标签' }).click();
  await expect(filter).toHaveClass(/is-collapsed/);

  await page.goto('/blog/page/2/');
  await expect(page.getByRole('button', { name: '展开标签' })).toBeVisible();
  await expect(page.locator('.site-footer').getByRole('link', { name: 'RSS' })).toHaveCount(0);
  await page.setViewportSize({ width: 1100, height: 800 });
  await expect(page.locator('.tag-filter-toggle')).toBeVisible();
});
