import { searchTMDB } from "./tmdb";
import { searchTVDB } from "./tvdb";
import type { MatchType } from "../types/types";

export async function search(
  provider: 'tmdb' | 'tvdb',
  type: 'tv' | 'movie',
  query: string
): Promise<MatchType[]> {
  if (provider === 'tmdb') {
    return searchTMDB(query, type);
  }

   if (provider === 'tvdb') {
     return searchTVDB(query);
  }

  return [];
}