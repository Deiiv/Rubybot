Title: chore: apply npm audit automated fixes

Summary:
Applied automated non-breaking fixes from `npm audit fix`. This PR contains only dependency lockfile updates and small transitive upgrades applied automatically. It does NOT attempt major-version upgrades for packages that require manual review.

What changed:
- Ran `npm audit fix` (non-force). Updated a few transitive packages (notably `ws`).
- package-lock.json updated.

Remaining vulnerabilities (require manual attention):
- undici (high) — affects @discordjs/rest / discord.js. Fix requires updating discord.js ecosystem or undici upstream.
- @discordjs/rest, @discordjs/ws, discord.js (moderate) — suggested fixes are SemVer-major (downgrade to discord.js@13.17.1) or other breaking changes.
- pm2 / js-yaml (moderate) — fix available in pm2@7.x (major).
- discord-backup (moderate) — upstream may need updating or replacement for compatibility with discord.js v14.

Checklist for follow-up (recommend running in feature branches):
- [ ] Upgrade pm2 to 7.x and test process management on staging.
- [ ] Evaluate `discord-backup` compatibility with current discord.js; update or replace as needed.
- [ ] Decide approach for discord.js/undici issues:
  - Option A: Downgrade to discord.js v13 (breaking change) — requires code adaptations.
  - Option B: Wait for upstream fixes for undici/@discordjs/rest or update those packages to patched major releases when available.
  - Option C: Use dependency overrides (risky) and test thoroughly.
- [ ] Run full integration tests on Node 24 in staging, verifying bot behavior and AWS interactions.
- [ ] Monitor Dependabot and schedule follow-ups for remaining advisories.

Notes:
- This PR is intentionally conservative to avoid introducing breaking changes. Manual review is required for major-version bumps.

Branch: chore/patch-audit-fixes-2026-06-30

