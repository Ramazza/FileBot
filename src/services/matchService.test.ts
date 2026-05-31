import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findMatches } from './matchService';
import * as filenameUtils from '../utils/filename';
import * as searchService from './search';

describe('findMatches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should extract query and return results', async () => {
    vi.spyOn(filenameUtils, 'extractShowName')
      .mockReturnValue('One Piece');

    vi.spyOn(searchService, 'search')
      .mockResolvedValue([{ id: 1, name: 'One Piece' }]);

    const result = await findMatches({
      fileName: 'One Piece 1074.mkv',
      provider: 'tmdb',
      type: 'tv',
    });

    expect(filenameUtils.extractShowName)
      .toHaveBeenCalledWith('One Piece 1074.mkv', 'tv');

    expect(searchService.search)
      .toHaveBeenCalledWith('tmdb', 'tv', 'One Piece');

    expect(result).toEqual({
      results: [{ id: 1, name: 'One Piece' }],
      query: 'One Piece',
    });
  });

  it('should throw if search fails', async () => {
    vi.spyOn(filenameUtils, 'extractShowName')
      .mockReturnValue('One Piece');

    vi.spyOn(searchService, 'search')
      .mockRejectedValue(new Error('API error'));

    await expect(
      findMatches({
        fileName: 'One Piece.mkv',
        provider: 'tmdb',
        type: 'tv',
      })
    ).rejects.toThrow('API error');
  });
});