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
} from './ContentWithdraw.style';
import { useWallet } from '../../../../hooks/useWallet';
import { handleRenderValue } from '../ContentHeader';

function ContentWithdraw({ onClose }) {
  const [valueWithdraw, setValueWithdraw] = useState('');
  const { dataPnL, USDBalance } = useWallet();

  const handleConfirm = () => {
    if (!valueWithdraw || `${valueWithdraw}`.includes('e')) {
      return;
    }
    try {
      traderFunction.withdraw(valueWithdraw, () => {
        onClose();
      });
    } catch (error) {
      onClose();
    }
  };

  return (
    <WrapperContentDeposit>
      <Label>Transfer type and Amount</Label>

      <WrapperTitle>
        <Title>Transfer type and Amount</Title>
        <LabelNote>
          Available: {handleRenderValue(dataPnL?.portfolio)} USDC
        </LabelNote>
      </WrapperTitle>
      <SelectCoin value={valueWithdraw} handleOnChange={setValueWithdraw} />

      <WrapperRow>
        <TitleRow>Wallet Balance</TitleRow>
        <ValueRow>{(USDBalance * 1).toFixed(2)} USDC</ValueRow>
      </WrapperRow>
      <WrapperRow>
        <TitleRow>Withdrawal limit</TitleRow>
        <ValueRow>${dataPnL?.withdrawable || '-'} USDC</ValueRow>
      </WrapperRow>

      {/* <WrapperRow>
        <TitleRow>Collateral</TitleRow>
        <ValueRow>{(cashBalance * 1).toFixed(2)} USDC</ValueRow>
      </WrapperRow> */}

      <WrapperButtonConfirm>
        <Button className={'button-confirm'} onClick={handleConfirm}>
          Confirm
        </Button>
      </WrapperButtonConfirm>
    </WrapperContentDeposit>
  );
}
export default memo(ContentWithdraw);
