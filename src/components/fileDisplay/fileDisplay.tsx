import * as S from './styles';

import { useFiles } from '../../context/FileContext';
import { useState, useRef } from 'react';

import { useClickOutside } from '../../hooks/useClickOutside';
import type { FileType } from '../../types/types';

function FileDisplay({ title }: {title: string}) {

    const { files, setFiles } = useFiles();
    const [ open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useClickOutside(wrapperRef, () => setOpen(false));
        

    const handleSelectFolder = async () => {
        const result = await window.electronAPI.selectFolder();

        const cleanedResult: FileType[] = result.map((file) => ({
            ...file,
            name: file.name
                .replace(/\.[^.]+$/, '')
                .trim()
        }))

        setFiles(cleanedResult);
        setOpen(false);
    }

    const handleSelectFile = async () => {
        const result = await window.electronAPI.selectFile();

        const cleanedResult: FileType[] = result.map((file) => ({
            ...file,
            name: file.name
                .replace(/\.[^.]+$/, '')
                .trim()
        }))

        setFiles(cleanedResult);
        setOpen(false);
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
       </>
   );
}

export default FileDisplay;