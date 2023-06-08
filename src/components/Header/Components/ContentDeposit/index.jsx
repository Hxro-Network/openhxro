import React, { memo, useState } from 'react';
import { traderFunction } from '@contexts/walletContext';
import Button from '@components/Button';
import SelectCoin from '../SelectCoin';
import {
  Label,
  LabelNote,
  Title,
  TitleRow,
  ValueRow,
  WrapperButtonConfirm,
  WrapperContentDeposit,
  // WrapperContentRows,
  WrapperRow,
  WrapperTitle,
} from './ContentDeposit.style';
import { useWallet } from '../../../../hooks/useWallet';

function ContentDeposit({ onClose }) {
  const { cashBalance, USDBalance } = useWallet();
  const [value, setValue] = useState('');

  const handleConfirm = async () => {
    if (!value || `${value}`.includes('e')) {
      return;
    }
    try {
      await traderFunction.deposit(value, () => {
        onClose();
        traderFunction.trader.updateVarianceCache();
      });
    } catch (error) {
      onClose();
    }
  };
  return (
    <WrapperContentDeposit>
      {/* <Label>
        Deposited assets automatically earn yield through lending.{' '}
        <a href="/" className="link-more">
          Learn more.
        </a>
      </Label> */}

      <WrapperTitle>
        <Title>Transfer type and Amount</Title>
        {/* <LabelNote>Deposit APR 1.3015% </LabelNote> */}
      </WrapperTitle>
      <SelectCoin value={value} handleOnChange={setValue} />

      <WrapperRow>
        <TitleRow>Wallet Balance</TitleRow>
        <ValueRow>{(USDBalance * 1).toFixed(2)} USDC</ValueRow>
      </WrapperRow>
      {/* <WrapperRow>
          <TitleRow>Global USDC Deposits / Max</TitleRow>
          <ValueRow>2.12M / 10.0M</ValueRow>
        </WrapperRow> */}

      {/* <WrapperRow>
        <TitleRow>Cash balance</TitleRow>
        <ValueRow>{(cashBalance * 1).toFixed(2)} USDC</ValueRow>
      </WrapperRow> */}
      {/* <WrapperRow>
        <TitleRow>Net Account Balance (USD)</TitleRow>
        <ValueRow>$0.00</ValueRow>
      </WrapperRow> */}

      <WrapperButtonConfirm>
        <Button className={'button-confirm'} onClick={handleConfirm}>
          Confirm
        </Button>
      </WrapperButtonConfirm>
    </WrapperContentDeposit>
  );
}

export default memo(ContentDeposit);
