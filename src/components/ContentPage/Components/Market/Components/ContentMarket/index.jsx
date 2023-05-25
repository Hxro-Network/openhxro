import React, { memo } from 'react';
import { handleConvertTime } from '../../../../../../utils';
import {
  WrapperTitle,
  Title,
  WrapperRowContent,
  WrapperRowsContent,
} from './ContentMarket.style';

export const handleReturnIsBid = (item, account) => {
  if (account) {
    if (item?.taker_trg == account || item?.maker_trg == account) {
      if (item?.taker_trg == account) {
        if (item?.taker_side == 'bid') {
          return true;
        } else {
          return false;
        }
      }
      if (item?.taker_side == 'bid') {
        return false;
      } else {
        return true;
      }
    }
    return item?.taker_side == 'bid';
  }

  return item?.taker_side == 'bid';
};

export const handleRenderPrice = (price, product) => {
  if (!price) {
    return '-';
  }
  const newProduct = `${product}`.toLowerCase();
  if (newProduct.includes('btcusd')) {
    return (price * 1).toFixed(0);
  }
  if (newProduct.includes('ethusd')) {
    return (price * 1).toFixed(1);
  }
  if (newProduct.includes('solusd')) {
    return (price * 1).toFixed(3);
  }
};

function ContentMarket({ dataMarket, accountSelect, productSelect }) {
  return (
    <>
      <WrapperTitle>
        <Title className="time">Time (UTC)</Title>
        <Title className="instrument">Instrument</Title>
        <Title className="position">Qty</Title>
        <Title className="mark-price">Price</Title>
        <Title className="basis">Side</Title>
      </WrapperTitle>

      <WrapperRowsContent>
        {!!dataMarket?.length &&
          dataMarket.map((item, index) => {
            return (
              <WrapperRowContent
                color={handleReturnIsBid(item) ? '#47C5D8' : '#E3627D'}
                index={0}
                key={item?.maker_order_id + index}
              >
                <p className="time">{handleConvertTime(item?.inserted_at)}</p>
                <p className="instrument">{item?.product}</p>
                <p className="position">{item?.base_size}</p>
                <p className="mark-price">
                  {handleRenderPrice(item?.price, productSelect)}
                </p>
                <p className="basis">
                  {handleReturnIsBid(item, accountSelect) ? 'BUY' : 'SELL'}
                </p>
              </WrapperRowContent>
            );
          })}
      </WrapperRowsContent>
    </>
  );
}

export default memo(ContentMarket);
