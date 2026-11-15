# PromptForge user guide

A plain-language tour. You don't need any experience with AI to start.

## 1. Find your way around

The sidebar groups everything by what you're doing:

- **Learn:** the *Learning path* (lessons) and the *Library* (500+ ready-made templates)
- **Create:** the *Prompt builder* (guided) and the *Workbench* (where you write, run and refine)
- **Ship:** the *Harness studio* (agents) and *Evals* (testing)
- **Tools:** *Council* (decision help) and *Scout* (discovers new templates)

Press **⌘K** (Mac) or **Ctrl K** (Windows/Linux) anywhere to search pages, lessons and the whole library.

The dot at the bottom of the sidebar shows whether the server is connected to Claude. In **offline mode** you can still learn, build, analyze and export; only running prompts needs the connection.

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

## 5. Test it properly with Evals

From the Workbench, click **Create eval suite**:

1. Add **cases**: different values for your variables (typical, tricky and adversarial inputs).
2. Add **checks** to each case: *contains*, *does not contain*, *regex*, *word limits*, *valid JSON*, or *Graded by Claude* with a plain-language rubric.
3. Click **Run**. You'll see pass/fail per check and a pass-rate history over time.
4. Change one thing in the prompt, run again, and compare.
5. **promptfoo YAML** exports the suite so it can run in CI.

## 6. Design an agent in the Harness studio

Start from a template (code review, support, research) or a blank harness, then work through the layers on the left:

- **Mission & identity:** the agent's role, goal and definition of done
- **Guardrails:** safety behaviors added to the system prompt
- **Project memory:** becomes `CLAUDE.md`
- **Tools, Skills, Subagents:** the agent's capabilities
- **Evals:** cases that prove it works

The **Readiness** checklist shows what's missing. **Download .zip** gives you the files, ready for Claude Code and the Claude API.

## 7. Explore the Library

Search by task ("code review", "PRD", "RAG"), then filter by type, domain and level. Open an item to read it, copy it, save it as a favorite, open it in the Workbench, or add a skill to a harness.

## 8. Council and Scout

- **Council:** describe a decision; five advisors analyze it independently and a chairman summarizes where they agree and disagree.
- **Scout:** enter a topic; Claude proposes new skills and agents, which pass safety and quality checks before you can save them to your library.

## Your data

Everything you create is stored in this browser. Use **Settings → Export workspace** to back it up or move it to another computer, and **Import** to bring it back. Settings also shows an estimate of what your runs have cost and lets you set a spend alert.
