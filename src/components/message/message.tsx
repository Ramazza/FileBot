import * as S from './styles';
import { useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

type Prop = {
    message: string;
    open: boolean;
    onClose: () => void;
}

function Message({message, open, onClose}: Prop) {

    const modalRef = useRef<HTMLDivElement>(null);

    useClickOutside(modalRef, onClose);

    if (!open) return null;

   return(
        <S.Overlay>
             <S.Modal ref={modalRef}>
                 <S.Text>{message}</S.Text>
                 <S.Button onClick={onClose}>ok</S.Button>
             </S.Modal>
        </S.Overlay>
   );
}

export default Message;