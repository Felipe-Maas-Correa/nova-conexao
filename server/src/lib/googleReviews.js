// Busca avaliações reais do Google (Places API - Place Details).
//
// Requer no .env:
//   GOOGLE_MAPS_API_KEY=...   (API Key com "Places API" ativada)
//   GOOGLE_PLACE_ID=...       (Place ID do perfil da Nova Conexão no Google Maps)
//
// Sem essas variáveis, retorna null e o site usa os depoimentos locais.
// A API do Google devolve no máximo ~5 avaliações.

let cache = { at: 0, data: null };
const TTL = 6 * 60 * 60 * 1000; // 6h — evita estourar a cota

function iniciais(nome = "") {
  return nome
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export async function getGoogleReviews() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  if (cache.data && Date.now() - cache.at < TTL) return cache.data;

  const url =
    "https://maps.googleapis.com/maps/api/place/details/json" +
    `?place_id=${encodeURIComponent(placeId)}` +
    "&fields=reviews,rating,user_ratings_total,name,url" +
    "&reviews_sort=newest&language=pt-BR" +
    `&key=${encodeURIComponent(key)}`;

  const res = await fetch(url);
  const json = await res.json();
  if (json.status !== "OK" || !json.result) {
    console.warn("[googleReviews] status:", json.status, json.error_message || "");
    return null;
  }

  const reviews = (json.result.reviews || []).map((r, i) => ({
    id: "g" + i,
    nome: r.author_name,
    cidade: r.relative_time_description, // Google não fornece cidade
    nota: Math.round(r.rating),
    texto: r.text,
    inicial: iniciais(r.author_name),
    foto: r.profile_photo_url || null,
    link: r.author_url || null,
    fonte: "google"
  }));

  const data = {
    reviews,
    rating: json.result.rating || null,
    total: json.result.user_ratings_total || null,
    placeUrl: json.result.url || null
  };
  cache = { at: Date.now(), data };
  return data;
}
