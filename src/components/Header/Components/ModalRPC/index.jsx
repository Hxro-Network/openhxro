import React, { useEffect, useRef, useState } from 'react';
import { Modal } from '@mui/material';
import Button from '@components/Button';
import {
  WrapperModal,
  WrapperTab,
  Title,
  ContentModal,
  InputRPC,
} from './Modal.style';
import { WrapperButtonConfirm } from '../ContentDeposit/ContentDeposit.style';

function ModalRPC({ open, onClose, walletConnect }) {
  const [valueInput, setValueInput] = useState('');
  const refInput = useRef();
  useEffect(() => {
    setTimeout(() => {
      const input = refInput.current;
      if (open && input) {
        input.focus();
      }
    }, 500);
  }, [open]);

  const handleConfirm = () => {
    try {
      var regex = /^(https?|http):\/\/[^\s/$.?#].[^\s]*$/;
      if (!valueInput || !regex.test(valueInput)) return;
      localStorage.setItem('rpc', valueInput);
      localStorage.setItem('provider', walletConnect);
      window.location.reload();
    } catch (er) {
      onClose();
    }
  };

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
          <Title>Import RPC</Title>
          <WrapperTab>
            <InputRPC
              ref={refInput}
              value={valueInput}
              onChange={(e) => setValueInput(e.target?.value)}
            />
          </WrapperTab>
          <WrapperButtonConfirm>
            <Button className={'button-confirm'} onClick={handleConfirm}>
              Confirm
            </Button>
          </WrapperButtonConfirm>
        </ContentModal>
      </Modal>
    </WrapperModal>
  );
}

export default ModalRPC;
