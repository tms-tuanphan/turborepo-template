'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Messages } from '@/shared/i18n';

import { resolveCategoryNameKey } from '../../lib/resolve-category-label';
import type { AdminBlogCategoryOption } from '../../types/admin-blog';
import {
  ADMIN_BLOG_STATUSES,
  type AdminBlogStatus,
} from '../../validations/blog.schema';
import { editorPanelClass } from '../editor/editor-panel-styles';
import { AdminBlogCoverSection } from './admin-blog-cover-section';

type BlogFormMessages = Messages['admin']['blogs']['form'];

type AdminBlogSidebarProps = {
  messages: BlogFormMessages;
  i18n: Messages;
  categories: AdminBlogCategoryOption[];
  status: AdminBlogStatus;
  onStatusChange: (value: AdminBlogStatus) => void;
  categoryId: string;
  onCategoryIdChange: (value: string) => void;
  coverImage: string;
  onCoverImageChange: (value: string) => void;
  statusError?: string;
  categoryError?: string;
  coverError?: string;
};

function SidebarCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(editorPanelClass, 'space-y-3 p-4', className)}>
      {children}
    </div>
  );
}

export function AdminBlogSidebar({
  messages,
  i18n,
  categories,
  status,
  onStatusChange,
  categoryId,
  onCategoryIdChange,
  coverImage,
  onCoverImageChange,
  statusError,
  categoryError,
  coverError,
}: AdminBlogSidebarProps) {
  const t = messages;

  return (
    <div className="space-y-4 xl:sticky xl:top-14">
      <SidebarCard>
        <span className="text-sm font-medium">{t.sidebar.statusLabel}</span>
        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as AdminBlogStatus)}
        >
          <SelectTrigger
            aria-label={t.sidebar.statusChangeLabel}
            aria-invalid={Boolean(statusError)}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ADMIN_BLOG_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {t.sidebar.statusLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {statusError ? (
          <p className="text-sm text-destructive" role="alert">
            {statusError}
          </p>
        ) : null}
      </SidebarCard>

      <SidebarCard>
        <span className="text-sm font-medium">{t.categoryLabel}</span>
        <Select value={categoryId} onValueChange={onCategoryIdChange}>
          <SelectTrigger
            aria-label={t.categoryLabel}
            aria-invalid={Boolean(categoryError)}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {resolveCategoryNameKey(i18n, c.nameKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {categoryError ? (
          <p className="text-sm text-destructive" role="alert">
            {categoryError}
          </p>
        ) : null}
      </SidebarCard>

      <SidebarCard>
        <span className="text-sm font-medium">{t.featuredImageLabel}</span>
        <AdminBlogCoverSection
          coverImage={coverImage}
          onCoverImageChange={onCoverImageChange}
          featuredImageLabel={t.featuredImageLabel}
          featuredImageUploadPrompt={t.featuredImageUploadPrompt}
          featuredImageChooseFile={t.featuredImageChooseFile}
          featuredImageReplace={t.featuredImageReplace}
          featuredImageRemove={t.featuredImageRemove}
          featuredImageInvalidType={t.featuredImageInvalidType}
          featuredImageTooLarge={t.featuredImageTooLarge}
          coverError={coverError}
          showLabel={false}
        />
      </SidebarCard>
    </div>
  );
}
