import styled from 'styled-components';

export const WrapperTitle = styled.div`
  min-height: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #262c2e;
  border-top: 1px solid #262c2e;

  .time {
    max-width: 30%;
    width: 120px;
  }

  .instrument {
    max-width: 30%;
    width: 120px;
  }
  .position {
    max-width: 15%;
    min-width: 60px;
  }
  .mark-price {
    max-width: 15%;
    min-width: 80px;
  }

  .basis {
    max-width: 10%;
    min-width: 40px;
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

export const WrapperRowsContent = styled.div`
  flex: 1;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  height: calc(100% - 75px);
`;
export const WrapperRowContent = styled.div`
  width: 100%;
  display: flex;
  min-height: 26px;
  padding: 4px 0px;
  align-items: center;
  justify-content: space-between;
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
    word-wrap: break-word;
  }
  .time {
    max-width: 30%;
    width: 120px;
  }

  .instrument {
    max-width: 30%;
    width: 120px;
  }
  .position {
    max-width: 15%;
    min-width: 60px;
  }
  .mark-price {
    max-width: 15%;
    min-width: 80px;
  }

  .basis {
    max-width: 10%;
    min-width: 40px;
  }
`;
