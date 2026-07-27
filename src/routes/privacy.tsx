import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () =>
    legalHead(
      "/privacy",
      "Privacy Policy",
      "How Girly Vibes handles your data — your diary, notes, and routines stay on your device.",
    ),
});

function PrivacyPage() {
  return (
    <LegalPage
      updated="2026-07-27"
      title={{ ar: "سياسة الخصوصية", en: "Privacy Policy" }}
      intro={{
        ar: "خصوصيتك غالية علينا 🩷 صفحة بسيطة وواضحة عن البيانات في تطبيق وموقع Girly Vibes.",
        en: "Your privacy matters to us 🩷 Here's a simple, honest look at how data works in the Girly Vibes app and website.",
      }}
      sections={[
        {
          title: { ar: "بياناتك تفضل على هاتفك", en: "Your data stays on your phone" },
          body: {
            ar: "الروتينات، اليوميات، الملاحظات، المزاج، وبورد الرؤية بتتخزن محليًا على جهازك. ما بننشئ حسابات وما بنطلب تسجيل دخول.",
            en: "Routines, diary entries, notes, moods, and your vision board are stored locally on your device. There are no accounts and no sign-in required.",
          },
        },
        {
          title: { ar: "اليوميات الخاصة", en: "Private diary mode" },
          body: {
            ar: "وضع اليوميات الخاص محمي بكود سري تختاريه بنفسك. الكود بيتخزن على جهازك فقط، وما نقدرش نستعيده لو نسيتيه.",
            en: "The private diary mode is protected by a PIN you choose. The PIN is stored only on your device — we can't see it or recover it.",
          },
        },
        {
          title: { ar: "الموقع واليوتيوب", en: "This website & YouTube" },
          body: {
            ar: "الموقع بيعرض فيديوهات وإحصائيات عامة من قناتنا على يوتيوب عبر خدمات YouTube. لما تفتحي فيديو على يوتيوب بتطبق سياسات جوجل ويوتيوب.",
            en: "This website shows public videos and stats from our YouTube channel using YouTube services. When you open a video on YouTube, Google's and YouTube's own policies apply.",
          },
        },
        {
          title: { ar: "تفضيلاتك على الموقع", en: "Your preferences on this site" },
          body: {
            ar: "بنحفظ اختياراتك البسيطة (اللغة، الثيم، الوضع الليلي) في متصفحك فقط، عشان الموقع يفتكرها في زيارتك الجاية. مفيش تتبع إعلاني.",
            en: "We keep small preferences (language, theme, dark mode) in your browser only, so the site remembers them next visit. There is no ad tracking.",
          },
        },
        {
          title: { ar: "أمانك أولًا", en: "Safety first" },
          body: {
            ar: "التطبيق مصمم كمساحة لطيفة وآمنة. لو في أي وقت حسيتي إنك مش بخير، تكلمي مع شخص بالغ تثقي فيه.",
            en: "The app is designed to be a soft, safe space. If you ever feel unsafe or overwhelmed, please talk to a trusted adult.",
          },
        },
      ]}
    />
  );
}
