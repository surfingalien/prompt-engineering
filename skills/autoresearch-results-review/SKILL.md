---
name: autoresearch-results-review
description: Use in the morning to analyze an autonomous experiment log (results.tsv plus diffs), find which changes actually helped, spot metric gaming, noise and local optima, and decide what to merge and what the next night's program.md should change.
metadata:
  title: "Morning review of results.tsv"
  kind: skill
  domain: agents
  level: advanced
  pack: autoresearch
  source: "PromptForge · pattern from karpathy/autoresearch (MIT): read results.tsv in the morning instead of watching the terminal"
  tags: [autoresearch, analysis, experimentation, review]
---

# Autoresearch Morning Review

<results_tsv>
{{results_tsv}}
</results_tsv>
<kept_diffs>
{{kept_diffs}}
</kept_diffs>
Metric direction: {{direction}} · Baseline: {{baseline}} · Known run-to-run noise: {{noise}}

## Analyze
1. **Staircase**: the best-so-far curve over experiments. When did gains stop? Where were the biggest jumps?
2. **Keep / discard / crash** counts and rates; the most common crash causes
3. **Real vs. noise**: flag "keeps" whose gain is below ~2× noise. They may be luck and should be re-run
4. **Attribution**: group kept changes by type (learning rate, architecture, data, refactor…) and their total contribution
5. **Gaming check**: did any change improve the metric by weakening what it measures (e.g. evaluating on less data, changing seeds, touching eval code, shortening the time budget)? Inspect the diffs
6. **Complexity cost**: lines added vs. gain for each kept change; candidates to simplify
7. **Local optimum**: if the last N attempts all failed, the search is stuck

## Output
- A summary table and the staircase described in words
- **Merge list**: changes worth keeping, each with evidence
- **Re-run list**: suspicious or noisy wins
- **Revert list**: gamed or overly complex changes
- 3 concrete edits to program.md for the next night (new directions, tighter guards, a different budget)
