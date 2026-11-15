'use strict';
// ─── Express app factory ─────────────────────────────────────────────────────
// Exported (not listening) so tests can mount it on an ephemeral port.

const express = require('express');
const path = require('path');
const compression = require('compression');
const { rateLimit } = require('express-rate-limit');
const chatRoutes = require('./routes/chat');
const scoutRoutes = require('./routes/scout');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SKILLS_DIR = path.join(__dirname, '..', 'skills');

function securityHeaders(req, res, next) {
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
}

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  // Rate limits key on client IP; behind one reverse proxy (Railway, Render,
  // Fly) the real IP is in X-Forwarded-For. Set TRUST_PROXY=0 when the app is
  // exposed directly, so clients cannot spoof their IP to dodge the limiter.
  const trust = process.env.TRUST_PROXY ?? '1';
  app.set('trust proxy', /^\d+$/.test(trust) ? Number(trust) : trust);

  app.use(securityHeaders);
  // SSE must not be buffered by gzip — compress everything except the API.
  app.use(compression({ filter: (req, res) => !req.path.startsWith('/api/') && compression.filter(req, res) }));
  app.use(express.json({ limit: '1mb' }));

  const limiter = (max, message) => rateLimit({
    windowMs: 15 * 60 * 1000, limit: max, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: message },
  });
  const chatLimiter = limiter(Number(process.env.CHAT_RATE_LIMIT) || 60, 'Too many requests. Please try again in a few minutes.');
  const scoutLimiter = limiter(Number(process.env.SCOUT_RATE_LIMIT) || 10, 'Too many Scout requests. Please try again in a few minutes.');

  app.get('/api/health', (req, res) => res.json({ ok: true }));
  app.use('/api', chatRoutes({ chatLimiter }));
  app.use('/api', scoutRoutes({ scoutLimiter }));
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

  // Installable skill packs (skills/<name>/SKILL.md), served as plain text so
  // the Library can offer a one-click SKILL.md download.
  app.use('/skills', express.static(SKILLS_DIR, {
    index: false, dotfiles: 'ignore',
    setHeaders(res) { res.setHeader('Content-Type', 'text/markdown; charset=utf-8'); res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate'); },
  }));
  app.use(express.static(PUBLIC_DIR, {
    extensions: ['html'],
    setHeaders(res, file) {
      // Data and code revalidate (cheap 304s); the shell must never go stale.
      res.setHeader('Cache-Control', file.endsWith('.html') ? 'no-cache' : 'public, max-age=300, must-revalidate');
    },
  }));
  // Client-side routes use the hash, so any other path just gets the shell.
  app.get(/^\/(?!api\/|skills\/).*/, (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));

  // Malformed JSON and other errors → JSON, never an HTML stack trace.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    res.status(status).json({ error: status === 500 ? 'Internal server error.' : err.message });
  });
  return app;
}

module.exports = { createApp };
