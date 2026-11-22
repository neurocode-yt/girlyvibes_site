export const HANDLE = "girlyvibes0";
export const CHANNEL_ID = "UCH8YtfoeO4rZuvkH3B4X2hg";

export type YTVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  views: number;
  duration: string; // ISO 8601 e.g. PT3M21S
  url: string;
};

export type YTPlaylist = {
  id: string;
  title: string;
  thumbnail: string;
  itemCount: number;
  url: string;
};

export type YTPayload = {
  channel: {
    id: string;
    title: string;
    thumbnail: string;
    subscribers: number;
    videoCount: number;
    viewCount: number;
    url: string;
  } | null;
  videos: YTVideo[];
  playlists: YTPlaylist[];
  isFallback?: boolean;
  error?: string;
};

export const FALLBACK_YOUTUBE_DATA: YTPayload = {
  channel: {
    id: CHANNEL_ID,
    title: "Girly Vibes",
    thumbnail:
      "https://yt3.ggpht.com/68uhiTNcz27QF9wbORndN7WWsfZVciwBvHVsf3xyBoTeyLUHd6iX4ghXdUVMKeAiDMzKTHw_Rg=s800-c-k-c0x00ffffff-no-rj",
    subscribers: 228000,
    videoCount: 374,
    viewCount: 27252506,
    url: `https://www.youtube.com/@${HANDLE}`,
  },
  videos: [
    {
      id: "WuC-f8bCU4Q",
      title: "لو عمرك بين 10 ل 18 سنة لازم تشوفي الفيديو دا 🎀 نصائح مهمة للمراهقات 💖 part 2 💖",
      description: "",
      thumbnail: "https://i.ytimg.com/vi/WuC-f8bCU4Q/maxresdefault.jpg",
      publishedAt: "2026-07-13T13:45:25Z",
      views: 67379,
      duration: "PT11M6S",
      url: "https://www.youtube.com/watch?v=WuC-f8bCU4Q",
    },
    {
      id: "SuLtHDYE7O8",
      title:
        "جلو اب كامل في فيديو واحد ! 👑💖 ( نصائح، روتين ، تمارين ، وصفات ، تسريحات ولفات حجاب والمزيد ! )✨",
      description: "",
      thumbnail: "https://i.ytimg.com/vi/SuLtHDYE7O8/maxresdefault.jpg",
      publishedAt: "2026-06-24T09:46:39Z",
      views: 87373,
      duration: "PT24M36S",
      url: "https://www.youtube.com/watch?v=SuLtHDYE7O8",
    },
    {
      id: "GOss_2lU-0U",
      title:
        "15 فكرة ممتعة تكسر ملل العطلة بعيداً عن الهاتف والسوشيال ميديا 🤭💖✨ لازم تجربيهم ! 🫢",
      description: "",
      thumbnail: "https://i.ytimg.com/vi/GOss_2lU-0U/maxresdefault.jpg",
      publishedAt: "2026-06-09T11:31:50Z",
      views: 183647,
      duration: "PT13M50S",
      url: "https://www.youtube.com/watch?v=GOss_2lU-0U",
    },
    {
      id: "l0y9ugOCx_U",
      title:
        "اشياء ما قالوها لنا امهاتنا في مرحلة المراهقة ! 🤫 - نصائح للبنات فقط بدون خجل 👌🏻🎀✨",
      description: "",
      thumbnail: "https://i.ytimg.com/vi/l0y9ugOCx_U/maxresdefault.jpg",
      publishedAt: "2026-05-22T11:23:22Z",
      views: 426745,
      duration: "PT19M38S",
      url: "https://www.youtube.com/watch?v=l0y9ugOCx_U",
    },
    {
      id: "dE0xP_VtMLM",
      title: "وأخيرا فيديو الأسئلة Q&A 🤭🎀✨ أسئلة محرجة واجابات صريحة 😬💯",
      description: "",
      thumbnail: "https://i.ytimg.com/vi/dE0xP_VtMLM/maxresdefault.jpg",
      publishedAt: "2026-04-25T08:28:59Z",
      views: 41680,
      duration: "PT39M22S",
      url: "https://www.youtube.com/watch?v=dE0xP_VtMLM",
    },
    {
      id: "fd_-tLUinn0",
      title: "خطة عملية هتخليكي واثقة في نفسك بجد👌🏻❤️",
      description: "",
      thumbnail: "https://i.ytimg.com/vi/fd_-tLUinn0/maxresdefault.jpg",
      publishedAt: "2026-04-17T11:25:11Z",
      views: 47218,
      duration: "PT14M16S",
      url: "https://www.youtube.com/watch?v=fd_-tLUinn0",
    },
  ],
  playlists: [
    {
      id: "PLm5K2tBe_c7dt3IEFzInR4bGfAtyvtCq8",
      title: "shorts",
      thumbnail: "https://i.ytimg.com/vi/QV2o1RBunRo/hqdefault.jpg",
      itemCount: 250,
      url: "https://www.youtube.com/playlist?list=PLm5K2tBe_c7dt3IEFzInR4bGfAtyvtCq8",
    },
    {
      id: "PLm5K2tBe_c7eOIWmFlbf3q_RhQqwHQjgF",
      title: "سلسلة الGLOW UP 💕✨",
      thumbnail: "https://i.ytimg.com/vi/hVc4FhFXjLQ/hqdefault.jpg",
      itemCount: 9,
      url: "https://www.youtube.com/playlist?list=PLm5K2tBe_c7eOIWmFlbf3q_RhQqwHQjgF",
    },
    {
      id: "PLm5K2tBe_c7e_UxM9QOaEJt2YMZZsaMPL",
      title: "نصايح للبنات وتطوير الذات 💖",
      thumbnail: "https://i.ytimg.com/vi/-X1tzsLAFIg/hqdefault.jpg",
      itemCount: 17,
      url: "https://www.youtube.com/playlist?list=PLm5K2tBe_c7e_UxM9QOaEJt2YMZZsaMPL",
    },
    {
      id: "PLm5K2tBe_c7cNy3v5U3yJol_wTygR7fns",
      title: "العناية 🫣💕✨🫣",
      thumbnail: "https://i.ytimg.com/vi/IxPK1F2nWdQ/hqdefault.jpg",
      itemCount: 17,
      url: "https://www.youtube.com/playlist?list=PLm5K2tBe_c7cNy3v5U3yJol_wTygR7fns",
    },
  ],
  isFallback: true,
};
