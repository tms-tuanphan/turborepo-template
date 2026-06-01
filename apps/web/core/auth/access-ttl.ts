/** Mirrors Nest `JWT_ACCESS_EXPIRES_IN` (apps/api/.env). */
export function getAccessTtlMs(): number {
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
  const match = /^(\d+)([smhd])$/.exec(expiresIn.trim());
  if (!match) {
    return 15 * 60 * 1000;
  }
  const value = Number.parseInt(match[1] ?? '0', 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return value * (multipliers[unit ?? 'm'] ?? 60 * 1000);
}
