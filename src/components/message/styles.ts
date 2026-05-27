import styled from "styled-components";

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
  align-items: center;
  gap: 10px;
`;

export const Text = styled.p`
  font-size: 1rem;
  color: #bbbbbb;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 30%;
  gap: 10px;

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
`;