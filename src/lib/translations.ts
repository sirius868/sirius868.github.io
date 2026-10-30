import { getCollection, type CollectionEntry } from 'astro:content';

export type Translation = CollectionEntry<'translations'>;

let cached: Promise<Map<string, Translation>> | undefined;

export function getEnglishTranslations(): Promise<Map<string, Translation>> {
  cached ??= getCollection('translations').then((entries) => {
    const translations = new Map<string, Translation>();
    for (const entry of entries) {
      const key = `${entry.data.type}:${entry.data.slug}`;
      if (translations.has(key)) throw new Error(`Duplicate English translation: ${key}`);
      translations.set(key, entry);
    }
    return translations;
  });
  return cached;
}
