import * as S from './styles';

import { useState, useRef } from 'react';
import { useFiles } from '../../context/FileContext';

import { useClickOutside } from '../../hooks/useClickOutside';
import Message from '../message/message';
import type { MatchType } from "../../types/types";
import { createLogger } from '../../utils/logger';
import { findMatches } from '../../services/matchService';
import { processSelection } from '../../services/processSelection';

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
        const file = files[0];

        if (!file) {
            log.error('No file selected');
            return;
        }

        setLoading(true);

        try {
            const { results, query } = await findMatches({
            fileName: file.name,
            provider,
            type,
            });

            log.info('Search completed', {
            resultsCount: results.length,
            query,
            });

            setMatches(results);
            setIsOpen(true);
        } catch (err) {
            setMessage(`Error searching for a match: ${err}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleSelect(match: MatchType) {
        setIsProcessing(true);

        try {
            const updated = await processSelection({
            files,
            match,
            });

            setNewFiles(updated);

            log.success('Batch rename complete', {
            totalFiles: updated.length,
            match: match.name,
            });

            setIsOpen(false);
        } catch (err) {
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