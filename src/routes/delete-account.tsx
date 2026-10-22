import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Globe,
  Heart,
  Mail,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PRIVACY_CONTACT_EMAIL, PRIVACY_UPDATED, PUBLIC_SITE_URL } from "@/lib/legal";

const CONTACT_EMAIL = PRIVACY_CONTACT_EMAIL;

export const Route = createFileRoute("/delete-account")({
  component: DeleteAccountPage,
  head: () => ({
    meta: [
      { title: "Delete Your Account | Girly Vibes" },
      {
        name: "description",
        content: "Request deletion of your Girly Vibes account and associated personal data.",
      },
      { property: "og:title", content: "Delete Your Girly Vibes Account" },
      {
        property: "og:description",
        content: "Instructions for permanently deleting a Girly Vibes account and associated data.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${PUBLIC_SITE_URL}/delete-account` }],
  }),
});

function DeleteAccountPage() {
  const { lang, setLang, dir } = useI18n();
  const isAr = lang === "ar";
  const l = (en: string, ar: string) => (isAr ? ar : en);
  const deleteEmailUrl =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      l("Girly Vibes account deletion request", "طلب حذف حساب Girly Vibes"),
    )}` +
    `&body=${encodeURIComponent(
      [
        l("Hello Girly Vibes Privacy Team,", "مرحبًا فريق خصوصية Girly Vibes،"),
        "",
        l(
          "I want to delete my Girly Vibes account and associated data.",
          "أرغب في حذف حسابي في Girly Vibes والبيانات المرتبطة به.",
        ),
        "",
        l("Account email:", "البريد الإلكتروني للحساب:"),
        l("Username (if known):", "اسم المستخدم (إن وُجد):"),
        "",
        l(
          "Please contact me at my account email if you need to verify this request.",
          "يُرجى التواصل معي على بريد الحساب إذا احتجتم إلى التحقق من هذا الطلب.",
        ),
        "",
        l("Do not include your password in this message.", "لا تُدرج كلمة المرور في هذه الرسالة."),
      ].join("\n"),
    )}`;

  const coverage = [
    l("Your authentication account and profile", "حساب المصادقة والملف الشخصي"),
    l("Diary entries, notes, and uploaded media", "إدخالات اليوميات والملاحظات والوسائط المرفوعة"),
    l(
      "Routines, reminders, progress, and saved content",
      "الروتينات والتذكيرات والتقدّم والمحتوى المحفوظ",
    ),
    l(
      "AI personalization memory and conversation history, including retained deleted chats",
      "ذاكرة التخصيص للذكاء الاصطناعي وسجل المحادثات، بما فيه المحادثات المحذوفة المحتفظ بها",
    ),
    l("Vision-board images and account-linked storage", "صور لوحة الرؤية والتخزين المرتبط بالحساب"),
    l(
      "Other data associated with your Girly Vibes user ID",
      "بيانات أخرى مرتبطة بمعرّف مستخدم Girly Vibes",
    ),
  ];

  return (
    <div
      className={`min-h-screen bg-[color:var(--background)] text-[color:var(--mauve)] ${
        isAr ? "text-right" : "text-left"
      }`}
      dir={dir}
    >
      <header className="border-b border-[color:var(--border)] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display text-lg font-semibold text-[color:var(--rose-deep)]"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-rose-gradient text-white">
              <Heart className="h-4 w-4" aria-hidden="true" />
            </span>
            Girly Vibes
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(isAr ? "en" : "ar")}
              aria-label={l("Switch to Arabic", "التبديل إلى الإنجليزية")}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[color:var(--rose-deep)] transition hover:border-[color:var(--rose-deep)]"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              {isAr ? "EN" : "العربية"}
            </button>
            <Link
              to="/"
              aria-label={l("Back home", "العودة إلى الصفحة الرئيسية")}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-semibold transition hover:border-[color:var(--rose-deep)]"
            >
              <ArrowLeft className={`h-4 w-4 ${isAr ? "scale-x-[-1]" : ""}`} aria-hidden="true" />
              <span className="hidden sm:inline">{l("Back home", "العودة إلى الرئيسية")}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 md:py-20">
        <section className="overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-white shadow-card">
          <div className="bg-[color:var(--rose-soft)]/55 px-7 py-10 md:px-12 md:py-14">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--rose-deep)]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {l("Account and data control", "التحكم في الحساب والبيانات")}
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold md:text-6xl">
              {l("Delete your Girly Vibes account", "حذف حسابك في Girly Vibes")}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[color:var(--mauve)]/72">
              {l(
                "You can permanently delete your account and associated personal data either inside the app or by sending us a request from your account email.",
                "يمكنك حذف حسابك والبيانات الشخصية المرتبطة به بشكل دائم، إما من داخل التطبيق أو بإرسال طلب إلينا من عنوان البريد الإلكتروني المرتبط بحسابك.",
              )}
            </p>
            <p className="mt-4 text-sm font-semibold text-[color:var(--rose-deep)]">
              {l(`Updated ${PRIVACY_UPDATED.en}`, `آخر تحديث: ${PRIVACY_UPDATED.ar}`)}
            </p>
          </div>

          <div className="grid gap-6 p-7 md:grid-cols-2 md:p-12">
            <article className="rounded-3xl border border-[color:var(--border)] p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--rose-soft)] text-[color:var(--rose-deep)]">
                <Smartphone className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-2xl font-semibold">
                {l("Delete inside the app", "الحذف من داخل التطبيق")}
              </h2>
              <ol className="mt-4 space-y-3 text-[color:var(--mauve)]/75">
                {[
                  l("Open Girly Vibes and sign in.", "افتح تطبيق Girly Vibes وسجّل الدخول."),
                  l("Go to Settings → Account.", "انتقل إلى الإعدادات ← الحساب."),
                  l("Select “Delete account and data.”", "اختر «حذف الحساب والبيانات»."),
                  l(
                    "Enter your password and the requested DELETE confirmation.",
                    "أدخل كلمة المرور وتأكيد DELETE المطلوب.",
                  ),
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <strong className="text-[color:var(--rose-deep)]">{index + 1}.</strong>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </article>

            <article className="rounded-3xl border border-[color:var(--border)] p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--rose-soft)] text-[color:var(--rose-deep)]">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-2xl font-semibold">
                {l("Request deletion by email", "طلب الحذف عبر البريد الإلكتروني")}
              </h2>
              <p className="mt-4 leading-7 text-[color:var(--mauve)]/75">
                {l(
                  "If you cannot access the app, email us from the address connected to your account. Include your account email and username if known. Never send your password.",
                  "إذا تعذّر عليك الوصول إلى التطبيق، فراسلنا من العنوان المرتبط بحسابك. أدرج بريد الحساب واسم المستخدم إن وُجد. لا ترسل كلمة المرور مطلقًا.",
                )}
              </p>
              <p className="mt-3 leading-7 text-[color:var(--mauve)]/75">
                {l(
                  "We verify account ownership before acting on an email request. Sending an email does not immediately erase an account. If you cannot complete in-app deletion, use this email route.",
                  "نتحقّق من ملكية الحساب قبل تنفيذ طلب عبر البريد الإلكتروني. إرسال الرسالة لا يمحو الحساب فورًا. إذا تعذّر عليك إكمال الحذف داخل التطبيق، فاستخدم هذا المسار عبر البريد.",
                )}
              </p>
              <a
                href={deleteEmailUrl}
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-rose-gradient px-5 py-3 font-bold text-white shadow-soft transition hover:scale-[1.02]"
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" />
                {l("Request account deletion", "طلب حذف الحساب")}
              </a>
              <p className="mt-4 text-sm text-[color:var(--mauve)]/65">
                {l("Email:", "البريد الإلكتروني:")}{" "}
                <a
                  className="font-bold text-[color:var(--rose-deep)] underline underline-offset-4"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  <bdi>{CONTACT_EMAIL}</bdi>
                </a>
              </p>
            </article>
          </div>

          <div className="px-7 pb-12 md:px-12">
            <section className="mb-6 rounded-3xl border border-[color:var(--border)] p-6 md:p-8">
              <h2 className="text-2xl font-semibold">
                {l("Full-account erasure and chat deletion", "محو الحساب بالكامل وحذف المحادثات")}
              </h2>
              <p className="mt-4 leading-7 text-[color:var(--mauve)]/75">
                {l(
                  "Deleting a chat removes it from your app and device cache after server confirmation; its transcript is retained in Supabase for authorized security review with no automatic expiry. Full-account erasure also removes those retained deleted transcripts. Uninstalling the app alone does not delete your synced account data.",
                  "حذف محادثة يزيلها من التطبيق وذاكرة الجهاز بعد تأكيد الخادم؛ ويُحتفَظ بنصّها في Supabase للمراجعة الأمنية المخوّلة دون انتهاء تلقائي. محو الحساب بالكامل يزيل أيضًا نصوص المحادثات المحذوفة المحتفظ بها. إلغاء تثبيت التطبيق وحده لا يحذف بيانات حسابك المتزامنة.",
                )}
              </p>
              <p className="mt-4 leading-7 text-[color:var(--mauve)]/75">
                {l(
                  "The app may show that deletion is pending while private media is removed. Background retries continue the cleanup; pending does not mean completed. If deletion remains pending or you need help, contact the privacy email above without sending a password.",
                  "قد يعرض التطبيق أن الحذف معلّق أثناء إزالة الوسائط الخاصة. تستمر محاولات الخلفية في التنظيف؛ والحالة المعلّقة لا تعني الاكتمال. إذا استمر تعليق الحذف أو احتجت إلى المساعدة، فتواصل مع بريد الخصوصية أعلاه دون إرسال كلمة مرور.",
                )}
              </p>
            </section>
            <section className="rounded-3xl bg-[color:var(--rose-soft)]/45 p-6 md:p-8">
              <h2 className="text-2xl font-semibold">
                {l("What deletion covers", "ما يشمله الحذف")}
              </h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {coverage.map((item) => (
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
                {l(
                  "We may retain limited information only where reasonably required for security, abuse prevention, legal compliance, or backups, as described in our ",
                  "قد نحتفظ بمعلومات محدودة فقط عند الحاجة المعقولة لأغراض الأمن أو منع إساءة الاستخدام أو الامتثال القانوني أو النسخ الاحتياطية، على النحو الموضّح في ",
                )}
                <Link
                  to="/privacy"
                  className="font-bold text-[color:var(--rose-deep)] underline underline-offset-4"
                >
                  {l("Privacy Policy", "سياسة الخصوصية")}
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
