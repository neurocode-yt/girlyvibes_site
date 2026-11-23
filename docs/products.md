# Updating the Products page

Add one object per product to the `catalog` array in [src/lib/products.ts](../src/lib/products.ts).
The page displays entries in the order you list them.

```ts
{
  id: "pink-journal",
  category: "stationery",
  title: { en: "Pink journal", ar: "دفتر يوميات وردي" },
  description: {
    en: "A little notebook for ideas and everyday plans.",
    ar: "دفتر صغير للأفكار والخطط اليومية.",
  },
  retailer: "Retailer name",
  affiliateUrl: "PASTE_YOUR_AFFILIATE_URL_HERE",
},
```

- Give each entry a unique, stable `id`. Use `stationery`, `room`, or `accessories` for `category`.
- Paste the full HTTPS affiliate URL from your partner dashboard, including its tracking parameters.
  The page skips entries with blank, malformed, or non-HTTPS URLs.
- Optional product photos can go in `public/products/` if you have permission to publish them.
  Add `image` with a `src` such as `"/products/pink-journal.webp"` and English and Arabic
  `alt` text describing the photo. Cards without a photo use the collection icon.
- Preview `/products` in English and Arabic. Check that the card appears under the right category
  and that its retailer link lands on the intended listing.

Remove the entry from `catalog` when you want to take it off the page.

The page discloses commissions above the catalog and labels each retailer link as paid.
Retailer links use the sponsored link attribute.
[FTC affiliate guidance](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking)
[Google Search Central link guidance](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links#sponsored)
