import { extractShowName } from "../utils/filename";
import { search } from "./search";

type FindMatchesParams = {
  fileName: string;
  provider: 'tmdb' | 'tvdb';
  type: 'tv' | 'movie';
};

function buildSearchQueries(base: string) {
  const queries: string[] = [];

  const clean = base.trim();

  if (!clean) return [];

  queries.push(clean);

  const words = clean.split(' ');
  if (words.length > 2) {
    queries.push(words.slice(1).join(' '));
  }

  if (words.length >= 3) {
    queries.push(words.slice(0, 3).join(' '));
  }

  if (words.length >= 2) {
    queries.push(words.slice(0, 2).join(' '));
  }

  return [...new Set(queries)];
}

export async function findMatches({
  fileName,
  provider,
  type,
}: FindMatchesParams) {
  const base = extractShowName(fileName, type);

  const queries = buildSearchQueries(base);

  for (const query of queries) {
    const results = await search(provider, type,  query);

    if (results.length > 0) {
      return {
        results,
        queries
      };
    }
  }

  return {
    results: [],
    query: queries[0] ?? '',
  };
}