import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { toastUICancelOrder, toastUISenOrder } from '@utils/notify';
import { traderFunction } from '@contexts/walletContext';
import { useWallet } from '@hooks/useWallet';
import Dropdown from '@components/Dropdown';
import IconLoading from '@components/IconLoading';
import Tick from './Tick';
import cloneDeep from 'lodash.clonedeep';

import {
  ProjectWrapper,
  LadderWrapper,
  LadderHeading,
  StyledLadder,
  WrapperLadderContent,
  WrapperLoading,
  WrapperLadders,
  WrapperButton,
  ButtonClick,
  Collapse,
  WrapperIcon,
  WrapperDropdown,
  WrapperLadderGroup,
} from './Ladder.style';
import iconHidden from './Icon/icon_hidden.svg';
import iconUnHidden from './Icon/icon_un_hidden.svg';
import iconFocus from './Icon/icon_focus.svg';
import LadderGroup from './LadderGroup';

const Ladder = () => {
  const {
    dataLadder: ticks,
    productsListKey,
    changeProduct,
    qtyGlobal,
    isConnect,
    setProductIndex,
    productIndex,
    productSelect,
    loading,
    onSelectPrice,
  } = useWallet();

  const [newTicks, setNewTicks] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    label: 'BTCUSD-PERP',
    value: 'BTCUSD-PERP',
  });
  const DATA_GROUP = {
    btc: [
      {
        label: '1',
        value: '1',
      },
      {
        label: '5',
        value: '5',
      },
      {
        label: '10',
        value: '10',
      },
    ],
    eth: [
      {
        label: '0.1',
        value: '0.1',
      },
      {
        label: '0.5',
        value: '0.5',
      },
      {
        label: '1',
        value: '1',
      },
    ],
    sol: [
      {
        label: '0.001',
        value: '0.001',
      },
      {
        label: '0.005',
        value: '0.005',
      },
      {
        label: '0.01',
        value: '0.01',
      },
    ],
  };
  const [isCollapse, setIsCollapse] = useState(true);
  const refWrapperLadderContent = useRef();
  const [groupSelectForProduct, setGroupSelectForProduct] = useState(
    DATA_GROUP.btc
  );
  const [groupSelected, setGroupSelected] = useState(
    groupSelectForProduct?.[0]
  );
  const [indexGroupSelect, setIndexGroupSelect] = useState(0);
  const [isSelectGroup, setIsSelectGroup] = useState(false);
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const [hadNewData, setHadNewData] = useState(false);
  const firstLoad = useRef(0);
  const refPrevProduct = useRef('BTCUSD-PERP');
  const pointEvent = useRef(true);
  const refIndexMaxBid = useRef(0);
  const refIndexMinAsk = useRef(0);
  const refContentLadder = useRef();
  const refFocus = useRef(false);

  const products = useMemo(() => {
    return productsListKey.map((item) => {
      return { label: item.trim() || '', value: item.trim() || '' };
    });
  }, [productsListKey]);

  const PADDING = 100000;
  /**
   *
   * @param {product} void
   * set product active
   */
  const handleSelectProduct = (product) => {
    onSelectPrice('');
    firstLoad.current = 0;
    setIsCollapse(true);
    setIsMouseEnter(false);
    setHadNewData(false);
    pointEvent.current = false;
    refIndexMaxBid.current = 0;
    refIndexMinAsk.current = 0;
    setTimeout(() => {
      pointEvent.current = true;
    }, 3500);
    setNewTicks([]);
    changeProduct(`${product.value}`.trim());
    setSelectedProduct(product);
    const index = products.findIndex(({ value }) => value === product.value);
    setProductIndex(index || 0);
  };
  /**
   *
   * @param {order} void
   * send content order to trader
   */
  const handleOrder = async (placeOrderParams) => {
    const idToast = toast.loading(toastUISenOrder.loading, {
      closeButton: true,
    });
    try {
      const { isBid, price } = { ...placeOrderParams };

      const newOrderSend = {
        isBid: isBid,
        price: price.reduced(),
        size: traderFunction.dexterity.Fractional.FromString(qtyGlobal),
      };
      if (traderFunction && traderFunction.trader && productIndex >= 0) {
        await traderFunction.sendNewOrder(
          newOrderSend,
          productIndex,
          false,
          (id, value) => {
            if (id === '1') {
              toast.update(idToast, toastUISenOrder.sending);
            }
            if (id === '2') {
              toast.update(idToast, toastUISenOrder.new(value));
            }
            if (id === '3') {
              toast.update(idToast, toastUISenOrder.success(value));
            }
            if (id === '4') {
              toast.update(
                idToast,
                toastUISenOrder.error(value?.message || 'Error!')
              );
            }
          }
        );
      }
    } catch (e) {
      toast.update(idToast, toastUISenOrder.error('Error!'));
    }
  };

  /**
   *
   * @param {order} void
   * send cancel order to trader
   */
  const handleCancel = async (cancelOrdersParams) => {
    const idToast = toast.loading(toastUICancelOrder.loading, {
      closeButton: true,
    });
    try {
      const { orderIds } = { ...cancelOrdersParams };
      if (
        !traderFunction ||
        !traderFunction?.trader ||
        productIndex < 0 ||
        orderIds?.length <= 0
      ) {
        toast.update(idToast, toastUISenOrder.error('Error!'));
        return;
      }
      await traderFunction.cancelOrders(productIndex, orderIds, (id, value) => {
        if (id === '1') {
          toast.update(idToast, toastUICancelOrder.sending);
        }
        if (id === '2') {
          toast.update(idToast, toastUICancelOrder.new(value));
        }
        if (id === '3') {
          toast.update(idToast, toastUICancelOrder.success(value));
        }
        if (id === '4') {
          toast.update(
            idToast,
            toastUICancelOrder.error(value?.message || 'Error!')
          );
        }
      });
    } catch (e) {
      toast.update(idToast, toastUISenOrder.error('Error!'));
    }
  };

  /**
   * scroll to center ladder
   */
  const handleFocus = () => {
    setTimeout(() => {
      if (
        refWrapperLadderContent.current &&
        newTicks.length &&
        refFocus.current &&
        refContentLadder.current
      ) {
        refFocus.current = false;
        const wrapperLadderContent = refWrapperLadderContent.current;
        const ladderContent = refContentLadder.current;
        const heightContent = (wrapperLadderContent?.clientHeight || 0) / 2;
        const totalHeightLadder = (ladderContent.clientHeight || 0) / 2;
        const top = totalHeightLadder - heightContent + 20;
        wrapperLadderContent.scroll({
          top: top,
          behavior: 'smooth',
        });
      }
    }, 500);
  };

  /**
   * return total size for tickBid and tickAsk
   */
  const totalSize = useMemo(() => {
    const total = newTicks.reduce(
      (a, b) => {
        const ask = `${b.tickAsk?.value?.toString() || 0}` * 1;
        const valueAsk = a.totalAsk + ask;
        const bid = `${b.tickBid?.value?.toString() || 0}` * 1;
        const valueBid = a.totalBid + bid;
        return {
          totalAsk: valueAsk,
          totalBid: valueBid,
        };
      },
      {
        totalAsk: 0,
        totalBid: 0,
      }
    );

    return {
      totalAsk: Math.round((total.totalAsk || 0) * PADDING),
      totalBid: Math.round((total.totalBid || 0) * PADDING),
    };
  }, [newTicks]);

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
    newTicks.map((item, indexBf) => {
      const valueAsk = `${item.tickAsk?.value?.toString() || 0}` * 1 * PADDING;
      const valueBid = `${item.tickBid?.value?.toString() || 0}` * 1 * PADDING;

      if (index === 0 && indexBf === 0) {
        totalBefore = {
          totalAsk: totalBefore.totalAsk - valueAsk,
          totalBid: totalBefore.totalBid - valueBid,
        };
      } else {
        if (indexBf <= index && (valueAsk !== 0 || valueBid !== 0) && isBid) {
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

  /**
   *
   * @param {group} void
   * handle change state when select group
   */
  const handleSelectGroup = (group) => {
    setGroupSelected(group);
    pointEvent.current = false;
    refFocus.current = true;
    setTimeout(() => {
      pointEvent.current = true;
      handleFocus();
    }, 500);
    if (group.value === groupSelectForProduct[0].value) {
      setIsSelectGroup(false);
      setIndexGroupSelect(0);
      return;
    }
    setIsSelectGroup(true);
    const index = groupSelectForProduct.findIndex(
      (item) => item.value === group.value
    );
    setIndexGroupSelect(index <= 0 ? 0 : index);
  };

  useEffect(() => {
    if (!isCollapse || !newTicks?.length) {
      setNewTicks(ticks);
      return;
    }
    if (!isMouseEnter || refPrevProduct.current !== `${productSelect}`.trim()) {
      refPrevProduct.current = `${productSelect}`.trim();
      const newDataLadder = ticks.map((item) => {
        return {
          ask: item?.tickAsk?.value ? item?.tickAsk?.value * 1 : 0,
          bid: item?.tickBid?.value ? item?.tickBid?.value * 1 : 0,
        };
      });

      let maxBid = {
        ask: 0,
        bid: 0,
        index: 0,
        value: 0,
      };
      let minAsk = {
        ask: 0,
        bid: 0,
        index: 0,
        value: 0,
      };

      newDataLadder.map((item, index) => {
        if (item.bid > maxBid.bid && maxBid.bid === 0) {
          maxBid = {
            ...item,
            index,
          };
        }
        if (item.ask > 0) {
          minAsk = {
            ...item,
            index,
          };
        }
      });
      refIndexMaxBid.current = maxBid.index;
      refIndexMinAsk.current = minAsk.index;

      if (maxBid.index !== minAsk.index) {
        const ticksNew = ticks.map((item, index) => {
          if (index > minAsk.index && index < maxBid.index) {
            return { ...item, hidden: true };
          }
          if (index === minAsk.index) {
            return { ...item, isShowCollapse: true };
          }
          return item;
        });
        setNewTicks(ticksNew);
        return;
      }
      setNewTicks(ticks);
      return;
    }
  }, [ticks, isCollapse, isMouseEnter]);

  useEffect(() => {
    if (newTicks?.length && isMouseEnter) {
      const dataNewTicks = cloneDeep(newTicks).map((item) => {
        const tickPrices = `${item?.tickPrices?.value}`.trim();
        const newItem = ticks.find(
          (itemNew) => `${itemNew?.tickPrices?.value}`.trim() === tickPrices
        );
        if (newItem) {
          return {
            ...newItem,
            isShowCollapse: item?.isShowCollapse || false,
            hidden: item?.hidden || false,
          };
        }
        return item;
      });

      setNewTicks(dataNewTicks);

      if (isCollapse) {
        const newDataLadder = dataNewTicks.map((item) => {
          return {
            ask: item?.tickAsk?.value ? item?.tickAsk?.value * 1 : 0,
            bid: item?.tickBid?.value ? item?.tickBid?.value * 1 : 0,
          };
        });

        let maxBid = {
          ask: 0,
          bid: 0,
          index: 0,
          value: 0,
        };
        let minAsk = {
          ask: 0,
          bid: 0,
          index: 0,
          value: 0,
        };
        newDataLadder.map((item, index) => {
          if (item.bid > maxBid.bid && maxBid.bid === 0) {
            maxBid = {
              ...item,
              index,
            };
          }
          if (item.ask > 0) {
            minAsk = {
              ...item,
              index,
            };
          }
        });
        if (
          maxBid.index !== refIndexMaxBid.current ||
          minAsk.index !== refIndexMinAsk.current
        ) {
          setHadNewData(true);
        } else {
          setHadNewData(false);
        }
      }
      return;
    }
  }, [isMouseEnter, ticks, isCollapse]);

  useEffect(() => {
    setIsSelectGroup(false);
    setIndexGroupSelect(0);
    const newProduct = `${productSelect}`.toLowerCase();
    if (newProduct.includes('btc')) {
      setGroupSelectForProduct(DATA_GROUP.btc);
      setGroupSelected(DATA_GROUP.btc[0]);
      return;
    }
    if (newProduct.includes('eth')) {
      setGroupSelectForProduct(DATA_GROUP.eth);
      setGroupSelected(DATA_GROUP.eth[0]);
      return;
    }
    if (newProduct.includes('sol')) {
      setGroupSelectForProduct(DATA_GROUP.sol);
      setGroupSelected(DATA_GROUP.sol[0]);
      return;
    }
  }, [productSelect]);

  useEffect(() => {
    if (firstLoad.current < 2 && !!newTicks?.length) {
      if (firstLoad.current > 0) {
        handleFocus();
      }
      firstLoad.current = firstLoad.current + 1;
    }
  }, [JSON.stringify(newTicks)]);

  return (
    <WrapperLadders>
      <WrapperDropdown className={`${loading ? 'disable_select' : ''}`}>
        <ProjectWrapper>
          <Dropdown
            options={products}
            defaultOption={selectedProduct}
            onSelect={handleSelectProduct}
          />
        </ProjectWrapper>
        <ProjectWrapper className="group-select">
          <Dropdown
            options={groupSelectForProduct}
            defaultOption={groupSelected}
            onSelect={handleSelectGroup}
          />
        </ProjectWrapper>
      </WrapperDropdown>
      <LadderWrapper
        onMouseEnter={() => {
          newTicks?.length && setIsMouseEnter(true);
        }}
        onMouseLeave={() => setIsMouseEnter(false)}
        event={pointEvent.current}
        hover={isMouseEnter}
      >
        <LadderHeading>
          <div>
            <span>My Bids</span>
          </div>
          <div>
            <span>All Bids</span>
          </div>
          <div>
            <span>Price</span>
          </div>
          <div>
            <span>All Asks</span>
          </div>
          <div>
            <span>My Asks</span>
          </div>
        </LadderHeading>

        <WrapperLadderContent ref={refWrapperLadderContent}>
          {/* {newTicks && newTicks.length === 0 && !isConnect && (
            <p>Connect wallet to see live market.</p>
          )} */}
          <div ref={refContentLadder}>
            {!isSelectGroup &&
              newTicks.map((tick, index) => {
                if (index === newTicks?.length - 1) {
                  refFocus.current = true;
                }
                return (
                  <StyledLadder key={index} hidden={tick?.hidden || false}>
                    {tick.traderBid &&
                      (tick.traderBid.size > 0 ? (
                        <Tick
                          id={`tooltip_${index}_traderBid`}
                          hasCursor
                          data={tick.traderBid}
                          tooltip={`Cancel buy ${tick.traderBid.size}`}
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
                        id={`tooltip_${index}_tickBid`}
                        hasCursor
                        data={tick.tickBid}
                        tooltip={`Buy ${qtyGlobal} @ ${tick.tickBid.tickPrice}`}
                        onOrder={handleOrder}
                        isBackgroundBid
                        isShowBackground
                        totalSize={totalSize?.totalBid || 0}
                        totalBefore={
                          handleReturnTotalBefore(totalSize, index, true)
                            ?.totalBid
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
                        id={`tooltip_${index}_tickAsk`}
                        hasCursor
                        data={tick.tickAsk}
                        tooltip={`Sell ${qtyGlobal} @ ${tick.tickAsk.tickPrice}`}
                        onOrder={handleOrder}
                        totalSize={totalSize?.totalAsk || 0}
                        totalBefore={
                          handleReturnTotalBefore(totalSize, index, false)
                            ?.totalAsk
                        }
                        isShowBackground
                        totalSizeSecond={totalSize?.totalBid || 0}
                        isConnect={isConnect}
                        valuePrice={tick.tickPrices?.value || '0'}
                        onSelectPrice={onSelectPrice}
                      />
                    )}
                    {tick.traderAsk &&
                      (tick.traderAsk.size > 0 ? (
                        <Tick
                          id={`tooltip_${index}_traderAsk`}
                          hasCursor
                          data={tick.traderAsk}
                          tooltip={`Cancel sell ${tick.traderAsk.size}`}
                          onCancel={handleCancel}
                          isConnect={isConnect}
                          valuePrice={tick.tickPrices?.value || '0'}
                          onSelectPrice={onSelectPrice}
                        />
                      ) : (
                        <Tick
                          hasCursor={false}
                          data={tick.traderAsk}
                          isConnect={isConnect}
                          valuePrice={tick.tickPrices?.value || '0'}
                          onSelectPrice={onSelectPrice}
                        />
                      ))}
                    {tick?.isShowCollapse && (
                      <Collapse>
                        <WrapperIcon
                          onClick={() => {
                            setIsCollapse(false);
                            setIsMouseEnter(false);
                            pointEvent.current = false;
                            setTimeout(() => {
                              pointEvent.current = true;
                            }, 2000);
                            handleFocus();
                          }}
                        >
                          <img src={iconHidden} alt="icon" />
                        </WrapperIcon>
                        {isMouseEnter && hadNewData && (
                          <p className="new-data">New data</p>
                        )}
                      </Collapse>
                    )}
                  </StyledLadder>
                );
              })}
          </div>
        </WrapperLadderContent>

        <WrapperLadderGroup display={isSelectGroup ? '' : 'none'}>
          <LadderGroup
            dataLadder={cloneDeep(newTicks)}
            totalSize={totalSize}
            indexGroupSelect={indexGroupSelect}
            qtyGlobal={qtyGlobal}
            handleCancel={handleCancel}
            handleOrder={handleOrder}
            product={`${selectedProduct?.value}`.toLowerCase().trim()}
            isCollapse={isCollapse}
            onSetIsCollapse={() => {
              setIsCollapse(false);
              setIsMouseEnter(false);
              pointEvent.current = false;
              setTimeout(() => {
                pointEvent.current = true;
              }, 2000);
              handleFocus();
            }}
            isConnect={isConnect}
            onSelectPrice={onSelectPrice}
            hadNewData={hadNewData}
            isMouseEnter={isMouseEnter}
          />
        </WrapperLadderGroup>

        {!ticks?.length && (
          <WrapperLoading>
            <IconLoading isWhite />
          </WrapperLoading>
        )}
        <WrapperButton>
          <ButtonClick
            onClick={() => {
              setIsCollapse(!isCollapse);
              refFocus.current = true;
              handleFocus();
              setIsMouseEnter(false);
              setTimeout(() => {
                setIsMouseEnter(true);
              }, 2000);
            }}
          >
            <img src={isCollapse ? iconHidden : iconUnHidden} alt="icon" />
          </ButtonClick>
          <ButtonClick
            onClick={() => {
              refFocus.current = true;
              handleFocus();
            }}
          >
            <img src={iconFocus} alt="icon" />
          </ButtonClick>
        </WrapperButton>
      </LadderWrapper>
    </WrapperLadders>
  );
};

export default memo(Ladder);
