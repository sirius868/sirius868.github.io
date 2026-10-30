import rss from '@astrojs/rss';
import { getPublishedArticles, articleUrl } from '../lib/articles';
import { site } from '../site.config';

export async function GET(context: { site: URL }) {
  const articles = await getPublishedArticles();
  return rss({
    title: site.name,
    description: site.description,
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.pubDate,
      link: articleUrl(article)
    }))
  });
}
