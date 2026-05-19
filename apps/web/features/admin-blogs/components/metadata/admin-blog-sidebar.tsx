'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { BLOG_CATEGORIES, type BlogCategory } from '@/shared/types/blog';
import type { Messages } from '@/shared/i18n';

import {
  ADMIN_BLOG_STATUSES,
  type AdminBlogStatus,
} from '../../validations/blog.schema';
import { editorPanelClass } from '../editor/editor-panel-styles';
import { AdminBlogCoverSection } from './admin-blog-cover-section';

type BlogFormMessages = Messages['admin']['blogs']['form'];
type CategoryMessages = Messages['blogs']['categories'];

type AdminBlogSidebarProps = {
  messages: BlogFormMessages;
  categoryMessages: CategoryMessages;
  status: AdminBlogStatus;
  onStatusChange: (value: AdminBlogStatus) => void;
  category: BlogCategory;
  onCategoryChange: (value: BlogCategory) => void;
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
  categoryMessages,
  status,
  onStatusChange,
  category,
  onCategoryChange,
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
        <Select
          value={category}
          onValueChange={(v) => onCategoryChange(v as BlogCategory)}
        >
          <SelectTrigger
            aria-label={t.categoryLabel}
            aria-invalid={Boolean(categoryError)}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BLOG_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {categoryMessages[c]}
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
