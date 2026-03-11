export function extractBodyContent(fullHtml: string): {
  headWrapper: string;
  bodyContent: string;
  tailWrapper: string;
} {
  const bodyOpenMatch = fullHtml.match(/<body[^>]*>/i);
  const bodyCloseMatch = fullHtml.match(/<\/body>/i);

  if (!bodyOpenMatch || bodyOpenMatch.index === undefined) {
    return { headWrapper: '', bodyContent: fullHtml, tailWrapper: '' };
  }

  const bodyTagEnd = bodyOpenMatch.index + bodyOpenMatch[0].length;
  const bodyCloseStart = bodyCloseMatch?.index ?? fullHtml.length;

  return {
    headWrapper: fullHtml.slice(0, bodyTagEnd),
    bodyContent: fullHtml.slice(bodyTagEnd, bodyCloseStart).trim(),
    tailWrapper: fullHtml.slice(bodyCloseStart),
  };
}

export function reconstructHtml(
  headWrapper: string,
  bodyContent: string,
  tailWrapper: string
): string {
  if (!headWrapper && !tailWrapper) return bodyContent;
  return `${headWrapper}\n${bodyContent}\n${tailWrapper}`;
}
