import type { FileType, MatchType, SeasonData } from "../types/types";
import { getEpisodes, getNameTVDB } from "./tvdb";
import { fetchSeason, buildName } from "./tmdb";
import { extractEpisodeInfo, getExtension } from "../utils/filename";

type ProcessSelectionParams = {
  files: FileType[];
  match: MatchType;
};

export async function processSelection({
  files,
  match,
}: ProcessSelectionParams) {
  const normalizedFiles = files.map(f => ({
    ...f,
    path: f.path ?? '',
  }));

  const episodes =
    match.provider === 'tvdb'
      ? await getEpisodes(String(match.id))
      : null;

  const seasonMap = new Map<string, SeasonData>();

  if (match.provider === 'tmdb' && match.type === 'tv') {
    const seasonsNeeded = new Set<string>(
      normalizedFiles
        .map(f => extractEpisodeInfo(f.name, f.path)?.season)
        .filter((s): s is string => s !== undefined)
    );

    await Promise.all(
      [...seasonsNeeded].map(async (season) => {
        const data = await fetchSeason(match.id, Number(season));
        seasonMap.set(season, data);
      })
    );
  }

  const updated = await Promise.all(
    normalizedFiles.map(async (file) => {
      const ext = getExtension(file.name);
      const episodeInfo = extractEpisodeInfo(file.name, file.path);

      let baseName: string;

      if (match.provider === 'tmdb') {
        const seasonData = episodeInfo
          ? seasonMap.get(episodeInfo.season)
          : undefined;

        baseName = buildName(match, episodeInfo, seasonData);
      } else {
        baseName = await getNameTVDB(match, episodeInfo, episodes);
      }

      return {
        ...file,
        name: `${baseName}${ext}`,
      };
    })
  );

  return updated;
}