# PromptForge User Guide
## How to Use the App — Explained Simply

> This guide is for anyone who has never used a prompt engineering tool before.
> No tech experience needed. If you can type, you can use PromptForge.

---

## 🟢 Step 1: Open the App

Go to your web browser (like Chrome, Safari, or Firefox) and type this address:

```
https://prompt-engineering-production-67f2.up.railway.app
```

Press **Enter**. The app will open. You'll see a dark screen with buttons at the top.

**That's it. No sign-up. No password. No account needed.**

---

## 🗺️ What You're Looking At

When the app opens, you'll see **three main parts on screen**:

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ PromptForge v3  [Editor] [Council] [Techniques] [Skills] …  │  ← Top bar (navigation)
├───────────────┬──────────────────────────────┬──────────────────┤
│               │                              │                  │
│  LEFT PANEL   │      MIDDLE (Editor)         │  RIGHT PANEL     │
│               │                              │                  │
│  Your saved   │  This is where you TYPE      │  AI tools:       │
│  prompts list │  your prompt (instructions)  │  Optimizer       │
│               │                              │  Score           │
│  Search box   │  Big text box                │  Variables       │
│  at the top   │                              │  History         │
│               │  Stats below it              │                  │
└───────────────┴──────────────────────────────┴──────────────────┘
```

**The top bar** has buttons to switch between different tools. You'll use these a lot.

---

## ✏️ Step 2: Write Your First Prompt

A **prompt** is simply instructions you write to tell the AI what to do.

Click the big white text box in the middle of the screen (it says something like "Start writing your prompt...").

### What is a prompt?

Imagine you hired a very smart helper. A prompt is the note you hand them explaining the job. The clearer your note, the better their work.

**Bad prompt:**
```
Write an email.
```
(An email about what? To who? How long? What tone? The AI has to guess everything.)

**Good prompt:**
```
Write a professional email to a client named Sarah thanking her for her
business last quarter. Keep it under 100 words. Sound warm and confident.
End with an invitation to schedule a call next week.
```
(Now the AI knows exactly what to do.)

---

## 🏗️ The Magic Formula for Good Prompts

Every great prompt has these parts. You don't need all of them every time — but the more you include, the better the result.

### 1. 🎭 Give the AI a Role
Tell the AI who to pretend to be.

> "You are a friendly customer service agent for a software company."
> "You are an expert chef who specializes in Italian food."
> "You are a patient teacher explaining things to a 10-year-old."

### 2. 📋 Describe the Task Clearly
Say exactly what you want it to do.

> "Write a 3-paragraph product description for my new coffee mug."
> "List 5 reasons why exercise is important for kids."
> "Summarize the following article in 2 sentences."

### 3. 📐 Give the Format
Tell it how you want the answer structured.

> "Give your answer as a numbered list."
> "Format it as a table with two columns: Problem and Solution."
> "Write it as a short story, not bullet points."

### 4. 🎯 Add Rules or Limits
Set any special requirements.

> "Do not use technical jargon."
> "Keep it under 200 words."
> "Always use a friendly, casual tone."
> "Do not mention competitor brands."

### 5. 💡 Give an Example (Optional but Powerful)
Show the AI what a good answer looks like.

> "Here's an example of the style I want:
> Input: chocolate cake
> Output: 'A rich, indulgent treat perfect for birthdays and celebrations.'"

---

## 🧩 Using Variables — The Fill-in-the-Blanks Trick

PromptForge has a special feature called **variables**. They look like this: `{{name}}`

Write double curly braces around any word, and the app will pop up a box asking you to fill it in. This lets you write one template and reuse it forever.

**Example prompt with variables:**
```
Write a thank-you email for {{customer_name}} who purchased {{product_name}}.
Keep it under {{word_limit}} words and use a {{tone}} tone.
```

When you click **Fill Variables**, boxes appear:
- customer_name → you type: `Sarah`
- product_name → you type: `Premium Coffee Mug`
- word_limit → you type: `80`
- tone → you type: `warm and professional`

The app automatically fills it all in. Now you have a custom prompt ready to paste into Claude or ChatGPT.

---

## ⚡ Step 3: Use the Skills Library (Shortcuts!)

Don't want to write a prompt from scratch? Click **⚡ ECC Skills** in the top bar.

You'll see a grid of **300+ ready-made prompts** organized by category:

| Category | What's In There |
|----------|----------------|
| 🔴 Security | Check code for vulnerabilities |
| 🟠 Testing | Write tests for software |
| 🟣 Code | Review, simplify, document code |
| 💙 Frontend | Build websites and UIs |
| 💜 Backend | Build APIs and databases |
| 🟢 Agent | AI agent patterns |
| 🟡 DevOps | Deploy and monitor apps |
| 🔵 ML | Machine learning workflows |
| 🟩 Research | Deep research frameworks |
| ⚪ Product | Write PRDs and strategy docs |
| 📝 Writing | Blog posts, articles, content |

**How to use a skill:**
1. Click any skill card
2. It loads into the editor automatically
3. Fill in the `{{variables}}`
4. Done — paste into your AI of choice

---

## 🤖 Step 4: Explore the Agents Library

Click **🤖 Agents** in the top bar.

An **agent** is a system prompt — a set of instructions that turns an AI into a specialist. Instead of asking a general AI a question, you first give it a "personality" and expertise, then ask your question.

Think of it like hiring a consultant vs. asking a random person on the street. Same AI, totally different quality of answer.

**Example agent — "LLM Architect":**
```
You are a senior LLM architect who designs large language model systems
for production. You start with the smallest model that meets requirements.
You measure before optimizing. You recommend RAG before fine-tuning...
```

Paste this into Claude or ChatGPT's system prompt box, then ask your question. The AI will respond like a senior architect would — specific, opinionated, practical.

**Use the filter tabs** to find agents by category:
- **CCT** — 36 professional agents (fullstack engineer, DevOps, security, etc.)
- **ECC** — 7 specialist agents (architect, code reviewer, TDD guide, etc.)
- **Memory** — 8 memory workflow agents (save context, recall past work)

---

## ⚔️ Step 5: The Council — Ask 5 Experts at Once

Click **⚔ Council** in the top bar.

The Council is for when you have a hard decision to make and you want multiple perspectives. You describe your situation and 5 AI advisors each give you their honest opinion:

| Advisor | What They Do |
|---------|-------------|
| 🗡️ The Contrarian | Challenges your idea — finds what's wrong |
| 🔬 First Principles | Breaks it down to basics — what's really true here? |
| 🌐 Expansionist | Thinks bigger — what's the upside you're missing? |
| 👁️ The Outsider | Fresh eyes — what would someone new think? |
| ⚙️ The Executor | Gets practical — what are the actual steps? |

After all 5 speak, a **Chairman** synthesizes everything into one clear recommendation.

**How to use it:**
1. Click **⚔ Council** in the top bar
2. Click **Start Council Session**
3. Type your question or decision in the box
4. Press **Run Council**
5. Read each advisor's response, then the final synthesis

**Great for:** Should I build X or buy Y? Which approach is better? Is this a good idea?

---

## 🔧 Step 6: The AI Optimizer

The right panel has an **Optimize** button. This is your prompt quality booster.

Write your rough prompt first. Then click one of the 6 optimizer modes:

| Mode | What It Does |
|------|-------------|
| **Clarity** | Makes it clearer and removes ambiguity |
| **Chain of Thought** | Adds step-by-step reasoning instructions |
| **Few-Shot** | Adds examples to your prompt |
| **System Prompt** | Reformats it as a professional system prompt |
| **Concise** | Cuts it down to the essential words only |
| **Structured** | Organizes it with headers and sections |

Click **Optimize**, wait a few seconds, and the app rewrites your prompt for you. You can compare the before and after.

---

## 📊 Your Prompt Score

Below the text box, you'll see a **score from 0–100** with 5 categories:

| Category | What It Measures |
|----------|-----------------|
| **Clarity** | Is it easy to understand? |
| **Specificity** | Is it detailed enough? |
| **Context** | Does it give enough background? |
| **Structure** | Is it organized well? |
| **Completeness** | Is anything missing? |

A score above **70** is solid. Above **85** is excellent. The score updates live as you type, so you can watch it improve in real time.

---

## 💾 Saving Your Work

PromptForge saves automatically to your browser. But here's the formal way:

1. Give your prompt a **title** in the box that says "Untitled Prompt" (top of the editor)
2. Click **Save** (or press Ctrl+S / Cmd+S)
3. It appears in the **left panel** for later

To reload a saved prompt, just click its name in the left panel.

---

## 🎨 Other Tabs Worth Exploring

**Techniques** — 12 visual cards teaching the core methods used by AI researchers:
- Chain of Thought (get the AI to think step by step)
- Tree of Thoughts (explore multiple paths)
- ReAct (combine reasoning with actions)
- RAG (make the AI use your own documents)

**Design System** — if you work on apps or websites, these prompts generate complete design systems, color palettes, and UI component specs.

**COG Brain** — second brain skills for knowledge workers:
- Braindump: throw all your thoughts in, get them organized
- Daily Brief: turn your notes into a structured morning brief
- PRD Generator: turn an idea into a product requirements doc

**Sys Prompts** — see the actual system prompts used by Claude, ChatGPT, GitHub Copilot, Cursor, and other AI tools.

**Library** — browse 600+ full prompts by category. Filter by type (coding, writing, analysis, etc.) or search by keyword.

---

## 🏆 Tips for Writing Great Prompts

Here are the most important habits of people who get amazing AI results:

**1. Be specific, not vague**
- ❌ "Write something about dogs"
- ✅ "Write a 150-word paragraph about why golden retrievers make great family pets, targeting parents with young children"

**2. Tell it who you are or who it should be**
- "You are a professional copywriter with 10 years of experience writing for tech companies."

**3. Say what format you want**
- "Answer in bullet points."
- "Give me a table."
- "Write it as a short story."

**4. Give context about your audience**
- "Explain this to someone who has never used software before."
- "Write this for a tech-savvy CTO audience."

**5. Iterate — don't settle on the first result**
- Start with a rough prompt, see what comes back, then add "Make it shorter / more formal / add examples."
- Use the Optimizer to improve your prompt before running it.

**6. Use the `{{variables}}` trick**
Once you find a prompt that works well, turn the specific parts into variables so you can reuse it forever.

---

## ❓ Quick Help

| Problem | Solution |
|---------|---------|
| The AI buttons don't work | The app needs an API key set on the server (Railway environment variable). Contact the app owner. |
| My saved prompts disappeared | Prompts save to your browser's storage. Clearing browser data will remove them. Export important ones. |
| I don't know which skill to use | Start with the search box in the left panel — type what you want to do. |
| The prompt is too long | Use **Optimize → Concise** mode to cut it down. |
| The output doesn't feel right | Add "more formal / more casual / more detailed / simpler" to your prompt and try again. |

---

## 🚀 Your First 5 Minutes Challenge

Try this right now:

1. **Open the app** → you're on the Editor view
2. **Type this prompt** in the big text box:
   ```
   You are a friendly teacher. Explain what the internet is to a 7-year-old
   in 3 simple sentences. Use a fun analogy.
   ```
3. **Watch your score** update on the right as you type
4. **Click Optimize → Clarity** and see how the app improves your prompt
5. **Go to ⚡ ECC Skills** → click "Deep Research" → see a full research template load

That's all you need to get started. Everything else you'll discover by exploring.

Happy prompting! ⚡
