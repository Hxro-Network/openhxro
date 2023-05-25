import React, { memo, useMemo, useState } from 'react';
import { Modal } from '@mui/material';
import ContentDeposit from '@components/Header/Components/ContentDeposit';
import ContentWithdraw from '@components/Header/Components/ContentWithdraw';
import {
  WrapperModal,
  WrapperTab,
  Tab,
  WrapperContentModal,
  Title,
  ContentModal,
} from './Modal.style';

function ModalComponent({ open, onClose }) {
  const [tabSelect, setTabSelect] = useState('deposit');

  const returnContentDeposit = useMemo(() => {
    return <ContentDeposit onClose={onClose} />;
  }, []);

  const returnContentWithdraw = useMemo(() => {
    return <ContentWithdraw onClose={onClose} />;
  }, []);

  return (
    <WrapperModal>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          outline: 'none',
        }}
      >
        <ContentModal>
          <Title>Manage Balances</Title>
          <WrapperTab>
            <Tab
              color={tabSelect === 'deposit' ? '#A7273D' : null}
              onClick={() => {
                setTabSelect('deposit');
              }}
            >
              Deposit
            </Tab>
            <Tab
              color={tabSelect === 'withdraw' ? '#0B7CB6' : null}
              onClick={() => {
                setTabSelect('withdraw');
              }}
            >
              Withdraw
            </Tab>
          </WrapperTab>
          <WrapperContentModal>
            {tabSelect === 'deposit' && returnContentDeposit}
            {tabSelect === 'withdraw' && returnContentWithdraw}
          </WrapperContentModal>
        </ContentModal>
      </Modal>
    </WrapperModal>
  );
}

export default memo(ModalComponent);
