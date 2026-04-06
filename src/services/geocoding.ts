import { Coordinates } from "../types";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export async function geocodeAddress(address: string): Promise<Coordinates> {
  const query = encodeURIComponent(`${address}, Brasil`);
  const url = `${NOMINATIM_URL}?q=${query}&format=json&limit=1&countrycodes=br`;

  const res = await fetch(url, {
    headers: {
      // Nominatim exige User-Agent identificado
      "User-Agent": "PharmaRoute/1.0 (contato@pharmaroute.com)",
      "Accept-Language": "pt-BR",
    },
  });

  if (!res.ok) {
    throw new Error(`Erro ao consultar geocoding: ${res.status}`);
  }

  const data = await res.json();

  if (!data || data.length === 0) {
    throw new Error(
      "Endereço não encontrado. Tente ser mais específico (ex: Rua X, 123, Cidade, Estado).",
    );
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}
