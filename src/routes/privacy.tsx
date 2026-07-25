import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Globe, Heart, Mail, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

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

function PrivacyPolicy() {
  const { lang, setLang, dir } = useI18n();
  const isAr = lang === "ar";
  const l = (en: string, ar: string) => (isAr ? ar : en);

  const sections = [
    {
      title: l("1. Who we are", "1. من نحن"),
      content: (
        <>
          <p>
            {l(
              "Girly Vibes is a self-care and lifestyle app for routines, diary notes, calm breathing, glow points, reads, activities, reminders, vision boards, and Maryam, the in-app AI chat companion.",
              "Girly Vibes تطبيق للعناية بالنفس وأسلوب الحياة، يوفّر الروتينات وملاحظات اليوميات وتمارين التنفس الهادئ ونقاط الجلو والقراءات والأنشطة والتذكيرات ولوحات الرؤية، بالإضافة إلى Maryam، مرافقة الدردشة بالذكاء الاصطناعي داخل التطبيق.",
            )}
          </p>
          <p>
            {l(
              "For privacy questions or data requests, email ",
              "للاستفسارات المتعلقة بالخصوصية أو طلبات البيانات، راسلنا على ",
            )}
            <a href={`mailto:${CONTACT_EMAIL}`}>
              <bdi>{CONTACT_EMAIL}</bdi>
            </a>
            .
          </p>
        </>
      ),
    },
    {
      title: l("2. Information we collect", "2. المعلومات التي نجمعها"),
      content: (
        <>
          <p>
            {l(
              "Depending on the features you use, we may collect or process:",
              "حسب الميزات التي تستخدمها، قد نجمع أو نعالج:",
            )}
          </p>
          <ul>
            <li>
              <strong>{l("Account information:", "معلومات الحساب:")}</strong>{" "}
              {l(
                "email address, username, Supabase user ID, email-verification status, and authentication session information. Passwords are handled by Supabase Auth; Girly Vibes does not store or display your plain-text password.",
                "عنوان البريد الإلكتروني، واسم المستخدم، ومعرّف مستخدم Supabase، وحالة التحقق من البريد، ومعلومات جلسة المصادقة. تُدار كلمات المرور عبر Supabase Auth؛ ولا تخزّن Girly Vibes كلمة مرورك بنص واضح ولا تعرضها.",
              )}
            </li>
            <li>
              <strong>
                {l("Profile and preferences:", "الملف الشخصي والتفضيلات:")}
              </strong>{" "}
              {l(
                "display name, profile photo or avatar, language, theme, and app settings.",
                "الاسم المعروض، وصورة الملف الشخصي أو الصورة الرمزية، واللغة، والمظهر، وإعدادات التطبيق.",
              )}
            </li>
            <li>
              <strong>{l("Content you create:", "المحتوى الذي تنشئه:")}</strong>{" "}
              {l(
                "diary entries, notes, attachments, voice notes, routines, reminders, widget todo items, glow progress, saved reads, activity preferences, vision-board images, Who Am I answers, and support messages.",
                "إدخالات اليوميات، والملاحظات، والمرفقات، والملاحظات الصوتية، والروتينات، والتذكيرات، ومهام الويدجت، وتقدّم نقاط الجلو، والقراءات المحفوظة، وتفضيلات الأنشطة، وصور لوحة الرؤية، وإجابات Who Am I، ورسائل الدعم.",
              )}
            </li>
            <li>
              <strong>{l("AI chat:", "دردشة الذكاء الاصطناعي:")}</strong>{" "}
              {l(
                "your message, recent chat context, optional display name and calm check-in context, supported tool requests, optional personalization memory, and bounded information submitted when you report an AI response.",
                "رسالتك، وسياق الدردشة الأخير، والاسم المعروض الاختياري وسياق تسجيل الهدوء، وطلبات الأدوات المدعومة، وذاكرة التخصيص الاختيارية، ومعلومات محدودة تُقدَّم عند الإبلاغ عن رد من الذكاء الاصطناعي.",
              )}
            </li>
            <li>
              <strong>{l("Device access:", "الوصول إلى الجهاز:")}</strong>{" "}
              {l(
                "notifications for reminders, microphone access for voice notes, user-selected photos or media, internet access, and local storage for offline data and encrypted sessions.",
                "الإشعارات للتذكيرات، والوصول إلى الميكروفون للملاحظات الصوتية، والصور أو الوسائط التي تختارها، والوصول إلى الإنترنت، والتخزين المحلي للبيانات دون اتصال والجلسات المشفّرة.",
              )}
            </li>
          </ul>
          <p>
            {l(
              "Maryam is blocked from accessing private diary and note content. Durable AI personalization memory is disabled by default and is saved only after you opt in. Opting out deletes that saved memory summary.",
              "تُمنع Maryam من الوصول إلى محتوى اليوميات والملاحظات الخاصة. ذاكرة التخصيص الدائمة للذكاء الاصطناعي معطّلة افتراضيًا ولا تُحفظ إلا بعد موافقتك. وإلغاء الاشتراك يحذف ملخّص الذاكرة المحفوظ.",
            )}
          </p>
          <p>
            {l(
              "The app does not currently include third-party advertising or analytics SDKs.",
              "لا يتضمّن التطبيق حاليًا حزم SDK لإعلانات أو تحليلات من أطراف ثالثة.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l("3. How we use information", "3. كيف نستخدم المعلومات"),
      content: (
        <ul>
          {[
            l(
              "Create, secure, verify, and recover your account.",
              "إنشاء حسابك وتأمينه والتحقق منه واستعادته.",
            ),
            l(
              "Sync your data and provide the app features you choose to use.",
              "مزامنة بياناتك وتوفير ميزات التطبيق التي تختار استخدامها.",
            ),
            l(
              "Provide Maryam AI responses and supported in-app actions.",
              "تقديم ردود Maryam بالذكاء الاصطناعي والإجراءات المدعومة داخل التطبيق.",
            ),
            l(
              "Send account verification and password-reset emails.",
              "إرسال رسائل التحقق من الحساب وإعادة تعيين كلمة المرور.",
            ),
            l(
              "Deliver local reminders and user-scoped Android widgets.",
              "تقديم التذكيرات المحلية وويدجت Android المرتبطة بالمستخدم.",
            ),
            l(
              "Improve safety, reliability, support, and prevent abuse.",
              "تحسين السلامة والموثوقية والدعم ومنع إساءة الاستخدام.",
            ),
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
    },
    {
      title: l(
        "4. Service providers and sharing",
        "4. مقدّمو الخدمات والمشاركة",
      ),
      content: (
        <>
          <p>
            {l(
              "We do not sell personal information or share it for third-party advertising. We use service providers only to operate Girly Vibes:",
              "لا نبيع المعلومات الشخصية ولا نشاركها لأغراض إعلانات أطراف ثالثة. نستخدم مقدّمي خدمات فقط لتشغيل Girly Vibes:",
            )}
          </p>
          <ul>
            {[
              l(
                "Supabase for authentication, database, storage, and sessions.",
                "Supabase للمصادقة وقاعدة البيانات والتخزين والجلسات.",
              ),
              l(
                "Hugging Face Spaces for hosting the Maryam AI/RAG backend.",
                "Hugging Face Spaces لاستضافة الواجهة الخلفية لـ Maryam (الذكاء الاصطناعي / RAG).",
              ),
              l(
                "OpenAI or an OpenAI-compatible provider for AI responses.",
                "OpenAI أو مزوّد متوافق مع OpenAI لردود الذكاء الاصطناعي.",
              ),
              l(
                "Resend for account confirmation and password-reset emails.",
                "Resend لرسائل تأكيد الحساب وإعادة تعيين كلمة المرور.",
              ),
              l(
                "Hosting providers, Google Play, and Android operating-system services.",
                "مقدّمو الاستضافة وGoogle Play وخدمات نظام Android.",
              ),
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            {l(
              "We may disclose information when required by law, to investigate abuse, protect users, or protect the security and integrity of Girly Vibes.",
              "قد نفصح عن المعلومات عندما يقتضي القانون ذلك، أو للتحقيق في إساءة الاستخدام، أو لحماية المستخدمين، أو لحماية أمن وسلامة Girly Vibes.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l(
        "5. AI and wellness disclosures",
        "5. إفصاحات الذكاء الاصطناعي والعافية",
      ),
      content: (
        <>
          <p>
            {l(
              "Maryam is an AI-assisted companion for self-care, routines, reminders, confidence, beauty, studying, and everyday support. AI can make mistakes.",
              "Maryam مرافقة بمساعدة الذكاء الاصطناعي للعناية بالنفس والروتينات والتذكيرات والثقة والجمال والدراسة والدعم اليومي. وقد يخطئ الذكاء الاصطناعي.",
            )}
          </p>
          <p>
            {l(
              "Girly Vibes is not a medical device, therapist, doctor, emergency service, or crisis service and does not diagnose, treat, cure, or prevent medical or mental-health conditions. In immediate danger, contact local emergency services or a trusted person.",
              "Girly Vibes ليس جهازًا طبيًا ولا معالجًا نفسيًا ولا طبيبًا ولا خدمة طوارئ أو أزمة، ولا يشخّص الحالات الطبية أو النفسية ولا يعالجها ولا يشفيها ولا يمنعها. في حال الخطر الفوري، اتصل بخدمات الطوارئ المحلية أو بشخص موثوق.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l("6. How we protect information", "6. كيف نحمي المعلومات"),
      content: (
        <>
          <p>
            {l(
              "We use HTTPS, Supabase row-level security, server-only admin credentials, encrypted local session storage where available, user-scoped reminder and widget data, token verification, request limits, rate limits, and access controls.",
              "نستخدم HTTPS، وأمان مستوى الصف في Supabase، وبيانات اعتماد إدارية على الخادم فقط، وتخزين جلسات محليًا مشفّرًا حيث يتوفر، وبيانات تذكيرات وويدجت مرتبطة بالمستخدم، والتحقق من الرموز، وحدود الطلبات، وحدود المعدّل، وضوابط الوصول.",
            )}
          </p>
          <p>
            {l(
              "No system is perfectly secure. Avoid storing emergency, legally privileged, or highly sensitive information unless you understand the risks.",
              "لا يوجد نظام آمن بالكامل. تجنّب تخزين معلومات طارئة أو محمية قانونيًا أو شديدة الحساسية ما لم تفهم المخاطر.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l("7. Retention and deletion", "7. الاحتفاظ والحذف"),
      content: (
        <>
          <p>
            {l(
              "We retain account and synced app data while your account is active or as needed to provide the service. You can permanently delete your account and associated synced data in Settings → Account → Delete account and data. The app requires your account password and an explicit DELETE confirmation.",
              "نحتفظ ببيانات الحساب والتطبيق المتزامنة طالما حسابك نشط أو حسب الحاجة لتقديم الخدمة. يمكنك حذف حسابك والبيانات المتزامنة المرتبطة به بشكل دائم عبر الإعدادات ← الحساب ← حذف الحساب والبيانات. ويتطلّب التطبيق كلمة مرور الحساب وتأكيد DELETE صريحًا.",
            )}
          </p>
          <p>
            {l(
              "You may also request deletion or make a data request at ",
              "يمكنك أيضًا طلب الحذف أو تقديم طلب بيانات عبر ",
            )}
            <a href={`mailto:${CONTACT_EMAIL}`}>
              <bdi>{CONTACT_EMAIL}</bdi>
            </a>
            .{" "}
            {l(
              "Limited information may be retained where required for security, abuse prevention, legal compliance, or backups.",
              "وقد نحتفظ بمعلومات محدودة عند الحاجة لأغراض الأمن أو منع إساءة الاستخدام أو الامتثال القانوني أو النسخ الاحتياطية.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l("8. Local and offline data", "8. البيانات المحلية ودون اتصال"),
      content: (
        <p>
          {l(
            "Girly Vibes is offline-first. Some data is stored locally for speed and offline use. Local reminders and widget mutations are scoped to the signed-in user and cleared when the app detects an unusable or signed-out session. Uninstalling may remove local-only data; synced data remains until you delete your account or request deletion.",
            "Girly Vibes مصمَّم للعمل أولًا دون اتصال. تُخزَّن بعض البيانات محليًا للسرعة والاستخدام دون إنترنت. التذكيرات المحلية وتغييرات الويدجت مرتبطة بالمستخدم المسجّل الدخول وتُمسح عندما يكتشف التطبيق جلسة غير صالحة أو تسجيل خروج. قد يزيل إلغاء التثبيت البيانات المحلية فقط؛ وتبقى البيانات المتزامنة إلى أن تحذف حسابك أو تطلب الحذف.",
          )}
        </p>
      ),
    },
    {
      title: l("9. Children’s privacy", "9. خصوصية الأطفال"),
      content: (
        <p>
          {l(
            "Girly Vibes is not intended for children under 13. If we learn that we collected personal information from a child under 13 without appropriate consent, we will take steps to delete it.",
            "Girly Vibes غير موجّه للأطفال دون سن 13. إذا علمنا أننا جمعنا معلومات شخصية من طفل دون 13 دون موافقة مناسبة، فسنتخذ خطوات لحذفها.",
          )}
        </p>
      ),
    },
    {
      title: l("10. International processing", "10. المعالجة الدولية"),
      content: (
        <p>
          {l(
            "Information may be processed in countries other than where you live. Our service providers may store or process data where they operate and support secure transmission and access controls.",
            "قد تُعالَج المعلومات في بلدان غير بلد إقامتك. وقد يخزّن مقدّمو خدماتنا البيانات أو يعالجونها حيث يعملون، مع دعم النقل الآمن وضوابط الوصول.",
          )}
        </p>
      ),
    },
    {
      title: l("11. Changes to this policy", "11. التغييرات على هذه السياسة"),
      content: (
        <p>
          {l(
            'We may update this policy when features, providers, data practices, or legal requirements change. The latest version and effective date will always appear on this page.',
            "قد نحدّث هذه السياسة عند تغيّر الميزات أو مقدّمي الخدمات أو ممارسات البيانات أو المتطلبات القانونية. وستظهر أحدث نسخة وتاريخ السريان دائمًا على هذه الصفحة.",
          )}
        </p>
      ),
    },
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
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[color:var(--mauve)] transition hover:border-[color:var(--rose-deep)]"
            >
              <ArrowLeft
                className={`h-4 w-4 ${isAr ? "scale-x-[-1]" : ""}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">
                {l("Back home", "العودة إلى الرئيسية")}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 md:py-20">
        <section className="rounded-[32px] border border-[color:var(--border)] bg-white p-7 shadow-card md:p-12">
          <div className="mb-10 border-b border-[color:var(--border)] pb-9">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--rose-soft)] px-4 py-2 text-sm font-semibold text-[color:var(--rose-deep)]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {l("Your privacy matters", "خصوصيتك تهمّنا")}
            </div>
            <h1 className="text-4xl font-semibold text-[color:var(--mauve)] md:text-6xl">
              {l("Privacy Policy", "سياسة الخصوصية")}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[color:var(--mauve)]/70">
              {l(
                "This policy explains how Girly Vibes collects, uses, stores, protects, and shares information across the mobile app and related services.",
                "توضّح هذه السياسة كيف تجمع Girly Vibes المعلومات وتستخدمها وتخزّنها وتحميها وتشاركها عبر تطبيق الجوال والخدمات ذات الصلة.",
              )}
            </p>
            <p className="mt-4 text-sm font-semibold text-[color:var(--rose-deep)]">
              {l("Effective July 26, 2026", "سارية اعتبارًا من 26 يوليو 2026")}
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
                <h2 className="text-xl font-semibold">
                  {l("Contact us", "تواصل معنا")}
                </h2>
                <p className="mt-2 text-[color:var(--mauve)]/70">
                  {l(
                    "Privacy questions, data requests, and account-deletion requests:",
                    "استفسارات الخصوصية وطلبات البيانات وطلبات حذف الحساب:",
                  )}
                </p>
                <a
                  className="mt-2 inline-block font-bold text-[color:var(--rose-deep)] underline underline-offset-4"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  <bdi>{CONTACT_EMAIL}</bdi>
                </a>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
