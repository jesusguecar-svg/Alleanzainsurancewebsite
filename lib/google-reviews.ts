export type GoogleReview = { name: string; authorUrl?: string; rating: number; text: string; date: string; url?: string };
export type GoogleReviews = { rating: number; count: number; url: string; reviews: GoogleReview[] };

export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const place = process.env.GOOGLE_REVIEWS_PLACE_ID;
  if (!key || !place) return null;
  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(place)}?languageCode=es`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
      cache: "no-store", signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (typeof data.rating !== "number" || !data.googleMapsUri) return null;
    return {
      rating: data.rating, count: data.userRatingCount ?? 0, url: data.googleMapsUri,
      reviews: (data.reviews ?? []).map((review: { authorAttribution?: { displayName?: string; uri?: string }; rating?: number; text?: { text?: string }; relativePublishTimeDescription?: string; googleMapsUri?: string }) => ({
        name: review.authorAttribution?.displayName ?? "Usuario de Google", authorUrl: review.authorAttribution?.uri,
        rating: review.rating ?? 0, text: review.text?.text ?? "", date: review.relativePublishTimeDescription ?? "", url: review.googleMapsUri,
      })).filter((review: GoogleReview) => review.text),
    };
  } catch { return null; }
}
