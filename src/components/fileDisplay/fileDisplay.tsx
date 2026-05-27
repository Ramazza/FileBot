import * as S from './styles';

import { useFiles } from '../../context/FileContext';
import Message from '../message/message';
import { useState, useRef } from 'react';

import { useClickOutside } from '../../hooks/useClickOutside';
import type { FileType } from '../../types/types';

function FileDisplay({ title }: {title: string}) {

    const { files, setFiles, setNewFiles } = useFiles();
    const [ open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useClickOutside(wrapperRef, () => setOpen(false));

    const processFiles = (result: FileType[]) => {
        if (!result || result.length === 0) {
            setMessage('No files selected');
            return;
        }

        const cleaned = result.map((file) => ({
            ...file,
            name: file.name
                .replace(/\.[^.]+$/, '')
                .trim()
        }));

        setFiles(cleaned);
        setNewFiles([]);
        setOpen(false);
    }
        
    const handleSelectFolder = async () => {
        try {
            const result = await window.electronAPI.selectFolder();
            processFiles(result);
        } catch {
            setMessage('Failed to load folder');
        }      
    }

    const handleSelectFile = async () => {
        try {
            const result = await window.electronAPI.selectFile();
            processFiles(result);
        } catch {
            setMessage('Failed to load files');
        }
    }

   return(
       <>
       <S.Wrapper>
            <S.Title>{title}</S.Title>
            <S.InnerWrapper>
                {files.length > 0 ? (
                    files.map((item) => (
                        <S.Text variant='primary' key={item.path ?? item.name}>{item.name}</S.Text>
                    ))
                ) : (
                    <S.NoText>No files loaded</S.NoText>
                )}
            </S.InnerWrapper>
            <S.ButtonContainer ref={wrapperRef}>
                <S.Button onClick={() => setOpen(!open)}>📂 Load</S.Button>
                {open && (
                    <S.ModalWrapper>
                        <S.Title>Load Files</S.Title>
                        <S.Text variant='secondary' onClick={handleSelectFolder}>Select Folder</S.Text>
                        <S.Text variant='secondary' onClick={handleSelectFile}>Select Files</S.Text>
                    </S.ModalWrapper>
                )}
            </S.ButtonContainer>
       </S.Wrapper>
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

export default FileDisplay;