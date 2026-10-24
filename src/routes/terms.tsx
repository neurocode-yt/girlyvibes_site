import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () =>
    legalHead(
      "/terms",
      "Terms of Use",
      "The simple, friendly terms for using the Girly Vibes app and website.",
    ),
});

function TermsPage() {
  return (
    <LegalPage
      updated="2026-10-24"
      title={{ ar: "شروط الاستخدام", en: "Terms of Use" }}
      intro={{
        ar: "شروط بسيطة ولطيفة زي التطبيق نفسه 🌸 باستخدامك لموقع أو تطبيق Girly Vibes بتوافقي عليها.",
        en: "Simple, friendly terms — just like the app itself 🌸 By using the Girly Vibes website or app, you agree to them.",
      }}
      sections={[
        {
          title: { ar: "قواعد لوحة الجلو", en: "Leaderboard community rules" },
          body: {
            ar: "المشاركة اختيارية. لا تنشري تنمراً أو تهديداً أو كراهية أو محتوى جنسياً أو تشجيعاً لإيذاء النفس أو معلومات شخصية عنك أو عن الآخرين. يراجع المشرف الاسم العام والرسالة قبل نشرهما، وكل تعديل يحتاج موافقة جديدة. يمكننا رفض المخالفات أو إزالة محتوى سبق اعتماده. يمكنك الإبلاغ والحظر والانسحاب من صفحة نقاط الجلو. لا تضمن الموافقة ترتيباً أو مكافأة.",
            en: "Participation is optional. Do not post bullying, threats, hate, sexual content, encouragement of self-harm, or personal information about yourself or others. Admins approve the public name and note before publication; every edit requires fresh approval. We may reject violations or remove previously approved content. Report, block or withdraw from Glow Points. Approval does not guarantee a ranking or reward.",
          },
        },
        {
          title: { ar: "استخدام شخصي ولطيف", en: "Personal, kind use" },
          body: {
            ar: "Girly Vibes مجاني للاستخدام الشخصي. استخدميه بلطف وما تحاوليش تعطلي الخدمة أو تسيئي استخدامها.",
            en: "Girly Vibes is free for personal use. Please use it kindly and don't attempt to disrupt or misuse the service.",
          },
        },
        {
          title: { ar: "مش علاج نفسي", en: "Not therapy or medical advice" },
          body: {
            ar: "غرفة الهدوء والقراءات هي دعم لطيف وتمارين استرخاء — مش علاج نفسي أو نصيحة طبية. لو محتاجة مساعدة حقيقية، تكلمي مع شخص بالغ تثقي فيه أو مع مختص.",
            en: "The Calm Room and reads are gentle support and relaxation exercises — not therapy or medical advice. If you need real help, please talk to a trusted adult or a professional.",
          },
        },
        {
          title: { ar: "المحتوى", en: "Content" },
          body: {
            ar: "التصميمات والنصوص والمحتوى في الموقع والتطبيق ملك Girly Vibes. فيديوهات يوتيوب تتبع شروط يوتيوب.",
            en: "Designs, text, and content on this site and in the app belong to Girly Vibes. YouTube videos are subject to YouTube's own terms.",
          },
        },
        {
          title: { ar: "التغييرات", en: "Changes" },
          body: {
            ar: "ممكن نحدّث التطبيق أو الشروط دي من وقت للتاني عشان نخلي التجربة أحسن. التحديثات المهمة هنعلن عنها في قسم التحديثات.",
            en: "We may update the app or these terms from time to time to make the experience better. Important updates will appear in the Updates section.",
          },
        },
      ]}
    />
  );
}
