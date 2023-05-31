import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { toastUICancelOrder, toastUISenOrder } from '@utils/notify';
import { traderFunction } from '@contexts/walletContext';
import { useWallet } from '@hooks/useWallet';
import Dropdown from '@components/Dropdown';
import IconLoading from '@components/IconLoading';
import Tick from './Tick';
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
  const firstLoad = useRef(false);

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
    firstLoad.current = false;
    setIsCollapse(true);
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
  const handleFocus = (firstLoad = false) => {
    if (refWrapperLadderContent.current) {
      const ladderContent = refWrapperLadderContent.current;
      if (newTicks.length) {
        const top = firstLoad
          ? (newTicks.length / 2) * 8
          : (newTicks.length / 2 / 2) * 18;
        ladderContent.scroll({
          top: top,
          behavior: 'smooth',
        });
      }
    }
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
  }, [newTicks, ticks]);

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
    if (!isCollapse) {
      setNewTicks(ticks);
      return;
    }

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
  }, [ticks, isCollapse]);

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
    if (!firstLoad.current && !!newTicks?.length) {
      firstLoad.current = true;
      handleFocus(true);
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
      <LadderWrapper>
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
          {!isSelectGroup &&
            newTicks.map((tick, index) => {
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
                      />
                    ) : (
                      <Tick hasCursor={false} data={tick.traderBid} />
                    ))}
                  {tick.tickBid && (
                    <Tick
                      id={`tooltip_${index}_tickBid`}
                      hasCursor
                      data={tick.tickBid}
                      tooltip={`Buy ${
                        tick.tickBid.value > 0 ? tick.tickBid.value : qtyGlobal
                      } @ ${tick.tickBid.tickPrice}`}
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
                    />
                  )}
                  {tick.tickPrices && (
                    <Tick
                      hasCursor={false}
                      data={tick.tickPrices}
                      index={index}
                    />
                  )}
                  {tick.tickAsk && (
                    <Tick
                      id={`tooltip_${index}_tickAsk`}
                      hasCursor
                      data={tick.tickAsk}
                      tooltip={`Sell ${
                        tick.tickAsk.value > 0 ? tick.tickAsk.value : qtyGlobal
                      } @ ${tick.tickAsk.tickPrice}`}
                      onOrder={handleOrder}
                      totalSize={totalSize?.totalAsk || 0}
                      totalBefore={
                        handleReturnTotalBefore(totalSize, index, false)
                          ?.totalAsk
                      }
                      isShowBackground
                      totalSizeSecond={totalSize?.totalBid || 0}
                      isConnect={isConnect}
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
                      />
                    ) : (
                      <Tick
                        hasCursor={false}
                        data={tick.traderAsk}
                        isConnect={isConnect}
                      />
                    ))}
                  {tick?.isShowCollapse && (
                    <Collapse>
                      <WrapperIcon onClick={() => setIsCollapse(false)}>
                        <img src={iconHidden} alt="icon" />
                      </WrapperIcon>
                    </Collapse>
                  )}
                </StyledLadder>
              );
            })}
        </WrapperLadderContent>

        {!!isSelectGroup && (
          <WrapperLadderGroup>
            <LadderGroup
              dataLadder={newTicks}
              totalSize={totalSize}
              indexGroupSelect={indexGroupSelect}
              qtyGlobal={qtyGlobal}
              handleCancel={handleCancel}
              handleOrder={handleOrder}
              product={`${selectedProduct?.value}`.toLowerCase().trim()}
              isCollapse={isCollapse}
              onSetIsCollapse={setIsCollapse}
            />
          </WrapperLadderGroup>
        )}
        {!ticks?.length && (
          <WrapperLoading>
            <IconLoading isWhite />
          </WrapperLoading>
        )}
      </LadderWrapper>

      <WrapperButton>
        <ButtonClick
          onClick={() => {
            setIsCollapse(!isCollapse);
            handleFocus();
          }}
        >
          <img src={isCollapse ? iconHidden : iconUnHidden} alt="icon" />
        </ButtonClick>
        <ButtonClick onClick={handleFocus} disabled={isCollapse}>
          <img src={iconFocus} alt="icon" />
        </ButtonClick>
      </WrapperButton>
    </WrapperLadders>
  );
};

export default memo(Ladder);
