import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Title,
  WrapperRowContent,
  WrapperTitle,
  WrapperContentRows,
  WrapperLoading,
} from './ContentPosition.style';
import IconLoading from '@components/IconLoading';

function ContentPosition({
  dataPosition,
  productsListKey,
  fundingRateList,
  markPriceList,
  indexPriceList,
  isConnect,
}) {
  const [data, setData] = useState([]);
  const [positionList, setPositionList] = useState([]);
  const [markList, setMarkList] = useState({});
  const [indexList, setIndexList] = useState({});

  useEffect(() => {
    if (
      !Object.keys(markPriceList)?.length ||
      !Object.keys(indexPriceList)?.length
    ) {
      return;
    }
    setPositionList(dataPosition);
    setMarkList(markPriceList);
    setIndexList(indexPriceList);
  }, [dataPosition, markPriceList, indexPriceList]);

  const newProductListKey = useMemo(() => {
    return productsListKey.filter((item) => {
      if (`${item}`.includes('USD')) {
        return `${item}`.trim();
      }
    });
  }, [JSON.stringify(productsListKey)]);

  useEffect(() => {
    const newProduct = [];
    newProductListKey.map((product) => {
      const position = positionList?.find(
        (item) => `${item?.instrument}`.trim() === `${product}`.trim()
      );
      if (position) {
        newProduct.push(position);
      } else {
        newProduct.push({ position: '0', instrument: product });
      }
    });

    setData(newProduct);
  }, [positionList, newProductListKey, isConnect]);

  const renderMarkPrice = (markPrice, product) => {
    if (!markPrice) {
      return '-';
    }
    const regex = /\B(?=(\d{3})+(?!\d))/g;

    if (`${product}`.includes('BTC')) {
      return `${(markPrice * 1).toFixed(0)}`.replace(regex, ',');
    }
    if (`${product}`.includes('ETH')) {
      return `${(markPrice * 1).toFixed(1)}`.replace(regex, ',');
    }
    if (`${product}`.includes('SOL')) {
      return `${(markPrice * 1).toFixed(3)}`.replace(regex, ',');
    }

    return '-';
  };

  const handleReturnAnnualizedBasis = (instrument) => {
    try {
      if (instrument === 'BTCUSD-PERP') {
        return '-';
      }
      const markPrice = markList[instrument];
      const indexPrice = indexList[instrument];
      const r = (markPrice - indexPrice) / indexPrice;

      const date = moment(`${instrument}`.replace(/BTCUSD-/g, ''), 'DD-MMM-YY');
      var daysDiff = date.diff(moment(), 'days');
      const result = (1 + r) ** (365 / daysDiff) - 1;

      return `${(result * 100).toFixed(3)}`.includes('NaN')
        ? '-'
        : `${(result * 100).toFixed(3)}%`;
    } catch (err) {
      return '-';
    }
  };

  const handleReturnFundingRate = (product) => {
    if (!Object.keys(fundingRateList)?.length) {
      return '-';
    }
    if (`${product}`.includes('BTC')) {
      return `${(fundingRateList[product] * 1).toFixed(5)}%`;
    }
    if (`${product}`.includes('ETH')) {
      return `${((fundingRateList[product] * 1) / 100).toFixed(5)}%`;
    }
    if (`${product}`.includes('SOL')) {
      return `${((fundingRateList[product] * 1) / 1000000).toFixed(5)}%`;
    }
    return '-';
  };

  return (
    <>
      <WrapperTitle>
        <Title className="instrument">Instrument</Title>
        <Title className="position">Position</Title>
        <Title className="mark-price">Mark Price</Title>
        <Title className="funding">
          1 hour
          <br /> Funding Rate
        </Title>
        <Title className="basis">Annualized Basis</Title>
      </WrapperTitle>
      <WrapperContentRows>
        {!!Object.keys(markPriceList)?.length &&
          !!data?.length &&
          data.map((position, index) => {
            return (
              <WrapperRowContent
                key={index}
                index={0}
                color={
                  `${position?.position}`.includes('-') ? '#E3627D' : '#47C5D8'
                }
              >
                <p className="instrument">{position?.instrument || ''} </p>
                <p className="position">{position?.position || ''}</p>
                <p className="mark-price">
                  {renderMarkPrice(
                    markList[`${position?.instrument}`.trim()],
                    `${position?.instrument}`.trim()
                  )}
                </p>
                <p className="funding">
                  {/* {`${position?.instrument}`.trim() === 'BTCUSD-PERP'
                    ? funding
                    : '-'} */}
                  {handleReturnFundingRate(`${position?.instrument}`.trim())}
                </p>
                <p className="basis">
                  {handleReturnAnnualizedBasis(
                    `${position?.instrument}`.trim()
                  )}
                </p>
              </WrapperRowContent>
            );
          })}
        {!Object.keys(markPriceList)?.length && (
          <WrapperLoading>
            <IconLoading isWhite />
          </WrapperLoading>
        )}
      </WrapperContentRows>
    </>
  );
}

export default React.memo(ContentPosition);
