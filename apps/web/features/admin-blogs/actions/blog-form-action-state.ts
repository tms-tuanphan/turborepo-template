export type BlogFormFormError =
  | 'unauthorized'
  | 'slugTaken'
  | 'notFound'
  | 'invalid'
  | 'scheduleRequired'
  | 'scheduleInvalid';

export type BlogFormActionState = {
  ok: boolean;
  fieldErrors?: Partial<Record<string, string[]>>;
  formError?: BlogFormFormError;
};

export const initialBlogFormActionState: BlogFormActionState = { ok: true };
