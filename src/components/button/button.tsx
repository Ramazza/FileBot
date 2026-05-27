import * as S from './styles';

type Props = {
    title: string;
    onClick?: () => void;
}

function Button({ title, onClick }: Props) {

   return(
       <S.Wrapper onClick={onClick}>
            <S.Title>{title}</S.Title>
       </S.Wrapper>
   );
}

export default Button;