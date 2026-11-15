# build-clipboard-prompt.ts

Source: `apps/web/src/lib/build-clipboard-prompt.ts`

Triggered by the "Continue in CLI" button in the web app. When a user wants
to resume an Open Design project mid-flight from a fresh local `claude` CLI
session, this builds the literal Markdown text that gets copied to their
clipboard, to be pasted/read as the session kickoff. Per the file's header
comment, this is the single-source-of-truth template for issue #451 / spec
§3.4, and the trailing `<!-- TODO -->` line is an intentional "blank task
slot" that must NOT be pre-filled.

## buildClipboardPrompt(...)

Template literal (with `${...}` interpolation placeholders left as-is):

```
# Continue in CLI — ${project.name}

You're picking up an Open Design project mid-flight in a fresh `claude` CLI session. Run `claude` at the working directory below; the design intent is captured in `DESIGN.md` at the project root.

## Working directory

```
${projectDir}
```

## Authoritative spec

Read `DESIGN.md` first. It contains:
- Summary
- Brand & Voice
- Information Architecture
- Components & Patterns
- Visual System
- Open Questions
- Provenance

The Provenance section names the project ID, design system, current artifact, transcript message count, and generated UTC timestamp. If the spec is stale (current state has moved past the provenance), surface that to the user before acting.

## Operating rules for this session

- Treat `DESIGN.md` as the authoritative source of design intent. Don't re-derive design decisions from chat history unless `DESIGN.md` is missing or contradicts current artifacts.
- The visual system, route table, and shared state contracts are documented in the existing project files — read what's there before introducing new patterns.
- No new build steps, lockfile churn, or dependency additions without surfacing.
- For shell-out tooling (`pnpm`, `curl`, `ps`), filesystem traversal beyond the project, or daemon-level debugging, you're in the right place — proceed.

## Project context

- Project name: ${project.name}
- Project ID: ${project.id}
- Design system: ${designMdState.designSystemId ?? 'none'}
- Current artifact: ${designMdState.currentArtifact ?? 'none'}
- Transcript message count when DESIGN.md was generated: ${transcriptCount}
- DESIGN.md generated at: ${generatedAt}

## Your task

<!-- TODO: describe what you want this session to do. -->
```

Where:
- `generatedAt` = `designMdState.generatedAt.toISOString()` if a finite date, else the literal string `unknown`.
- `transcriptCount` = `String(designMdState.transcriptMessageCount)` if numeric, else the literal string `unknown`.
