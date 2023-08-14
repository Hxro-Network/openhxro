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
  if (!value || value === 'undefined') return '-';
  const newValue = `${value}`.split('.');
  const newInteger = `${newValue[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  newValue[0] = newInteger;

  return (newValue.join('.') * 1).toFixed(3);
};
const ContentHeader = ({ dataWallet }) => {
  const TITLE_LIST = [
    'Required Margin',
    'Excess Margin',
    'Required Initial Margin',
    'Excess Initial Margin',
    'Required Initial Margin',
    'Excess Initial Margin',
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

        <Value color={handleRenderColor(dataWallet?.rInitialMargin)}>
          {handleRenderValue(dataWallet?.rInitialMargin)}
        </Value>

        <Value color={handleRenderColor(dataWallet?.eInitialMargin)}>
          {handleRenderValue(dataWallet?.eInitialMargin)}
        </Value>

        <Value color={handleRenderColor(dataWallet?.rInitialMarginOO)}>
          {handleRenderValue(dataWallet?.rInitialMarginOO)}
        </Value>

        <Value color={handleRenderColor(dataWallet?.eInitialMarginOO)}>
          {handleRenderValue(dataWallet?.eInitialMarginOO)}
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
