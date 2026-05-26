import type { Messages } from '@/shared/i18n';
import { resolveNameKey } from '@/shared/utils/resolve-name-key';

export function resolveCategoryNameKey(
  messages: Messages,
  nameKey: string,
): string {
  return resolveNameKey(messages as Record<string, unknown>, nameKey);
}
