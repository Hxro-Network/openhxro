import React from 'react';
import { useWallet } from '@hooks/useWallet';
import ContentPosition from './Components/ContentPosition';
import {
  WrapperContentPosition,
  WrapperContentPositionTotal,
} from './Positions.style';
import { Label } from './Components/ContentPosition/ContentPosition.style';
import ContentOrderList from './Components/ContentOrderList';

export default function Position() {
  const {
    dataPosition,
    productsListKey,
    fundingRateList,
    markPriceList,
    indexPriceList,
    isConnect,
    accountSelect,
  } = useWallet();

  const renderContent = React.useMemo(() => {
    return (
      <ContentPosition
        dataPosition={dataPosition}
        productsListKey={productsListKey}
        fundingRateList={fundingRateList}
        markPriceList={markPriceList}
        indexPriceList={indexPriceList}
        isConnect={isConnect}
      />
    );
  }, [
    JSON.stringify(dataPosition),
    JSON.stringify(productsListKey),
    JSON.stringify(fundingRateList),
    JSON.stringify(markPriceList),
    JSON.stringify(indexPriceList),
    isConnect,
  ]);

  const renderYourFills = React.useMemo(() => {
    return (
      <ContentOrderList
        productsListKey={productsListKey}
        isConnect={isConnect}
        accountSelect={accountSelect}
      />
    );
  }, [
    JSON.stringify(productsListKey),
    isConnect,
    JSON.stringify(accountSelect),
  ]);

  return (
    <WrapperContentPosition>
      <Label>Position</Label>
      <WrapperContentPositionTotal>{renderContent}</WrapperContentPositionTotal>
      {renderYourFills}
    </WrapperContentPosition>
  );
}
