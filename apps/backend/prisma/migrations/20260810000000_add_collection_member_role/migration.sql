-- Reconciliation migration (2026-08-10)
-- CollectionMember.role has been referenced by raw SQL (collection.controller.ts,
-- collection.service.ts) since Phase 4, but the column was never added to the
-- schema or a migration. On fresh databases every create/invite/member-list
-- statement failed with "column role does not exist"; on the shared cloud DB
-- the column is absent too (confirmed via information_schema).
--
-- Additive + idempotent: ADD COLUMN IF NOT EXISTS. Type matches the raw SQL
-- cast ('RESEARCHER'::"Role") used across the module.

ALTER TABLE "CollectionMember" ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'RESEARCHER';
