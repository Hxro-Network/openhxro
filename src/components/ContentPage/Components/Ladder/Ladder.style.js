import styled from 'styled-components';

export const WrapperLadders = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;

  .disable_select {
    pointer-events: none;
    cursor: auto;
  }
`;

export const WrapperDropdown = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  .group-select {
    max-width: 100px;
    min-width: 80px;
  }
`;

export const WrapperLadder = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

export const WrapperButton = styled.div`
  position: absolute;
  right: 0px;
  top: calc(50vh - 100px);
  width: 50px;
  height: 100px;
  background: #ffffff0f;
  border: 1px solid #284048;
  border-radius: 8px 0px 0px 8px;
  border-right: none;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 10;
  box-sizing: border-box;
`;

export const ButtonClick = styled.button`
  width: 34px;
  height: 38px;
  padding: 0px;
  margin: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #edebeb;

  :active {
    outline: none;
  }
  :focus {
    outline: 0;
  }

  img {
    width: 60%;
    transform: rotate(-45deg);
  }

  :hover {
    border: none;
    background: #fff;
  }
`;

export const ProjectWrapper = styled.div`
  display: flex;
  width: 100%;
  white-space: nowrap;
  z-index: 1;
  overflow: hidden;
  position: relative;

  &:hover {
    border-color: #ffffff;
  }

  .MuiInputBase-root {
    width: 100%;
  }

  select {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 23px;
    padding: 6px 12px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -ms-word-break: normal;
    word-break: normal;

    /* IE11 hide native button */
    &::-ms-expand {
      display: none;
    }
  }

  &:after {
    content: '\\e5cf';
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 32px; /* Preferred icon size */
    line-height: 1.2em;
    color: #ffffff;
    position: absolute;
    top: 0;
    right: 6px;
    pointer-events: none;
  }
`;

export const WrapperLadderContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const WrapperLoading = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: #151c28; */

  .style-icon-loading {
    width: 52px;
    height: 52px;
  }
`;
export const LadderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* background: #151c28; */
  border-right: 1px solid #262c2e;
  border-bottom: 1px solid #262c2e;
  text-align: center;
  vertical-align: middle;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const LadderHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 0;
  border-bottom: 1px solid #262c2e;
  /* background: #141c28; */

  span {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #ffffff;
  }
`;

export const StyledLadder = styled.div`
  display: ${({ hidden }) => (hidden ? 'none' : 'fles')};
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  height: 30px;
  width: 100%;
  position: relative;

  div:first-child:not(.tooltip),
  div:last-child:not(.tooltip) {
    border-bottom: 1px solid transparent;

    span {
      color: #ffffff;
    }
  }

  div:nth-child(2):not(.tooltip) {
    background: #8080800f;
    border-bottom: 1px solid #262c2e;
    cursor: pointer;

    span {
      color: #ffffff;
    }
  }

  div:nth-child(3):not(.tooltip) {
    background: #ffffff;
    border-bottom: 1px solid #262c2e;

    span {
      color: #010101;
    }
  }

  div:nth-child(4):not(.tooltip) {
    background: #8080800f;
    border-bottom: 1px solid #262c2e;
    cursor: pointer;
    span {
      color: #ffffff;
    }
  }

  div[class^='tooltip'] {
    z-index: 1;
  }
  #tooltip_0_tickBid,
  #tooltip_0_tickAsk {
    .react-tooltip {
      z-index: 100;
    }
  }
`;

export const Collapse = styled.div`
  position: absolute;
  bottom: -1px;
  left: 0px;
  width: 100%;
  height: 2px;
  background: #0e879c;
  display: flex;
  justify-content: flex-start;
  z-index: 10;
`;

export const WrapperIcon = styled.div`
  position: absolute;
  display: flex;
  top: -15px;
  height: 30px;
  width: 16px;
  background: #d2c9c9;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  border-radius: 4px;

  img {
    width: 100%;
    height: 28px;
    transform: rotate(-45deg);
  }
`;

export const LadderColumn = styled.div`
  flex-direction: column;
  width: calc(100% / 5);
  height: 100%;
  background: #ffffff;

  span {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    color: #ffffff;
  }
`;

export const WrapperLadderGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
