import React, { useEffect } from 'react';
import { Modal } from '@mui/material';
import {
  ContentModal,
  Label,
  LabelNote,
  Title,
  WrapperAccount,
  WrapperContentModal,
} from './ManageAccounts.style';
import Icon from '../../../../assets/delete-icon.svg';
import Button from '@components/Button';
import IconLoading from '@components/IconLoading';
import { useState } from 'react';
import { traderFunction } from '@contexts/walletContext';

export default function ManageAccounts({ open, onClose, listAccount = [] }) {
  const [loading, setLoading] = useState(false);

  const handleCancelCreateAccount = () => {
    setLoading(false);
  };

  const handleCreateAccountSuccess = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (window) {
      window.addEventListener(
        'cancel-created-account',
        handleCancelCreateAccount
      );

      window.addEventListener(
        'created-account-success',
        handleCreateAccountSuccess
      );
    }

    return () => {
      window.removeEventListener(
        'created-account-success',
        handleCreateAccountSuccess
      );
      window.removeEventListener(
        'cancel-created-account',
        handleCancelCreateAccount
      );
    };
  }, []);

  const handleFormatAccount = (account) => {
    if (!account) {
      return account;
    }
    return `${account.slice(0, 10)}...${account.slice(
      account.length - 5,
      account.length
    )}`;
  };

  const handleClose = () => {
    onClose();
    setLoading(false);
  };

  const handleClickCreateAccount = () => {
    if (traderFunction && typeof traderFunction !== 'undefined') {
      setLoading(true);
      if (window) {
        const creating = new Event('create-account');
        window.dispatchEvent(creating);
      }
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          outline: 'none',
        }}
      >
        <ContentModal>
          <Title>Manage Trading Account</Title>
          <WrapperContentModal>
            {!!listAccount?.length && <Label>List account:</Label>}
            {!!listAccount?.length &&
              listAccount.map((item) => {
                return (
                  <WrapperAccount key={item}>
                    <p>
                      <span></span> {handleFormatAccount(item)}
                    </p>
                    <img src={Icon} alt="Icon" />
                  </WrapperAccount>
                );
              })}
            <LabelNote>
              Create a new TRG costs 0.5 SOL but you will get it back when the
              account is closed.
            </LabelNote>
            <Button
              id="button-creating-account"
              disable={loading}
              onClick={handleClickCreateAccount}
            >
              {loading ? 'Confirming transactions...' : 'Create new account'}{' '}
              {loading && <IconLoading isWhite />}
            </Button>
          </WrapperContentModal>
        </ContentModal>
      </Modal>
    </div>
  );
}
