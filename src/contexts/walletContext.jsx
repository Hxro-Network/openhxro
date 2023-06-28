import { useEffect, useState, createContext, useRef } from 'react';
import TraderFunction from '@utils/trader';
import * as markets from '@utils/markets';
import { Ladder } from '@utils/ladder';
import { Feed } from '@utils/feeds';

export const WalletContext = createContext({
  dataPnL: '',
  walletPubkey: '',
  walletAddress: '',
  connectWallet: () => {},
  disableConnectWallet: () => {},
  dataOrders: [],
  dataPosition: [],
  dataMarket: {},
  productsListKey: [process.env.MAINNET_PRODUCT_NAME],
  productSelect: process.env.MAINNET_PRODUCT_NAME,
  isConnect: false,
  netWorkConnect: localStorage.getItem('network'),
  fundingRateList: {},
  loading: false,
  priceSelect: '',
  // yourFillList: [],
});

export const traderFunction = new TraderFunction();

export const WalletProvider = ({ children }) => {
  const [dataPnL, setDataPnL] = useState({});
  const [dataOrders, setDataOrders] = useState([]);
  const [dataPosition, setDataPosition] = useState([]);
  const [dataMarket, setDataMarket] = useState({});
  const [dataLadder, setDataLadder] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productsListKey, setProductsListKey] = useState([
    process.env.MAINNET_PRODUCT_NAME,
  ]);
  const [productSelect, setProductSelect] = useState(
    process.env.MAINNET_PRODUCT_NAME
  );
  const [productIndex, setProductIndex] = useState(0);
  const [netWorkConnect, setNetWorkConnect] = useState(
    localStorage.getItem('network') || process.env.MAINNET_NETWORK
  );

  const [walletConnect, setWalletConnect] = useState(
    localStorage.getItem('provider') || process.env.MAINNET_WALLET
  );
  // const [yourFillList, setYourFillList] = useState([]);
  const [accountSelect, setAccountSelect] = useState('');
  const [isConnect, setIsContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markPrice, setMarkPrice] = useState('-');
  const [markPriceList, setMarkPriceList] = useState({});
  const [cashBalance, setCashBalance] = useState('');
  const [indexPriceList, setIndexPriceList] = useState({});
  const [fundingRateList, setFundingRateList] = useState({});
  const [qtyGlobal, setQtyGlobal] = useState('');
  const [USDBalance, setUSDBalance] = useState(0);
  const [priceSelect, setPriceSelect] = useState('');

  const refIsConnect = useRef(false);
  const refTimeOut = useRef(null);
  const refTimeOutGetLadder = useRef(null);
  const refTimeOutGetLadderNoneWallet = useRef(null);
  const refInterValGetLadderNoneWallet = useRef(null);
  const refIsDisconnect = useRef(true);

  // const refTimeOutGetYourFills = useRef(null);

  const refRenderLadder = useRef();

  useEffect(() => {
    let rpc = '';
    if (netWorkConnect === 'Mainnet') {
      rpc = process.env.MAINNET_NETWORK_URL;
    }
    if (netWorkConnect === 'Devnet') {
      rpc = process.env.DEVNET_NETWORK_URL;
    }
    localStorage.setItem('rpc', rpc);
    localStorage.setItem('network', netWorkConnect);

    const provider = localStorage.getItem('provider');
    if (
      (provider === 'phantom' || provider === 'solflare') &&
      !dataPnL.length &&
      (netWorkConnect === process.env.MAINNET_NETWORK ||
        netWorkConnect === process.env.DEVNET_NETWORK) &&
      (rpc == process.env.MAINNET_NETWORK_URL ||
        rpc === process.env.DEVNET_NETWORK_URL)
    ) {
      window.clearTimeout(refTimeOutGetLadderNoneWallet.current);
      if (refTimeOut.current) {
        window.clearTimeout(refTimeOut.current);
      }
      refTimeOut.current = setTimeout(() => {
        refTimeOut.current = undefined;
        connectWallet(provider);
      }, 2000);
      return;
    } else {
      localStorage.setItem('rpc', rpc);
      localStorage.setItem('network', netWorkConnect);
    }
    return () => {
      window.clearTimeout(refTimeOut.current);
    };
  }, [netWorkConnect]);

  /**
   * Create new Ladder according to information of Market and Trader
   * @param {*} market
   * @param {*} trader
   * @returns ladder contains ladder's attributes
   */
  const createLadder = async (
    market,
    trader = null,
    productList,
    isConnect
  ) => {
    if (!market || !trader) return;
    await market?.updateBook();
    const ladder = await new Ladder(
      await new Feed(market, null, traderFunction, productList),
      trader,
      traderFunction,
      isConnect
    );
    if (ladder?.feed) {
      await ladder?.feed?.kill();
      ladder.feed.onMarkPrices = async () => {
        ladder?.getDataLadder();
      };
    }
    return ladder;
  };

  /**
   * Get Ladder's information by selected product
   * @param {*} product
   * @returns
   */
  const handleGetDataLadder = async (product, productList, connected) => {
    if (!traderFunction || !traderFunction?.activeMpg || !product) return;
    window.dexterity = traderFunction.dexterity;
    const manifest = await traderFunction.getManifest(true);
    if (!manifest) return;
    refRenderLadder.current = await createLadder(
      await new markets.Market(
        manifest,
        traderFunction.dexterity.bytesToString(traderFunction.activeMpg?.name),
        product,
        'books',
        traderFunction
      ),
      traderFunction.trader,
      productList,
      connected
    );
    if (
      refRenderLadder.current &&
      typeof refRenderLadder.current.getDataLadder === 'function'
    ) {
      refRenderLadder.current.getDataLadder((data) => {
        setMarkPriceList(data?.markPriceList || {});
        if (data.ticks?.length) {
          setDataLadder(data.ticks);
        }
        setMarkPrice(data?.markPrice);
        setFundingRateList(data?.fundingRateList || {});
        setIndexPriceList(data?.indexPriceList || {});
        setCashBalance(data?.cashBalance || '');
      });
    }
  };

  /**
   * Get data Your Fills information by selected product and wallet address
   * @param {productSelect, isConnect,accountSelect,productList} product
   * @returns
   */
  useEffect(() => {
    if (isConnect) {
      if (refTimeOutGetLadder.current) {
        window.clearTimeout(refTimeOutGetLadder.current);
      }
      refTimeOutGetLadder.current = setTimeout(() => {
        refTimeOutGetLadder.current = undefined;
        handleGetDataLadder(productSelect, productList, refIsConnect.current);
      }, 1000);
    }
  }, [productSelect, isConnect, JSON.stringify(productList), accountSelect]);

  useEffect(() => {
    const provider = localStorage.getItem('provider');
    const handleConnectNoneWallet = () => {
      traderFunction?.connectNoneWallet((products) => {
        setProductList(products || []);
        const orderedProductsKeys = Array.from(products?.keys());
        setProductsListKey(orderedProductsKeys || productsListKey);
      });
    };
    window.addEventListener('disconnect', handleConnectNoneWallet);
    if (
      typeof traderFunction === 'undefined' ||
      provider === 'phantom' ||
      provider === 'solflare'
    ) {
      return;
    }

    if (refTimeOutGetLadderNoneWallet.current) {
      window.clearTimeout(refTimeOutGetLadderNoneWallet.current);
    }
    refTimeOutGetLadderNoneWallet.current = setTimeout(() => {
      refTimeOutGetLadderNoneWallet.current = undefined;
      traderFunction.connectNoneWallet((products) => {
        setProductList(products || []);
        const orderedProductsKeys = Array.from(products?.keys());
        setProductsListKey(orderedProductsKeys || productsListKey);
      });
    }, 1000);
    return () => {
      window.clearTimeout(refTimeOut.current);
      window.removeEventListener('disconnect', handleConnectNoneWallet);
    };
  }, []);

  useEffect(() => {
    if (
      typeof traderFunction !== 'undefined' &&
      !traderFunction?.listAccounts?.length &&
      !!productsListKey?.length
    ) {
      window.clearInterval(refInterValGetLadderNoneWallet.current);
      if (refTimeOutGetLadder.current) {
        window.clearTimeout(refTimeOutGetLadder.current);
      }
      refTimeOutGetLadder.current = setTimeout(() => {
        refTimeOutGetLadder.current = undefined;
        handleGetDataLadder(productSelect, productList, refIsConnect.current);
        refInterValGetLadderNoneWallet.current = setInterval(() => {
          if (
            refRenderLadder.current &&
            typeof refRenderLadder.current.getDataLadder === 'function'
          ) {
            refRenderLadder.current.getDataLadder((data) => {
              setMarkPriceList(data?.markPriceList || {});
              if (data.ticks?.length) {
                setDataLadder(data.ticks);
              }
              setMarkPrice(data?.markPrice);
              setFundingRateList(data?.fundingRateList || {});
              setIndexPriceList(data?.indexPriceList || {});
              setCashBalance(data?.cashBalance || '');
            });
          }
        }, 2000);
      }, 500);
    } else {
      window.clearInterval(refInterValGetLadderNoneWallet.current);
    }
  }, [
    isConnect,
    JSON.stringify(productsListKey),
    JSON.stringify(productSelect),
  ]);

  /**
   * Connect Wallet
   */
  const connectWallet = (wallet) => {
    refRenderLadder.current = null;
    refIsDisconnect.current = false;
    window.clearTimeout(refTimeOutGetLadder.current);
    traderFunction.connect(`${wallet}`.toLowerCase(), async (data) => {
      refIsConnect.current = true;
      setLoading(false);
      if (refIsConnect.current && !refIsDisconnect.current) {
        if (data?.dataWallet?.listAccounts?.length) {
          window.clearInterval(refInterValGetLadderNoneWallet.current);
        }
        localStorage.setItem('provider', `${wallet}`.toLowerCase());
        setIsContent(true);
        if (data?.error) {
          setDataPnL(data?.dataWallet || {});
          return;
        }
        setUSDBalance(data.USDBalance || 0);
        setDataPnL(data?.dataWallet || {});
        setDataOrders(data?.dataOrders || []);
        setDataPosition(
          data?.dataPosition?.length ? data?.dataPosition : dataPosition || []
        );
        setProductList(data?.products || []);
        const orderedProductsKeys = Array.from(data?.products?.keys());
        setProductsListKey(orderedProductsKeys || productsListKey);

        if (
          refRenderLadder.current &&
          typeof refRenderLadder.current.getDataLadder === 'function'
        ) {
          refRenderLadder.current.getDataLadder((data) => {
            if (refIsConnect.current) {
              setMarkPriceList(data?.markPriceList);
              if (data.ticks?.length) {
                setDataLadder(data.ticks);
              }
              setMarkPrice(data?.markPrice);
              setFundingRateList(data?.fundingRateList || {});
              setIndexPriceList(data?.indexPriceList || {});
              setCashBalance(data?.cashBalance || 0);
            }
          });
        }
      }
    });
  };

  /**
   * Disable Wallet
   */
  const disableConnectWallet = () => {
    refIsConnect.current = false;
    refIsDisconnect.current = true;
    refRenderLadder.current = null;
    setIsContent(false);
    localStorage.removeItem('provider');
    setDataPnL({});
    setDataOrders([]);
    setDataPosition([]);
    setDataMarket([]);
    setAccountSelect('');
    setUSDBalance(0);
    setCashBalance(0);
    traderFunction.disConnect();
  };

  /**
   * Change active product
   * @param {*} product
   */
  const changeProduct = (product) => {
    setProductSelect(product);
    setDataLadder([]);
    if (traderFunction && traderFunction.trader) {
      traderFunction.setActiveProduct(null, `${product}`.trim());
    }
  };

  const onSelectPrice = (price) => {
    setPriceSelect(price);
  };
  return (
    <WalletContext.Provider
      value={{
        dataPnL,
        dataOrders,
        dataPosition,
        dataMarket,
        connectWallet,
        disableConnectWallet,
        traderFunction,
        dataLadder,
        productsListKey,
        productSelect,
        changeProduct,
        markPrice,
        qtyGlobal,
        setQtyGlobal,
        isConnect,
        productIndex,
        setProductIndex,
        netWorkConnect,
        setNetWorkConnect,
        fundingRateList,
        productList,
        markPriceList,
        setWalletConnect,
        walletConnect,
        indexPriceList,
        accountSelect,
        setAccountSelect,
        cashBalance,
        USDBalance,
        setLoading,
        loading,
        onSelectPrice,
        priceSelect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
