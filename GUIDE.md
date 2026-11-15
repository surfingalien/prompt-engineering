# PromptForge user guide

A plain-language tour. You don't need any experience with AI to start.

## 1. Find your way around

The sidebar groups everything by what you're doing:

- **Learn:** the *Learning path* (lessons) and the *Library* (500+ ready-made templates)
- **Create:** the *Prompt builder* (guided) and the *Workbench* (where you write, run and refine)
- **Ship:** the *Harness studio* (agents) and *Evals* (testing)
- **Tools:** *Council* (decision help) and *Scout* (discovers new templates)

Press **⌘K** (Mac) or **Ctrl K** (Windows/Linux) anywhere to search pages, lessons and the whole library.

The dot at the bottom of the sidebar shows whether you can run prompts: *Claude connected*, *Free models connected* (the server uses a free-model gateway) or *Using your key*. In **offline mode** you can still learn, build, analyze and export; only running prompts needs a connection.

## 2. New to prompting? Start with the Learning path

Open **Learning path → Level 1**. Each lesson takes about 5 minutes:

1. Read the principle.
2. Compare the **before** and **after** prompts. The circle shows each one's quality score.
3. Tick through the checklist.
4. Click **Try it in the workbench** to practice on a real exercise.
5. Mark the lesson complete. Your progress is saved in your browser.

## 3. Build a prompt without starting from a blank page

Open **Prompt builder**:

1. Pick what you're doing, e.g. *Analyze a document*.
2. Answer the questions in plain language. Not sure? Click **Load example**.
3. Switch to **Pro** to add a role, tone, examples, success criteria and safeguards.
4. Watch the composed prompt and its score update on the right.
5. Click **Open in workbench** to run it.

## 4. Run and refine in the Workbench

- **System prompt:** who Claude is and the rules that always apply (optional).
- **User message:** your request. Use `{{name}}` for parts that change; fill them in the Variables panel.
- **Run** (⌘/Ctrl + Enter) streams Claude's answer. Choose the model and **effort** (how hard Claude thinks).
- **Compare A / B** runs two models, or the current text against a saved version, side by side.
- **Reply** under an answer to continue the conversation.
- **Analyze** shows the score and specific suggestions. **Improve with Claude** rewrites the prompt and shows you exactly what changed before you accept.
- **Save version** (⌘/Ctrl + S) before big edits; the **Versions** tab lets you diff and restore.

**Deep review:** in the Analyze tab, *Review with Claude* gives an expert critique: a score, what works, and what to change.

**Exercises:** when you open a lesson exercise, *Check my answer* has Claude grade your prompt against the lesson's checklist. Pass every item to mark the lesson complete.

**Share link** copies a link to the prompt. Whoever opens it sees a preview and can save their own copy. The values you typed into variables are not included.

On a phone, the floating **Run** button runs the prompt and scrolls to the answer.

## 5. Test it properly with Evals

From the Workbench, click **Create eval suite**:

1. Add **cases**: different values for your variables (typical, tricky and adversarial inputs).
2. Add **checks** to each case: *contains*, *does not contain*, *regex*, *word limits*, *valid JSON*, or *Graded by Claude* with a plain-language rubric.
3. Click **Run**. You'll see pass/fail per check and a pass-rate history over time.
4. Change one thing in the prompt, run again, and compare. Even better: save a version first, then pick it under **Compare with** to run both versions on the same cases side by side.
   *Generate cases with Claude* drafts typical, edge and adversarial cases for you. Review them before trusting the suite.
5. **promptfoo YAML** exports the suite so it can run in CI.

## 6. Design an agent in the Harness studio

Start from a template (code review, support, research) or a blank harness, then work through the layers on the left:

- **Mission & identity:** the agent's role, goal and definition of done
- **Guardrails:** safety behaviors added to the system prompt
- **Project memory:** becomes `CLAUDE.md`
- **Tools, MCP servers, Skills, Subagents:** the agent's capabilities. MCP servers connect it to other systems (GitHub, a browser, Linear, Notion…): pick one from the list or add your own, and it becomes `.mcp.json`. Keep secrets as `${ENV_VAR}` references and start read-only
- **Evals:** cases that prove it works

The **Readiness** checklist shows what's missing. **Download .zip** gives you the files, ready for Claude Code and the Claude API.

## 7. Explore the Library

Search by task ("code review", "PRD", "RAG"), then filter by type, domain and level. Open an item to read it, copy it, save it as a favorite, open it in the Workbench, or add a skill to a harness.

## 8. Skill collections

At the top of the **Library**, six collections group 58 installable skills: a log-first trading desk, market microstructure, the volatility surface, quant research rigor, autoresearch and loop prompts, and agent & context engineering. Click a collection to filter. Open a skill to run it in the Workbench, add it to a harness, or **Download SKILL.md** to use it in Claude Code (put it in `.claude/skills/<name>/`).

The **MCP servers** collection lists 16 servers that connect agents to other systems. Open one to see what it can do, its security notes, a ready `.mcp.json` for your repository, and the `claude mcp add` command for your own machine. **Add to a harness** puts it in the Harness studio.

The trading skills are for learning and research, not financial advice. The trading-desk harness template runs in paper mode by default.

## 9. Council and Scout

- **Council:** describe a decision; five advisors analyze it independently and a chairman summarizes where they agree and disagree.
- **Scout:** enter a topic; Claude proposes new skills and agents, which pass safety and quality checks before you can save them to your library.

## 10. Your data

**Running prompts:** if this site provides a shared Claude key, it may have a daily budget or an access password. Some sites offer **free models** instead (or as well): they appear under *Free models* in every model picker, cost nothing, and ignore the effort setting. Free providers may log prompts, so keep confidential material out of them. You can always add **your own Anthropic API key** in Settings. It stays in your browser, is sent only with your requests, and is never stored on the server or included in exports.

Everything you create is stored in this browser. Use **Settings → Export workspace** to back it up or move it to another computer, and **Import** to bring it back. Settings also shows an estimate of what your runs have cost and lets you set a spend alert.
