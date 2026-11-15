---
name: agent-harness-engineering
description: Use to design or audit the harness around an autonomous agent (locked evaluation metrics, append-only logs, rollback, sandboxing, permission and approval boundaries, budgets and kill switches) so it can run unattended safely.
metadata:
  title: "Harness engineering for autonomous agents"
  kind: skill
  domain: agents
  level: expert
  pack: agent-engineering
  source: "PromptForge · agent engineering series; topics from muratcankoylan/Agent-Skills-for-Context-Engineering (MIT): harness-engineering, and ml4t/skills (Apache-2.0): agent-governance"
  tags: [agents, harness, safety, governance, autonomy]
---

# Harness Engineering Audit

Agent and its job: {{agent}}
Tools and permissions: {{tools_and_permissions}}
How long it runs unattended: {{autonomy}}

Score each control **present / partial / missing**, citing evidence:

1. **Locked evaluation**: the metric and eval code are read-only to the agent and versioned
2. **Append-only logs**: every action and decision recorded with reason, and not editable by the agent
3. **Rollback**: every change is reversible (git, snapshots, transactions); a tested restore path
4. **Sandbox**: filesystem, network and credential isolation; least-privilege tokens; no production access by default
5. **Approval boundaries**: an explicit list of actions needing human confirmation (spend, delete, deploy, send, trade live)
6. **Budgets**: tokens, money, time and iterations; hard stops, not suggestions
7. **Kill switch**: a way to stop it immediately, and the agent stops cleanly
8. **Input trust**: tool results, web pages and files treated as data; injection tests in the eval suite
9. **Observability**: dashboards or a morning report; alerts on anomalies (spend spike, error loops)
10. **Recovery**: behavior on crash or restart (resumes from state files, idempotent steps)

## Output
A scorecard table, the top 3 gaps ranked by blast radius, and concrete implementations for each (config, code or policy text). End with the single control you'd add first if you could only add one.
