import styled from 'styled-components';

export const StyledTick = styled.div`
  display: flex;
  width: calc(100% / 5);
  height: 100%;
  position: relative;
`;

export const WrapperTickContent = styled.div`
  width: 100%;
  height: 100%;
  cursor: ${(props) => (props.hasCursor ? 'pointer' : 'default')};
  padding: 2px 0;
  z-index: 4;

  span {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    color: #ffffff;
  }
`;

export const Ladder1 = styled.div`
  position: absolute;
  left: ${(props) => (props?.bid ? 'auto' : '0px')};
  right: ${(props) => (props?.bid ? '0px' : 'auto')};
  top: 0px;
  width: ${(props) => props?.width || '100%'};
  height: 100%;
  z-index: 1;
  background: ${(props) =>
    props?.bid ? '#154148 !important' : '#5d2927 !important'};
  transition: width 0.4s;
  border: none !important;
`;

export const ValueLadder = styled.div`
  position: absolute;
  left: ${(props) => (props?.bid ? 'auto' : '0px')};
  right: ${(props) => (props?.bid ? '0px' : 'auto')};
  top: 0px;
  height: 100%;
  width: ${(props) => props?.width || '0%'};
  background: ${(props) =>
    props?.bid ? '#47C5D8 !important' : ' #E3627D !important'};
  z-index: 2;
  transition: width 0.4s;
  border: none !important;
`;
