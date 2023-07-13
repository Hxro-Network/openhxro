import React, { memo, useEffect, useState } from 'react';
import { handleConvertTime, handleSort } from '../../../../../../utils';
import {
  WrapperTitle,
  Title,
  WrapperRowContent,
  WrapperRowsContent,
} from './ContentMarket.style';
import IconSort from '../../../../../IconSort';

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
  const [increases, setIncreases] = useState(true);
  const [idFilter, setIdFilter] = useState('inserted_at');
  const [isSortTime, setIsSortTime] = useState(true);
  const [isSortNumber, setIsSortNumber] = useState(false);

  const DATA_TITLE = [
    {
      label: 'Time (UTC)',
      key: 'inserted_at',
      class: 'time',
    },
    {
      label: 'Instrument',
      key: 'product',
      class: 'instrument',
    },
    {
      label: 'Qty',
      key: 'base_size',
      class: 'position',
    },
    {
      label: 'Price',
      key: 'price',
      class: 'mark-price',
    },
    {
      label: 'Side',
      key: '',
      class: 'basis',
    },
  ];

  return (
    <>
      <WrapperTitle>
        {DATA_TITLE.map((item, index) => {
          return (
            <Title
              className={item.class}
              key={index}
              onClick={() => {
                setIdFilter(item.key || 'inserted_at');
                setIncreases(!increases);
                if (item.key === '' || item.key === 'inserted_at') {
                  setIsSortTime(true);
                } else {
                  setIsSortTime(false);
                }
                if (item.key === 'qty' || item.key === 'mark-price') {
                  setIsSortNumber(true);
                } else {
                  setIsSortNumber(false);
                }
              }}
            >
              {item.label}
              {item.key === idFilter && (
                <IconSort
                  increases={increases}
                  onClick={() => {
                    setIncreases(!increases);
                  }}
                />
              )}
            </Title>
          );
        })}
      </WrapperTitle>

      <WrapperRowsContent>
        {handleSort(
          dataMarket,
          idFilter,
          increases,
          isSortTime,
          isSortNumber
        ).map((item, index) => {
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
