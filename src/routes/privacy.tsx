import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Globe, Heart, Mail, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PRIVACY_CONTACT_EMAIL, PRIVACY_UPDATED, PUBLIC_SITE_URL } from "@/lib/legal";

const CONTACT_EMAIL = PRIVACY_CONTACT_EMAIL;

export const Route = createFileRoute("/privacy")({
  component: PrivacyPolicy,
  head: () => ({
    meta: [
      { title: "Privacy Policy | Girly Vibes" },
      {
        name: "description",
        content: "Learn how Girly Vibes collects, uses, stores, protects, and deletes information.",
      },
      { property: "og:title", content: "Girly Vibes Privacy Policy" },
      {
        property: "og:description",
        content: "Privacy information for the Girly Vibes mobile app and services.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${PUBLIC_SITE_URL}/privacy` }],
  }),
});

function PrivacyPolicy() {
  const { lang, setLang, dir } = useI18n();
  const isAr = lang === "ar";
  const l = (en: string, ar: string) => (isAr ? ar : en);

  const sections = [
    {
      title: l("1. About this policy", "1. حول هذه السياسة"),
      content: (
        <>
          <p>
            {l(
              "Girly Vibes provides self-care routines, diary and notes, reminders, calm activities, progress tracking and Maryam, an AI chat companion. This policy explains how the Girly Vibes app and related services collect, use, share and retain personal information.",
              "يوفر Girly Vibes روتينات للعناية بالنفس ويوميات وملاحظات وتذكيرات وأنشطة هادئة وتتبعاً للتقدم ومريم، مرافقة دردشة بالذكاء الاصطناعي. تشرح هذه السياسة كيف يجمع التطبيق والخدمات المرتبطة به المعلومات الشخصية ويستخدمها ويشاركها ويحتفظ بها.",
            )}
          </p>
          <p>
            {l(
              "For privacy questions or requests about your information, contact privacy@girly-vibes.com. This policy covers account information, private content, AI conversations and optional public leaderboard participation.",
              "لأسئلة الخصوصية أو الطلبات المتعلقة بمعلوماتك، تواصل معنا عبر privacy@girly-vibes.com. تشمل هذه السياسة معلومات الحساب والمحتوى الخاص ومحادثات الذكاء الاصطناعي والمشاركة الاختيارية في لوحة الجلو العامة.",
            )}
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
              "Account and preferences: your Google email and shared profile information, account ID, optional username or nickname, profile photo, language, theme, settings and authentication session. Google manages sign-in and account recovery; we do not receive your Google password.",
              "الحساب والتفضيلات: بريد Google ومعلومات الملف التي تشاركها ومعرّف الحساب واسم المستخدم أو الاسم المستعار الاختياري وصورة الملف واللغة والمظهر والإعدادات وجلسة المصادقة. تدير Google تسجيل الدخول واستعادة الوصول؛ ولا نتلقى كلمة مرور Google.",
            )}
          </p>
          <p>
            {l(
              "Content and activity: diary entries, notes, notebook answers, selected photos or other attachments, voice notes, routines, reminders, plans, progress and glow points, saved reads, vision-board content and information you provide for support.",
              "المحتوى والنشاط: اليوميات والملاحظات وإجابات الدفتر والصور أو المرفقات التي تختارها والملاحظات الصوتية والروتينات والتذكيرات والخطط والتقدم ونقاط الجلو والقراءات المحفوظة ولوحة الرؤية والمعلومات التي تقدمها للدعم.",
            )}
          </p>
          <p>
            {l(
              "Chat and moderation: messages, replies, conversation identifiers and timestamps, recent context, optional personalization summaries, usage counters, submitted reports, safety flags and review notes. Public leaderboard submissions, decisions and blocks are described below.",
              "الدردشة والإشراف: الرسائل والردود ومعرّفات المحادثات وأوقاتها والسياق الحديث وملخصات التخصيص الاختيارية وعدادات الاستخدام والبلاغات وتنبيهات السلامة وملاحظات المراجعة. نوضح أدناه طلبات لوحة الجلو العامة وقرارات مراجعتها والحظر.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l("3. How we use information", "3. كيف نستخدم المعلومات"),
      content: (
        <>
          <p>
            {l(
              "We use this information to operate and secure accounts, save and synchronize content, restore synced data on another device, provide requested app features and AI responses, deliver local reminders, respond to support requests, investigate abuse and protect users and the service.",
              "نستخدم هذه المعلومات لتشغيل الحسابات وحمايتها وحفظ المحتوى ومزامنته واستعادة البيانات المتزامنة على جهاز آخر وتوفير ميزات التطبيق وردود الذكاء الاصطناعي والتذكيرات المحلية والرد على طلبات الدعم والتحقيق في إساءة الاستخدام وحماية المستخدمين والخدمة.",
            )}
          </p>
          <p>
            {l(
              "We do not sell your personal information or use your private content for third-party advertising. Girly Vibes uses Google sign-in rather than sending signup-verification or password-reset emails.",
              "لا نبيع معلوماتك الشخصية ولا نستخدم محتواك الخاص لإعلانات الجهات الخارجية. يستخدم Girly Vibes تسجيل الدخول عبر Google بدلاً من إرسال رسائل تأكيد التسجيل أو إعادة تعيين كلمة المرور.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l(
        "4. Maryam, AI processing and cloud history",
        "4. مريم ومعالجة الذكاء الاصطناعي والسجل السحابي",
      ),
      content: (
        <>
          <p>
            {l(
              "When you send a message to Maryam, your message and relevant recent context are sent to our backend and the configured AI provider to generate a response. Depending on the feature, this can include your display name, selected help mode or calm check-in context. Maryam does not receive access to your private diary or notes through chat.",
              "عند إرسال رسالة إلى مريم، تُرسل الرسالة والسياق الحديث ذو الصلة إلى خادمنا ومزوّد الذكاء الاصطناعي المستخدم لتوليد الرد. قد يتضمن ذلك، حسب الميزة، اسمك المعروض أو نمط المساعدة أو سياق تسجيل حالتك. لا تحصل مريم على وصول إلى يومياتك أو ملاحظاتك الخاصة عبر الدردشة.",
            )}
          </p>
          <p>
            {l(
              "For signed-in accounts, conversation transcripts and metadata are stored in Supabase for history, synchronization and recovery across devices or reinstalls, independently of plan. Personalization memory is a separate optional feature: disabling or clearing it does not erase conversation history.",
              "للحسابات المسجّلة، تُحفظ نصوص المحادثات وبياناتها في Supabase للسجل والمزامنة والاستعادة عبر الأجهزة أو بعد إعادة التثبيت، بصرف النظر عن الخطة. ذاكرة التخصيص ميزة اختيارية منفصلة؛ تعطيلها أو مسحها لا يمحو سجل المحادثات.",
            )}
          </p>
          <p>
            {l(
              "Maryam can make mistakes. Girly Vibes provides general self-care support, not medical advice, diagnosis, treatment, therapy or emergency assistance.",
              "قد تخطئ مريم. يقدم Girly Vibes دعماً عاماً للعناية بالنفس، وليس نصيحة طبية أو تشخيصاً أو علاجاً أو علاجاً نفسياً أو مساعدة طارئة.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l(
        "5. Authorized chat review for safety and security",
        "5. مراجعة المحادثات المخوّلة لأغراض السلامة والأمن",
      ),
      content: (
        <>
          <p>
            {l(
              "Authorized Girly Vibes administrators can access and review stored Maryam conversations, including messages and replies, together with associated account details such as email, account ID and conversation timestamps. Access is not limited to messages that a user reports or that an automated system flags. We use this access for safety and security review, investigating suspected abuse or threats, assessing reports and addressing support concerns.",
              "يمكن لمشرفي Girly Vibes المخوّلين الوصول إلى محادثات مريم المحفوظة ومراجعتها، بما يشمل الرسائل والردود وبيانات الحساب المرتبطة مثل البريد الإلكتروني ومعرّف الحساب وأوقات المحادثة. لا يقتصر الوصول على الرسائل التي يبلّغ عنها المستخدم أو يرصدها النظام آلياً. نستخدم هذا الوصول لمراجعة السلامة والأمن والتحقيق في الاشتباه بإساءة الاستخدام أو التهديدات وتقييم البلاغات ومعالجة مسائل الدعم.",
            )}
          </p>
          <p>
            {l(
              "Messages containing possible suicide, self-harm, abuse or danger signals may produce automated safety warnings for human review. Warning records can include the flagged text, linked account and conversation, detection time, review status and internal notes. A report of an AI reply can also include the reply, preceding message, sources and report reason.",
              "قد تُنشئ الرسائل التي تحمل إشارات محتملة للانتحار أو إيذاء النفس أو الإساءة أو الخطر تنبيهات آلية للمراجعة البشرية. قد تتضمن سجلات التنبيه النص المحدد والحساب والمحادثة المرتبطين ووقت الكشف وحالة المراجعة والملاحظات الداخلية. وقد يشمل بلاغ رد الذكاء الاصطناعي الرد والرسالة السابقة والمصادر وسبب البلاغ.",
            )}
          </p>
          <p>
            {l(
              "Chats are not public to other users, but they are not end-to-end encrypted or confidential from authorized operators and service providers. Admin access is intended for the purposes described here, not public disclosure. Automated detection can miss concerns or flag harmless messages. Review is not continuous, and we cannot guarantee detection, a response or assistance. In immediate danger, contact local emergency services or a trusted person rather than waiting for an administrator.",
              "المحادثات ليست عامة للمستخدمين الآخرين، لكنها ليست مشفّرة من طرف إلى طرف ولا محجوبة عن المشغلين المخوّلين ومقدمي الخدمات. يهدف وصول المشرفين إلى الأغراض الموضحة هنا، وليس إلى النشر العام. قد يفوّت الكشف الآلي حالات خطرة أو يرصد رسائل غير ضارة. المراجعة ليست مستمرة ولا نضمن اكتشاف الخطر أو الرد أو المساعدة. في حال الخطر الفوري، تواصل مع خدمات الطوارئ المحلية أو شخص موثوق بدلاً من انتظار المشرف.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l("6. Optional public leaderboard", "6. لوحة الجلو العامة الاختيارية"),
      content: (
        <>
          <p>
            {l(
              "Leaderboard participation is optional. After accepting the community rules, you may submit a public nickname and note for admin approval. Participating scores use a generic name during review. Only approved names and top-three notes appear publicly to other users; every edit requires fresh approval.",
              "المشاركة في لوحة الجلو اختيارية. بعد قبول قواعد المجتمع يمكنك إرسال اسم عام ورسالة لموافقة المشرف. تظهر نقاط المشاركين باسم عام أثناء المراجعة. لا تظهر الأسماء والرسائل للمستخدمين الآخرين إلا بعد الموافقة، وتُعرض الرسائل للمراكز الثلاثة الأولى؛ وكل تعديل يحتاج موافقة جديدة.",
            )}
          </p>
          <p>
            {l(
              "You can withdraw, report a public name or note, and block or unblock users from your leaderboard. Blocking affects your view, not other users’ views. We store submissions, the latest review decision and feedback, report snapshots and blocks to operate moderation. Withdrawal does not erase these moderation records; full account erasure removes account-linked records.",
              "يمكنك الانسحاب والإبلاغ عن اسم أو رسالة وحظر المستخدمين أو إلغاء حظرهم من لوحتك. يؤثر الحظر على عرضك أنت وليس على عرض الآخرين. نحفظ الطلبات وآخر قرار مراجعة وملاحظاته ونسخ البلاغات والحظر لتشغيل الإشراف. لا يمحو الانسحاب سجلات الإشراف هذه؛ ويزيل محو الحساب بالكامل السجلات المرتبطة به.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l("7. Service providers and disclosures", "7. مقدمو الخدمات والإفصاح"),
      content: (
        <>
          <p>
            {l(
              "We use Google for sign-in and account recovery; Supabase for authentication, database and media storage; Hugging Face Spaces to host the Maryam backend; and OpenAI or an OpenAI-compatible provider to generate AI responses. Hosting providers and Android/Google Play services support website delivery, distribution and operating-system features. Providers process relevant information when delivering these services.",
              "نستخدم Google لتسجيل الدخول واستعادة الوصول، وSupabase للمصادقة وقاعدة البيانات وتخزين الوسائط، وHugging Face Spaces لاستضافة خادم مريم، وOpenAI أو مزوداً متوافقاً معه لتوليد ردود الذكاء الاصطناعي. يدعم مقدمو الاستضافة وخدمات Android وGoogle Play تقديم الموقع وتوزيع التطبيق وميزات نظام التشغيل. يعالج المزودون المعلومات ذات الصلة عند تقديم هذه الخدمات.",
            )}
          </p>
          <p>
            {l(
              "Information may be processed outside your country, where our providers operate. We may disclose relevant information when required by applicable law or a valid legal request, or when reasonably necessary and legally permitted to investigate abuse or protect a person or the service. Safety review does not mean that every flagged conversation is shared externally.",
              "قد تُعالج المعلومات خارج بلدك حيث يعمل مقدمو خدماتنا. قد نفصح عن المعلومات ذات الصلة عندما يتطلب القانون المعمول به أو طلب قانوني صالح ذلك، أو عندما يكون الإفصاح ضرورياً بصورة معقولة ومسموحاً به قانوناً للتحقيق في إساءة الاستخدام أو حماية شخص أو الخدمة. لا تعني مراجعة السلامة مشاركة كل محادثة مرصودة مع جهة خارجية.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l("8. Permissions and local storage", "8. الأذونات والتخزين المحلي"),
      content: (
        <>
          <p>
            {l(
              "Features may request notifications for reminders, microphone access for voice notes, and access to photos or media you select. You can manage permissions in your device settings. Refusing a permission may prevent the related feature from working.",
              "قد تطلب الميزات الإشعارات للتذكيرات والميكروفون للملاحظات الصوتية والوصول إلى الصور أو الوسائط التي تختارها. يمكنك إدارة الأذونات من إعدادات الجهاز. قد يؤدي رفض إذن إلى منع عمل الميزة المرتبطة به.",
            )}
          </p>
          <p>
            {l(
              "Some content, preferences and encrypted conversation caches are stored on your device for offline use. Offline changes require reconnection to synchronize. Uninstalling can remove unsynced device-only content; it does not erase data already stored on our servers. Other devices and widgets may keep cached information until they reconnect and refresh.",
              "يُحفظ بعض المحتوى والتفضيلات وذاكرة المحادثات المشفّرة على جهازك للاستخدام دون اتصال. تحتاج التغييرات دون اتصال إلى إعادة الاتصال للمزامنة. قد يزيل إلغاء التثبيت المحتوى غير المتزامن الموجود على الجهاز فقط؛ ولا يمحو البيانات المحفوظة على خوادمنا. قد تحتفظ الأجهزة الأخرى والويدجت بنسخ مؤقتة حتى إعادة الاتصال والتحديث.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l("9. Security and private content", "9. الأمن والمحتوى الخاص"),
      content: (
        <>
          <p>
            {l(
              "We use safeguards such as HTTPS in transit, database access controls, authenticated sessions, server-only admin credentials and encrypted local session storage where available. No system is perfectly secure. Private diary PINs protect the local screen; they are not end-to-end encryption of cloud copies. Authorized operators and providers can process stored private content to operate and support the service.",
              "نستخدم وسائل حماية مثل HTTPS أثناء النقل وضوابط الوصول إلى قاعدة البيانات وجلسات المصادقة وبيانات اعتماد المشرفين على الخادم فقط وتخزين الجلسات المحلي المشفّر حيث يتوفر. لا يوجد نظام آمن تماماً. تحمي رموز اليوميات الخاصة الشاشة المحلية؛ ولا تعني تشفير النسخ السحابية من طرف إلى طرف. يمكن للمشغلين المخوّلين والمزودين معالجة المحتوى الخاص المحفوظ لتشغيل الخدمة ودعمها.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l("10. Retention and manual safety review", "10. الاحتفاظ والمراجعة اليدوية للسلامة"),
      content: (
        <>
          <p>
            {l(
              "We retain account and synced content while needed to provide the service. Removing a chat from the app does not immediately erase its server copy. Retained transcripts remain available to authorized administrators for safety and security review. Server cleanup of these copies is manual after review determines that there is no continuing safety or security need to retain them; there is no automatic expiry or guaranteed review deadline.",
              "نحتفظ بالحساب والمحتوى المتزامن حسب الحاجة لتقديم الخدمة. إزالة محادثة من التطبيق لا تمحو نسختها على الخادم فوراً. تبقى النصوص المحتفظ بها متاحة للمشرفين المخوّلين لمراجعة السلامة والأمن. يتم تنظيف هذه النسخ من الخادم يدوياً بعد أن تحدد المراجعة عدم وجود حاجة مستمرة للاحتفاظ بها لأغراض السلامة أو الأمن؛ ولا توجد مدة انتهاء تلقائية أو مهلة مراجعة مضمونة.",
            )}
          </p>
          <p>
            {l(
              "Separate personalization summaries, reports, safety-review records and provider backups are not erased merely by clearing the chat list. Full account erasure is a separate process and removes account-linked conversation history, including retained chats, memory and moderation records from our active app database. Provider backup copies follow the relevant provider’s retention and deletion processes.",
              "لا يؤدي مسح قائمة المحادثات وحده إلى محو ملخصات التخصيص أو البلاغات أو سجلات مراجعة السلامة أو النسخ الاحتياطية لدى المزودين. محو الحساب بالكامل إجراء منفصل يزيل سجل المحادثات المرتبط بالحساب، بما فيه المحادثات المحتفظ بها والذاكرة وسجلات الإشراف، من قاعدة بيانات التطبيق النشطة. تتبع نسخ المزودين الاحتياطية إجراءات الاحتفاظ والحذف لدى المزود المعني.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l("11. Your choices and account deletion", "11. خياراتك وحذف الحساب"),
      content: (
        <>
          <p>
            {l(
              "You can edit supported profile information, manage device permissions, turn off optional AI memory, withdraw from the leaderboard and request access, correction or deletion of your information at privacy@girly-vibes.com. Depending on applicable law, you may have additional rights to obtain a copy, object to or restrict processing, or complain to a data-protection authority.",
              "يمكنك تعديل معلومات الملف المدعومة وإدارة أذونات الجهاز وإيقاف ذاكرة الذكاء الاصطناعي الاختيارية والانسحاب من لوحة الجلو وطلب الوصول إلى معلوماتك أو تصحيحها أو حذفها عبر privacy@girly-vibes.com. حسب القانون المعمول به، قد تكون لك حقوق إضافية للحصول على نسخة أو الاعتراض على المعالجة أو تقييدها أو تقديم شكوى إلى جهة حماية البيانات.",
            )}
          </p>
          <p>
            {l(
              "To erase your account, use Settings → Account → Delete account and data, confirm DELETE and sign in again with the same Google account. You can also request deletion without reinstalling the app at https://girly-vibes.com/delete-account or through our privacy email. We verify account ownership before acting; simply supplying someone else’s email does not authorize deletion. Never send your password.",
              "لمحو حسابك، استخدم الإعدادات ← الحساب ← حذف الحساب والبيانات، وأكّد DELETE ثم سجّل الدخول مجدداً بحساب Google نفسه. يمكنك أيضاً طلب الحذف دون إعادة تثبيت التطبيق عبر https://girly-vibes.com/delete-account أو بريد الخصوصية. نتحقق من ملكية الحساب قبل التنفيذ؛ ومجرد تقديم بريد شخص آخر لا يجيز حذف حسابه. لا ترسل كلمة مرورك مطلقاً.",
            )}
          </p>
          <p>
            {l(
              "Private media cleanup can continue in the background after an erasure request. A pending status does not mean cleanup is complete. Contact our privacy email if you need help or your request remains pending.",
              "قد يستمر تنظيف الوسائط الخاصة في الخلفية بعد طلب المحو. لا تعني الحالة المعلّقة اكتمال التنظيف. تواصل مع بريد الخصوصية إذا احتجت إلى المساعدة أو بقي طلبك معلّقاً.",
            )}
          </p>
          <p>
            <Link to="/delete-account" className="font-semibold underline underline-offset-4">
              {l("Account-deletion instructions and request", "تعليمات حذف الحساب وتقديم الطلب")}
            </Link>
          </p>
        </>
      ),
    },
    {
      title: l("12. Children’s privacy", "12. خصوصية الأطفال"),
      content: (
        <>
          <p>
            {l(
              "Girly Vibes is not intended for children under 13. If you believe a child under 13 has provided personal information without appropriate consent, contact us so we can investigate and take steps to remove it.",
              "Girly Vibes غير موجّه للأطفال دون سن 13. إذا اعتقدت أن طفلاً دون 13 قد قدم معلومات شخصية دون موافقة مناسبة، فتواصل معنا للتحقيق واتخاذ خطوات لإزالتها.",
            )}
          </p>
        </>
      ),
    },
    {
      title: l("13. Changes and contact", "13. التغييرات والتواصل"),
      content: (
        <>
          <p>
            {l(
              "We update this policy when features, providers or data practices change. The date on this page identifies the latest policy. Where required, we provide additional notice and request consent for material changes. Questions and privacy requests can be sent to privacy@girly-vibes.com.",
              "نحدّث هذه السياسة عندما تتغير الميزات أو المزودون أو ممارسات البيانات. يحدد التاريخ في هذه الصفحة أحدث سياسة. نقدم إشعاراً إضافياً ونطلب الموافقة على التغييرات الجوهرية عندما يكون ذلك مطلوباً. يمكنك إرسال أسئلة الخصوصية وطلباتها إلى privacy@girly-vibes.com.",
            )}
          </p>
        </>
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
              <ArrowLeft className={`h-4 w-4 ${isAr ? "scale-x-[-1]" : ""}`} aria-hidden="true" />
              <span className="hidden sm:inline">{l("Back home", "العودة إلى الرئيسية")}</span>
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
              {l(`Effective ${PRIVACY_UPDATED.en}`, `سارية اعتبارًا من ${PRIVACY_UPDATED.ar}`)}
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section
                key={section.title}
                id={section.title.startsWith("7.") ? "retention-and-deletion" : undefined}
                className="privacy-copy"
              >
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
                <h2 className="text-xl font-semibold">{l("Contact us", "تواصل معنا")}</h2>
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
