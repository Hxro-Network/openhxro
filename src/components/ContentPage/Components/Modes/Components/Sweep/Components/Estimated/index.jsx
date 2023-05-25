import React, { useEffect, useState } from 'react';
import { useWallet } from '@hooks/useWallet';
import { Label, Title, WrapperQuantity } from './Estimated.style';

export default function Estimated({ onSetPrice }) {
  const { markPrice, dataLadder, isConnect, productSelect } = useWallet();
  const [price, setPrice] = useState('-');

  useEffect(() => {
    if (!dataLadder?.length || !isConnect) {
      setPrice('-');
      return;
    }

    const newDataLadder = dataLadder.map((item) => {
      return {
        ask: item?.tickAsk?.value ? item?.tickAsk?.value * 1 : 0,
        bid: item?.tickBid?.value ? item?.tickBid?.value * 1 : 0,
        value: item?.tickPrices?.value ? item?.tickPrices?.value * 1 : 0,
      };
    });
    let maxBid = {
      ask: 0,
      bid: 0,
      value: 0,
    };
    let minAsk = {
      ask: 0,
      bid: 0,
      value: 0,
    };

    newDataLadder.map((item) => {
      if (item.bid > maxBid.bid) {
        maxBid = item;
      }
      if (item.ask !== 0) {
        minAsk = item;
      }
      if (item.ask < minAsk.ask && item.ask !== 0) {
        minAsk = item;
      }
    });

    if (maxBid.bid === 0 || minAsk.ask === 0) {
      onSetPrice(`${(markPrice * 1).toFixed(1)}`.replace(/,/g, '') * 1);
      return;
    }
    const estimatedPrice = (maxBid.value + minAsk.value) / 2;
    onSetPrice(estimatedPrice);

    if (`${productSelect}`.toLowerCase().includes('btc')) {
      setPrice((estimatedPrice * 1).toFixed(0));
    }
    if (`${productSelect}`.toLowerCase().includes('eth')) {
      setPrice((estimatedPrice * 1).toFixed(1));
    }
    if (`${productSelect}`.toLowerCase().includes('sol')) {
      setPrice((estimatedPrice * 1).toFixed(3));
    }
  }, [dataLadder, isConnect, markPrice]);

  return (
    <>
      <WrapperQuantity>
        <Title> Reference Price</Title>
        {(!markPrice || markPrice === '-') && <Label>-</Label>}
        {!!markPrice && markPrice !== '-' && (
          <Label>
            {price === '-' ? (
              <span>-</span>
            ) : (
              <span>{`$${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
            )}
          </Label>
        )}
      </WrapperQuantity>
    </>
  );
}
