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
        log.error('getToken', {
            status: res.status
        });

        switch (res.status) {
            case 401:
                throw new Error("Invalid API Key");
            default:
                throw new Error(`Failed to fetch token (${res.status})`);
        }
    }

    const data = await res.json();
    token = data.data.token;

    log.success('getToken', { received: !!token });

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
        log.error('getEnglishTitle', {
            seriesId,
            status: res.status
        });

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

    log.success('getEnglishTitle', {
        englishName: data.data?.name
    });

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
        log.error('searchTVDB', {
            query,
            status: res.status
        });

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

    log.success('searchTVDB', {
            query,
            totalResults: data.results?.length ?? 0,
            topResults: data.results?.slice(0, 3).map((r: TVDBResult) => ({
                id: r.id,
                name: r.name ?? r.name,
                date: r.first_air_time,
                poster: r.thumbnail
            })),
        });

    const results = await Promise.all(
        data.data.map(async (r: TVDBResult) => {
            const cleanedId = r.id.replace('series-', '');

            const englishName = await getEnglishTitle(cleanedId);

            return {
                id: cleanedId,
                name: englishName ?? r.name ?? 'Unknown',
                date: r.first_air_time,
                poster: r.thumbnail ?? null,
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
        log.warn('getNameTVDB:noEpisodeInfo' , { name: match.name });
        return match.name;
    }

    if (!episodes || episodes.length === 0) {
        log.warn('getNameTVDB:noEpisodes', { name: match.name });
        return `${match.name} - S${episodeInfo.season}E${episodeInfo.episode}`;

    }

    const ep = episodes.find(
        (e:TVDBEpisode) => 
            e.seasonNumber === Number(episodeInfo.season) &&
            e.number === Number(episodeInfo.episode)
    );

    if (!ep) {
        log.warn('getNameTVDB:episodeNotFound', {
            name: match.name,
            season: episodeInfo.season,
            episode: episodeInfo.episode
        });
        return `${match.name} - S${episodeInfo.season}E${episodeInfo.episode}`;
    }

    log.info('getNameTVDB', {
        name: match.name,
        episodeInfo: `S${episodeInfo.season}E${episodeInfo.episode}`,
        episodeName: ep.name
    })

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
        log.error('getEpisodes', {
            seriesId,
            status: res.status
        });

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

    log.info('data', data)

    log.success('getEpisodes', { 
        seriesId,
        count: data.data?.episodes?.length ?? 0});

    return data.data?.episodes ?? [];
}