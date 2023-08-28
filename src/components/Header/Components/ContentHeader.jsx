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
  const valueFormat = `${newValue[0]}.${`${newValue[1] || 0}00`.slice(0, 3)}`;
  return valueFormat;
};
const ContentHeader = ({ dataWallet }) => {
  const TITLE_LIST = [
    'Required Margin (Position)',
    'Excess Margin (Position)',
    'Required Initial Margin (Position Only)',
    'Excess Initial Margin (Position Only)',
    'Required Initial Margin (Incl. Open Orders)',
    'Excess Initial Margin (Incl. Open Orders)',
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
