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

## Deployment and email follow-up

At this checkpoint, the refreshed pages have been built and checked locally.
**Production deployment is pending Vercel CLI authentication and live checks.**
The saved CLI credential returned 403, and the owner confirmed their signed-in
dashboard sessions are in Firefox. Use the official CLI browser approval with
that account; no passwords or tokens should be pasted into this document.

After the Git push, deploy from this verified checkout linked to the existing
Vercel project, then verify `/`, `/privacy`, `/delete-account` and `/terms`.
The app repository's read-only `scripts/verify-public-release-pages.py` can check
the fixed public routes and require the updated policy markers.

Email remains a separate open part of release item 4:

- Supabase custom SMTP is not configured; actual signup/reset delivery and native
  redirects have not been verified in this task.
- Public MX records point to registrar forwarding. This does not prove the
  `privacy@` or `hello@` aliases deliver to a monitored inbox.
- Provider/domain access, DNS verification, SMTP setup and a controlled delivery
  test still need completion. No test email was sent during the source review.

The older local checkout at `G:\0\G\GirlyVibesSite` has unrelated uncommitted
changes. This task used a separate clean checkout from remote revision
`ecb3f7aca6fc0fcba1ee0ff2a967a649aede3d8e`; those local edits were preserved.
