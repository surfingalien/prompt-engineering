---
name: agent-memory-design
description: Use to design an agent's memory architecture (working context, session scratchpad, long-term episodic and semantic memory, user preferences), deciding what to store, when to write, how to retrieve, and how to keep memory correct and private.
metadata:
  title: "Agent memory architecture"
  kind: skill
  domain: agents
  level: expert
  pack: agent-engineering
  source: "PromptForge · agent engineering series; topics from muratcankoylan/Agent-Skills-for-Context-Engineering (MIT): memory-systems, and ml4t/skills (Apache-2.0): agent-state-memory"
  tags: [agents, memory, architecture, retrieval]
---

# Agent Memory Design

Agent: {{agent_description}}
Typical session length and frequency: {{usage_pattern}}
Data sensitivity: {{sensitivity}}

## Design these layers
1. **Working context**: what must be in the prompt every turn (kept small)
2. **Session state**: plan, progress and scratch notes in files the agent re-reads (survives compaction)
3. **Long-term memory**:
   - *semantic*: stable facts and preferences ("prefers TypeScript", "deploys on Fridays are banned")
   - *episodic*: past tasks, outcomes and lessons ("migration X failed because Y")
   - *procedural*: skills and playbooks that worked
4. **Retrieval**: keyword vs. embedding vs. structured lookup; when retrieval runs (task start, on demand via a tool); and how much is injected
5. **Write policy**: what triggers a memory write; who can write; dedupe and merge; expiry and decay
6. **Correctness**: memories carry source and date; contradictions are resolved toward newer verified facts; the user can view, edit and delete (white-box memory)
7. **Privacy**: never store secrets; scope memories per user and project; retention limits

## Output
An architecture diagram in text, a schema for memory records (fields), the read/write rules as a short policy, failure modes (stale or poisoned memory, over-retrieval), and how you'd evaluate whether memory improves task success.
