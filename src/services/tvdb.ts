import type { MatchType, TVDBResult, TVDBEpisode } from "../types/types";
import { createLogger } from "../utils/logger";

const API_KEY = import.meta.env.VITE_TVDB_API_KEY;
const PIN = import.meta.env.VITE_TVDB_PIN;

let token: string | null = null;

const log = createLogger('TVDB');

async function getToken(): Promise<string> {
    if (token) return token;

    const res = await fetch('https://api4.thetvdb.com/v4/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apikey: API_KEY,
            pin: PIN,
        }),
    });

    if(!res.ok) {
        switch (res.status) {
            case 401:
                throw new Error("Invalid API Key");
            default:
                throw new Error(`Failed to fetch token (${res.status})`);
        }
    }

    const data = await res.json();
    token = data.data.token;

    return token!;
}

async function getEnglishTitle(seriesId: string): Promise<string | null> {
    const token = await getToken();

    const res = await fetch(`https://api4.thetvdb.com/v4/series/${seriesId}/translations/eng`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if(!res.ok) {
        switch (res.status) {
            case 401:
                throw new Error("Invalid API Key");
            case 404:
                throw new Error("english title not found");
            default:
                throw new Error(`Failed to fetch english title (${res.status})`);
        }
    }

    const data = await res.json();

    return data.data?.name ?? null;
}

export async function searchTVDB(query: string): Promise<MatchType[]> {
    const token = await getToken();

    const res = await fetch(`https://api4.thetvdb.com/v4/search?query=${encodeURIComponent(query)}&type=series`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if(!res.ok) {
        switch (res.status) {
            case 401:
                throw new Error("Invalid API Key");
            case 404:
                throw new Error("TV show/Movie not found");
            default:
                throw new Error(`Failed to fetch TV show/Movie (${res.status})`);
        }
    }

    const data = await res.json();

    log('searchTVDB', {
            query,
            totalResults: data.results?.length ?? 0,
            topResults: data.results?.slice(0, 3).map((r: TVDBResult) => ({
                id: r.id,
                name: r.name ?? r.name,
                date: r.first_air_date,
            })),
        });

    const results = await Promise.all(
        data.data.map(async (r: TVDBResult) => {
            const cleanedId = r.id.replace('series-', '');

            const englishName = await getEnglishTitle(cleanedId);

            return {
                id: cleanedId,
                name: englishName ?? r.name ?? 'Unknown',
                date: r.first_air_date,
                poster: r.poster_url ?? null,
                type: 'tv',
                provider: 'tvdb',
            };
        })
    );

    return results;
}

export async function getNameTVDB(
    match: MatchType,
    episodeInfo?: {season: string, episode: string},
    episodes?: TVDBEpisode[] | null
) {
    if (!episodeInfo) {
        return match.name;
    }

    if (!episodes || episodes.length === 0) {
        return `${match.name} - S${episodeInfo.season}E${episodeInfo.episode}`;

    }

    const ep = episodes.find(
        (e:TVDBEpisode) => 
            e.seasonNumber === Number(episodeInfo.season) &&
            e.number === Number(episodeInfo.episode)
    );

    if (!ep) {
        return `${match.name} - S${episodeInfo.season}E${episodeInfo.episode}`;
    }

    return `${match.name} - S${episodeInfo.season}E${episodeInfo.episode} - ${ep.name}`
}

export async function getEpisodes(seriesId: string) {
    const token = await getToken();

    const res = await fetch(`https://api4.thetvdb.com/v4/series/${seriesId}/episodes/default/eng`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if(!res.ok) {
        switch (res.status) {
            case 401:
                throw new Error("Invalid API Key");
            case 404:
                throw new Error("Episodes not found");
            default:
                throw new Error(`Failed to fetch episodes (${res.status})`);
        }
    }

    const data = await res.json();

    return data.data?.episodes ?? [];
}