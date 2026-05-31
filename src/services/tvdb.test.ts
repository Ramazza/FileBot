import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MatchType } from '../types/types';

globalThis.fetch = vi.fn();
const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules(); 
});


describe('getNameTVDB()', () => {
    it('build tv show name without episode info', async () => {
        const { getNameTVDB } = await import('./tvdb');

        const match = {
            type: 'tv',
            name: 'One Piece',
        } as MatchType;

        const result = await getNameTVDB(match);

        expect(result).toBe('One Piece');
    });

    it('build tv show name without episodes', async () => {
        const { getNameTVDB } = await import('./tvdb');

        const match = {
            type: 'tv',
            name: 'One Piece',
        } as MatchType;

        const episodeInfo = {
            season: '1',
            episode: '2',
        };

        const result = await getNameTVDB(match, episodeInfo);

        expect(result).toBe('One Piece - S01E02');
    });

    it('build tv show name', async () => {
        const { getNameTVDB } = await import('./tvdb');

        const match = {
            type: 'tv',
            name: 'One Piece',
        } as MatchType;

        const episodeInfo = {
            season: '1',
            episode: '5',
        };

        const episodes = [
            {
                seasonNumber: 1,
                number: 5,
                name: 'The King of the Pirates'
            }
        ];

        const result = await getNameTVDB(match, episodeInfo, episodes);

        expect(result).toBe('One Piece - S01E05 - The King of the Pirates');
    });
});


describe('searchTVDB()', () => {
    it('returns mapped results with english title', async () => {
        const { searchTVDB } = await import('./tvdb');

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: { token: 'fake-token' } })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [
                        {
                            id: 'series-123',
                            name: 'Original Name',
                            first_air_time: '2020',
                            thumbnail: 'poster.jpg'
                        }
                    ]
                })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: { name: 'English Name' }
                })
            });

        const result = await searchTVDB('test');

        expect(result).toEqual([
            {
                id: '123',
                name: 'English Name',
                date: '2020',
                poster: 'poster.jpg',
                type: 'tv',
                provider: 'tvdb'
            }
        ]);
    });

    it('handles empty results', async () => {
        const { searchTVDB } = await import('./tvdb');

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: { token: 'fake-token' } })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [] 
                })
            });

        const result = await searchTVDB('nothing');

        expect(result).toEqual([]);
    });

    it('throws on 401', async () => {
        const { searchTVDB } = await import('./tvdb');

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: { token: 'fake-token' } })
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 401
            });

        await expect(searchTVDB('test'))
            .rejects
            .toThrow('Invalid API Key');
    });
});


describe('getEpisodes()', () => {
    it('returns episode list', async () => {
        const { getEpisodes } = await import('./tvdb');

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: { token: 'fake-token' } })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: {
                        episodes: [{ id: 1, name: 'Episode 1' }]
                    }
                })
            });

        const result = await getEpisodes('123');

        expect(result).toEqual([
            { id: 1, name: 'Episode 1' }
        ]);
    });

    it('throws on 404', async () => {
        const { getEpisodes } = await import('./tvdb');

        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: { token: 'fake-token' } })
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 404
            });

        await expect(getEpisodes('123'))
            .rejects
            .toThrow('Episodes not found');
    });
});