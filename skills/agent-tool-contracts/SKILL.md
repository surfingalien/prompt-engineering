---
name: agent-tool-contracts
description: Use to design typed tool contracts for an agent (names, descriptions, strict JSON schemas, error shapes, idempotency, side-effect classification and provenance fields) so tool calls are predictable, safe to retry and auditable.
metadata:
  title: "Tool contracts for agents"
  kind: skill
  domain: agents
  level: advanced
  pack: agent-engineering
  source: "PromptForge · agent engineering series; topics from ml4t/skills (Apache-2.0): agent-tool-contracts, and muratcankoylan/Agent-Skills-for-Context-Engineering (MIT): tool-design"
  tags: [agents, tools, schemas, safety]
---

# Tool Contract Design

Capabilities the agent needs: {{capabilities}}
Backends / APIs available: {{backends}}

For each tool, define:
1. **Name**: verb_noun, specific (`search_orders`, not `search`)
2. **Description**: what it does, **when to use it and when not to**, what it returns, its limits, and its side effects
3. **Input schema**: strict JSON Schema, `additionalProperties: false`, required fields, enums for closed sets, formats and examples in descriptions
4. **Output shape**: consistent fields, plus `source` and `retrieved_at` provenance for data tools, and truncation markers for large results
5. **Errors**: a structured error with a message the model can act on ("date must be YYYY-MM-DD; got 03/04"), returned as a tool result rather than thrown
6. **Side-effect class**: read-only / reversible write / irreversible. Irreversible tools require confirmation and support dry runs
7. **Idempotency**: an idempotency key for writes, so retries are safe

Keep the tool set small and non-overlapping; merge near-duplicates.

## Output
The tool definitions as Messages API JSON (strict), a table of side-effect classes and approval rules, and 3 adversarial test calls per write tool (bad input, retry, injection in returned data).
