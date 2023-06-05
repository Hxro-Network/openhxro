import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { StyledLadder } from '../../../Ladder.style';
import Tick from '../../../Tick';
import cloneDeep from 'lodash.clonedeep';

export default function EntryGroup({
  indexAsk,
  indexBid,
  dataLadder,
  indexGroupSelect,
  product,
  handleCancel,
  handleOrder,
  qtyGlobal,
  onSelectPrice,
}) {
  const PADDING_PRODUCT = product.includes('btc')
    ? 1
    : product.includes('eth')
    ? 10
    : 1000;

  const [ticks, newTicks] = useState([]);

  useEffect(() => {
    if (indexAsk !== 0 && indexBid !== 0 && !!dataLadder?.length) {
      const newDataLadder = cloneDeep(dataLadder).slice(indexAsk, indexBid);
      const newTick = [];
      const length = newDataLadder?.length || 0;
      if (length) {
        for (let index = 0; index < length; index++) {
          const tick = newDataLadder[index];
          const valueCoin =
            `${tick.tickPrices?.value?.toString() || 0}` * PADDING_PRODUCT;

          if (valueCoin % indexGroupSelect === 0) {
            newTick.push(tick);
          }
        }
      }
      newTicks(newTick);
    }
  }, [dataLadder, indexAsk, indexBid]);

  return (
    <>
      {!!ticks?.length &&
        ticks.map((tick, index) => {
          return (
            <StyledLadder key={index} hidden={tick?.hidden || false}>
              {tick.traderBid &&
                (tick.traderBid.size > 0 ? (
                  <Tick
                    id={`tooltip_${index}_traderBid_EntryGroup`}
                    hasCursor
                    data={tick.traderBid}
                    tooltip={`Cancel buy ${tick.traderBid.size}`}
                    onCancel={handleCancel}
                    onSelectPrice={onSelectPrice}
                  />
                ) : (
                  <Tick
                    hasCursor={false}
                    data={tick.traderBid}
                    onSelectPrice={onSelectPrice}
                  />
                ))}
              {tick.tickBid && (
                <Tick
                  id={`tooltip_${index}_tickBid_EntryGroup`}
                  hasCursor
                  data={tick.tickBid}
                  tooltip={`Buy ${
                    tick.tickBid.value > 0 ? tick.tickBid.value : qtyGlobal
                  } @ ${tick.tickPrices?.value}`}
                  onOrder={handleOrder}
                  isBackgroundBid
                  onSelectPrice={onSelectPrice}
                />
              )}
              {tick.tickPrices && (
                <Tick
                  hasCursor={false}
                  data={tick.tickPrices}
                  index={index}
                  onSelectPrice={onSelectPrice}
                />
              )}
              {tick.tickAsk && (
                <Tick
                  id={`tooltip_${index}_tickAsk_EntryGroup`}
                  hasCursor
                  data={tick.tickAsk}
                  tooltip={`Sell ${
                    tick.tickAsk.value > 0 ? tick.tickAsk.value : qtyGlobal
                  } @ ${tick.tickPrices?.value}`}
                  onSelectPrice={onSelectPrice}
                />
              )}
              {tick.traderAsk &&
                (tick.traderAsk.size > 0 ? (
                  <Tick
                    id={`tooltip_${index}_traderAsk_EntryGroup`}
                    hasCursor
                    data={tick.traderAsk}
                    tooltip={`Cancel sell ${tick.traderAsk.size}`}
                    onCancel={handleCancel}
                    onSelectPrice={onSelectPrice}
                  />
                ) : (
                  <Tick
                    hasCursor={false}
                    data={tick.traderAsk}
                    onSelectPrice={onSelectPrice}
                  />
                ))}
            </StyledLadder>
          );
        })}
    </>
  );
}
