-- Phase 6: extend CitationFormat enum with Vancouver and ACS.
-- Safe additive enum value change. pgvector untouched.

ALTER TYPE "CitationFormat" ADD VALUE 'VANCOUVER';
ALTER TYPE "CitationFormat" ADD VALUE 'ACS';
