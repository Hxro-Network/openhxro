import React, { memo, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { toastUISenOrder } from '@utils/notify';
import { VALUE_BET } from '@utils/constants';
import { traderFunction } from '@contexts/walletContext';
import { useWallet } from '@hooks/useWallet';
import Button from '@components/Button';
import Input from '@components/Input';
import {
  ButtonClear,
  GroupButton,
  Title,
  ValueBet,
  WrapperQuantity,
  WrapperSelectOrderType,
} from './Mode.style';
import { useMemo } from 'react';
import { useEffect } from 'react';

function Mode() {
  const {
    qtyGlobal,
    setQtyGlobal,
    productIndex,
    isConnect,
    productSelect,
    priceSelect,
  } = useWallet();
  const PADDING = 1000000;
  const [orderType, setOrderType] = useState('Limit');

  const OPTION_ORDER_TYPE = ['Limit', 'ImmediateOrCancel'];

  const [price, setPrice] = useState(priceSelect);

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

  useEffect(() => {
    setPrice(priceSelect);
  }, [priceSelect]);

  const handleClickItem = (value) => {
    const newValue =
      Math.round(qtyGlobal * PADDING) + Math.round(value * PADDING);
    setQtyGlobal(`${newValue / PADDING}`);
    return;
  };

  const handleClickSell = () => {
    if (!isConnect) {
      return;
    }
    const idToast = toast.loading(toastUISenOrder.loading);
    try {
      const newOrderSend = {
        price: price,
        quantity: qtyGlobal,
        productIndex: productIndex,
        isIOC: orderType !== 'Limit',
      };
      if (traderFunction && traderFunction.trader) {
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
    } catch (er) {
      toast.update(idToast, toastUISenOrder.error('Error!'));
    }
  };

  const handleClickBuy = () => {
    if (!isConnect) {
      return;
    }
    const idToast = toast.loading(toastUISenOrder.loading);
    try {
      const newOrderSend = {
        price: price,
        quantity: qtyGlobal,
        productIndex: productIndex,
        isIOC: orderType !== 'Limit',
      };
      if (traderFunction && traderFunction.trader) {
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

  const disableButton =
    !isConnect || !price || qtyGlobal === '0' || qtyGlobal === '';

  return (
    <WrapperMode>
      <WrapperQuantity>
        <Title> Quantity</Title>
        <Input
          type="number"
          value={qtyGlobal}
          onChange={(e) => {
            setQtyGlobal(e?.target?.value || '');
          }}
        />
      </WrapperQuantity>
      <WrapperQuantity>
        <Title> Price</Title>
        <Input
          type="number"
          min={1}
          value={price}
          onChange={(e) => {
            setPrice(e?.target?.value || '');
          }}
        />
      </WrapperQuantity>
      <WrapperQuantity>
        <Title> Order Type</Title>
        <WrapperSelectOrderType>
          <select
            value={orderType.value}
            className="select-content"
            onChange={(e) => {
              setOrderType(e?.target.value);
            }}
          >
            <option
              className="option-content"
              value=""
              defaultValue
              disabled
              hidden
            >
              Network
            </option>
            {OPTION_ORDER_TYPE.map((item) => {
              return (
                <option value={item} key={item} className="option-content">
                  {item}
                </option>
              );
            })}
          </select>
        </WrapperSelectOrderType>
      </WrapperQuantity>
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
          setPrice('');
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
    </WrapperMode>
  );
}

export default memo(Mode);

const WrapperMode = styled.div`
  width: 100%;
  height: 100%;
`;
const TableValueBet = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
`;
