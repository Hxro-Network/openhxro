import styled from 'styled-components';

export const Label = styled.div`
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0px 8px;
`;

export const WrapperLabel = styled.div`
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .button-cancel-all {
    background: transparent;
    color: #fff;
    cursor: pointer;
    border: none;

    :hover {
      background: #eee;
      color: #000;
    }
  }
`;

export const Title = styled.div`
  display: flex;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
  padding: 0px 8px;
  cursor: pointer;
`;

export const WrapperOrdersContent = styled.div`
  height: 100%;
  flex: 1;
  min-width: 425px;
  border: 1px solid #262c2e;
  border-top: none;
  overflow: hidden;
  box-sizing: border-box;

  box-shadow: ${({ hover }) =>
    hover ? '1px 1px 16px 1px rgba(71,197,216,0.8) inset' : 'none'};
  -webkit-box-shadow: ${({ hover }) =>
    hover ? '1px 1px 16px 1px rgba(71,197,216,0.8) inset' : 'none'};
  -moz-box-shadow: ${({ hover }) =>
    hover ? '1px 1px 16px 1px rgba(71,197,216,0.8) inset' : 'none'};
`;

export const WrapperTitle = styled.div`
  min-height: 38px;
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid #262c2e;
  border-left: none;
  border-right: none;

  .instrument {
    width: 30%;
    max-width: 120px;
  }

  .side {
    width: 15%;
    min-width: 50px;
  }
  .qty,
  .price {
    width: 15%;
    min-width: 55px;
  }

  .id {
    width: 13%;
    min-width: 30px;
  }
  .button {
    flex: 1;
    min-width: 40px;
    color: transparent;
  }
`;

export const ContentOrders = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100% - 80px);
  overflow: auto;
`;

export const WrapperRowContent = styled.div`
  width: 100%;
  display: flex;
  min-height: 26px;
  padding: 4px 0px;
  align-items: center;
  background: ${(props) => (props.index % 2 == 0 ? 'none' : '#474747c9')};
  color: ${(props) => props?.color || '#fff'};

  :hover {
    background: rgba(71, 71, 71, 0.79);
  }

  p {
    padding: 0px 8px;
    margin: 0px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
  }

  button {
    color: ${(props) => props?.color || '#fff'};
  }

  .instrument {
    width: 30%;
    max-width: 120px;
  }

  .side {
    width: 15%;
    min-width: 50px;
  }
  .qty,
  .price {
    width: 15%;
    min-width: 55px;
  }

  .id {
    width: 13%;
    min-width: 30px;
    display: flex;
    align-items: center;
    .icon-copy {
      margin-left: 4px;
      min-width: 12px;
      width: 12px;
      cursor: pointer;
    }
  }
  .button {
    flex: 1;
    min-width: 40px;
    color: transparent;
  }
`;

export const WrapperButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 4px;

  .style-button {
    width: fit-content;
    background: none;
    min-width: 46px;
    border: 1px solid #fff;
    height: 22px;
    padding: 4px 10px;
    margin: 0px 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
  }

  .button-cancel {
    color: red;
  }
`;
