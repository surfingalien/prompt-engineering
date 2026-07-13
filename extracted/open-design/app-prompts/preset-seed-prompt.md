# presetSeedPrompt.ts

Source: `apps/web/src/components/plugins-home/presetSeedPrompt.ts`

This file does not define one static prompt string sent to an LLM. Instead it
is the shared logic that decides what short, human-editable seed text gets
dropped into the Studio composer textarea when a user picks a plugin's
"example" preset from the Home screen (the example-prompt cards on `HomeHero`
and the "Use" action in the plugin detail modal / `HomeView`). It selects
between a plugin's localized description and its `manifest.od.useCase.query`
field, deliberately avoiding "meta-instruction" query text that's meant for
the agent (not the user) once a plugin is applied. The full build spec for
the plugin still reaches the agent later via plugin context (SKILL.md +
example.html) — this function only produces the human-facing seed.

Included below are the literal instructional/detector strings embedded in
the code (regexes and comments describing generator-facing text this logic
is designed to recognize and avoid surfacing to the user).

## Meta-instruction seed detector (`isMetaInstructionSeed`)

Regex used to detect that a candidate seed string is actually a generator-facing
meta-instruction rather than a human-readable prompt:

```
/逐字注入|以\s*en\s*字段为准|verbatim|example\.html/iu
```

## Example of the kind of meta-instruction text this avoids surfacing (from code comments)

> a generator-facing meta-instruction ("follow the en field verbatim; start from example.html")

## Attribution-tail markers stripped from descriptions (`ATTRIBUTION_MARKERS`)

When composing the seed from a plugin's description, a trailing sentence that
opens with one of these markers is stripped (so the composer doesn't end on
source-provenance boilerplate):

```
Based on
Adapted from
Ported from
Inspired by
移植自
改编自
基于
源自
参考自
```

## Placeholder patterns recognized in preset query templates

Input placeholder pattern (rendered against plugin manifest input fields):

```
/\{\{\s*([a-zA-Z_][\w-]*)\s*\}\}/g
```

Argument placeholder patterns (from Home-authored prompt templates, e.g.
`{argument name="foo" default="bar"}`):

```
/\{argument\s+name=\\"([^"]+)\\"\s+default=\\"([^"]*)\\"[^}]*\}/g
/\{argument\s+name=(?:"([^"]+)"|'([^']+)')\s+default=(?:"([^"]*)"|'([^']*)')[^}]*\}/g
```

Note: The actual prompt text (`manifest.od.useCase.query`) lives in each
plugin's own manifest (`open-design.json`) under `plugins/`, not in this
source file — this file is pure selection/rendering plumbing plus the
detector/marker literals shown above.
