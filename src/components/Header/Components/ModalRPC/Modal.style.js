import styled from 'styled-components';
import { InputContent } from '../../../Input/Input.style';

export const WrapperModal = styled.div``;

export const ContentModal = styled.div`
  width: 350px;
  display: flex;
  flex-direction: column;
  background: #000;
  margin: auto;
  padding: 24px 24px 0px;
  border-radius: 8px;
  outline: none;
  box-shadow: 0px 8px 24px #3d546285;
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
  text-align: center;
`;

export const WrapperTab = styled.div`
  width: 100%;
  display: flex;
  padding-bottom: 5px;
  justify-content: flex-start;
  border-bottom: 1px solid #262c2e;
  position: relative;

  .icon-remove {
    position: absolute;
    right: 0px;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: #000;
    z-index: 1;

    :hover {
      background-color: #262c2e;
      border-radius: 50%;
    }
  }
`;

export const InputRPC = styled(InputContent)`
  text-align: center;
`;
