import * as S from './styles';

import { useState } from 'react';
import { useFiles } from '../../context/FileContext';
import { createLogger } from "../../utils/logger";

import Button from '../../components/button/button';
import FileDisplay from '../../components/fileDisplay/fileDisplay';
import NewFileDisplay from '../../components/newFileDisplay/newFileDisplay';
import Match from '../../components/Match/match';
import Message from '../../components/message/message';


function Home() {

    const [match, setMatch] = useState(false);
    const [message, setMessage] = useState('');
    const {files, setFiles, newFiles, setNewFiles} = useFiles();

    const log = createLogger('Main');
    

    const handleMatch = () => {
        setMatch(!match);
    }

    const handleRename = async () => {
        if (!files.length || !newFiles.length) {
            log.warn("Nothing to rename");
            return;
        }

        if (files.length !== newFiles.length) {
            log.warn("Files and newFiles mismatch");
            return;
        }

        const result = await window.electronAPI.renameFiles(files, newFiles);

        if (result.success) {
            setMessage('Successfully renamed the files');
            log.success('renameFiles');
            setFiles([]);
            setNewFiles([]);
        } else {
            setMessage('Something went wrong');
            log.error('renameFiles');
        }
    }

   return(
    <>
       <S.HomeWrapper>
        <S.Header>
            <S.HeaderTitle>Rename</S.HeaderTitle>
        </S.Header>
       </S.HomeWrapper>
       <S.BodyWrapper>
            <FileDisplay title= "Original Files"/>
            <S.ButtonWrapper>
                <Button title='↔️ Match' onClick={() => { handleMatch(); setNewFiles([]);} }/>
                <Button title='➡️ Rename' onClick={handleRename}/>
                {match && <Match onClose={() => setMatch(false)}/>}
            </S.ButtonWrapper>

            <NewFileDisplay title= "New Names" />
       </S.BodyWrapper>
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

export default Home;