import styled from 'styled-components';

export const WrapperContentOrderList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

export const WrapperTitle = styled.div`
  min-height: 38px;
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid #262c2e;
  border-left: none;
  border-right: none;

  .side,
  .qty,
  .price {
    width: 15%;
  }

  .instrument {
    min-width: 120px;
    width: 30%;
  }
  .time {
    min-width: 120px;
    width: 30%;
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
  padding: 0px 4px;
`;
export const Label = styled.div`
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-top: 1px solid #262c2e;
`;

export const ContentOrders = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
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
    padding: 0px 4px;
    margin: 0px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
  }

  .side,
  .qty,
  .price {
    width: 15%;
  }

  .instrument {
    min-width: 120px;
    width: 30%;
  }
  .time {
    min-width: 120px;
    width: 30%;
    white-space: nowrap;
  }
`;
