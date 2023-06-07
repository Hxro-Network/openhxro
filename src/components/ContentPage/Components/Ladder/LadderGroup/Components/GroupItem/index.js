import React, { useEffect, useState } from 'react';
import { StyledLadder } from '../../../Ladder.style';
import Tick from '../../../Tick';
import cloneDeep from 'lodash.clonedeep';

export default function GroupItem({
  dataLadder,
  totalSize,
  typeGroup,
  indexGroupSelect,
  qtyGlobal,
  handleCancel,
  handleOrder,
  product = 'btc',
  onSetIndexAsk,
  onSetIndexBid,
  isConnect,
  onSelectPrice,
  indexBid,
  indexAsk,
  isMouseEnter,
}) {
  const [ticks, setTicks] = useState([]);
  const PADDING = 100000;
  const PADDING_PRODUCT = product.includes('btc')
    ? 1
    : product.includes('eth')
    ? 10
    : 1000;
  const TO_FIXED = product.includes('btc')
    ? 0
    : product.includes('eth')
    ? 1
    : 3;

  const handleReturnValueAsk = (value) => {
    if (!value) {
      return value;
    }
    let result = 1;

    for (let index = 0; index < 10; index++) {
      if (
        (index + `${value || 0}` * PADDING_PRODUCT) % indexGroupSelect ===
        0
      ) {
        result = index;
        break;
      }
    }

    return `${(
      (result + `${value || 0}` * PADDING_PRODUCT) /
      PADDING_PRODUCT
    ).toFixed(TO_FIXED)}`;
  };

  const handleReturnValueBid = (value) => {
    if (!value) {
      return value;
    }
    let result = 1;
    for (let index = 0; index < 10; index++) {
      if (
        (`${value || 0}` * PADDING_PRODUCT - index) % indexGroupSelect ===
        0
      ) {
        result = index;
        break;
      }
    }
    return `${(
      (`${value || 0}` * PADDING_PRODUCT - result) /
      PADDING_PRODUCT
    ).toFixed(TO_FIXED)}`;
  };

  const handleReturnReductions = (value) => {
    if (!value) {
      return value;
    }
    let result = 1;
    for (let index = 0; index < 10; index++) {
      if (
        (`${value || 0}` * PADDING_PRODUCT - index) % indexGroupSelect ===
        0
      ) {
        result = index;
        break;
      }
      return result;
    }
  };

  const handleReturnIncreases = (value) => {
    if (!value) {
      return value;
    }
    let result = 1;
    for (let index = 0; index < 10; index++) {
      if (
        (`${value || 0}` * PADDING_PRODUCT + index) % indexGroupSelect ===
        0
      ) {
        result = index;
        break;
      }
      return result;
    }
  };

  const handleReturnIndexMinAsk = () => {
    const length = dataLadder?.length;
    let indexMixAsk = length || 0;
    for (let indexMin = 0; indexMin < length; indexMin++) {
      const tick = dataLadder[indexMin];
      const askValue = `${tick.tickAsk?.value || 0}` * 1;
      if (askValue !== 0) {
        indexMixAsk = indexMin;
      }
    }
    return indexMixAsk;
  };

  const handleRenderDataAsk = () => {
    const indexMixAsk =
      isMouseEnter && !!indexAsk ? indexAsk : handleReturnIndexMinAsk();

    const newTicks = [];
    const itemLast = dataLadder[indexMixAsk];

    const increases =
      handleReturnIncreases(itemLast?.tickPrices?.value || 0) || 1;
    const newDataLadder = cloneDeep(dataLadder).slice(
      0,
      isMouseEnter ? indexMixAsk : indexMixAsk + increases
    );

    if (!isMouseEnter) {
      onSetIndexAsk(indexMixAsk + increases);
    }
    const lengthNewDataLadder = newDataLadder.length;
    let newAsk = {};
    for (let index = lengthNewDataLadder - 1; index >= 0; index--) {
      const tick = newDataLadder[index];

      const valueCoin =
        `${tick.tickPrices?.value?.toString() || 0}` * PADDING_PRODUCT;
      const askValue = `${tick.tickAsk?.value?.toString() || 0}` * 1;
      const valueNewAsk = `${newAsk?.tickAsk?.value?.toString() || 0}` * 1;

      const valueAsk = valueNewAsk * PADDING + askValue * PADDING;

      const askTraderValue = `${tick.traderAsk?.value?.toString() || 0}` * 1;
      const newTraderValue = `${newAsk.traderAsk?.value?.toString() || 0}` * 1;

      const valueTraderAsk =
        askTraderValue * PADDING + newTraderValue * PADDING;

      const newOrderIds = [
        ...(newAsk?.traderAsk?.orderIds || []),
        ...(tick?.traderAsk?.orderIds || []),
      ];

      if (valueCoin % indexGroupSelect === 0) {
        newAsk = {
          ...tick,
          tickAsk: {
            ...tick.tickAsk,
            value: valueAsk / PADDING,
          },
          traderAsk: {
            ...tick.traderAsk,
            value: valueTraderAsk / PADDING,
            orderIds: newOrderIds,
          },
          tickBid: {
            ...tick.tickBid,
            value: 0,
          },
        };
      } else {
        if (valueNewAsk === 0) {
          newAsk = {
            ...tick,
            tickAsk: {
              ...tick.tickAsk,
              value: valueAsk / PADDING,
            },
            tickBid: {
              ...tick.tickBid,
              value: 0,
            },
            traderAsk: {
              ...tick.traderAsk,
              value: valueTraderAsk / PADDING,
              orderIds: newOrderIds,
            },
          };
        } else {
          newAsk = {
            ...newAsk,
            tickAsk: {
              ...newAsk.tickAsk,
              value: valueAsk / PADDING,
            },
            traderAsk: {
              ...tick.traderAsk,
              value: valueTraderAsk / PADDING,
              orderIds: newOrderIds,
            },
            tickBid: {
              ...newAsk.tickBid,
              value: 0,
            },
          };
        }
      }
      if (index === 0 || valueCoin % indexGroupSelect === 0) {
        newTicks.push(newAsk);
        newAsk = {};
      }
    }

    const newData = [];
    for (let idx = newTicks.length - 1; idx >= 0; idx--) {
      if (idx === newTicks.length - 1) {
        newData.push({
          ...newTicks[idx],
          tickPrices: {
            ...newTicks[idx].tickPrices,
            value:
              (newTicks[idx].tickPrices.value * PADDING_PRODUCT) %
                indexGroupSelect ===
              0
                ? newTicks[idx].tickPrices.value
                : handleReturnValueAsk(newTicks[idx].tickPrices.value),
          },
        });
      } else {
        newData.push(newTicks[idx]);
      }
    }
    setTicks(newData);
  };

  const handelReturnIndexMinBid = () => {
    const length = dataLadder.length || 0;
    let indexMixBid = length;
    for (let indexMin = 0; indexMin < length; indexMin++) {
      const tick = dataLadder[indexMin];
      const bidValue = `${tick.tickBid?.value || 0}` * 1;
      if (bidValue !== 0) {
        indexMixBid = indexMin;
        break;
      }
    }
    return indexMixBid;
  };

  const handleRenderDataBid = () => {
    const indexMixBid =
      isMouseEnter && !!indexBid ? indexBid : handelReturnIndexMinBid();

    const newTicks = [];
    const itemFirst = dataLadder[indexMixBid];

    const reduction =
      handleReturnReductions(itemFirst?.tickPrices?.value || 0) || 1;
    const newDataLadder = cloneDeep(dataLadder).slice(
      isMouseEnter ? indexMixBid : indexMixBid - reduction,
      dataLadder.length
    );
    onSetIndexBid(indexMixBid - reduction);
    const lengthNewDataLadder = newDataLadder.length;
    let newBid = {};

    for (let index = 0; index < lengthNewDataLadder; index++) {
      const tick = newDataLadder[index];

      const valueCoin =
        `${tick.tickPrices?.value?.toString() || 0}` * PADDING_PRODUCT;
      const bidValue = `${tick.tickBid?.value?.toString() || 0}` * 1;

      const valueNewBid = `${newBid?.tickBid?.value?.toString() || 0}` * 1;
      const valueBid = valueNewBid * PADDING + bidValue * PADDING;

      const askTraderValue = `${tick.traderBid?.value?.toString() || 0}` * 1;
      const newTraderValue = `${newBid.traderBid?.value?.toString() || 0}` * 1;

      const valueTraderBid =
        askTraderValue * PADDING + newTraderValue * PADDING;

      const newOrderIds = [
        ...(newBid?.traderBid?.orderIds || []),
        ...(tick?.traderBid?.orderIds || []),
      ];

      if (valueCoin % indexGroupSelect === 0) {
        newBid = {
          ...tick,
          tickBid: {
            ...tick.tickBid,
            value: valueBid / PADDING,
          },
          traderBid: {
            ...tick.traderBid,
            value: valueTraderBid / PADDING,
            orderIds: newOrderIds,
          },
          tickAsk: {
            ...tick.tickAsk,
            value: 0,
          },
        };
      } else {
        if (valueNewBid === 0) {
          newBid = {
            ...tick,
            tickBid: {
              ...tick.tickBid,
              value: valueBid / PADDING,
            },
            tickAsk: {
              ...tick.tickAsk,
              value: 0,
            },
            traderBid: {
              ...tick.traderBid,
              value: valueTraderBid / PADDING,
              orderIds: newOrderIds,
            },
          };
        } else {
          newBid = {
            ...newBid,
            tickBid: {
              ...newBid.tickBid,
              value: valueBid / PADDING,
            },
            tickAsk: {
              ...newBid.tickAsk,
              value: 0,
            },
            traderBid: {
              ...newBid.traderBid,
              value: valueTraderBid / PADDING,
              orderIds: newOrderIds,
            },
          };
        }
      }
      if (
        index === lengthNewDataLadder - 1 ||
        valueCoin % indexGroupSelect === 0
      ) {
        newTicks.push(newBid);
        newBid = {};
      }
    }
    const itemLastBid = newTicks[newTicks.length - 1];
    if (
      itemLastBid.tickPrices.value * PADDING_PRODUCT * indexGroupSelect !==
      0
    ) {
      newTicks[newTicks.length - 1].tickPrices.value = handleReturnValueBid(
        newTicks[newTicks.length - 1].tickPrices.value
      );
    }
    setTicks(newTicks);
  };

  useEffect(() => {
    const length = dataLadder?.length || 0;
    if (!length) {
      setTicks([]);
      return;
    }
    /**
     * handle return data typeGroup = ask
     */
    if (typeGroup === 'ask') {
      handleRenderDataAsk();
      //   const newData = newTicks.filter((item) => item?.tickAsk?.value !== 0);
    }
    /**
     * handle return data typeGroup = bid
     */
    if (typeGroup === 'bid') {
      handleRenderDataBid();
    }
  }, [dataLadder, typeGroup, indexGroupSelect]);

  /**
   *
   * @param {totalSize} totalSize
   * @param {number} index
   * @param {boolean} isBid
   * @returns {totalSizeBefore}
   * handel return value totalSize after deducting previous sizes
   */
  const handleReturnTotalBefore = (totalSize, index, isBid) => {
    let totalBefore = totalSize;
    ticks.map((item, indexBf) => {
      const valueAsk = `${item.tickAsk?.value?.toString() || 0}` * 1 * 100000;
      const valueBid = `${item.tickBid?.value?.toString() || 0}` * 1 * 100000;
      if (index === 0 && indexBf === 0 && !isBid) {
        return;
      } else {
        if (indexBf <= index && totalBefore.totalBid && isBid) {
          totalBefore = {
            totalAsk: totalBefore.totalAsk - valueAsk,
            totalBid: totalBefore.totalBid - valueBid,
          };
        }
        if (indexBf < index && (valueAsk !== 0 || valueBid !== 0) && !isBid) {
          totalBefore = {
            totalAsk: totalBefore.totalAsk - valueAsk,
            totalBid: totalBefore.totalBid - valueBid,
          };
        }
      }
    });
    return totalBefore;
  };
  return (
    <>
      {ticks.map((tick, index) => {
        return (
          <StyledLadder key={index} hidden={tick?.hidden || false}>
            {tick.traderBid &&
              ((tick.traderBid.value || 0) * 1 > 0 ? (
                <Tick
                  id={`tooltip_${index}_traderBid_${typeGroup}`}
                  hasCursor
                  data={tick.traderBid}
                  tooltip={`Cancel buy ${tick.traderBid.value}`}
                  onCancel={handleCancel}
                  isConnect={isConnect}
                  valuePrice={tick.tickPrices?.value || '0'}
                  onSelectPrice={onSelectPrice}
                />
              ) : (
                <Tick
                  hasCursor={false}
                  data={tick.traderBid}
                  valuePrice={tick.tickPrices?.value || '0'}
                  onSelectPrice={onSelectPrice}
                />
              ))}
            {tick.tickBid && (
              <Tick
                id={`tooltip_${index}_tickBid_${typeGroup}`}
                hasCursor
                data={tick.tickBid}
                tooltip={`Buy ${qtyGlobal} @ ${tick.tickPrices?.value}`}
                onOrder={handleOrder}
                isBackgroundBid
                isShowBackground={typeGroup === 'bid'}
                totalSize={totalSize?.totalBid || 0}
                totalBefore={
                  handleReturnTotalBefore(totalSize, index, true)?.totalBid
                }
                totalSizeSecond={totalSize?.totalAsk || 0}
                isConnect={isConnect}
                valuePrice={tick.tickPrices?.value || '0'}
                onSelectPrice={onSelectPrice}
              />
            )}
            {tick.tickPrices && (
              <Tick
                hasCursor={false}
                data={tick.tickPrices}
                index={index}
                valuePrice={tick.tickPrices?.value || '0'}
                onSelectPrice={onSelectPrice}
              />
            )}
            {tick.tickAsk && (
              <Tick
                id={`tooltip_${index}_tickAsk_${typeGroup}`}
                hasCursor
                data={tick.tickAsk}
                tooltip={`Sell ${qtyGlobal} @ ${tick.tickPrices?.value}`}
                onOrder={handleOrder}
                totalSize={totalSize?.totalAsk || 0}
                totalBefore={
                  handleReturnTotalBefore(totalSize, index, false)?.totalAsk
                }
                isShowBackground={typeGroup === 'ask'}
                totalSizeSecond={totalSize?.totalBid || 0}
                isGroup={true}
                isConnect={isConnect}
                valuePrice={tick.tickPrices?.value || '0'}
                onSelectPrice={onSelectPrice}
              />
            )}
            {tick.traderAsk &&
              ((tick.traderAsk.value || 0) * 1 > 0 ? (
                <Tick
                  id={`tooltip_${index}_traderAsk_${typeGroup}`}
                  hasCursor
                  data={tick.traderAsk}
                  tooltip={`Cancel sell ${tick.traderAsk.value}`}
                  onCancel={handleCancel}
                  isConnect={isConnect}
                  valuePrice={tick.tickPrices?.value || '0'}
                  onSelectPrice={onSelectPrice}
                />
              ) : (
                <Tick
                  hasCursor={false}
                  data={tick.traderAsk}
                  valuePrice={tick.tickPrices?.value || '0'}
                  onSelectPrice={onSelectPrice}
                />
              ))}
          </StyledLadder>
        );
      })}
    </>
  );
}
