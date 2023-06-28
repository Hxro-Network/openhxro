import React, { memo, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { toastUISenOrder } from '@utils/notify';
import { traderFunction } from '@contexts/walletContext';
import { useWallet } from '@hooks/useWallet';
import { VALUE_BET } from '@utils/constants';
import Button from '@components/Button';
import Input from '@components/Input';
import Estimated from './Components/Estimated';
import {
  WrapperSweep,
  WrapperQuantity,
  Title,
  ButtonClear,
  TableValueBet,
  ValueBet,
  GroupButton,
} from './Sweep.style';
import { useMemo } from 'react';

function Sweep() {
  const {
    qtyGlobal,
    setQtyGlobal,
    productIndex,
    markPrice,
    isConnect,
    productSelect,
  } = useWallet();
  const PADDING = 1000000;

  const [toler, setToler] = useState('0.1');
  const [price, SetPrice] = useState('-');

  const handleReturnProduct = (product) => {
    if (`${product}`.toLowerCase().includes('eth')) {
      return 'eth';
    }
    if (`${product}`.toLowerCase().includes('sol')) {
      return 'sol';
    }
    return 'btc';
  };

  const valueBet = useMemo(() => {
    return VALUE_BET[`${handleReturnProduct(productSelect)}`] || [];
  }, [productSelect]);

  useEffect(() => {
    setQtyGlobal(valueBet?.[0]);
  }, [productSelect]);

  const handleClickItem = (value) => {
    const newValue =
      Math.round(qtyGlobal * PADDING) + Math.round(value * PADDING);
    setQtyGlobal(`${newValue / PADDING}`);
    return;
  };

  const handleClickBuy = () => {
    const idToast = toast.loading(toastUISenOrder.loading);
    try {
      if (traderFunction && traderFunction.trader && markPrice !== '-') {
        let newPrice = (price * toler) / 100 + price;
        const newOrderSend = {
          price: `${(newPrice * 1).toFixed(0)}`,
          quantity: qtyGlobal,
          productIndex: productIndex,
          isIOC: true,
        };
        traderFunction.sendOrder(newOrderSend, true, (id, value) => {
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
        });
      }
    } catch (error) {
      toast.update(idToast, toastUISenOrder.error('Error!'));
    }
  };

  const handleClickSell = () => {
    const idToast = toast.loading(toastUISenOrder.loading);
    try {
      if (traderFunction && traderFunction.trader && markPrice !== '-') {
        let newPrice = price - (price * toler) / 100;
        const newOrderSend = {
          price: `${(newPrice * 1).toFixed(0)}`,
          quantity: qtyGlobal,
          productIndex: productIndex,
          isIOC: true,
        };
        traderFunction.sendOrder(newOrderSend, false, (id, value) => {
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
        });
      }
    } catch (error) {
      toast.update(idToast, toastUISenOrder.error('Error!'));
    }
  };

  const disableButton =
    !isConnect || !price || qtyGlobal === '0' || qtyGlobal === '';

  return (
    <WrapperSweep>
      <WrapperQuantity>
        <Title> Quantity</Title>
        <Input
          type="number"
          value={qtyGlobal}
          onChange={(e) => {
            setQtyGlobal(e?.target?.value || '');
          }}
          className="input"
        />
      </WrapperQuantity>
      <WrapperQuantity>
        <Title> Slippage Tolerance</Title>
        <Input
          type="number"
          percent
          value={toler}
          onChange={(e) => {
            setToler(e?.target?.value || '');
          }}
          className="input"
        />
      </WrapperQuantity>
      <Estimated onSetPrice={SetPrice} />
      <TableValueBet>
        {valueBet.map((item, index) => {
          return (
            <ValueBet key={index} onClick={() => handleClickItem(item)}>
              {item}
            </ValueBet>
          );
        })}
      </TableValueBet>
      <ButtonClear
        onClick={() => {
          setQtyGlobal(valueBet?.[0]);
        }}
      >
        Clear
      </ButtonClear>
      <GroupButton>
        <Button
          className="button-buy"
          disable={disableButton}
          onClick={handleClickBuy}
        >
          Buy
        </Button>
        <Button
          className="button-sell"
          disable={disableButton}
          onClick={handleClickSell}
        >
          Sell
        </Button>
      </GroupButton>
    </WrapperSweep>
  );
}

export default memo(Sweep);
