/**
 * Resolves a dotted i18n key (e.g. blogs.categories.it_partnership) against a messages object.
 */
export function resolveNameKey(
  messages: Record<string, unknown>,
  nameKey: string,
): string {
  const parts = nameKey.split('.');
  let node: unknown = messages;
  for (const part of parts) {
    if (node && typeof node === 'object' && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return nameKey;
    }
  }
  return typeof node === 'string' ? node : nameKey;
}
