import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      code: 'forbidden',
      message: 'Public registration is disabled.',
    },
    { status: 403 },
  );
}
