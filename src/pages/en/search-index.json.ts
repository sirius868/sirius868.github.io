import type { APIRoute } from 'astro';
import { render } from 'astro:content';
import { getPublishedArticles } from '../../lib/articles';
import { getPublishedNotes } from '../../lib/notes';
import { getEnglishTranslations } from '../../lib/translations';
import { articleSearchItem, noteSearchItem } from '../../lib/search';

export const GET: APIRoute = async () => {
  const [articles,notes,translations]=await Promise.all([getPublishedArticles(),getPublishedNotes(),getEnglishTranslations()]);
  const articleItems=await Promise.all(articles.map(async(article)=>{
    const translation=translations.get(`blog:${article.data.slug}`);
    const entry=translation || article;
    const {headings}=await render(entry);
    const item=articleSearchItem(article,entry.body || '',headings);
    if(translation){item.title=translation.data.title;item.description=translation.data.description;}
    return item;
  }));
  const noteItems=notes.map((note)=>{
    const translation=translations.get(`notes:${note.data.slug}`);
    const item=noteSearchItem(note,translation?.body || note.body || '');
    if(translation){item.title=translation.data.title;item.description=translation.data.description;}
    return item;
  });
  return new Response(JSON.stringify([...articleItems,...noteItems]),{headers:{'Content-Type':'application/json; charset=utf-8'}});
};
