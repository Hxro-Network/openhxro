import styled from 'styled-components';

export const WrapperContentDeposit = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
  margin: 0px 0px 16px;

  .link-more {
    color: #727e88;
    text-decoration: none;
  }
`;

export const WrapperTitle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 8px;
`;

export const Title = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #d9d9d9;
  margin: 0px;
`;

export const LabelNote = styled.p`
  font-weight: 400;
  font-size: 12px;
  color: #2d3236;
  margin: 0px;
  padding: 0px;
`;

export const WrapperContentRows = styled.div`
  display: flex;
  flex-direction: column;
  /* border-bottom: 1px solid #262c2e; */
  margin-top: 12px;
  padding-bottom: 12px;
`;

export const WrapperRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`;

export const TitleRow = styled.p`
  margin: 0px;
  padding: 0px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #d9d9d9;
`;

export const ValueRow = styled.p`
  margin: 0px;
  padding: 0px;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #d9d9d9;
`;

export const WrapperButtonConfirm = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0px;

  .button-confirm {
    width: 150px;
    height: 34px;
    border: 1px solid #ffffff;
    border-radius: 6px;
    background: transparent;
    color: #ffffff;
    padding: 0px;
    cursor: pointer;
    outline: none;
    :hover {
      background: #141313;
      border: 1px solid #ffffff;
    }
  }
`;
