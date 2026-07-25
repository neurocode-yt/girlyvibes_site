import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, Mail, ShieldCheck } from "lucide-react";

const CONTACT_EMAIL = "privacy@girly-vibes.com";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPolicy,
  head: () => ({
    meta: [
      { title: "Privacy Policy | Girly Vibes" },
      {
        name: "description",
        content:
          "Learn how Girly Vibes collects, uses, stores, protects, and deletes information.",
      },
      { property: "og:title", content: "Girly Vibes Privacy Policy" },
      {
        property: "og:description",
        content: "Privacy information for the Girly Vibes mobile app and services.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

const sections = [
  {
    title: "1. Who we are",
    content: (
      <>
        <p>
          Girly Vibes is a self-care and lifestyle app for routines, diary notes,
          calm breathing, glow points, reads, activities, reminders, vision
          boards, and Maryam, the in-app AI chat companion.
        </p>
        <p>
          For privacy questions or data requests, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    title: "2. Information we collect",
    content: (
      <>
        <p>Depending on the features you use, we may collect or process:</p>
        <ul>
          <li>
            <strong>Account information:</strong> email address, username,
            Supabase user ID, email-verification status, and authentication
            session information. Passwords are handled by Supabase Auth; Girly
            Vibes does not store or display your plain-text password.
          </li>
          <li>
            <strong>Profile and preferences:</strong> display name, profile
            photo or avatar, language, theme, and app settings.
          </li>
          <li>
            <strong>Content you create:</strong> diary entries, notes,
            attachments, voice notes, routines, reminders, widget todo items,
            glow progress, saved reads, activity preferences, vision-board
            images, Who Am I answers, and support messages.
          </li>
          <li>
            <strong>AI chat:</strong> your message, recent chat context,
            optional display name and calm check-in context, supported tool
            requests, optional personalization memory, and bounded information
            submitted when you report an AI response.
          </li>
          <li>
            <strong>Device access:</strong> notifications for reminders,
            microphone access for voice notes, user-selected photos or media,
            internet access, and local storage for offline data and encrypted
            sessions.
          </li>
        </ul>
        <p>
          Maryam is blocked from accessing private diary and note content.
          Durable AI personalization memory is disabled by default and is saved
          only after you opt in. Opting out deletes that saved memory summary.
        </p>
        <p>The app does not currently include third-party advertising or analytics SDKs.</p>
      </>
    ),
  },
  {
    title: "3. How we use information",
    content: (
      <ul>
        <li>Create, secure, verify, and recover your account.</li>
        <li>Sync your data and provide the app features you choose to use.</li>
        <li>Provide Maryam AI responses and supported in-app actions.</li>
        <li>Send account verification and password-reset emails.</li>
        <li>Deliver local reminders and user-scoped Android widgets.</li>
        <li>Improve safety, reliability, support, and prevent abuse.</li>
      </ul>
    ),
  },
  {
    title: "4. Service providers and sharing",
    content: (
      <>
        <p>
          We do not sell personal information or share it for third-party
          advertising. We use service providers only to operate Girly Vibes:
        </p>
        <ul>
          <li>Supabase for authentication, database, storage, and sessions.</li>
          <li>Hugging Face Spaces for hosting the Maryam AI/RAG backend.</li>
          <li>OpenAI or an OpenAI-compatible provider for AI responses.</li>
          <li>Resend for account confirmation and password-reset emails.</li>
          <li>Hosting providers, Google Play, and Android operating-system services.</li>
        </ul>
        <p>
          We may disclose information when required by law, to investigate
          abuse, protect users, or protect the security and integrity of Girly
          Vibes.
        </p>
      </>
    ),
  },
  {
    title: "5. AI and wellness disclosures",
    content: (
      <>
        <p>
          Maryam is an AI-assisted companion for self-care, routines,
          reminders, confidence, beauty, studying, and everyday support. AI can
          make mistakes.
        </p>
        <p>
          Girly Vibes is not a medical device, therapist, doctor, emergency
          service, or crisis service and does not diagnose, treat, cure, or
          prevent medical or mental-health conditions. In immediate danger,
          contact local emergency services or a trusted person.
        </p>
      </>
    ),
  },
  {
    title: "6. How we protect information",
    content: (
      <>
        <p>
          We use HTTPS, Supabase row-level security, server-only admin
          credentials, encrypted local session storage where available,
          user-scoped reminder and widget data, token verification, request
          limits, rate limits, and access controls.
        </p>
        <p>
          No system is perfectly secure. Avoid storing emergency, legally
          privileged, or highly sensitive information unless you understand
          the risks.
        </p>
      </>
    ),
  },
  {
    title: "7. Retention and deletion",
    content: (
      <>
        <p>
          We retain account and synced app data while your account is active or
          as needed to provide the service. You can permanently delete your
          account and associated synced data in{" "}
          <strong>Settings → Account → Delete account and data</strong>. The
          app requires your account password and an explicit DELETE
          confirmation.
        </p>
        <p>
          You may also request deletion or make a data request at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Limited
          information may be retained where required for security, abuse
          prevention, legal compliance, or backups.
        </p>
      </>
    ),
  },
  {
    title: "8. Local and offline data",
    content: (
      <p>
        Girly Vibes is offline-first. Some data is stored locally for speed and
        offline use. Local reminders and widget mutations are scoped to the
        signed-in user and cleared when the app detects an unusable or signed-out
        session. Uninstalling may remove local-only data; synced data remains
        until you delete your account or request deletion.
      </p>
    ),
  },
  {
    title: "9. Children’s privacy",
    content: (
      <p>
        Girly Vibes is not intended for children under 13. If we learn that we
        collected personal information from a child under 13 without
        appropriate consent, we will take steps to delete it.
      </p>
    ),
  },
  {
    title: "10. International processing",
    content: (
      <p>
        Information may be processed in countries other than where you live.
        Our service providers may store or process data where they operate and
        support secure transmission and access controls.
      </p>
    ),
  },
  {
    title: "11. Changes to this policy",
    content: (
      <p>
        We may update this policy when features, providers, data practices, or
        legal requirements change. The latest version and effective date will
        always appear on this page.
      </p>
    ),
  },
];

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--mauve)]">
      <header className="border-b border-[color:var(--border)] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display text-lg font-semibold text-[color:var(--rose-deep)]"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-rose-gradient text-white">
              <Heart className="h-4 w-4" aria-hidden="true" />
            </span>
            Girly Vibes
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--mauve)] transition hover:border-[color:var(--rose-deep)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 md:py-20">
        <section className="rounded-[32px] border border-[color:var(--border)] bg-white p-7 shadow-card md:p-12">
          <div className="mb-10 border-b border-[color:var(--border)] pb-9">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--rose-soft)] px-4 py-2 text-sm font-semibold text-[color:var(--rose-deep)]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Your privacy matters
            </div>
            <h1 className="text-4xl font-semibold text-[color:var(--mauve)] md:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[color:var(--mauve)]/70">
              This policy explains how Girly Vibes collects, uses, stores,
              protects, and shares information across the mobile app and related
              services.
            </p>
            <p className="mt-4 text-sm font-semibold text-[color:var(--rose-deep)]">
              Effective July 26, 2026
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title} className="privacy-copy">
                <h2 className="text-2xl font-semibold text-[color:var(--mauve)]">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 leading-7 text-[color:var(--mauve)]/78">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-12 rounded-3xl bg-[color:var(--rose-soft)]/55 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[color:var(--rose-deep)]">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-semibold">Contact us</h2>
                <p className="mt-2 text-[color:var(--mauve)]/70">
                  Privacy questions, data requests, and account-deletion requests:
                </p>
                <a
                  className="mt-2 inline-block font-bold text-[color:var(--rose-deep)] underline underline-offset-4"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
