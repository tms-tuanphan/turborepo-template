import { z } from 'zod';

import { createAiRoute } from '../_lib/ai-handler';

const summarizeSchema = z.object({
  content: z.string().min(1).max(20000),
});

const SUMMARY_MAX = 280;

export const POST = createAiRoute(summarizeSchema, ({ content }) => {
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= SUMMARY_MAX) return plain;
  const truncated = plain.slice(0, SUMMARY_MAX);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : SUMMARY_MAX).trimEnd()}…`;
});
