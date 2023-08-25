import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useWallet } from '@hooks/useWallet';
import Button from '@components/Button';
import IconLoading from '@components/IconLoading';
import ModalComponent from './Components/Modal';
import ContentHeader from './Components/ContentHeader';
import { traderFunction } from '@contexts/walletContext';
import {
  AddressWallet,
  ButtonCreateAccount,
  GroupButton,
  StyledHeader,
  WrapperButtonCreateAccount,
  WrapperGroupButton,
  WrapperRerRefresh,
  WrapperSelect,
  ButtonOrderConnect,
} from './Header.style';
import { shortPkStr } from '../../utils';
import IconCopy from '../IconCopy';
import ModalRPC from './Components/ModalRPC';

const Header = () => {
  const LIST_NETWORK = ['Mainnet', 'Devnet'];
  const LIST_WALLET = ['Phantom', 'Solflare'];

  const {
    isConnect,
    dataPnL,
    connectWallet,
    disableConnectWallet,
    netWorkConnect,
    setNetWorkConnect,
    setWalletConnect,
    walletConnect,
    accountSelect,
    setAccountSelect,
    setLoading,
    loading,
  } = useWallet();
  const [dataWallet, setDataWallet] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [openModalRPC, setOpenModalRPC] = useState(false);
  const refTimeOut = useRef();
  const rpc_custom = localStorage.getItem('rpc_custom') || '';

  useEffect(() => {
    const provider = localStorage.getItem('provider');
    if (provider === 'phantom' || provider === 'solflare') {
      refTimeOut.current = setTimeout(() => {
        setLoading(true);
      }, 2000);
    }
    setDataWallet(dataPnL);

    if (Object.keys(dataPnL).length) {
      setLoading(false);
      window.clearTimeout(refTimeOut.current);
    }

    const handleDisConnect = () => {
      setLoading(false);
    };
    window.addEventListener('disconnect', handleDisConnect);
    return () => {
      window.clearTimeout(refTimeOut.current);
      window.removeEventListener('disconnect', handleDisConnect);
    };
  }, [dataPnL]);

  useEffect(() => {
    if (!accountSelect) {
      setAccountSelect(dataPnL?.listAccounts?.[0] || '');
    }
  }, [JSON.stringify(dataPnL.listAccounts || []), accountSelect]);

  const handleClickConnect = () => {
    setLoading(true);
    connectWallet?.(walletConnect);
  };

  const handleClickDisconnect = () => {
    disableConnectWallet?.();
  };

  const formatWallet = (wallet) => {
    if (!wallet || wallet === 'null') {
      return '';
    }
    const lentWallet = wallet.length;

    return `${wallet.substring(0, 5)}***${wallet.substring(
      lentWallet - 5,
      lentWallet
    )}`;
  };

  const headerContent = useMemo(() => {
    return <ContentHeader dataWallet={dataWallet} />;
  }, [JSON.stringify(dataWallet)]);

  const handleRefresh = async () => {
    try {
      if (traderFunction && traderFunction.trader) {
        if (refTimeOut.current) {
          window.clearTimeout(refTimeOut.current);
        }
        setRefresh(!refresh);
        setTimeout(() => {
          setRefresh(false);
        }, 3000);
        traderFunction.trader.updateVarianceCache();
      }
    } catch (error) {
      setRefresh(false);
    }
  };

  const handleClickWalletPubkey = () => {
    window.open(
      `${process.env.URL_SOLANA}${dataPnL?.walletPubkeyHref}`,
      '_blank'
    );
  };

  const renderModal = useMemo(() => {
    return (
      <ModalComponent
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    );
  }, [openModal]);

  const renderModalRPC = useMemo(() => {
    return (
      <ModalRPC
        open={openModalRPC}
        onClose={() => {
          setOpenModalRPC(false);
        }}
      />
    );
  }, [openModalRPC]);

  return (
    <StyledHeader>
      {isConnect && (
        <WrapperRerRefresh onClick={handleRefresh} refresh={refresh}>
          <IconLoading isWhite isturn={refresh} />
        </WrapperRerRefresh>
      )}
      {headerContent}
      <WrapperGroupButton>
        <GroupButton>
          <WrapperSelect isshow={`${isConnect}`}>
            <select
              value={accountSelect}
              className={`select-content ${
                isConnect ? 'select-content-show' : 'select-content-hidden'
              }`}
              id="select-account"
              onChange={(e) => setAccountSelect(e?.target?.value || '')}
            >
              <option
                value=""
                defaultValue
                disabled
                hidden
                className="option-content"
              >
                Account...
              </option>
              {!!dataWallet?.listAccounts?.length &&
                dataWallet.listAccounts.map((item) => {
                  return (
                    <option
                      value={item || ''}
                      className="option-content"
                      key={item}
                    >
                      {formatWallet(item || '')}
                    </option>
                  );
                })}
            </select>
            {isConnect && (
              <IconCopy className="icon-copy" value={`${accountSelect}`} />
            )}
          </WrapperSelect>

          {/* select connect wallet */}
          {!isConnect && (
            <WrapperSelect disabled={loading}>
              <select
                value={walletConnect}
                className="select-content"
                onChange={(e) => {
                  setWalletConnect(e?.target.value);
                }}
              >
                <option
                  value=""
                  defaultValue
                  disabled
                  hidden
                  className="option-content"
                >
                  Wallet
                </option>
                {LIST_WALLET.map((item) => {
                  return (
                    <option value={item} key={item} className="option-content">
                      {item}
                    </option>
                  );
                })}
              </select>
            </WrapperSelect>
          )}

          {/* select network */}
          {!isConnect && (
            <WrapperSelect disabled={loading}>
              <select
                value={netWorkConnect}
                className="select-content"
                onChange={(e) => {
                  setNetWorkConnect(e?.target.value);
                }}
              >
                <option
                  value=""
                  defaultValue
                  disabled
                  hidden
                  className="option-content"
                >
                  Network
                </option>
                {LIST_NETWORK.map((item) => {
                  return (
                    <option value={item} key={item} className="option-content">
                      {item}
                    </option>
                  );
                })}
              </select>
            </WrapperSelect>
          )}

          {isConnect && (
            <Button
              className="button-deposit"
              onClick={() => {
                dataWallet?.walletPubkey && setOpenModal(true);
              }}
            >
              Deposit/Withdraw
            </Button>
          )}
          {!isConnect && (
            <ButtonOrderConnect
              onClick={() => {
                if (rpc_custom) {
                  localStorage.removeItem('rpc_custom');
                  window.location.reload();
                  return;
                }
                setOpenModalRPC(true);
              }}
            >
              {rpc_custom ? 'Reset RPC' : 'Custom RPC'}
            </ButtonOrderConnect>
          )}
          <Button
            className="connect-wallet"
            onClick={() => {
              loading
                ? ''
                : dataWallet?.walletPubkey
                ? handleClickDisconnect()
                : handleClickConnect();
            }}
          >
            {dataWallet?.walletPubkey ? 'Disconnect wallet' : 'Connect Wallet'}
            {loading && <IconLoading />}
          </Button>
        </GroupButton>

        <AddressWallet hidden={!!dataPnL?.walletPubkey}>
          <WrapperButtonCreateAccount className="wrapper-button-creating-account">
            <ButtonCreateAccount id="button-creating-account">
              New Trading Account
            </ButtonCreateAccount>
            <IconLoading />
          </WrapperButtonCreateAccount>
          <div className="description">
            Connected to Mainnet via{' '}
            {localStorage.getItem('provider') === 'phantom'
              ? 'Phantom'
              : localStorage.getItem('provider')}{' '}
            Wallet:
            {dataPnL?.walletPubkey && (
              <p onClick={handleClickWalletPubkey}>
                {shortPkStr(dataPnL?.walletPubkey)}
              </p>
            )}
          </div>
        </AddressWallet>
      </WrapperGroupButton>
      {renderModal}
      {renderModalRPC}
    </StyledHeader>
  );
};

export default memo(Header);
