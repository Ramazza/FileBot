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

export const Button = styled.div`
  margin-top: 1rem;
  padding: 5px 10px 7px 10px;
  background-color: #4c5052;
  color: #909090;
  border-radius: 5px;
  border: 1px solid #909090;
  cursor: pointer;
`;

export const Text = styled.p`
  z-index: 1;
  white-space: nowrap;
  overflow: visible;
  margin: 8px;
  color: #9a9a9a;
`;

export const NoText = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9a9a9a;
  padding-top: 40%;
`;