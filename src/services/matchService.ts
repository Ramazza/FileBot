import { extractShowName } from "../utils/filename";
import { search } from "./search";

type FindMatchesParams = {
  fileName: string;
  provider: 'tmdb' | 'tvdb';
  type: 'tv' | 'movie';
};

export async function findMatches({
  fileName,
  provider,
  type,
}: FindMatchesParams) {
  const query = extractShowName(fileName, type);

  const results = await search(provider, type, query);

  return {
    results,
    query,
  };
}