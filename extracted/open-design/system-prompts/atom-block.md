# atom-block — per-pipeline-stage prompt fragment renderer

**Source:** `packages/contracts/src/prompts/atom-block.ts`. Contracts-only (pure TS, no filesystem/DB access — lives in `packages/contracts` deliberately per spec §11.8's "single-import guarantee" so both the daemon composer and any future contracts-side composer share one definition). There is no daemon-side duplicate; the daemon's `apps/daemon/src/plugins/atom-bodies.ts` (`loadAtomBodies()`) supplies the data this renderer formats, and `system.ts`'s `activeStageBlocks` composer input consumes its output.

## What triggers/uses this prompt

This is not a fixed prompt string but a **structural renderer**: `renderActiveStageBlock({ stageId, bodies, iteration })` assembles the markdown for one "Active stage" block in a multi-stage pipeline run. Each "atom" is a small reusable prompt/workflow fragment (in practice, other SKILL.md-style bodies) associated with a pipeline stage; when the daemon's pipeline runner has `OD_BUNDLED_ATOM_PROMPTS` enabled, it calls `loadAtomBodies()` to fetch the atom bodies for the stages active in the current run, then calls this renderer per stage, and splices the resulting blocks into the composed system prompt immediately after the active plugin block (see `system.md`'s `activeStageBlocks` composer input).

If `bodies` is empty for a given stage, the function returns an empty string (skips the block entirely) so a pipeline with no bundled atom prompts for a stage doesn't add empty prompt mass.

## Output template (not a fixed string — generated per call)

```
## Active stage: <stageId>[ (iteration <N>)]

### <atomId 1>

<atom 1 body, trimmed>

---

### <atomId 2>

<atom 2 body, trimmed>

[... one "### <atomId>" + body per atom in `bodies`, separated by "---", with no trailing "---" after the last atom ...]
```

The `(iteration N)` suffix on the stage header only appears when `iteration` is passed and is greater than 0 — used for pipelines that re-run the same stage more than once in a session.

## Notes

- This is infrastructure/plumbing for prompt *composition*, not itself hand-authored instructional prose — the actual instructional content comes from whatever atom bodies (SKILL.md-style files) are loaded and passed in via `bodies`. Those atom bodies are not part of this repo's `prompts/` directories and were out of scope for this extraction pass; see the daemon's `apps/daemon/src/plugins/atom-bodies.ts` and the `plugins/` tree for where atom content actually lives.
