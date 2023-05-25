import styled from 'styled-components';
import { Select } from '@mui/material';

export const WrapperDropdown = styled(Select)`
  flex: 1;
  border: 1px solid #fff;
  min-height: auto;

  &:hover {
    border: 1px solid #fff;
  }

  * > :focus {
    border: none;
    outline: none;
  }

  .MuiSelect-select {
    width: 100%;
    background: transparent;
    color: #fff;
    border-radius: 2px;
    padding: 8px 12px 0 8px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 23px;
    min-height: auto;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    /* IE11 hide native button */
    &::-ms-expand {
      display: none;
    }

    :focus {
      border: none;
      outline: none;
    }
  }
`;
