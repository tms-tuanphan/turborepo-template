import { NextResponse } from 'next/server';
import type { z } from 'zod';

import { auth } from '@/auth';

const SIMULATED_LATENCY_MS = 350;

type Handler<TInput> = (input: TInput) => Promise<string> | string;

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wraps a Zod-validated POST handler with auth + simulated latency for the
 * mock AI endpoints under /api/admin/blog-ai.
 */
export function createAiRoute<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  handler: Handler<z.infer<TSchema>>,
): (request: Request) => Promise<NextResponse> {
  return async function POST(request: Request) {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid_body', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await delay(SIMULATED_LATENCY_MS);
    const result = await handler(parsed.data);
    return NextResponse.json({ result });
  };
}
