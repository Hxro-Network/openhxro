import React, { memo } from 'react';
import {
  Title,
  Value,
  WrapperContent,
  WrapperRowsTitle,
  WrapperRowsValue,
} from '../Header.style';
import ContentLeverage from './ContentLeverage';

export const handleRenderValue = (value) => {
  if (!value) return '-';
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const ContentHeader = ({ dataWallet }) => {
  const TITLE_LIST = [
    'Required Margin',
    'Excess Margin',
    'Collateral + Unrealized PnL',
    'Leverage (Effective)',
    'Total PnL',
  ];

  const handleRenderColor = (value) => {
    return `${value}`.includes('-') ? 'red' : '';
  };

  return (
    <WrapperContent>
      <WrapperRowsTitle>
        {TITLE_LIST.map((title) => {
          return <Title key={title}>{title}</Title>;
        })}
      </WrapperRowsTitle>
      <WrapperRowsValue>
        <Value color={handleRenderColor(dataWallet?.requiredMargin)}>
          {handleRenderValue(dataWallet?.requiredMargin)}
        </Value>
        <Value color={handleRenderColor(dataWallet?.excessMargin)}>
          {handleRenderValue(dataWallet?.excessMargin)}
        </Value>
        {/* <Value color={handleRenderColor(dataWallet?.positionVal)}>
          {handleRenderValue(dataWallet?.positionVal)}
        </Value> */}
        <Value color={handleRenderColor(dataWallet?.portfolio)}>
          {handleRenderValue(dataWallet?.portfolio)}
        </Value>
        <ContentLeverage />
        <Value color={handleRenderColor(dataWallet?.pnl)}>
          {handleRenderValue(dataWallet?.pnl)}
        </Value>
      </WrapperRowsValue>
    </WrapperContent>
  );
};

export default memo(ContentHeader);
