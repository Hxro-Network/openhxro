import styled from 'styled-components';

export const StyledHeader = styled.header`
  background: transparent;
  width: 100%;
  /* min-height: 93px; */
  display: flex;
  position: sticky;
  top: 0px;
  left: 0px;
  background: #000000;
  border: 1px solid #262c2e;
  z-index: 10;
`;

export const WrapperRerRefresh = styled.div`
  display: flex;
  height: 100%;
  min-width: 50px;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #262c2e;
  pointer-events: ${(props) => (props.refresh ? 'none' : 'auto')};

  .style-icon-loading {
    width: 32px;
    height: 32px;
    cursor: ${(props) => (props.refresh ? 'auto' : 'pointer')};
  }
`;

export const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-right: 32px;
`;

export const WrapperRowsTitle = styled.div`
  width: 100%;
  display: flex;
  border: 1px solid #262c2e;
  border-left: none;
  border-top: none;
`;

export const WrapperRowsValue = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  min-height: 38px;
  border-right: 1px solid #262c2e;
`;

export const WrapperGroupButton = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;

  .button-deposit,
  .connect-wallet {
    height: 28px;
    border: 1px solid #fff;
    border-radius: 2px;
    padding: 0px 12px;
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: #fff;
    margin: 0px 4px;
  }

  .connect-wallet {
    background-color: #fff;
    color: #262c2e;
  }
`;

export const GroupButton = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

export const AddressWallet = styled.div`
  display: ${({ hidden }) => (hidden ? 'flex' : 'none')};
  flex-direction: column;
  padding: 0px 4px;

  .disable-button {
    background: #aeaeae;
    pointer-events: none;
    cursor: auto;
  }

  .description {
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    p {
      margin: 0px;
      padding: 0px;
      color: inherit;
      margin-left: 4px;
      text-decoration: underline;
      cursor: pointer;
      :hover {
        color: #646cff;
      }
    }
  }
`;

export const Title = styled.p`
  text-align: center;
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  line-height: 14px;
  width: 100%;
  max-width: calc(100% / 9);
  padding: 0 4px;
`;

export const Value = styled.p`
  text-align: center;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  max-width: calc(100% / 5);
  color: ${(props) => props.color || '#47C5D8'};
`;

export const WrapperSelect = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  white-space: nowrap;
  margin-right: 4px;
  min-width: ${(props) =>
    props.isshow === 'true' || !props.isshow ? '144px' : '0px'};
  background: transparent;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  .select-content-hidden {
    display: none;
  }

  .select-content-show {
    display: flex;
  }

  .icon-copy {
    width: 16px;
    margin-left: 2px;
    cursor: pointer;
  }
`;

export const WrapperButtonCreateAccount = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  display: flex;
  position: relative;
  .style-icon-loading {
    opacity: 0;
    position: absolute;
    width: 24px;
    top: -2px;
    left: 82px;
    z-index: -1;
  }

  .show-icon-loading {
    opacity: 1;
    z-index: 2;
  }
`;

export const ButtonCreateAccount = styled.button`
  margin-bottom: 4px;
  width: fit-content;
  font-size: 14px;
  border-radius: 2px;
  padding: 4px 12px;
  background: transparent;
  color: #fff;
  border: 1px solid #fff;

  :active {
    outline: none;
  }
  :focus {
    outline: 0px;
  }

  :hover {
    background: #fff;
    color: #000;
    border-color: #fff;
  }
`;
export const ButtonOrderConnect = styled(ButtonCreateAccount)`
  margin-bottom: 0px;
  min-width: 106px;
`;
