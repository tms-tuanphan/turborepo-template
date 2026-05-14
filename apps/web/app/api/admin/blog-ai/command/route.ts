import { z } from 'zod';

import { createAiRoute } from '../_lib/ai-handler';

const commandSchema = z.object({
  prompt: z.string().trim().min(1).max(500),
  context: z.string().trim().max(200).optional(),
});

export const POST = createAiRoute(commandSchema, ({ prompt, context }) => {
  const heading = context ? `### About "${context}"` : '### Suggestion';
  return [
    heading,
    '',
    `_Prompt:_ ${prompt}`,
    '',
    'Here is a draft paragraph that addresses the request with two supporting bullets:',
    '',
    '- **Why it matters:** a one-sentence rationale tying the topic to reader goals.',
    '- **What to do next:** an actionable step the reader can take immediately.',
  ].join('\n');
});
