import * as S from './styles';

function FileDisplay({ title, off }: {title: string, off: boolean}) {

   return(
       <>
       <S.Wrapper>
            <S.Title>{title}</S.Title>
            <S.InnerWrapper></S.InnerWrapper>
            {!off && <S.Button>📂 Load</S.Button>}
            {/* <S.Button disabled={off}>📂 Load</S.Button> */}
       </S.Wrapper>
       </>
   );
}

export default FileDisplay;