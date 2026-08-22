import {
  prepareWithSegments,
  layoutWithLines,
  type PreparedTextWithSegments,
} from '@chenglou/pretext';

export type LayoutResult = ReturnType<typeof layoutWithLines>;
export type PretextLine = LayoutResult['lines'][number];

export interface PretextLineLayout {
  lines: PretextLine[];
  lineCount: number;
  maxLineWidth: number;
  totalHeight: number;
}

const preparedCache = new Map<string, PreparedTextWithSegments>();

export function getOrPrepareText(text: string, font: string): PreparedTextWithSegments {
  const cacheKey = font + ':::' + text;
  let prepared = preparedCache.get(cacheKey);
  if (!prepared) {
    prepared = prepareWithSegments(text, font);
    if (preparedCache.size > 200) {
      const keys = Array.from(preparedCache.keys());
      if (keys.length > 0) {
        preparedCache.delete(keys[0]);
      }
    }
    preparedCache.set(cacheKey, prepared);
  }
  return prepared;
}

export function computePretextLayout(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number
): PretextLineLayout {
  if (!text || maxWidth <= 0) {
    return {
      lines: [],
      lineCount: 0,
      maxLineWidth: 0,
      totalHeight: 0,
    };
  }

  const prepared = getOrPrepareText(text, font);
  const result = layoutWithLines(prepared, maxWidth, lineHeight);
  const lines = result.lines;

  let maxLineWidth = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].width > maxLineWidth) {
      maxLineWidth = lines[i].width;
    }
  }

  return {
    lines,
    lineCount: lines.length,
    maxLineWidth,
    totalHeight: lines.length * lineHeight,
  };
}
