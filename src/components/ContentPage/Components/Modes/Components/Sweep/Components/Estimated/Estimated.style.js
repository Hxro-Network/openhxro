import styled from 'styled-components';

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

export const Label = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;

  .buy {
    color: #47C5D8;
  }
  .sell {
    color: #E3627D;
  }
`;
