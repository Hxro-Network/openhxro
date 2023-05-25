import styled from 'styled-components';

export const WrapperSweep = styled.div`
  width: 100%;

  height: 100%;
`;
export const WrapperQuantity = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const Title = styled.p`
  width: fit-content;
  font-family: 'Roboto';
  white-space: nowrap;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  color: #ffffff;
`;

export const WrapperSelectOrderType = styled.div`
  display: flex;
  width: fit-content;
  white-space: nowrap;
  min-width: 144px;
  background: transparent;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
`;

export const Label = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

export const TableValueBet = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

export const ValueBet = styled.div`
  width: calc(50% - 2px);
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #262c2e;
  cursor: pointer;
  :hover {
    background-color: #262c2e;
  }
`;

export const ButtonClear = styled.div`
  width: calc(100% -2px);
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ffffff;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  border-radius: 2px;
  cursor: pointer;
  :hover {
    background-color: #262c2e;
  }
`;

export const GroupButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;

  button {
    width: calc(50% - 10px);
    border: none;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    :hover {
      background-color: #262c2e;
    }
  }

  .button-buy {
    background: #47C5D8;
  }

  .button-sell {
    background: #E3627D;
  }
`;
