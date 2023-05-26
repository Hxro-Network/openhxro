import styled from 'styled-components';

export const Label = styled.div`
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0px 8px;
`;

export const WrapperTitle = styled.div`
  min-height: 38px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #262c2e;
  border-left: none;
  border-right: none;
  padding: 4px 0px;

  .instrument {
    width: 30%;
    min-width: 120px;
  }

  .position {
    width: 18%;
    min-width: 60px;
  }

  .mark-price {
    width: 18%;
    min-width: 60px;
  }

  .funding {
    width: 17%;
    min-width: 60px;
  }

  .basis {
    width: 17%;
    min-width: 60px;
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

export const WrapperContentRows = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100% - 50px);
  overflow: auto;
  position: relative;

  ::-webkit-scrollbar {
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
  }
  .instrument {
    width: 30%;
    min-width: 120px;
  }

  .position {
    width: 18%;
    min-width: 60px;
  }

  .mark-price {
    width: 18%;
    min-width: 60px;
  }

  .funding {
    width: 17%;
    min-width: 60px;
  }

  .basis {
    width: 17%;
    min-width: 60px;
  }
`;
