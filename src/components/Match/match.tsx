import * as S from './styles';

import { useState, useRef } from 'react';
import { useFiles } from '../../context/FileContext';

import { extractShowName, extractEpisodeInfo, getExtension } from '../../utils/filename';
import { useClickOutside } from '../../hooks/useClickOutside';
import { fetchSeason, buildName } from '../../services/tmdb';
import { getEpisodes, getNameTVDB } from '../../services/tvdb';
import Message from '../message/message';
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
    const [message, setMessage] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    
    useClickOutside([wrapperRef, modalRef], onClose);

    const log = createLogger('Match');

    async function handleMatch(provider: 'tmdb' | 'tvdb', type: 'tv' | 'movie') {
        log.info('Starting match search', {
            provider,
            type,
            filesCount: files.length
        });

        const file = files[0];

        if (!file) {
            log.error('No file selected');
            return;
        }

        const query = extractShowName(file.name, type);

        setLoading(true);

        try {
            const results = await search(provider, type, query);

            log.info('Search completed', {
                resultsCount: results.length,
                query
            });

            setMatches(results);
            setIsOpen(true);
        } catch (err) {
            log.error('Match search failed', {
                provider,
                type,
                query,
                err
            });
            setMessage(`Error searching for a match: ${err}`)
        } finally {
            setLoading(false);
        }
    }

    async function handleSelect(match: MatchType) {
        log.info('Selected match:', match);

        const normalizedFiles = files.map(f => ({
            ...f,
            path: f.path ?? ''
        }));

        setIsProcessing(true);

        try {
            // 👉 TVDB episodes
            const episodes =
                match.provider === 'tvdb'
                    ? await getEpisodes(String(match.id))
                    : null;

            // 👉 TMDB season cache
            const seasonMap = new Map<string, SeasonData>();

            if (match.provider === 'tmdb' && match.type === 'tv') {

                const seasonsNeeded = new Set<string>(
                    normalizedFiles
                        .map(f => extractEpisodeInfo(f.name, f.path)?.season)
                        .filter((season): season is string => season !== undefined)
                );

                await Promise.all(
                    [...seasonsNeeded].map(async (season) => {
                        const data = await fetchSeason(match.id, Number(season));
                        seasonMap.set(season, data);
                    })
                );
            }

            // 👉 FIXED PART (async map + await)
            const updated = await Promise.all(
                normalizedFiles.map(async (file) => {
                    const ext = getExtension(file.name);
                    const episodeInfo = extractEpisodeInfo(file.name, file.path);

                    log.debug?.('Processing file', {
                        original: file.name,
                        episodeInfo,
                    });

                    let baseName: string;

                    if (match.provider === 'tmdb') {
                        const seasonData = episodeInfo
                            ? seasonMap.get(episodeInfo.season)
                            : undefined;

                        baseName = buildName(match, episodeInfo, seasonData);

                    } else {
                        // ✅ THIS WAS THE BUG
                        baseName = await getNameTVDB(match, episodeInfo, episodes);
                    }

                    const finalName = `${baseName}${ext}`;

                    log.debug?.('File renamed', {
                        from: file.name,
                        to: finalName
                    });

                    return {
                        ...file,
                        name: finalName,
                        path: file.path,
                    };
                })
            );

            setNewFiles(updated);

            log.success('Batch rename complete', {
                totalFiles: updated.length,
                match: match.name
            });

            setIsOpen(false);

        } catch (err) {
            log.error('File processing failed', {
                match,
                filesCount: files.length,
                err
            });
            setMessage(`Error selecting a match: ${err}`);
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

                        {matches.slice(0,10).map((match) => (
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
            {message && 
            <Message 
                message={message}
                open={true}
                onClose={() => setMessage('')}
            />
        }
        </>
    );
}

export default Match;