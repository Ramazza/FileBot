import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 83vh;
  width: 40vw;
  margin-top: 8px;
  margin-left: 8px;
  padding-top: 2rem;
  background-color: #3c3f41;
  border-radius: 5px;
  border: 1px solid #2b2b2b;
  overflow-y: hidden;
`;

export const Title = styled.h3`
    color: #909090;
`;

export const InnerWrapper = styled.div`
  height: 80%;
  width: 95%;
  border: 1px solid #909090;
  border-radius: 5px;
  position: relative;
  z-index: 2;
  overflow-x: hidden;
`;

export const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const Button = styled.div`
  margin-top: 1rem;
  padding: 5px 10px 7px 10px;
  background-color: #4c5052;
  color: #909090;
  border-radius: 5px;
  border: 1px solid #909090;
  transition: all 0.2s ease;
  cursor: pointer;

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
`;

export const Text = styled.p<{ variant: 'primary' | 'secondary' }>`
  z-index: 1;
  white-space: nowrap;
  overflow: visible;
  margin: 8px;
  color: #9a9a9a;

  ${({ variant }) => variant === 'secondary' && 
  `
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
  `}
`;

export const NoText = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9a9a9a;
  padding-top: 40%;
`;

export const Overlay = styled.div`
  position: fixed; 
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 998;
`;

export const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-15%, -100%);
  margin-top: 8px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #909090;
  border-radius: 5px;
  background-color: #3c3f41;
  padding: 0.8rem;
`;