import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Mail,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";

const CONTACT_EMAIL = "privacy@girly-vibes.com";
const DELETE_EMAIL_URL =
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Girly Vibes account deletion request")}` +
  `&body=${encodeURIComponent(
    [
      "Hello Girly Vibes Privacy Team,",
      "",
      "I want to delete my Girly Vibes account and associated data.",
      "",
      "Account email:",
      "Username (if known):",
      "",
      "Please contact me at my account email if you need to verify this request.",
      "",
      "Do not include your password in this message.",
    ].join("\n"),
  )}`;

export const Route = createFileRoute("/delete-account")({
  component: DeleteAccountPage,
  head: () => ({
    meta: [
      { title: "Delete Your Account | Girly Vibes" },
      {
        name: "description",
        content:
          "Request deletion of your Girly Vibes account and associated personal data.",
      },
      { property: "og:title", content: "Delete Your Girly Vibes Account" },
      {
        property: "og:description",
        content:
          "Instructions for permanently deleting a Girly Vibes account and associated data.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

function DeleteAccountPage() {
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
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold transition hover:border-[color:var(--rose-deep)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 md:py-20">
        <section className="overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-white shadow-card">
          <div className="bg-[color:var(--rose-soft)]/55 px-7 py-10 md:px-12 md:py-14">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--rose-deep)]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Account and data control
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold md:text-6xl">
              Delete your Girly Vibes account
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[color:var(--mauve)]/72">
              You can permanently delete your account and associated personal
              data either inside the app or by sending us a request from your
              account email.
            </p>
          </div>

          <div className="grid gap-6 p-7 md:grid-cols-2 md:p-12">
            <article className="rounded-3xl border border-[color:var(--border)] p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--rose-soft)] text-[color:var(--rose-deep)]">
                <Smartphone className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-2xl font-semibold">Delete inside the app</h2>
              <ol className="mt-4 space-y-3 text-[color:var(--mauve)]/75">
                <li className="flex gap-3">
                  <strong className="text-[color:var(--rose-deep)]">1.</strong>
                  Open Girly Vibes and sign in.
                </li>
                <li className="flex gap-3">
                  <strong className="text-[color:var(--rose-deep)]">2.</strong>
                  Go to Settings → Account.
                </li>
                <li className="flex gap-3">
                  <strong className="text-[color:var(--rose-deep)]">3.</strong>
                  Select “Delete account and data.”
                </li>
                <li className="flex gap-3">
                  <strong className="text-[color:var(--rose-deep)]">4.</strong>
                  Enter your password and the requested DELETE confirmation.
                </li>
              </ol>
            </article>

            <article className="rounded-3xl border border-[color:var(--border)] p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--rose-soft)] text-[color:var(--rose-deep)]">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-2xl font-semibold">Request deletion by email</h2>
              <p className="mt-4 leading-7 text-[color:var(--mauve)]/75">
                If you cannot access the app, email us from the address connected
                to your account. Include your account email and username if known.
                Never send your password.
              </p>
              <a
                href={DELETE_EMAIL_URL}
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-rose-gradient px-5 py-3 font-bold text-white shadow-soft transition hover:scale-[1.02]"
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" />
                Request account deletion
              </a>
              <p className="mt-4 text-sm text-[color:var(--mauve)]/65">
                Email:{" "}
                <a
                  className="font-bold text-[color:var(--rose-deep)] underline underline-offset-4"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </article>
          </div>

          <div className="px-7 pb-12 md:px-12">
            <section className="rounded-3xl bg-[color:var(--rose-soft)]/45 p-6 md:p-8">
              <h2 className="text-2xl font-semibold">What deletion covers</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {[
                  "Your authentication account and profile",
                  "Diary entries, notes, and uploaded media",
                  "Routines, reminders, progress, and saved content",
                  "AI personalization memory and account-linked chat data",
                  "Vision-board images and account-linked storage",
                  "Other data associated with your Girly Vibes user ID",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--rose-deep)]"
                      aria-hidden="true"
                    />
                    <span className="leading-6 text-[color:var(--mauve)]/75">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-6 text-[color:var(--mauve)]/65">
                We may retain limited information only where reasonably required
                for security, abuse prevention, legal compliance, or backups, as
                described in our{" "}
                <Link
                  to="/privacy"
                  className="font-bold text-[color:var(--rose-deep)] underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
