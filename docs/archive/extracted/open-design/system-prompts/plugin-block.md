# plugin-block — "Active plugin" / "Plugin inputs" / "Plugin atoms" renderer

**Source:** `packages/contracts/src/plugins` renderer at `packages/contracts/src/prompts/plugin-block.ts`. Contracts-only, consumed by the daemon composer (`system.ts`'s `pluginBlock` input) — the daemon and any future contracts-side composer share this one definition (spec §11.8 PB1).

## What triggers/uses this prompt

`renderPluginBlock(snapshot: AppliedPluginSnapshot)` renders the `## Active plugin` / `## Plugin inputs` / `## Plugin atoms` sections that appear in the composed system prompt whenever the current project/run has an applied plugin (e.g. the user opened the project through a plugin chip on the Home screen, such as a themed template or a specialized workflow). The discovery-layer prompt (`discovery.ts`) explicitly instructs the agent to read "Plugin inputs" as equally authoritative to the turn-1 discovery form answers (see `discovery.md`), so this block's job is to surface exactly what the plugin author pre-answered.

## Output template (not a fixed string — generated per call)

```
## Active plugin

The user applied plugin **<pluginTitle or pluginId>** (`<pluginId>@<pluginVersion>`).

<pluginDescription, if present>

The plugin's example brief is: _<snapshot.query>_   [only if snapshot.query is set]

## Plugin inputs   [only if snapshot.inputs has keys]

Treat these as authoritative answers to questions the plugin author baked into the brief — do not re-ask the user about them.

- **<inputKey1>**: <value1>
- **<inputKey2>**: <value2>
[... one line per input key, sorted alphabetically; a missing/empty value renders as "(empty)" ...]

## Plugin atoms   [only if snapshot.resolvedContext.atoms has entries]

The plugin opted into these workflow atoms; prefer them over ad-hoc shortcuts:

- `<atomId1>`
- `<atomId2>`
[... one line per atom id ...]
```

## Notes

- `formatInput()` renders `undefined`/`null` as `(empty)`, an empty string as `(empty)`, and any other value via `String(value)`.
- This is structural plumbing rather than hand-authored prose — the actual instructional content is whatever the plugin author configured as `pluginDescription`, `inputs`, and `resolvedContext.atoms` for a specific plugin (plugin definitions live under `plugins/`, out of scope for this extraction pass beyond the media-template plugins already catalogued in `media-templates/`).
