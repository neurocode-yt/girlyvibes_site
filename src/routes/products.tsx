import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookHeart, Heart, Lamp, Ribbon, ShoppingBag } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Download";
import { useI18n, type Lang } from "@/lib/i18n";
import { productCategories, products, type ProductCategory } from "@/lib/products";
import stylesheet from "./-products.css?url";

const canonical = "https://girly-vibes.com/products";
const title = "Products | The Girly Vibes Edit";
const description =
  "Explore the Girly Vibes collections for journals, cozy rooms, and everyday accessories.";
const shareImage = "https://girly-vibes.com/products/cover.webp";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:image", content: shareImage },
      { property: "og:image:alt", content: "A pink journal tied with a satin ribbon" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: shareImage },
    ],
    links: [
      { rel: "canonical", href: canonical },
      { rel: "stylesheet", href: stylesheet },
    ],
  }),
});

const copy = {
  en: {
    label: "Products",
    title: "The Girly Vibes",
    titleAccent: "Edit",
    intro:
      "Pretty things for your desk, your room, and the little rituals that make a day feel like yours.",
    explore: "Explore collections",
    collections: "The collections",
    all: "All picks",
    picks: "The product edit",
    filter: "Filter by collection",
    disclosure: "Affiliate disclosure",
    disclosureText:
      "Girly Vibes may earn a commission if you buy through a product link on this page.",
    empty: "Our first picks are on the way",
    emptyText: "Check back here for product details and links to shop.",
    retailerLink: "Visit retailer",
    paidLink: "Paid link",
    count: "Products shown",
  },
  ar: {
    label: "المنتجات",
    title: "مختارات",
    titleAccent: "جيرلي فايبز",
    intro: "أشياء جميلة لمكتبك وغرفتك وللتفاصيل الصغيرة التي تجعل يومك يشبهكِ.",
    explore: "تصفّحي المجموعات",
    collections: "المجموعات",
    all: "كل المختارات",
    picks: "مختارات المنتجات",
    filter: "التصفية حسب المجموعة",
    disclosure: "إفصاح عن روابط العمولة",
    disclosureText:
      "قد تحصل جيرلي فايبز على عمولة إذا اشتريتِ عبر أحد روابط المنتجات في هذه الصفحة.",
    empty: "مختاراتنا الأولى قيد التجهيز",
    emptyText: "عودي إلى هذه الصفحة للاطّلاع على تفاصيل المنتجات وروابط الشراء.",
    retailerLink: "زيارة المتجر",
    paidLink: "رابط مدفوع",
    count: "عدد المنتجات المعروضة",
  },
} satisfies Record<Lang, Record<string, string>>;

const collections = {
  stationery: {
    title: { en: "Journals & stationery", ar: "دفاتر وقرطاسية" },
    description: {
      en: "Journals, pretty pens, and little things for your desk.",
      ar: "دفاتر يوميات وأقلام جميلة ولمسات صغيرة لمكتبك.",
    },
    image: "/products/stationery.webp",
    icon: BookHeart,
  },
  room: {
    title: { en: "Cozy room", ar: "غرفة دافئة" },
    description: {
      en: "Soft lighting and thoughtful details for your favorite corner.",
      ar: "إضاءة هادئة وتفاصيل لطيفة لركنك المفضّل.",
    },
    image: "/products/room.webp",
    icon: Lamp,
  },
  accessories: {
    title: { en: "Everyday accessories", ar: "إكسسوارات يومية" },
    description: {
      en: "Bows, clips, and finishing touches for everyday outfits.",
      ar: "فيونكات ومشابك ولمسات أخيرة لإطلالاتك اليومية.",
    },
    image: "/products/accessories.webp",
    icon: Ribbon,
  },
} satisfies Record<
  ProductCategory,
  {
    title: Record<Lang, string>;
    description: Record<Lang, string>;
    image: string;
    icon: typeof BookHeart;
  }
>;

const availableCategories = productCategories.filter((category) =>
  products.some((product) => product.category === category),
);

function ProductsPage() {
  const { lang } = useI18n();
  const t = copy[lang];
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const visibleProducts =
    category === "all" ? products : products.filter((product) => product.category === category);

  return (
    <div className="products-page min-h-screen">
      <Header />
      <main id="main-content" tabIndex={-1} className="products-main">
        <section className="products-hero products-width" aria-labelledby="products-title">
          <div className="products-hero-copy">
            <p className="products-label">{t.label}</p>
            <h1 id="products-title" className="products-display">
              {t.title} <em>{t.titleAccent}</em>
            </h1>
            <p className="products-intro">{t.intro}</p>
            <a href="#collections" className="products-button">
              {t.explore}
            </a>
          </div>
          <div className="products-hero-photo">
            <img
              src="/products/cover.webp"
              srcSet="/products/cover-small.webp 640w, /products/cover.webp 1120w"
              sizes="(min-width: 76rem) 620px, (min-width: 50rem) 49vw, 91vw"
              width={1120}
              height={840}
              alt=""
              fetchPriority="high"
            />
          </div>
        </section>

        <section className="products-width products-collections" aria-labelledby="collections">
          <h2 id="collections" className="products-display" tabIndex={-1}>
            {t.collections}
          </h2>
          <ul className="products-grid">
            {productCategories.map((key) => {
              const collection = collections[key];
              return (
                <li key={key} className="products-collection-card">
                  <img src={collection.image} alt="" width={580} height={760} loading="lazy" />
                  <div className="products-collection-copy">
                    <collection.icon aria-hidden="true" size={22} strokeWidth={1.6} />
                    <div>
                      <h3>{collection.title[lang]}</h3>
                      <p>{collection.description[lang]}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <aside
          className="products-width products-disclosure"
          aria-labelledby="affiliate-disclosure"
        >
          <Heart aria-hidden="true" size={22} strokeWidth={1.6} />
          <div>
            <h2 id="affiliate-disclosure">{t.disclosure}</h2>
            <p>{t.disclosureText}</p>
          </div>
        </aside>

        {products.length === 0 ? (
          <section className="products-width products-empty" aria-labelledby="products-empty-title">
            <ShoppingBag aria-hidden="true" size={26} strokeWidth={1.5} />
            <h2 id="products-empty-title" className="products-display">
              {t.empty}
            </h2>
            <p>{t.emptyText}</p>
          </section>
        ) : (
          <section className="products-width products-catalog" aria-labelledby="product-edit-title">
            <h2 id="product-edit-title" className="products-display">
              {t.picks}
            </h2>
            {availableCategories.length > 1 && (
              <div className="products-filters" role="group" aria-label={t.filter}>
                <button
                  type="button"
                  aria-pressed={category === "all"}
                  onClick={() => setCategory("all")}
                >
                  {t.all}
                </button>
                {availableCategories.map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={category === key}
                    onClick={() => setCategory(key)}
                  >
                    {collections[key].title[lang]}
                  </button>
                ))}
              </div>
            )}
            <output className="sr-only" aria-live="polite">
              {t.count}: {new Intl.NumberFormat(lang).format(visibleProducts.length)}
            </output>
            <ul className="products-grid">
              {visibleProducts.map((product) => {
                const collection = collections[product.category];
                return (
                  <li key={product.id} className="products-item">
                    <div className="products-item-media">
                      {product.image ? (
                        <img src={product.image.src} alt={product.image.alt[lang]} loading="lazy" />
                      ) : (
                        <collection.icon aria-hidden="true" size={36} strokeWidth={1.4} />
                      )}
                    </div>
                    <div className="products-item-copy">
                      <p className="products-label">{collection.title[lang]}</p>
                      <h3>{product.title[lang]}</h3>
                      <p>{product.description[lang]}</p>
                      <a href={product.affiliateUrl} rel="sponsored" className="products-button">
                        {t.retailerLink}: <bdi>{product.retailer}</bdi>
                        <span className="sr-only"> — {product.title[lang]}</span>
                      </a>
                      <p className="products-paid-link">{t.paidLink}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
