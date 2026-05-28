-- CreateIndex
CREATE INDEX IF NOT EXISTS "Blog_status_updatedAt_idx" ON "Blog"("status", "updatedAt");
