/* eslint-disable @typescript-eslint/no-unused-vars */

import * as S from './styles';

import { useState, useRef } from 'react';
import { useFiles } from '../../context/FileContext';

import { extractShowName, extractEpisodeInfo, getExtension } from '../../utils/filename';
import { useClickOutside } from '../../hooks/useClickOutside';
import { fetchSeason, buildName } from '../../services/tmdb';
import { getEpisodes, getNameTVDB } from '../../services/tvdb';
import { search } from '../../services/search';
import type { MatchType, SeasonData } from "../../types/types";
import { createLogger } from '../../utils/logger';

type MatchProps = {
    onClose: () => void;
}

function Match({ onClose }: MatchProps) {

    const { files, setNewFiles, setIsProcessing } = useFiles();

    const [isOpen, setIsOpen] = useState(false);
    const [matches, setMatches] = useState<MatchType[]>([]);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    
    useClickOutside([wrapperRef, modalRef], onClose);

    const log = createLogger('Match');

    async function handleMatch(provider: 'tmdb' | 'tvdb', type: 'tv' | 'movie') {
        log('handleMatch files:', files);

        const file = files[0];

        if (!file) {
            log('❌ No file selected');
            return;
        }

        const query = extractShowName(file.name, type);

        setLoading(true);

        try {
            const results = await search(provider, type, query);

            log('Search results:', results);

            setMatches(results);
            setIsOpen(true);
        } catch (err) {
            console.error("❌ ERROR in handleMatch:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSelect(match: MatchType) {
        log('Selected match:', match);

        const normalizedFiles = files.map(f => ({
            ...f,
            path: f.path ?? '' 
        }));

        setIsProcessing(true);

        try {
            // 👉 TVDB still works as before
            const episodes =
                match.provider === 'tvdb'
                    ? await getEpisodes(String(match.id))
                    : null;

            // 👉 Only needed for TMDB TV
            const seasonMap = new Map<string, SeasonData>();

            if (match.provider === 'tmdb' && match.type === 'tv') {

                // 1. discover seasons needed
                const seasonsNeeded = new Set<string>(
                    normalizedFiles
                        .map(f => extractEpisodeInfo(f.name, f.path)?.season)
                        .filter((season): season is string => season !== undefined)
                );

                // 2. fetch all seasons once
                await Promise.all(
                    [...seasonsNeeded].map(async (season) => {
                        const data = await fetchSeason(match.id, Number(season));
                        seasonMap.set(season, data);
                    })
                );
            }

            // 👉 Now process files (NO API CALLS HERE)
            const updated = normalizedFiles.map((file) => {
                const ext = getExtension(file.name);
                const episodeInfo = extractEpisodeInfo(file.name, file.path);

                let baseName;

                if (match.provider === 'tmdb') {
                    const seasonData = episodeInfo
                        ? seasonMap.get(episodeInfo.season)
                        : undefined;

                    baseName = buildName(match, episodeInfo, seasonData);

                } else {
                    baseName = getNameTVDB(match, episodeInfo, episodes);
                }

                return {
                    ...file,
                    name: `${baseName}${ext}`,
                    path: file.path,
                };
            });

            setNewFiles(updated);
            setIsOpen(false);

        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <>
            <S.Wrapper ref={wrapperRef}>
                <S.InnerWrapper>
                    <S.Title>Tv Show Mode:</S.Title>

                    <S.Text onClick={() => handleMatch('tmdb', 'tv')}>
                        TheMovieDB (Match)
                    </S.Text>
                    
                    <S.Text onClick={() => handleMatch('tvdb', 'tv')}>
                        TheTVDB (Match)
                    </S.Text>

                    {loading && <p>Loading...</p>}
                </S.InnerWrapper>

                <S.InnerWrapper>
                    <S.Title>Movie Mode:</S.Title>
                    <S.Text onClick={() => handleMatch('tmdb', 'movie')}>
                        TheMovieDB
                    </S.Text>
                </S.InnerWrapper>
            </S.Wrapper>

            {isOpen && (
                <S.Overlay>
                    <S.Modal ref={modalRef}>
                        <h2 style={{color: '#bbbbbb'}}>Select a match</h2>

                        {matches.length === 0 && <p>No results</p>}

                        {matches.slice(0,5).map((match) => (
                            <S.Button
                                variant = 'primary'
                                key={match.id}
                                onClick={() => {
                                    handleSelect(match);
                                }}
                            >
                                {match.poster && (
                                    <img
                                        src={match.poster}
                                        alt={match.name}
                                        style={{ width: '50px', borderRadius: '4px' }}
                                    />
                                )}

                                <span>{match.name}</span>
                            </S.Button>
                        ))}

                        <S.Button 
                            variant = 'secondary'
                            onClick={() => setIsOpen(false)}
                            >
                            Close
                        </S.Button>
                    </S.Modal>
                </S.Overlay>
            )}
        </>
    );
}

export default Match;