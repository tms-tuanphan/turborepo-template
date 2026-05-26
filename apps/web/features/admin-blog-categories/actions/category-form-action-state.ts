export type CategoryFormError =
  | 'unauthorized'
  | 'forbidden'
  | 'conflict'
  | 'inUse'
  | 'notFound'
  | 'invalid';

export type CategoryFormActionState = {
  ok: boolean;
  fieldErrors?: Partial<Record<string, string[]>>;
  formError?: CategoryFormError;
};

export const initialCategoryFormActionState: CategoryFormActionState = {
  ok: true,
};
