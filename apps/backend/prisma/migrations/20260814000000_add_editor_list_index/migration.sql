-- Editor paper list queries filter on (uploaderId, source, isDeleted)
-- then order by updatedAt. The existing per-column indexes cannot serve
-- that sort, forcing a sort on every /editor list page.
CREATE INDEX IF NOT EXISTS "Paper_editor_list_idx"
ON "Paper" ("uploaderId", source, "isDeleted", "updatedAt");
