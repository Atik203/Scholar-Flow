# TipTap Rich Text Editor Skill

## When to use this skill
Any task involving: the research paper editor, rich text content,
auto-save, draft/publish workflow, image upload in editor,
export to PDF, export to DOCX, TipTap extensions.

## Pre-task checklist
1. Read the editor component(s) first
2. Check auto-save debounce implementation
3. Check draft vs published state fields
4. Check image upload handler (must use S3)

## Key patterns
Auto-save: debounced (check current delay — do not change it)
States: draft (isPublished=false) and published (isPublished=true)
Images: upload to S3 via backend → insert S3 URL into TipTap node
Export PDF: server-side rendering — NOT browser window.print()
Export DOCX: server-side generation
Resizable images: tiptap-extension-resizable-image is installed

## Extensions installed
tiptap-extension-resizable-image
tiptap-resizable-image
Standard TipTap extensions (check editor config for full list)

## Critical constraints
- NEVER call save on every keystroke — use debounce
- NEVER store images as base64 inline — always S3
- NEVER use browser print for PDF export
- Draft and publish must be separate fields — never merge them
- Undo/redo history must be preserved across auto-saves

## Files to read first
apps/frontend/components/ → editor component files
