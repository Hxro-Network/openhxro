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

function ModalRPC({ open, onClose }) {
  const [valueInput, setValueInput] = useState('');
  const refInput = useRef();
  useEffect(() => {
    const rpc_custom = localStorage.getItem('rpc_custom');
    if (rpc_custom) {
      setValueInput(rpc_custom);
    }
    if (!open) {
      setValueInput('');
    }
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

      if (valueInput && !regex.test(valueInput)) {
        return;
      }
      if (!valueInput) {
        localStorage.removeItem('rpc_custom');
      } else {
        localStorage.setItem('rpc_custom', valueInput);
      }

      onClose();
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
          <Title>Input Your RPC </Title>
          <WrapperTab>
            <InputRPC
              ref={refInput}
              value={valueInput}
              onChange={(e) => setValueInput(e.target?.value)}
            />
            {valueInput && (
              <div className="icon-remove" onClick={() => setValueInput('')}>
                x
              </div>
            )}
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
