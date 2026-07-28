# Creative Potatoes — session handoff (2026-07-22)

Portable context for resuming work in a new conversation. (In a new Claude Code
session on this machine, project memory auto-loads — this file is mainly for
pasting into the claude.ai Project chat, which does not share that memory.)

## What this is
German freelancer marketing site. **Eleventy 3.1.6**, vanilla CSS, no framework.
Repo: `/Users/tanmayagarwal/creative pototatoes`. Deploy target: **Cloudflare
Pages** (`src/_headers` + `src/_redirects` ready; **not yet deployed**).

## Where it lives
- **GitHub (private):** https://github.com/tanmayagrawal24/Creative-Potatoes
  — branch `main`, **16 commits**, local and origin in sync.
- Auth is HTTPS via macOS keychain (PAT stored). `gh` CLI is not installed.

## Architecture / conventions
- Two-agent split: **design agent owns** `signature.css`, `tokens.css`,
  `sections/hero.njk`, `sections/craft.njk` (marked OWNED BY DESIGN AGENT).
  This side owns everything `cp-`-prefixed. Edit design-owned files only with an
  explicit, scoped, diff-reviewed go-ahead.
- **32 fixed `--cp-*` design tokens** in `tokens.css`; never invent new ones,
  never hardcode colors/fonts/spacing. Gotcha: `--cp-ink-faint` fails WCAG AA on
  small text — use `--cp-ink-muted`.
- Strict **CSP** (`script-src 'self'`, no unsafe-inline). Fonts **self-hosted**
  (Fraunces + Schibsted Grotesk via Fontsource woff2 in `src/assets/fonts/`) —
  no Google Fonts, for GDPR.
- **Build-time schema assertion** (`lib/data-schema.js`) validates every
  `src/_data/*.json` and fails the build on any missing/unknown key.
- All content is data-driven from `src/_data/` (services, packages, process,
  faq, site). First-person-singular German voice, "Sie" to the reader.

## Built & passing
Homepage sections: hero, leistungen (5 pillars, GEO badge), craft, pakete,
ablauf, roadmap, abgrenzung, referenz, faq (accordion), kontakt (mailto).
Legal pages `/ueber/`, `/datenschutz/`, and `/404.html`. Partner **symbol mark**
wired into the header + footer logo. JSON-LD: Organization + ProfessionalService
+ FAQPage. **Lighthouse 100/100/100/100 on all three routes, CLS 0.**

## Outstanding before public launch (content, not code)
Live `[[…]]` placeholders still on the site:
- Referenz body; one FAQ answer (`[[QS-Verfahren…]]`).
- Legal pages: `[[Name]]`, `[[Stadt]]`, `[[Geschäftsanschrift]]`,
  `[[E-Mail-Adresse]]`, `[[Datum]]`. **The Datenschutzerklärung legally cannot
  go public without the Verantwortlicher + address.**
- Minor: footer `originStatement` repeats the hero subline.
- No Impressum by design (owner in India, no EU establishment).
- Then: deploy to Cloudflare Pages.

## Local dev
- `npm start` → live dev server at http://localhost:8080 (hot reload).
- `npm run build` → static output in `_site/`.
- Node 24.18.0 at `~/.local/node` (on PATH via `~/.zshrc`).
- Lighthouse/puppeteer/Chrome-for-Testing were installed in the session
  scratchpad (wiped between sessions) — reinstall if audits are needed.
