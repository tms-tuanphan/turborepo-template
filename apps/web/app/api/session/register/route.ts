import { proxyAuthPost } from '../_lib/proxy-auth-response';

export async function POST(request: Request) {
  const body = await request.text();

  return proxyAuthPost('register', {
    headers: {
      'Content-Type': request.headers.get('content-type') ?? 'application/json',
    },
    body,
  });
}
