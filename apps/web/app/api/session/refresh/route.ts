import { proxyAuthPost } from '../_lib/proxy-auth-response';

export async function POST() {
  return proxyAuthPost('refresh');
}
