import styled from 'styled-components';

export const WrapperModal = styled.div``;

export const ContentModal = styled.div`
  width: 450px;
  display: flex;
  flex-direction: column;
  background: #000;
  margin: auto;
  padding: 8px 15px;
  border-radius: 8px;
  outline: none;
`;

export const Title = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  margin: 0px 0px 20px;
  padding: 0px;
`;

export const WrapperTab = styled.div`
  width: 100%;
  display: flex;
  padding-bottom: 5px;
  justify-content: flex-start;
  border-bottom: 1px solid #262c2e;
`;

export const Tab = styled.div`
  width: fit-content;
  height: 100%;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  margin-right: 30px;
  color: ${(props) => props.color || '#2D3236'};
  cursor: pointer;
  position: relative;

  ::before {
    position: absolute;
    content: ' ';
    left: 0px;
    bottom: -6px;
    width: 100%;
    height: 1px;
    background: ${(props) => props.color || 'transparent'};
  }
`;

export const WrapperContentModal = styled.div`
  width: 100%;
  display: flex;
  padding-top: 12px;
`;
