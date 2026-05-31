import { describe, it, expect } from 'vitest';
import { extractShowName, extractEpisodeInfo, extractSeasonFromFolder, getExtension } from './filename';

describe('extractShowName()', () => {
  it('cleans basic tv filename', () => {
    const result = extractShowName('One.Piece.S20E10.mkv', 'tv');

    expect(result).toBe('One Piece');
  });

  it('removes junk tags', () => {
    const result = extractShowName('One.Piece.1074.1080p.WEBRIP.x264.mkv', 'tv');

    expect(result).toBe('One Piece 1074');
  });

  it('handles movie with year', () => {
    const result = extractShowName('Inception.2010.1080p.mkv', 'movie');

    expect(result).toBe('Inception');
  });
});

describe('extractEpisodeInfo()', () => {
  it('parses SxxExx format', () => {
    const result = extractEpisodeInfo('One.Piece.S02E05.mkv');

    expect(result).toEqual({
      season: '02',
      episode: '05'
    });
  });

  it('parses 1x02 format', () => {
    const result = extractEpisodeInfo('One.Piece.2x10.mkv');

    expect(result).toEqual({
      season: '02',
      episode: '10'
    });
  });

  it('falls back to absolute episode', () => {
    const result = extractEpisodeInfo('One Piece 1074.mkv');

    expect(result).toEqual({
      season: '01',
      episode: '1074'
    });
  });

  it('uses season from folder', () => {
    const result = extractEpisodeInfo(
      'One Piece 1074.mkv',
      '/anime/One Piece/Season 21/'
    );

    expect(result).toEqual({
      season: '21',
      episode: '1074'
    });
  });

  it('returns undefined when no numbers', () => {
    const result = extractEpisodeInfo('One Piece Final.mkv');

    expect(result).toBeUndefined();
  });
});

describe('extractSeasonFromFolder()', () => {
  it('extracts from "Season 2"', () => {
    const result = extractSeasonFromFolder('/shows/Season 2/');

    expect(result).toBe('02');
  });

  it('extracts from "S03"', () => {
    const result = extractSeasonFromFolder('/shows/S03/');

    expect(result).toBe('03');
  });

  it('extracts from "Temporada 4"', () => {
    const result = extractSeasonFromFolder('/shows/Temporada 4/');

    expect(result).toBe('04');
  });

  it('returns undefined if no season', () => {
    const result = extractSeasonFromFolder('/shows/random/');

    expect(result).toBeUndefined();
  });
});

describe('getExtension()', () => {
  it('extracts mkv extension', () => {
    const result = getExtension('file.mkv');

    expect(result).toBe('.mkv');
  });

  it('extracts mp4 extension', () => {
    const result = getExtension('video.mp4');

    expect(result).toBe('.mp4');
  });

  it('returns empty if no extension', () => {
    const result = getExtension('file');

    expect(result).toBe('');
  });
});