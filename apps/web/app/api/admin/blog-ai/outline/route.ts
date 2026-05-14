import { z } from 'zod';

import { createAiRoute } from '../_lib/ai-handler';

const outlineSchema = z.object({
  title: z.string().trim().min(1).max(200),
  instruction: z.string().trim().max(500).optional(),
});

export const POST = createAiRoute(outlineSchema, ({ title, instruction }) => {
  const focus = instruction?.trim()
    ? `Focus area: ${instruction.trim()}\n\n`
    : '';
  return [
    `## Outline: ${title}`,
    '',
    focus,
    '1. **Hook** – Why this matters now.',
    '2. **Context** – Set the problem space and stakeholders.',
    '3. **Key insights**',
    '   - Insight one with a concrete example.',
    '   - Insight two with measurable outcomes.',
    '   - Insight three contrasting common assumptions.',
    '4. **Implementation guidance** – Practical steps the reader can follow.',
    '5. **Risks & trade-offs** – What to watch out for.',
    '6. **Wrap-up** – Key takeaways and call to action.',
  ]
    .filter(Boolean)
    .join('\n');
});
