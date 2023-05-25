import styled from 'styled-components';

export const WrapperSelectCoin = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 36px;
  background: #2d3236;
  border-radius: 2px;

  .MuiInputBase-root {
    width: 120px;
    height: 100%;
    border-radius: 0px;
    color: #fff;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;

    .MuiSelect-select {
      padding: 0px 30px 0px 8px;
      min-height: auto;
      align-items: center;
      display: flex;
      img {
        margin-right: 6px;
      }

      p {
        padding: 0px;
        margin: 0px;
        max-width: 60px;
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .MuiOutlinedInput-notchedOutline {
      border: none;
    }

    :hover {
      border: none;
    }
  }
`;

export const WrapperInput = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  align-items: center;
  border-left: 1px solid #1e2324;

  .wrapper-value-coin-select {
    width: 100%;
  }
`;
