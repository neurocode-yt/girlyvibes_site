# Public privacy and account-deletion update — 22 October 2026

The existing production website is **https://girly-vibes.com** (with a hyphen),
hosted by Vercel project `girlyvibesyt`. Its repository is
`neurocode-yt/girlyvibes_site`, production branch `main`.

## Changes prepared and checked

- Updated `/privacy` and `/delete-account` in English and Arabic to describe
  synced conversation history, optional AI memory, indefinite admin security
  retention of ordinary deleted chats, and separate full-account erasure.
- Explained pending/background media cleanup and email ownership verification;
  email submission is not represented as completed deletion.
- Added canonical legal-page links, a prominent privacy-to-deletion link and
  consistent policy/contact/date constants. Policy date: **22 October 2026**.
- Disclosed the device-local diary PIN and absence of end-to-end encryption for
  synced diary content.
- Removed the unsupported claim that Resend is already configured. Supabase's
  live custom SMTP fields were empty during this review.
- The owner subsequently selected **Google-only sign-in**, without signup or
  password-reset emails. Updated the disclosures and deletion instructions to
  use fresh Google confirmation; no Resend/SMTP service was configured.
- Mirrored the disclosures and public URLs in the mobile/admin policy copies in
  the separate app repository. An updated mobile install is still required.

The existing public `/terms` route and homepage footer deletion links were
inspected; a new support route or another public admin deployment is not needed
to make the existing deletion instructions discoverable.

## Validation

- Production build/prerender: passed, including privacy and deletion HTML.
- ESLint and Prettier checks of all three changed source files: passed.
- Built-page browser checks: English/Arabic switching, LTR/RTL, deletion link,
  mailto route, retention/queued-deletion wording and no horizontal overflow.
- Global TypeScript: **11 existing errors in `src/routes/games.tsx`**. A baseline
  run with the original legal routes produced the identical errors. The policy
  changes add no errors; a globally clean site type check is not claimed.
- Vercel rejected the first deployment because of CVE-2026-102989. Updated and
  pinned `@tanstack/react-start` to `1.168.60`, matching router/plugin versions,
  and verified `@tanstack/start-server-core` resolves to `1.169.39`. The patched
  production build passes. See [the upstream advisory](https://tanstack.com/blog/tanstack-start-security-update-cve-2026-102989).

## Deployment and email follow-up

**Deployed and verified live.** Production source commit
`5714e1b5f83cef5b865dc116b92dd08b218f9222` is READY in deployment
`dpl_Et62x3R66ZPVuNkb1TxLGWLn8Nye`, aliased to `https://girly-vibes.com`.
The owner renewed the existing Vercel CLI login through Firefox. Existing project
environment configuration was preserved.

Unauthenticated `/`, `/privacy`, `/delete-account` and `/terms` requests return
HTTP 200 with their expected titles. The two legal pages pass all current-policy,
retention, erasure, canonical/contact and same-Google-account checks. Production
browser checks pass in English/Arabic with correct LTR/RTL, working navigation
and no horizontal overflow. The router error prop was adapted to `unknown` for
the patched dependency; final global types retain only the original games errors.

The app repository's read-only `scripts/verify-public-release-pages.py` repeats
the public checks with `--require-current-policy`. Deployment and browser proof
are saved under its `docs/audit-evidence/2026-10-22-public` directory.

Email remains a separate open part of release item 4:

- Supabase now enables Google as the only authentication provider. Email,
  anonymous and other sign-in providers are disabled; signup/reset SMTP is not
  required for the owner's chosen flow.
- Public MX records point to registrar forwarding. This does not prove the
  `privacy@` or `hello@` aliases deliver to a monitored inbox.
- Privacy/support receipt and monitoring still need verification. This contact
  route is separate from account authentication. No test email was sent.
- An updated installed app still needs Google sign-in, cancellation, logout,
  existing-account matching and Google-confirmed deletion acceptance.

The older local checkout at `G:\0\G\GirlyVibesSite` has unrelated uncommitted
changes. This task used a separate clean checkout from remote revision
`ecb3f7aca6fc0fcba1ee0ff2a967a649aede3d8e`; those local edits were preserved.
