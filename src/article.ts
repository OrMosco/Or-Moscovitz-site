export type ArticleBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ol'; intro?: string; items: string[] };

const LIST_ITEM = /^\s*\d+\.\s+/;

/**
 * Split article markdown into blocks. Numbered lines (1. 2. 3.) become a real
 * ordered list instead of a single paragraph.
 */
export function parseArticle(content: string): ArticleBlock[] {
  const normalized = content.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  return normalized.split(/\n\n+/).map((raw) => {
    const block = raw.trim();
    if (block.startsWith('### ')) {
      return { type: 'h3' as const, text: block.slice(4).replace(/\n/g, ' ').trim() };
    }
    if (block.startsWith('## ')) {
      return { type: 'h2' as const, text: block.slice(3).replace(/\n/g, ' ').trim() };
    }

    const lines = block.split('\n');
    if (lines.some((line) => LIST_ITEM.test(line))) {
      const intro: string[] = [];
      const items: string[] = [];
      for (const line of lines) {
        if (LIST_ITEM.test(line)) {
          items.push(line.replace(LIST_ITEM, '').trim());
        } else if (items.length === 0) {
          const text = line.trim();
          if (text) intro.push(text);
        } else if (line.trim()) {
          items[items.length - 1] = `${items[items.length - 1]} ${line.trim()}`;
        }
      }
      const introText = intro.join(' ').trim();
      return {
        type: 'ol' as const,
        intro: introText || undefined,
        items,
      };
    }

    return { type: 'p' as const, text: lines.map((line) => line.trim()).filter(Boolean).join(' ') };
  });
}
