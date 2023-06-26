import BN from 'bn.js';
import dexterity from '@hxronetwork/dexterity-ts';
import { Connection, PublicKey } from '@solana/web3.js';

class TraderFunction {
  constructor() {
    this.rpc = null;
    this.network = process.env.MAINNET_NETWORK;
    this.isConnected = false;
    this.trader = null;
    this.traderUpdateIntervalId = null;
    this.activeMpgPk = null; // has to be de-coupled from trader because could be viewing markets without trg
    this.activeMpg = null; // has to be de-coupled from trader because could be viewing markets without trg
    this.activeMpgName = null; // has to be de-coupled from trader because could be viewing markets without trg
    this.activeProduct = null; // has to be de-coupled from trader because could be viewing markets without trg
    this.activeProductIndex = null; // has to be de-coupled from trader because could be viewing markets without trg
    this.activeProductName = null; // has to be de-coupled from trader because could be viewing markets without trg
    this.mpgs = new Map();
    this.trgs = new Map();
    this.provider = null;
    this.walletPubkey = null;
    this.walletPubkeyHref = null;
    this.dataOption = [];
    this.web3 = { PublicKey };
    this.BN = { ...BN };
    this.dexterity = { ...dexterity };
    this.dexterityWallet = null;
    this.listAccounts = [];
    this.USDBalance = 0;
  }

  async returnData() {
    try {
      const portfolio = this.trader
        ? this.trader.getPortfolioValue()
        : this.dexterity.Fractional.Zero();

      const positionVal = this.trader
        ? this.trader.getPositionValue()
        : this.dexterity.Fractional.Zero();

      const excess = this.trader
        ? this.trader.getExcessMargin()
        : this.dexterity.Fractional.Zero();
      const excessPercent = excess
        ?.mul(this.dexterity.Fractional.New(100, 0))
        .div(portfolio);

      const requiredPercent = excessPercent
        ? this.dexterity.Fractional.New(100, 0).sub(excessPercent)
        : { textContent: '' };

      const required = portfolio ? portfolio?.sub(excess) : '';
      const requiredMargin = required
        ? (requiredPercent.textContent =
            required.toString(2) + ' (' + requiredPercent?.toString(2) + '%)')
        : '';

      const excessMargin = excessPercent
        ? excess?.toString(2) + ' (' + excessPercent?.toString(2) + '%)'
        : '';

      const pnlValue =
        this.trader && portfolio
          ? this.trader.getPnL()
          : this.dexterity.Fractional.Zero();

      const pnl = pnlValue?.toString(2);

      const withdrawable =
        this.trader?.getExcessMarginUntilUnhealthy()?.toString(2, true) || 0;

      const newData = {
        listAccounts: this.listAccounts,
        walletPubkeyHref: this.walletPubkeyHref,
        walletPubkey: this.walletPubkey,
        portfolio: portfolio?.toString(2),
        positionVal: positionVal?.toString(2),
        requiredMargin: requiredMargin,
        excessMargin: excessMargin,
        pnl,
        withdrawable,
        dataOption: this.dataOption,
      };
      return newData;
    } catch (error) {
      console.log('----', error);
    }
  }

  async returnDataOrder() {
    if (this.trader) {
      const rows = [];
      const openOrders = await this.trader.getOpenOrders();

      if (openOrders) {
        openOrders.forEach((order) => {
          let side = 'BUY';
          if (!order.isBid) {
            side = 'SELL';
          }
          rows.push({
            instrument: order.productName,
            productIndex: order.productIndex,
            id: order.id,
            price: order.price,
            qty: order.qty,
            side: side,
          });
        });
      }

      return rows;
    }
  }

  async returnDataPosition() {
    if (this.trader) {
      const position = this.trader.getPositions();
      const rows = [];
      for (const [name, amt] of position) {
        // if (amt.isZero()) {
        //   continue;
        // }
        rows.push({ instrument: name, position: amt.toString() });
      }

      return rows;
    }
  }

  returnDataConnect = async (callback) => {
    if (this.isConnected) {
      const dataWallet = await this.returnData();

      const dataOrders = this.listAccounts?.length
        ? await this.returnDataOrder()
        : [];

      const dataPosition = this.listAccounts?.length
        ? await this.returnDataPosition()
        : [];

      const dataTrader = await this.trader;

      const products = this.dexterity.Manifest.GetProductsOfMPG(this.activeMpg);

      callback({
        USDBalance: this.USDBalance,
        dataWallet,
        dataOrders,
        dataPosition,
        dataTrader,
        products,
      });
    }
  };

  setActiveProduct(productIndex = null, productName = null) {
    if (this.activeMpg == null) {
      return;
    }
    if (productIndex !== null) {
      this.activeProductIndex = productIndex;
    } else if (productName !== null) {
      let i = -1;
      for (const p of this.activeMpg.marketProducts.array) {
        i++;
        if (
          this.dexterity.productStatus(
            p,
            this.activeMpg.marketProducts.array
          ) === 'uninitialized'
        ) {
          continue;
        }
        if (
          this.dexterity
            .bytesToString(this.dexterity.productToMeta(p).name)
            .trim() === productName
        ) {
          this.activeProductIndex = i;
          break;
        }
      }
    }
    this.activeProduct =
      this.activeMpg.marketProducts.array[this.activeProductIndex];
    const meta = this.dexterity.productToMeta(this.activeProduct);

    this.activeProductName = this.dexterity.bytesToString(meta.name).trim();
  }

  async getManifest(useCache = true) {
    try {
      if (!this.dexterityWallet) {
        return;
      }
      const connectionUrl =
        localStorage.getItem('rpc') || process.env.MAINNET_NETWORK;
      this.rpc = connectionUrl;
      const manifest = await this.dexterity.getManifest(
        connectionUrl,
        useCache,
        this.dexterityWallet
      );
      return manifest;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateMPGs() {
    const manifest = await this.getManifest(false);
    if (!manifest) {
      return null;
    }

    for (const [_, { pubkey, mpg, orderbooks }] of manifest.fields.mpgs) {
      const rpc = localStorage.getItem('rpc');
      if (
        (rpc === process.env.MAINNET_NETWORK_URL &&
          pubkey.toBase58() !== process.env.MAINNET_MPG_KEY) ||
        (rpc === process.env.TESTNET_NETWORK_URL &&
          pubkey.toBase58() !== process.env.TESTNET_MPG_KEY) ||
        (rpc === process.env.DEVNET_NETWORK_URL &&
          pubkey.toBase58() !== process.env.DEVNET_MPG_KEY)
      ) {
        continue;
      }
      this.mpgs.clear();
      this.mpgs.set(pubkey, mpg);
      this.activeMpg = mpg;
      this.activeMpgPk = pubkey;
      this.setActiveProduct(0);
    }
  }

  async updateTrgSelect(callback) {
    const manifest = await this.getManifest();
    if (!manifest) {
      callback({
        error: true,
        dataWallet: { walletPubkey: this.walletPubkey },
      });
      return null;
    }
    const trgs = await manifest.getTRGsOfWallet(this.activeMpgPk);
    trgs.sort((a, b) => a.pubkey < b.pubkey);
    if (trgs.length === 0) {
      this.trader = new this.dexterity.Trader(manifest);
    } else {
      const listAccounts = [];
      for (const { pubkey, trg } of trgs) {
        listAccounts.push(`${pubkey}`);
      }
      this.listAccounts = listAccounts;
      await this.selectTrg(trgs[0].pubkey, callback);
    }
    const selectAccount = document.getElementById('select-account');

    if (selectAccount) {
      selectAccount.addEventListener('change', async (event) => {
        await this.selectTrg(
          new this.web3.PublicKey(event.target.value),
          callback
        );
      });
    }
  }

  getUSDCBalance = async () => {
    const TOKEN_PROGRAM_ID = new PublicKey(process.env.TOKEN_PROGRAM_ID);
    const USDC_TOKEN_MINT = new PublicKey(process.env.USDC_TOKEN_MINT);
    async function getBalance(walletPubkey) {
      const connection = new Connection(
        localStorage.getItem('rpc') || process.env.MAINNET_NETWORK_URL
      );
      const walletPublicKey = new PublicKey(walletPubkey);
      const tokenAccount = await connection.getParsedTokenAccountsByOwner(
        walletPublicKey,
        { programId: TOKEN_PROGRAM_ID }
      );
      const usdcAccount = tokenAccount.value.find(
        ({ account }) =>
          account.data.parsed.info.mint == USDC_TOKEN_MINT.toBase58()
      );
      if (!usdcAccount) {
        return 0;
      }
      return usdcAccount.account.data.parsed.info.tokenAmount.uiAmount;
    }
    // Example usage

    await getBalance(this.walletPubkey).then((balance) => {
      this.USDBalance = balance;
    });
  };

  async selectTrg(pubkey, callback) {
    const manifest = await this.getManifest();
    this.trader = new this.dexterity.Trader(manifest, pubkey);

    await this.trader.connect(async () => {
      if (!this.isConnected) {
        return;
      }
      this.returnDataConnect(callback);
    });

    await this.getUSDCBalance();
  }

  async connectNoneWallet(callback) {
    this.provider = window.phantom.solana;
    this.dexterityWallet = this.provider;
    const manifest = await this.getManifest();
    await this.updateMPGs();
    this.trader = new this.dexterity.Trader(manifest);
    const products = this.dexterity.Manifest.GetProductsOfMPG(this.activeMpg);
    callback(products);
  }

  connect(wallet, callback) {
    try {
      if (wallet === 'phantom') {
        this.provider = window.phantom.solana;
      } else {
        this.provider = window.solflare;
      }

      this.dexterityWallet = this.provider;

      this.provider?.on('connect', async (pk) => {
        this.walletPubkey = `${pk}`;
        const network = localStorage.getItem('network');
        this.walletPubkeyHref =
          pk +
          `${
            network === 'Devnet'
              ? '?cluster=devnet-solana'
              : network === 'Local'
              ? '?cluster=http%253A%252F%252Flocalhost%253A8899%252F'
              : ''
          }`;
        await this.updateMPGs();
        await this.updateTrgSelect(callback);
        this.isConnected = true;
        const dataWallet = await this.returnData();

        // muon lay list product phai co manifest => lay dc mpg trong manifest.
        const products = this.dexterity.Manifest.GetProductsOfMPG(
          this.activeMpg
        );

        callback({ dataWallet, products, wallet });
        const buttonCreateAccount = document.getElementById(
          'button-creating-account'
        );
        if (buttonCreateAccount) {
          buttonCreateAccount.addEventListener('click', async () => {
            const wrapperButton = document.querySelector(
              '.wrapper-button-creating-account'
            );
            if (wrapperButton) {
              const iconLoading = wrapperButton.querySelector('#icon-loading');
              if (iconLoading) {
                iconLoading.classList.add('show-icon-loading');
              }
            }

            buttonCreateAccount.classList.add('disable-button');
            buttonCreateAccount.innerText = 'Confirming transactions...';

            this.createTRG(callback, buttonCreateAccount);
          });
        }
      });
      this.provider
        .connect()
        .then()
        .catch(() => {
          const disconnect = new Event('disconnect');
          window.dispatchEvent(disconnect);
        });
    } catch (error) {
      console.log(error);
    }
  }

  disConnect() {
    this.listAccounts = [];
    this.provider.off?.('disconnect');
    this.provider.on('disconnect', (_) => {
      this.isConnected = false;
    });
    this.provider.disconnect();
  }

  async cancelBtnClickedHandler(productIndex, id, callback) {
    await this.trader?.cancelOrders(productIndex, [id], {
      onGotBlockHashFn: () => {
        callback?.('1');
      },
      onTxSentFn: (signature) => {
        callback?.('2', signature);
      },
      onTxSuccessFn: (signature) => {
        callback?.('3', signature);
      },
      onFailFn: (error) => {
        callback?.('4', error);
      },
    });
  }

  async withdraw(value, callback) {
    if (this.dexterity.Fractional.FromString(value) <= 0) {
      return;
    }
    if (this.trader === null) {
      return;
    }

    await this.trader.withdraw(
      this.dexterity.Fractional.FromString(`${value}`)
    );
    await this.trader.updateRisk();
    callback?.();
  }

  async deposit(value, callback) {
    try {
      if (this.dexterity.Fractional.FromString(value) <= 0) {
        callback?.();
        return;
      }
      if (this.trader === null) {
        callback?.();
        return;
      }
      await this.trader.deposit(this.dexterity.Fractional.FromString(value));
      await this.trader.updateRisk();
      callback?.();
    } catch (error) {
      console.log('error', error);
    }
  }

  async sendOrder(order, isBid, callback) {
    return await this.sendNewOrder(
      {
        isBid,
        price: this.dexterity.Fractional.FromString(order.price),
        size: this.dexterity.Fractional.FromString(order.quantity),
      },
      order.productIndex,
      order.isIOC,
      callback
    );
  }

  async sendNewOrder(order, productIndex = null, isIOC, callback) {
    if (this.trader === null) {
      console.error(
        'trader is null! TODO display message indicating wallet not connected'
      );
      return;
    }
    if (productIndex === null) {
      console.error('productIndex is null!');
      return;
    }
    if (order.size.lt(this.dexterity.Fractional.Zero())) {
      return;
    }
    return await this.trader.newOrder(
      productIndex,
      order.isBid,
      order.price,
      order.size,
      {
        onGotBlockHashFn: () => {
          callback?.('1');
        },
        onTxSentFn: (signature) => {
          callback?.('2', signature);
        },
        onTxSuccessFn: (signature) => {
          callback?.('3', signature);
        },
        onFailFn: (error) => {
          callback?.('4', error);
        },
      },
      isIOC
    );
  }

  async cancelOrders(productIndex, orderIds, callback) {
    if (this.trader === null) {
      console.error(
        'trader is null! TODO display message indicating wallet not connected'
      );
      return;
    }

    return await this.trader.cancelOrders(
      productIndex,
      orderIds.map((orderId) => new this.BN.BN(orderId)),
      true,
      {
        onGotBlockHashFn: () => {
          callback?.('1');
        },
        onTxSentFn: (signature) => {
          callback?.('2', signature);
        },
        onTxSuccessFn: (signature) => {
          callback?.('3', signature);
        },
        onFailFn: (error) => {
          callback?.('4', error);
        },
      }
    );
  }

  async cancelAllOrders() {
    if (this.trader === null) {
      console.error(
        'trader is null! TODO display message indicating wallet not connected'
      );
      return;
    }
    const products = this.dexterity.Manifest.GetProductsOfMPG(this.activeMpg);

    const productNames = [];
    for (const [_, { index, product }] of products) {
      const meta = this.dexterity.productToMeta(product);
      productNames.push(this.dexterity.bytesToString(meta.name));
      await this.trader.cancelAllOrders(productNames);
    }
  }

  async createTRG(callback, button) {
    // const createNewTRG = document.getElementById("create-trg");
    // createNewTRG.disabled = true;
    // createNewTRG.textContent = "Confirming transactions...";
    const manifest = await this.getManifest();
    const trg = await manifest.createTrg(
      new this.web3.PublicKey(this.activeMpgPk)
    ); // TODO figure out how to "bootstrap" MPG
    button.classList.remove('disable-button');
    button.innerText = 'New Trading Account';
    const wrapperButton = document.querySelector(
      '.wrapper-button-creating-account'
    );
    if (wrapperButton) {
      const iconLoading = wrapperButton.querySelector('#icon-loading');
      if (iconLoading) {
        iconLoading.classList.remove('show-icon-loading');
      }
    }
    if (!trg) {
      console.log('Cancel');
    } else {
      // createNewTRG.disabled = false;
      // createNewTRG.textContent = "Create New Trading Account";
      await this.updateTrgSelect(callback);
    }
  }
}
export default TraderFunction;
