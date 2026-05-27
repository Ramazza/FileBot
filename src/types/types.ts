export type TMDBResult = {
    id: number;
    name: string;
    title: string
    first_air_date?: string;
    release_date?: string;
    poster_path: string | null;
    poster_url?: string;
};

export type TVDBResult = {
    id: string,
    name: string,
    first_air_date: string
    poster_path: string | null;
    poster_url?: string;
}

export type MatchType = {
    id: number;
    name: string;
    date?: string;
    poster?: string | null;
    provider?: 'tmdb' | 'tvdb';
    type?: 'tv' | 'movie';
};

export type Episode = {
    name: string;
    episode_number: number;
};

export type EpisodeInfo = {
    season: string;
    episode: string;
}

export type SeasonData = {
    episodes: Episode[];
}

export type TVDBEpisode = {
    seasonNumber: number,
    number: number,
    name: string
}

export type FileType = {
  name: string;
  path?: string;
  query?: string;
  matches?: {
    id: number;
    name: string;
    date?: string;
  }[];
};