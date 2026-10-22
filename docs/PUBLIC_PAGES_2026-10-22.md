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

At this checkpoint, the refreshed pages have been built and checked locally.
**Production deployment and live checks are pending at this source checkpoint.**
The owner renewed the Vercel CLI login through Firefox. Deployment uses the
existing project and its saved environment, from this verified source.

After the Git push, deploy from this verified checkout linked to the existing
Vercel project, then verify `/`, `/privacy`, `/delete-account` and `/terms`.
The app repository's read-only `scripts/verify-public-release-pages.py` can check
the fixed public routes and require the updated policy markers.

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
