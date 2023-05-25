import styled from 'styled-components';

export const WrapperContentMode = styled.div`
  height: 100%;
  width: 25%;
  min-width: 280px;
  border: 1px solid #262c2e;
  display: flex;
  flex-direction: column;
`;

export const WrapperTitle = styled.div`
  width: 100%;
  display: flex;
  height: 38px;
  min-height: 38px;
`;

export const Title = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => (props.isSelect ? '#fff' : '#262C2E')};
  cursor: pointer;
`;

export const WrapperContentModes = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  padding: 18px 15px;
`;
