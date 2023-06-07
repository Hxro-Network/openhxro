import React, { memo } from 'react';
import { toast } from 'react-toastify';
import { traderFunction } from '@contexts/walletContext';
import { toastUICancelOrder } from '@utils/notify';
import Button from '@components/Button';
import {
  WrapperButton,
  WrapperOrdersContent,
  WrapperRowContent,
  WrapperTitle,
  ContentOrders,
  Label,
  Title,
  WrapperLabel,
} from './ContentOrder.style';
import IconCopy from '../../../../../IconCopy';

function ContentOrder({ dataOrders, productsListKey }) {
  const TITLE_LIST = ['Instrument', 'Side', 'Qty', 'Price', 'ID', 'button'];

  const handleClickCancel = (product, id) => {
    const idToast = toast.loading(toastUICancelOrder.loading, {
      closeButton: true,
    });
    try {
      const index =
        productsListKey.findIndex(
          (item) => `${item}`.trim() === `${product}`.trim()
        ) || 0;

      traderFunction.cancelOrders(index, [id], (id, value) => {
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
    } catch (error) {
      toast.update(idToast, toastUICancelOrder.error('Error!'));
    }
  };

  const handleReturnPrice = (price, instrument) => {
    if (!price || !instrument) {
      return '-';
    }
    if (`${instrument}`.toLowerCase().includes('eth')) {
      return ((price * 1) / 100).toFixed(1);
    }
    if (`${instrument}`.toLowerCase().includes('sol')) {
      return ((price * 1) / 1000000).toFixed(3);
    }
    return price;
  };

  const handleCancelAll = () => {
    traderFunction.cancelAllOrders();
  };

  return (
    <WrapperOrdersContent>
      <WrapperLabel>
        <Label>Orders</Label>
        {!!dataOrders?.length && (
          <Button className="button-cancel-all" onClick={handleCancelAll}>
            Cancel All
          </Button>
        )}
      </WrapperLabel>
      <WrapperTitle>
        {TITLE_LIST.map((item, index) => {
          return (
            <Title
              key={index}
              className={item.trim().toLowerCase().replace(/\s+/g, '-')}
            >
              {item}
            </Title>
          );
        })}
      </WrapperTitle>
      <ContentOrders>
        {!!dataOrders?.length &&
          dataOrders.map((item) => {
            const len = `${item?.id}`.length;
            return (
              <WrapperRowContent
                color={
                  `${item?.side}`.toLowerCase() === 'sell'
                    ? '#E3627D'
                    : '#47C5D8'
                }
                key={item?.id}
                index={0}
              >
                <p className="instrument">{item?.instrument?.toString()}</p>
                <p className="side">{item?.side?.toString()}</p>
                <p className="qty">{item?.qty?.toString()}</p>
                <p className="price">
                  {handleReturnPrice(
                    item?.price?.toString(),
                    item?.instrument?.toString()
                  )}
                </p>
                <div className="id">
                  {`${item?.id}`.substring(len - 4, len)}
                  <IconCopy className="icon-copy" value={`${item?.id}`} />
                </div>
                <WrapperButton className="button">
                  <Button
                    className="style-button button-cancel"
                    onClick={() =>
                      handleClickCancel(item?.instrument?.toString(), item?.id)
                    }
                  >
                    Cancel
                  </Button>
                </WrapperButton>
              </WrapperRowContent>
            );
          })}
      </ContentOrders>
    </WrapperOrdersContent>
  );
}

export default memo(ContentOrder);
