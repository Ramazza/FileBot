// Functions that handles TMDB API calls

import type { TMDBResult, MatchType, SeasonData, EpisodeInfo } from "../types/types";
import { createLogger } from "../utils/logger";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const log = createLogger('TMDB');

export async function fetchSeason( tvId: number, season: number ): Promise<SeasonData> {

    const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}/season/${season}?api_key=${API_KEY}`
    );

    if(!res.ok) {
        switch (res.status) {
            case 401:
                throw new Error("Invalid API Key");
            case 404:
                throw new Error("Season not found");
            default:
                throw new Error(`Failed to fetch season (${res.status})`);
        }
    }

    const data = await res.json();

    log('fetchSeason', { tvId, season, episodes: data.episodes?.length });

    return data;
}

export function buildName( match: MatchType, episodeInfo?: EpisodeInfo, seasonData?: SeasonData ): string {

    // 🎬 Movie
    if (match.type === 'movie') {
        const year = match.date?.split('-')[0];
        return `${match.name} (${year})`;
    }

    // 📺 No episode info
    if (!episodeInfo) {
        return match.name;
    }

    const season = episodeInfo.season.padStart(2, '0');
    const episode = episodeInfo.episode.padStart(2, '0');

    if (!seasonData?.episodes) {
        return `${match.name} - S${season}E${episode}`;
    }

    const ep = seasonData.episodes.find(
        (e) => e.episode_number === Number(episodeInfo.episode)
    );

    return ep
        ? `${match.name} - S${season}E${episode} - ${ep.name}`
        : `${match.name} - S${season}E${episode}`;
}

// Searches TMDB for a tv show name match
export async function searchTMDB(query: string, type: 'tv' | 'movie'): Promise<MatchType[]> {

    const res = await fetch(
        `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    const data = await res.json();

    if(!res.ok) {
        switch (res.status) {
            case 401:
                throw new Error("Invalid API Key");
            case 404:
                throw new Error("TV show/Movie not found");
            default:
                throw new Error(`Failed to fetch name from TMDB (${res.status})`);
        }
    }

    log('searchTMDB', {
        query,
        type,
        totalResults: data.results?.length ?? 0,
        topResults: data.results?.slice(0, 3).map((r: TMDBResult) => ({
            id: r.id,
            name: r.name ?? r.title,
            date: r.first_air_date ?? r.release_date,
        })),
    });

    return data.results.map((r: TMDBResult) => ({
        id: r.id,
        name: r.name ?? r.title ?? 'Unknown',
        date: r.first_air_date ?? r.release_date,
        poster: r.poster_path
        ? `https://image.tmdb.org/t/p/w200${r.poster_path}`
        : null,
        type,
        provider: 'tmdb',
    }));
}