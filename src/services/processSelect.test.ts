import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processSelection } from './processSelection';

import * as tvdb from './tvdb';
import * as tmdb from './tmdb';
import * as filename from '../utils/filename';

import type {
  MatchType,
  TVDBEpisode,
  SeasonData,
  EpisodeInfo,
  FileType,
} from '../types/types';

describe('processSelection - TVDB', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should rename files using TVDB', async () => {
    const mockEpisodes: TVDBEpisode[] = [
      {
        seasonNumber: 20,
        number: 10,
        name: 'Episode 10',
      },
    ];

    const mockEpisodeInfo: EpisodeInfo = {
      season: '20',
      episode: '10',
    };

    vi.spyOn(tvdb, 'getEpisodes')
      .mockResolvedValue(mockEpisodes);

    vi.spyOn(tvdb, 'getNameTVDB')
      .mockResolvedValue('One Piece - S20E10');

    vi.spyOn(filename, 'getExtension')
      .mockReturnValue('.mkv');

    vi.spyOn(filename, 'extractEpisodeInfo')
      .mockReturnValue(mockEpisodeInfo);

    const files: FileType[] = [
      { name: 'One Piece 1074.mkv', path: '/test' },
    ];

    const match: MatchType = {
      id: 123,
      provider: 'tvdb',
      type: 'tv',
      name: 'One Piece',
    };

    const result = await processSelection({ files, match });

    expect(tvdb.getEpisodes).toHaveBeenCalledWith('123');

    expect(result[0].name)
      .toBe('One Piece - S20E10.mkv');
  });
});

describe('processSelection - TMDB TV', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch seasons and rename files', async () => {
    const mockEpisodeInfo: EpisodeInfo = {
      season: '20',
      episode: '10',
    };

    const mockSeason: SeasonData = {
      episodes: [
        {
          name: 'Episode 10',
          episode_number: 10,
        },
      ],
    };

    vi.spyOn(filename, 'extractEpisodeInfo')
      .mockReturnValue(mockEpisodeInfo);

    vi.spyOn(filename, 'getExtension')
      .mockReturnValue('.mkv');

    vi.spyOn(tmdb, 'fetchSeason')
      .mockResolvedValue(mockSeason);

    vi.spyOn(tmdb, 'buildName')
      .mockReturnValue('One Piece - S20E10');

    const files: FileType[] = [
      { name: 'One Piece 1074.mkv', path: '/test' },
    ];

    const match: MatchType = {
      id: 999,
      provider: 'tmdb',
      type: 'tv',
      name: 'One Piece',
    };

    const result = await processSelection({ files, match });

    expect(tmdb.fetchSeason)
      .toHaveBeenCalledWith(999, 20);

    expect(tmdb.buildName)
      .toHaveBeenCalled();

    expect(result[0].name)
      .toBe('One Piece - S20E10.mkv');
  });
});

describe('processSelection - TMDB Movie', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should skip season fetching for movies', async () => {
    vi.spyOn(filename, 'extractEpisodeInfo')
      .mockReturnValue(undefined);

    vi.spyOn(filename, 'getExtension')
      .mockReturnValue('.mp4');

    vi.spyOn(tmdb, 'buildName')
      .mockReturnValue('Inception');

    const files: FileType[] = [
      { name: 'Inception.mp4', path: '/test' },
    ];

    const match: MatchType = {
      id: 1,
      provider: 'tmdb',
      type: 'movie',
      name: 'Inception',
    };

    const result = await processSelection({ files, match });

    expect(tmdb.fetchSeason).not.toHaveBeenCalled();

    expect(result[0].name)
      .toBe('Inception.mp4');
  });
});