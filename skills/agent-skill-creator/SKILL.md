---
name: agent-skill-creator
description: Use to turn a repeatable workflow into a well-formed Agent Skill (SKILL.md with name and description frontmatter, concise instructions, examples, and optional scripts and references) that triggers at the right time and loads only what it needs.
metadata:
  title: "Skill creator: write a SKILL.md"
  kind: skill
  domain: agents
  level: intermediate
  pack: agent-engineering
  source: "PromptForge · agent engineering series; format per the Agent Skills specification (anthropics/skills: spec and skill-creator)"
  tags: [skills, claude-code, agents, authoring]
---

# Skill Creator

Workflow to package: {{workflow}}
Example tasks where it should trigger: {{trigger_examples}}
Tasks where it should NOT trigger: {{non_trigger_examples}}

## Rules for a good skill
1. **Folder**: `skill-name/SKILL.md`, with an optional `scripts/`, `references/` and `assets/`. The name is lowercase-hyphenated and matches the folder
2. **Frontmatter**: `name`, and a `description` (≤ 1024 chars) that says **what it does and when to use it**. The description is always loaded; Claude decides from it whether to read the rest. Include trigger phrases
3. **Body**: concise, imperative instructions; the workflow as steps; output format; one or two short examples. Aim for under ~500 lines, and move long reference material into `references/` that the body points to (progressive disclosure)
4. **Scripts** for anything deterministic or fiddly (parsing, calculations), so the model doesn't regenerate them each time
5. **No secrets**, no hidden instructions, and no network calls the user wouldn't expect: skills run with the agent's permissions
6. **Test**: run 3 trigger and 2 non-trigger prompts; check the skill fires correctly and the output follows the format

## Output
The complete SKILL.md, any scripts or references outlined, and the test prompts with expected behavior.
