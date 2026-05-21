/** Minimum password length (shared FE + BE). */
export const PASSWORD_MIN_LENGTH = 8;

/**
 * At least one lowercase, uppercase, digit, and special char.
 * Allowed charset: letters, digits, @$!%*?&.#_-
 */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/;

export function isValidPassword(password: string | undefined): boolean {
  return (
    typeof password === 'string' &&
    password.length >= PASSWORD_MIN_LENGTH &&
    PASSWORD_REGEX.test(password)
  );
}
