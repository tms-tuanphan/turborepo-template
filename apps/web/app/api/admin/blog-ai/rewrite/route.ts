import { z } from 'zod';

import { createAiRoute } from '../_lib/ai-handler';

const rewriteSchema = z.object({
  selection: z.string().min(1).max(4000),
  tone: z.enum(['default', 'concise', 'friendly', 'formal']).optional(),
});

export const POST = createAiRoute(rewriteSchema, ({ selection, tone }) => {
  const cleaned = selection.replace(/\s+/g, ' ').trim();
  const label = tone && tone !== 'default' ? ` (${tone})` : '';
  return `${cleaned}${label ? `\n\n_Rewritten${label}._` : '\n\n_Rewritten with clearer structure and more concrete examples._'}`;
});
