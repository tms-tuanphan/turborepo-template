/**
 * Client-safe exports for Next.js (no NestJS / Swagger runtime).
 * Use `@repo/api` in Nest apps; use `@repo/api/client` in browser code.
 */
export { I18nKey } from './common/i18n/keys';
export type { I18nKeyValue } from './common/i18n/keys';
export type { ApiErrorPayload, ApiErrorDetails } from './common/http/api-error';

export type AuthUserRole = 'admin' | 'sub_admin';

export type AuthUser = {
  id: string;
  email: string;
  role: AuthUserRole;
};

export type LoginResponse = {
  user: AuthUser;
};

export type LogoutResponse = {
  success: boolean;
};

export type RegisterResponse = {
  user: AuthUser;
};

export type ForgotPasswordResponse = {
  success: boolean;
};

export type ResetPasswordResponse = {
  success: boolean;
};

export type BlogApiStatus = 'PUBLISHED' | 'UNPUBLISHED';

export type BlogCategorySummary = {
  id: string;
  displayName: string;
};

export type BlogSeoSummary = {
  metaTitle: string;
  metaDescription: string;
  primaryKeyword?: string;
};

export type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: BlogCategorySummary;
  status: BlogApiStatus;
  coverImage: string;
  author: string;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo: BlogSeoSummary;
};

export type BlogDetail = BlogListItem & {
  content: string;
};

export type AdminBlogListResponse = {
  items: BlogListItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

export type AdminBlogCategoryListResponse = {
  items: BlogCategory[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

export type BlogCategory = {
  id: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBlogCategoryBody = {
  displayName: string;
};

export type UpdateBlogCategoryBody = {
  displayName?: string;
};

export type CreateAdminBlogBody = {
  title: string;
  slug: string;
  content: string;
  description: string;
  categoryId: string;
  status: BlogApiStatus;
  coverImage: string;
  primaryKeyword?: string;
};

export type UpdateAdminBlogBody = Partial<CreateAdminBlogBody> & {
  primaryKeyword?: string | null;
};

export type AdminBlogCheckSlugResponse = {
  available: boolean;
};
