# first-prompt.ts

Source: `apps/web/src/onboarding/first-prompt.ts`

This file has no literal prompt/instruction text at all — it is pure
plumbing/analytics logic. It exports a single helper, `sentPrefilledPrompt`,
which compares (trimmed) the seed text that the Home recommendation flow
pre-filled into the Studio composer against what the user actually
submitted, to power the onboarding funnel's `has_prefilled_prompt` analytics
dimension. The actual seed/prefill text itself is generated elsewhere (see
`preset-seed-prompt.md`); this file only decides whether the user sent it
unmodified.

```ts
export function sentPrefilledPrompt(seedPrompt: string, submittedPrompt: string): boolean {
  const seed = seedPrompt.trim();
  return seed.length > 0 && submittedPrompt.trim() === seed;
}
```

No further prompt content to extract from this file.
