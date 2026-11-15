// ─── Builder blueprints ──────────────────────────────────────────────────────
// Each blueprint tailors the builder's questions to a kind of task, and ships
// a worked example so beginners can see a strong prompt take shape.

export const FIELDS = {
  task: { label: 'What should Claude do?', help: 'One clear instruction. Several lines become numbered steps.', rows: 3, guided: true },
  why: { label: 'Why does it matter?', help: 'What the result will be used for. This lets Claude make good judgment calls.', rows: 2, guided: true },
  audience: { label: 'Who is it for?', help: 'The reader or user of the output.', input: true, guided: true },
  documents: { label: 'Material to work from', help: 'Paste text, or use a {{variable}} to fill in later. It goes first in the prompt.', rows: 4, guided: true, mono: true },
  format: { label: 'Output format', help: 'Shape of the answer: table, bullets, JSON fields, sections…', rows: 2, guided: true },
  context: { label: 'Background', help: 'Anything else a smart newcomer would need to know.', rows: 3 },
  role: { label: 'Role for Claude', help: 'Expertise + perspective, e.g. “a senior SRE who has run on-call for payments systems”.', input: true },
  tone: { label: 'Tone & style', help: 'e.g. “warm and plain-spoken, no jargon”.', input: true },
  length: { label: 'Length', help: 'e.g. “under 150 words” or “5–7 bullets”.', input: true },
  constraints: { label: 'Rules', help: 'One per line. Phrase them as what to do.', rows: 3 },
  examples: { label: 'Examples', help: 'One per paragraph. Use “input => output” to make input/output pairs.', rows: 4, mono: true },
  success: { label: 'A great response…', help: 'Checkable criteria, one per line. You can reuse them as eval checks.', rows: 3 },
};

export const BLUEPRINTS = [
  {
    id: 'write', title: 'Write content', icon: 'build', level: 'beginner',
    desc: 'Emails, announcements, posts, docs, in the voice you need.',
    example: {
      task: 'Write an email announcing that our office will move to a 4-day work week starting March 1.',
      why: 'Some people will worry this means more hours on the other days. The email should reassure them and reduce questions to HR.',
      audience: 'All 85 employees, mostly non-managers',
      format: 'Subject line, then the email body with a short FAQ of 3 questions at the end.',
      role: 'the Head of People, writing personally',
      tone: 'warm, confident, plain English',
      length: 'body under 250 words',
      success: 'States the start date and what changes\nAnswers “will my hours increase?”\nTells people where to ask questions',
    },
  },
  {
    id: 'analyze', title: 'Analyze a document', icon: 'search', level: 'beginner',
    desc: 'Contracts, reports, transcripts: find what matters and why.',
    example: {
      documents: '{{contract_text}}',
      task: 'Review this vendor contract and identify clauses that create financial or operational risk for us.',
      why: 'We must decide by Friday whether to sign or push back on terms.',
      audience: 'Our COO, who is not a lawyer',
      format: 'A table with columns: clause, risk, severity (high/medium/low), suggested change. Then a one-paragraph recommendation.',
      role: 'an experienced commercial contracts advisor',
      untrusted: true, uncertainty: true,
      success: 'Every risk cites the clause it comes from\nSeverity is justified\nRecommendation is a clear sign / negotiate / walk away',
    },
  },
  {
    id: 'code', title: 'Write or review code', icon: 'workbench', level: 'intermediate',
    desc: 'Implement, refactor, debug or review with engineering rigor.',
    example: {
      documents: '{{code}}',
      task: 'Review this pull request for correctness bugs, security issues and missing tests.\nRank findings by severity.\nFor each finding, propose a concrete fix.',
      why: 'This change goes to production on Monday and touches the payments path.',
      role: 'a staff engineer who reviews payments code',
      context: 'TypeScript, Node 22, Express. Money is stored as integer cents.',
      format: 'Markdown: a summary line, then findings as “### [severity] title” with file:line, explanation and suggested patch.',
      constraints: 'Only report issues you can point to in the code\nSay explicitly if no issues are found in a category',
      reasoning: 'deep',
    },
  },
  {
    id: 'extract', title: 'Extract structured data', icon: 'layers', level: 'intermediate',
    desc: 'Turn messy text into clean JSON your code can trust.',
    example: {
      documents: '{{email}}',
      task: 'Extract the order details from this customer email.',
      why: 'The JSON is inserted directly into our order system, so field formats must be exact.',
      format: 'JSON object with: customer_name (string), items (array of {sku, quantity}), delivery_date (YYYY-MM-DD or null), notes (string or null). Return it inside <json> tags.',
      constraints: 'Use null for anything not stated\nNormalize dates to ISO 8601\nAdd a "warnings" array for anything ambiguous',
      examples: 'Hi, 2x SKU-114 by next Friday please — Ana => {"customer_name":"Ana","items":[{"sku":"SKU-114","quantity":2}],"delivery_date":null,"notes":"by next Friday","warnings":["relative date not resolved"]}',
      untrusted: true,
    },
  },
  {
    id: 'summarize', title: 'Summarize', icon: 'file', level: 'beginner',
    desc: 'Condense long material for a specific reader and purpose.',
    example: {
      documents: '{{transcript}}',
      task: 'Summarize this meeting transcript.',
      why: 'People who missed the meeting need to know decisions and their own action items.',
      audience: 'The wider product team',
      format: 'Three sections: Decisions, Action items (owner + due date), Open questions.',
      length: 'under 200 words',
      uncertainty: true,
    },
  },
  {
    id: 'classify', title: 'Classify or route', icon: 'route', level: 'intermediate',
    desc: 'Label inputs consistently: triage, sentiment, intent.',
    example: {
      documents: '{{ticket}}',
      task: 'Classify the support ticket into exactly one category: billing, bug, feature_request, account_access, other.',
      why: 'The label routes the ticket to the right team automatically.',
      format: 'Return only the category label, nothing else.',
      examples: 'I was charged twice this month => billing\nCan you add dark mode? => feature_request\nI can\'t log in after resetting my password => account_access',
      constraints: 'If the ticket fits several categories, choose the one that needs action first',
      untrusted: true,
    },
  },
  {
    id: 'brainstorm', title: 'Brainstorm & decide', icon: 'bulb', level: 'beginner',
    desc: 'Generate options, then pressure-test them.',
    example: {
      task: 'Generate 10 distinct ideas to reduce churn in the first 30 days for our budgeting app.\nGroup them by effort (low / medium / high).\nPick the 2 you would test first and explain why.',
      context: 'Users sign up, connect a bank account, then 40% stop opening the app by day 14.',
      why: 'We have one engineer for a month and need a quick win.',
      format: 'Grouped bullet list, then a short “Test first” section.',
      success: 'Ideas are meaningfully different from each other\nThe picks fit one engineer for a month',
    },
  },
  {
    id: 'agent', title: 'Agent system prompt', icon: 'harness', level: 'advanced', asSystem: true,
    desc: 'A complete system prompt for an assistant or agent.',
    example: {
      role: 'the customer support agent for Acme Cloud, a hosting company for small businesses',
      task: 'Answer customer questions about plans, billing and outages.\nLook up account details with your tools before answering account-specific questions.\nEscalate to a human for refunds over $50, legal threats, or security incidents.',
      why: 'Customers are small business owners whose websites are their livelihood, so accuracy and calm matter more than speed.',
      tone: 'calm, friendly, concise',
      constraints: 'Confirm before making any change to an account\nQuote the relevant help-center article when one exists\nNever guess about outage timelines; share the status page instead',
      success: 'The customer’s question is answered or escalated with a reason\nAny account change was confirmed first',
      untrusted: true, uncertainty: true,
    },
  },
];

export const blueprintById = id => BLUEPRINTS.find(b => b.id === id) || BLUEPRINTS[0];
