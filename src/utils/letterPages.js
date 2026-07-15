/**
 * Split love letter paragraphs into 5 readable pages (exact text preserved).
 */
export function buildLetterPages(letterText) {
  const paragraphs = letterText.split("\n").filter((line) => line.trim());
  const pageSizes = [3, 2, 3, 2, 3];
  const pages = [];
  let index = 0;

  for (const size of pageSizes) {
    pages.push(paragraphs.slice(index, index + size));
    index += size;
  }

  if (index < paragraphs.length) {
    const last = pages[pages.length - 1];
    pages[pages.length - 1] = [...last, ...paragraphs.slice(index)];
  }

  return pages;
}
