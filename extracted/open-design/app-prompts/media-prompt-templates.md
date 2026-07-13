# prompt-templates.ts (daemon)

Source: `apps/daemon/src/media/prompt-templates.ts`

This file is pure plumbing/types — it is a registry loader, not a source of
literal prompt text. It scans `<projectRoot>/prompt-templates/{image,video}/*.json`
on every list call, parses each hand-curated JSON entry, validates it against
the `PromptTemplate` shape (id, surface, title, summary, category, tags,
optional model/aspect, `prompt` string, source attribution block), and
returns them sorted (image before video, alphabetical by title) for display
in the gallery UI. `readPromptTemplate` resolves a single template by
surface + id (guarding against path traversal via `id`).

No literal instructional/prompt text is authored in this TypeScript file
itself — the actual prompt strings live in the JSON files under
`prompt-templates/image/*.json` and `prompt-templates/video/*.json` at the
repo root (each JSON object has its own `prompt` field, e.g. entries like
`3d-stone-staircase-evolution-infographic.json`, `anime-martial-arts-battle-illustration.json`,
`ancient-guardian-dragon-rescue.json`). Those JSON files were out of scope for
this extraction pass (only the `.ts` loader was requested); flagged here
since they are the actual prompt-content source this loader serves.

Summary: **no prompt text to extract from this file — plumbing/types only.**
