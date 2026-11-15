// Curated collections of installable skills (skills/<name>/SKILL.md).
export const PACKS = [
  { id: 'trading-desk', title: 'Log-first trading desk', icon: 'route', blurb: 'Six agents from scan to log (scanner, rug check, sizer, executor, logger, equity guard) plus a morning review. Every trade gets a reason.' },
  { id: 'microstructure', title: 'Market microstructure', icon: 'layers', blurb: 'How prices really form: spread, depth, impact, adverse selection, queues, latency, fees and slippage.' },
  { id: 'vol-surface', title: 'Volatility surface', icon: 'sparkle', blurb: 'How options price fear across strikes and time: skew, smile, term structure, sticky regimes, RR, fly, variance swaps.' },
  { id: 'quant-research', title: 'Quant research rigor', icon: 'evals', blurb: 'Leakage-safe research: bias audits, walk-forward and CPCV, deflated Sharpe, cost models, regimes and more.' },
  { id: 'autoresearch', title: 'Autoresearch loops', icon: 'history', blurb: 'The Karpathy loop: agents that edit, run, measure, keep or discard, and log, all night long.' },
  { id: 'agent-engineering', title: 'Agent & context engineering', icon: 'harness', blurb: 'Context, memory, harnesses, judges, tools, multi-agent patterns, skill authoring and a Socratic tutor.' },
];
export const packById = id => PACKS.find(p => p.id === id);
