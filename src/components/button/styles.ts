import styled from "styled-components";

export const Wrapper = styled.div`
  margin-top: 1rem;
  padding: 10px 10px 7px 10px;
  background-color: #4c5052;
  color: #909090;
  border-radius: 5px;
  border: 1px solid #909090;
  transition: all 0.2s ease;
  cursor: pointer;

  @media (min-width: 1000px) {
    height: 2rem;
    width: 7rem;
  }

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

export const Title = styled.h3`
  text-align: center;
`;