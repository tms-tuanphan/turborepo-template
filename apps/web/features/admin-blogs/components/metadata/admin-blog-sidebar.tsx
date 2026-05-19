'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BLOG_CATEGORIES, type BlogCategory } from '@/shared/types/blog';
import type { Messages } from '@/shared/i18n';

import {
  ADMIN_BLOG_STATUSES,
  type AdminBlogStatus,
} from '../../validations/blog.schema';
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

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-card/50 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
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
    <div className="space-y-6 xl:sticky xl:top-14">
      <SidebarSection title={t.sections.publish}>
        <div className="space-y-2">
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
        </div>
      </SidebarSection>

      <SidebarSection title={t.sections.metadata}>
        <div className="space-y-2">
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
        </div>
      </SidebarSection>

      <SidebarSection title={t.sections.cover}>
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
        />
      </SidebarSection>
    </div>
  );
}
