import * as S from './styles';
import { useFiles } from '../../context/FileContext';

function NewFileDisplay({ title,  }: {title: string}) {

    const { newFiles, isProcessing } = useFiles();

   return(
       <S.Wrapper>
            <S.Title>{title}</S.Title>
            <S.InnerWrapper>
                {isProcessing ? (
                    <S.NoText>Loading files...</S.NoText>
                ) : newFiles.length > 0 ? (
                    newFiles.map((item) => (
                        <S.Text key={item.path}>{item.name}</S.Text>
                    ))
                ) : (
                    <S.NoText>No files loaded</S.NoText>
                )}
            </S.InnerWrapper>
       </S.Wrapper>
   );
}

export default NewFileDisplay;