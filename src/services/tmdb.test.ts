import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildName, searchTMDB, fetchSeason } from './tmdb';
import type { MatchType, SeasonData } from '../types/types';

describe('buildName()', () => {
    it('build movie name with year', () => {
        const match = {
            type: 'movie',
            name: 'Inception',
            date: '2010-07-16'
        } as MatchType;

        const result = buildName(match);

        expect(result).toBe('Inception (2010)');
    });

    it('builds basic tv episode name without season data', () => {
        const match = {
            type: 'tv',
            name: 'One Piece',
        } as MatchType;

        const episodeInfo = {
            season: '1',
            episode: '5'
        };

        const result = buildName(match, episodeInfo);

        expect(result).toBe('One Piece - S01E05');
    });

    it('includes episode name when available', () => {
        const match = {
            type: 'tv',
            name: 'One Piece'
        } as MatchType;

        const episodeInfo = {
            season: '1',
            episode: '5'
        };

        const seasonData = {
            episodes: [
            {
                episode_number: 5,
                name: 'The King of the Pirates'
            }
            ]
        } as SeasonData;

        const result = buildName(match, episodeInfo, seasonData);

        expect(result).toBe(
            'One Piece - S01E05 - The King of the Pirates'
        );
    });

    it('returns only name when no episode info', () => {
        const match = {
            type: 'tv',
            name: 'One Piece'
        } as MatchType;

        const result = buildName(match);

        expect(result).toBe('One Piece');
    });
});

describe('searchTMDB()', () => {
    beforeEach(() => {
    vi.restoreAllMocks();
    });

    it('returns mapped results on success', async () => {
        const mockResponse = {
            results: [
                {
                    id: 1,
                    name: 'One Piece',
                    first_air_date: '1999-10-20',
                    poster_path: '/abc.jpg'
                }
            ]
        };

        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => mockResponse
        } as Response);

        const result = await searchTMDB('one piece', 'tv');

        expect(result).toEqual([
            {
                id: 1,
                name: 'One Piece',
                date: '1999-10-20',
                poster: 'https://image.tmdb.org/t/p/w200/abc.jpg',
                type: 'tv',
                provider: 'tmdb'
            }
        ]);
    });

    it('throws error on 401', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            status: 401
        } as Response);

        await expect(searchTMDB('one piece', 'tv'))
            .rejects
            .toThrow('Invalid API Key');
    });

    it('throws error on 404', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            status: 404
        } as Response);

        await expect(searchTMDB('one piece', 'tv'))
            .rejects
            .toThrow('TV show/Movie not found');
    });

    it('handles empty results', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({ results: [] })
        } as Response);

        const result = await searchTMDB('unknown', 'tv');

        expect(result).toEqual([]);
    });
});

describe('fetchSeason()', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('return season on success', async () => {
        const mockResponse = {
            id: 21,
            episodes: new Array(197).fill({}) 
        };

        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => mockResponse
        } as Response);

        const result = await fetchSeason(37854, 21);

        expect(result).toEqual(mockResponse);
    });

    it('throws error on 401', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            status: 401
        } as Response);

        await expect(fetchSeason(37854, 21))
            .rejects
            .toThrow('Invalid API Key');
    });

    it('throws error on 404', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            status: 404
        } as Response);

        await expect(fetchSeason(37854, 21))
            .rejects
            .toThrow('Season not found');
    });
});