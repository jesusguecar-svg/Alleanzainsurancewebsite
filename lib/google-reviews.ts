export type GoogleReview = { name: string; authorUrl?: string; rating: number; text: string; date: string; url?: string };
export type GoogleReviews = { rating: number; count: number; url: string; reviews: GoogleReview[] };

export const googleReviewsProfileUrl = "https://www.google.com/maps/place/Globe+Life+Family+Heritage+Division:+Villard+Agency/@32.9629058,-96.8434504,17z/data=!3m1!4b1!4m6!3m5!1s0x864c27f8e100b355:0x8ff33e26608d6b39!8m2!3d32.9629058!4d-96.8408701!16s%2Fg%2F11xcs5swz_?entry=ttu";

// Public Google profile snapshot verified on 2026-09-26. The Places API
// replaces this snapshot automatically when its deployment variables exist.
const reviewFallback: Record<"es" | "en", GoogleReviews> = {
  es: {
    rating: 5,
    count: 8,
    url: googleReviewsProfileUrl,
    reviews: [
      { name: "Roberto Jimenez", rating: 5, date: "Hace un año", text: "En esta agencia hay un ambiente de familia y solidaridad, con liderazgo y una gran conciencia de apoyo a los demás." },
      { name: "ANA SUESCUN", rating: 5, date: "Hace un año", text: "La mejor oportunidad de Estados Unidos. Amor. Credibilidad." },
      { name: "Olimar Jerez", rating: 5, date: "Hace un año", text: "Excelente agencia, llena de líderes y calidez humana, siempre dispuesta a ayudar a sus agentes y clientes." },
    ],
  },
  en: {
    rating: 5,
    count: 8,
    url: googleReviewsProfileUrl,
    reviews: [
      { name: "Roberto Jimenez", rating: 5, date: "A year ago", text: "This agency has an atmosphere of family and solidarity, with leadership and a strong awareness of supporting others." },
      { name: "ANA SUESCUN", rating: 5, date: "A year ago", text: "America’s best opportunity. Love. Credibility." },
      { name: "Olimar Jerez", rating: 5, date: "A year ago", text: "An excellent agency, full of leaders and human warmth, always willing to help its agents and clients." },
    ],
  },
};

export async function getGoogleReviews(locale: "es" | "en" = "es"): Promise<GoogleReviews> {
  const fallback = reviewFallback[locale];
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const place = process.env.GOOGLE_REVIEWS_PLACE_ID;
  if (!key || !place) return fallback;
  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(place)}?languageCode=${locale}`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
      cache: "no-store", signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return fallback;
    const data = await response.json();
    if (typeof data.rating !== "number" || !data.googleMapsUri) return fallback;
    const reviews = (data.reviews ?? []).map((review: { authorAttribution?: { displayName?: string; uri?: string }; rating?: number; text?: { text?: string }; relativePublishTimeDescription?: string; googleMapsUri?: string }) => ({
      name: review.authorAttribution?.displayName ?? (locale === "en" ? "Google user" : "Usuario de Google"),
      authorUrl: review.authorAttribution?.uri,
      rating: review.rating ?? 0,
      text: review.text?.text ?? "",
      date: review.relativePublishTimeDescription ?? "",
      url: review.googleMapsUri,
    })).filter((review: GoogleReview) => review.text);
    return { rating: data.rating, count: data.userRatingCount ?? 0, url: data.googleMapsUri, reviews: reviews.length ? reviews : fallback.reviews };
  } catch {
    return fallback;
  }
}
