import * as S from './styles';

function Button({ title }: {title: string}) {

   return(
       <S.Wrapper>
            <S.Title>{title}</S.Title>
       </S.Wrapper>
   );
}

export default Button;