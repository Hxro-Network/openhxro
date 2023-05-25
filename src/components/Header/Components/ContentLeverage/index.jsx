import React from 'react';
import { useWallet } from '@hooks/useWallet';
import { Value } from '../../Header.style';
import { useMemo } from 'react';

export default function ContentLeverage() {
  const { dataPnL, dataPosition, isConnect, markPriceList } = useWallet();

  const handleReturnValueLeverage = () => {
    if (!isConnect || !dataPosition?.length) {
      return '-';
    }
    let totalValue = 0;
    dataPosition.map((item) => {
      const markPriceForItem =
        markPriceList[`${item.instrument}`.trim()] || 0 * 1;
      const position = Math.abs(item.position * 1);
      totalValue += position * markPriceForItem;
    });
    return `${(totalValue / (dataPnL?.portfolio || 1)).toFixed(2)}x`;
  };

  const valueLeverage = useMemo(() => {
    return handleReturnValueLeverage();
  }, [
    JSON.stringify(dataPnL),
    JSON.stringify(dataPosition),
    isConnect,
    JSON.stringify(markPriceList),
  ]);

  return (
    <Value
      color={
        `${valueLeverage}`.includes('-') && `${valueLeverage}` !== '-'
          ? '#E3627D'
          : '#47C5D8'
      }
    >
      {`${valueLeverage}`.includes('NaN') ? '0.00x' : valueLeverage}
    </Value>
  );
}
