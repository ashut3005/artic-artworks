import type { Artwork } from '../types/artwork';

interface ApiResponse {
  data: Artwork[];
  pagination: {
    total: number;
  };
}

export async function fetchArtworks(page: number) {
  const res = await fetch(
    `https://api.artic.edu/api/v1/artworks?page=${page}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch artworks');
  }

  const json: ApiResponse = await res.json();

  return {
    rows: json.data,
    total: json.pagination.total,
  };
}
