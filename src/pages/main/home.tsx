import Button from '../../components/button/button';
import FileDisplay from '../../components/fileDisplay/fileDisplay';
import * as S from './styles';

function Home() {

   return(
    <>
       <S.HomeWrapper>
        <S.Header>
            <S.HeaderTitle>Rename</S.HeaderTitle>
        </S.Header>
       </S.HomeWrapper>
       <S.BodyWrapper>
            <FileDisplay title= "Original Files" off={false}/>
            <S.ButtonWrapper>
                <Button title='↔️ Match'/>
                <Button title='➡️ Rename'/>
            </S.ButtonWrapper>
            <FileDisplay title= "New Names" off={true}/>
       </S.BodyWrapper>
    </>
   ); 
}

export default Home;