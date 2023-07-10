import React, { memo, useEffect, useRef, useState } from 'react';
import {
  WrapperContentOrderList,
  Title,
  WrapperRowContent,
  ContentOrders,
  Label,
  WrapperTitle,
} from './ContentOrderList.style';
import { handleConvertTime, handleSort } from '../../../../../../utils/index';
// import { WrapperLoading } from '../../../Market/Market.style';
// import IconLoading from '@components/IconLoading';
import { getYourFills } from '../../../../../../axios/getYourFills';
import { handleReturnIsBid } from '../../../Market/Components/ContentMarket';
import { handleRenderPrice } from '../../../Market/Components/ContentMarket';
import IconSort from '../../../../../IconSort';

function ContentOrderList({ productsListKey, isConnect, accountSelect }) {
  const TITLE_LIST = [
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
      label: 'Side',
      key: 'side',
      class: 'side',
    },
    {
      label: 'Qty',
      key: 'base_size',
      class: 'qty',
    },

    {
      label: 'Price',
      key: 'price',
      class: 'price',
    },
  ];
  const [dataFills, setDataFills] = useState([]);
  const refTimeOut = useRef(undefined);
  const refConnect = useRef(isConnect);
  const refInterval = useRef();

  const [increases, setIncreases] = useState(true);
  const [idFilter, setIdFilter] = useState('inserted_at');
  const [isSortTime, setIsSortTime] = useState(true);

  const handleGetDataYourFills = async (products, wallet) => {
    try {
      if (!wallet || !products.length) {
        return;
      }
      const lenProductList = products?.length || 0;
      const dataFills = [];
      let isError = false;
      for (let index = 0; index < lenProductList; index++) {
        const product = products[index];
        await getYourFills(`${product}`.trim(), wallet)
          .then((res) => {
            if (res?.status !== 200) {
              throw res;
            }
            const { fills } = res.data;
            dataFills.push(...fills);
          })
          .catch((err) => {
            console.log(err);
            isError = true;
          });
        if (isError) {
          break;
        }
      }
      if (refConnect.current) {
        const newDataFills = dataFills.map((item) => {
          return {
            ...item,
            inserted_at: handleConvertTime(item?.inserted_at),
            side: handleReturnIsBid(item, accountSelect) ? 'BUY' : 'SELL',
            price: handleRenderPrice(item?.price, item?.product),
          };
        });
        // dataFills.sort((a, b) => {
        //   if (new Date(a?.inserted_at) > new Date(b?.inserted_at)) {
        //     return -1;
        //   }
        //   return 1;
        // });
        if (!isError) {
          setDataFills(newDataFills);
        }
      }
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (!isConnect) {
      refConnect.current = false;
      setDataFills([]);
      return;
    }
    setDataFills([]);
    refConnect.current = true;
    if (refTimeOut.current) {
      clearTimeout(refTimeOut.current);
    }

    refTimeOut.current = setTimeout(() => {
      refTimeOut.current = undefined;
      refInterval.current = setInterval(() => {
        handleGetDataYourFills(productsListKey, accountSelect);
      }, 5000);
    }, 1500);

    return () => {
      window.clearInterval(refInterval.current);
    };
  }, [
    JSON.stringify(productsListKey),
    JSON.stringify(accountSelect),
    isConnect,
  ]);

  return (
    <WrapperContentOrderList>
      <Label>Fills</Label>
      <WrapperTitle>
        {TITLE_LIST.map((item, index) => {
          return (
            <Title
              key={index}
              className={item.class}
              onClick={() => {
                setIdFilter(item.key || 'inserted_at');
                setIncreases(true);
                if (item.key === 'inserted_at') {
                  setIsSortTime(true);
                } else {
                  setIsSortTime(false);
                }
              }}
            >
              {item.label}
              {item.key === idFilter && !!dataFills.length && (
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
      <ContentOrders>
        {handleSort(dataFills, idFilter, increases, isSortTime).map(
          (item, index) => {
            return (
              <WrapperRowContent
                color={
                  handleReturnIsBid(item, accountSelect) ? '#47C5D8' : '#E3627D'
                }
                key={index}
                index={2}
              >
                <p className="time">{item?.inserted_at}</p>
                <p className="instrument">{item?.product || ''}</p>
                <p className="side">{item?.side}</p>
                <p className="qty">{item?.base_size}</p>
                <p className="price">{item?.price}</p>
              </WrapperRowContent>
            );
          }
        )}
      </ContentOrders>

      {/* {loading && (
        <WrapperLoading>
          <IconLoading isWhite />
        </WrapperLoading>
      )} */}
    </WrapperContentOrderList>
  );
}

export default memo(ContentOrderList);
