import styled from "styled-components";

export const Wrapper = styled.div`
  position: absolute;
  top: 51%;
  z-index: 999;

  width: 80%;

  border: 1px solid #909090;
  border-radius: 5px;
  background-color: #3c3f41;
  padding: 0.8rem;
`;

export const InnerWrapper = styled.div`
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Title = styled.p`
  font-size: 1rem;
  color: #bbbbbb;
`;

export const Text = styled.p`
  font-size: 0.8rem;
  color: #5195c4;
  text-decoration-line: underline;
  cursor: pointer;

  &:hover {
    color: #6bb3e0;
    opacity: 0.9;
  }

  &:active {
    color: #3f7fa8;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background: rgba(0, 0, 0, 0.7);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 999;
`;

export const Modal = styled.div`
  background: #3c3f41;
  padding: 20px;
  border-radius: 8px;
  border-color: #909090;

  display: flex;
  flex-direction: column;
  gap: 10px;

`;

export const Button = styled.button<{ variant: 'primary' | 'secondary'} >`
  display: flex;              
  align-items: center;
  gap: 10px;

  text-align: left;
  background-color: #4c5052;
  color: #bbbbbb;
  border-radius: 5px;
  border: 1px solid #909090;
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #5a5f61;
    border-color: #c0c0c0;
    color: #e0e0e0;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(0px);
    box-shadow: none;
  }

  ${({ variant }) => variant === 'secondary' && 
    `
    align-self: center;
    background-color: #313131;
    color: #909090;
    `}
`;