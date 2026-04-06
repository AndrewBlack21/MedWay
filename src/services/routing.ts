import { Doctor, RouteResult, RouteStop } from "../types";

const ORS_URL =
  "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

function getOrsKey(): string {
  return process.env.EXPO_PUBLIC_ORS_API_KEY ?? "";
}

// Fórmula de Haversine — distância real em km entre dois pontos
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Nearest Neighbor a partir de um ponto de partida (lat/lng)
// Se não for informado, usa o primeiro médico da lista
function nearestNeighborSort(
  doctors: Doctor[],
  startLat?: number,
  startLng?: number,
): Doctor[] {
  if (doctors.length <= 1) return doctors;

  const unvisited = [...doctors];
  const result: Doctor[] = [];

  // Ponto de partida: coordenada fornecida ou primeiro da lista
  let currentLat = startLat ?? unvisited[0].lat;
  let currentLng = startLng ?? unvisited[0].lng;

  // Se não tem ponto de partida externo, remove o primeiro como âncora
  if (startLat === undefined) {
    result.push(unvisited.splice(0, 1)[0]);
    currentLat = result[0].lat;
    currentLng = result[0].lng;
  }

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDist = Infinity;

    unvisited.forEach((d, i) => {
      const dist = haversineKm(currentLat, currentLng, d.lat, d.lng);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    });

    const next = unvisited.splice(nearestIdx, 1)[0];
    result.push(next);
    currentLat = next.lat;
    currentLng = next.lng;
  }

  return result;
}

function calcTotalDistance(
  sorted: Doctor[],
  startLat?: number,
  startLng?: number,
): number {
  let total = 0;

  // Inclui distância do ponto de partida até o primeiro médico
  if (startLat !== undefined && startLng !== undefined && sorted.length > 0) {
    total += haversineKm(startLat, startLng, sorted[0].lat, sorted[0].lng);
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    total += haversineKm(
      sorted[i].lat,
      sorted[i].lng,
      sorted[i + 1].lat,
      sorted[i + 1].lng,
    );
  }
  return Math.round(total * 10) / 10;
}

async function fetchRealRoute(
  sorted: Doctor[],
  startLat?: number,
  startLng?: number,
): Promise<GeoJSON.FeatureCollection | null> {
  const apiKey = getOrsKey();
  if (!apiKey || sorted.length < 2) return null;

  try {
    // Se tem ponto de partida, inclui como primeiro waypoint
    const coordinates: number[][] = [];
    if (startLat !== undefined && startLng !== undefined) {
      coordinates.push([startLng, startLat]);
    }
    sorted.forEach((d) => coordinates.push([d.lng, d.lat]));

    const res = await fetch(ORS_URL, {
      method: "POST",
      headers: { Authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ coordinates }),
    });

    if (!res.ok) {
      console.warn(
        `[routing] ORS retornou ${res.status} — usando haversine como fallback.`,
      );
      return null;
    }
    return res.json();
  } catch (e) {
    console.warn("[routing] Falha ao chamar ORS:", e);
    return null;
  }
}

// Calcula distância de cada médico até o ponto de partida
// para destacar o mais próximo e o mais distante
export function calcDistancesFromStart(
  doctors: Doctor[],
  startLat: number,
  startLng: number,
): { nearest: Doctor; farthest: Doctor; distances: Record<string, number> } {
  const distances: Record<string, number> = {};

  doctors.forEach((d) => {
    distances[d.id] =
      Math.round(haversineKm(startLat, startLng, d.lat, d.lng) * 10) / 10;
  });

  const sorted = [...doctors].sort((a, b) => distances[a.id] - distances[b.id]);
  return { nearest: sorted[0], farthest: sorted[sorted.length - 1], distances };
}

export async function generateRoute(
  doctors: Doctor[],
  startLat?: number,
  startLng?: number,
): Promise<RouteResult> {
  if (doctors.length === 0) {
    return { stops: [], total_distance_km: 0 };
  }

  const sorted = nearestNeighborSort(doctors, startLat, startLng);
  const total_distance_km = calcTotalDistance(sorted, startLat, startLng);
  const geojson = await fetchRealRoute(sorted, startLat, startLng);

  const stops: RouteStop[] = sorted.map((doctor, index) => ({
    doctor,
    order: index + 1,
    // Distância acumulada da parada anterior
    distance_from_prev_km:
      index === 0
        ? startLat !== undefined
          ? Math.round(
              haversineKm(startLat, startLng!, doctor.lat, doctor.lng) * 10,
            ) / 10
          : 0
        : Math.round(
            haversineKm(
              sorted[index - 1].lat,
              sorted[index - 1].lng,
              doctor.lat,
              doctor.lng,
            ) * 10,
          ) / 10,
  }));

  return { stops, total_distance_km, geojson: geojson ?? undefined };
}
