/**
 * Generate Id automatically
 */
let feedIdFountain = 0;
function getNewFeedId() {
  const id = feedIdFountain;
  feedIdFountain++;
  return id;
}

/**
 * Class Feed define and handle services to book/cancel orders
 */
class Feed {
  constructor(market, manifest, traderFunction, productList) {
    this.id = getNewFeedId();
    this.market = market;
    this.manifest = manifest;
    this.ticks = [];
    this.productList = productList;
    this.tradesRingBuf = [];
    this.ws = null;
    this.solanaConnection = null;
    this.markPriceList = {};
    this.indexPriceList = {};
    this.trades = traderFunction;
    this.bestask = traderFunction.dexterity.Fractional.Nan();
    this.bestbid = traderFunction.dexterity.Fractional.Nan();
    this.minprice = traderFunction.dexterity.Fractional.Nan();
    this.maxprice = traderFunction.dexterity.Fractional.Nan();
    this.bbo = traderFunction.dexterity.Fractional.Nan();
    this.markPrice = traderFunction.dexterity.Fractional.Nan();
    this.markPriceSpreadEMA = traderFunction.dexterity.Fractional.Nan();
    this.fundingRateList = {};
    this.hasSentFirstMsg = false;
    if (this.market === null) {
      return;
    }

    this.priceDecimals = traderFunction.dexterity.getPriceDecimals(
      this.market.product.metadata
    );
    this.startStreaming();
    console.log('FEEDS');

    if (this.market.kind === 'books') {
      console.log('BOOKS');
      this.pollBooks();
    }
  }

  /**
   * Start streaming prices of products in wallet
   */
  async startStreaming() {
    //
    this.pollBooks();
    this.tradesSocket = await this.market.manifest.streamTrades(
      this.market.product,
      this.market.marketState,
      this.tradesHandler.bind(this)
    );
  }

  /**
   * Add reference to stream sockets
   * @returns referred sockets
   */
  async addRef() {
    await this.asksSocket?.addRef();
    await this.bidsSocket?.addRef();
    await this.tradesSocket?.addRef();
    return this;
  }

  /**
   * Stream books
   */
  async pollBooks() {
    const { asksSocket, bidsSocket, markPricesSocket } =
      this.market.manifest.streamBooks(
        this.market.product,
        this.market.marketState,
        this.booksHandler.bind(this),
        this.markPricesHandler.bind(this)
      );
    this.asksSocket = asksSocket;
    this.bidsSocket = bidsSocket;
    this.markPricesSocket = markPricesSocket;
  }

  /**
   * Get mark price Oracle minus book Ewma
   * @param {*} markPrices
   */
  markPricesHandler(markPrices) {
    this.markPrice = this.trades.dexterity.Manifest.GetMarkPrice(
      markPrices,
      this.market.product.metadata.productKey
    );

    this.markPriceSpreadEMA =
      this.trades.dexterity.Manifest.GetMarkPriceOracleMinusBookEwma(
        markPrices,
        this.market.product.metadata.productKey
      );

    this.indexPrice = this.markPrice.add(this.markPriceSpreadEMA);

    for (const [key, value] of this.productList) {
      const meta = this.trades.dexterity.productToMeta(value.product);
      const price = this.trades.dexterity.Manifest.GetMarkPrice(
        markPrices,
        meta.productKey
      );
      const markPriceSpread =
        this.trades.dexterity.Manifest.GetMarkPriceOracleMinusBookEwma(
          markPrices,
          meta.productKey
        );
      const indexPrice = price.add(markPriceSpread);
      const fundingRate = price
        .sub(indexPrice)
        .div(indexPrice)
        .mul(
          this.trades.dexterity.Fractional.New(100, 0).div(
            this.trades.dexterity.Fractional.New(24, 0)
          )
        );
      this.markPriceList[`${key}`.trim().toString()] = price?.toString();
      this.indexPriceList[`${key}`.trim().toString()] = indexPrice?.toString();
      this.fundingRateList[`${key}`.trim().toString()] =
        fundingRate?.toString();
    }
  }

  /**
   * Disconnect sockets
   */
  kill() {
    this.asksSocket?.close();
    this.bidsSocket?.close();
    this.tradesSocket?.close();
  }

  /**
   * Book Order with price and quantity
   * @param {*} book
   * @returns
   */
  booksHandler(book) {
    const tickSize = this.trades.dexterity.Fractional.From(
      this.market.product.metadata.tickSize
    );

    const byKey = (a, b) =>
      a.key.length !== b.key.length
        ? a.key.length < b.key.length
        : a.key < b.key; // I think this is okay???
    let { ask_orders, bid_orders } = {
      ask_orders: book.asks.sort(byKey),
      bid_orders: book.bids.sort(byKey),
    };
    if (typeof this.market.filter === 'function') {
      [ask_orders, bid_orders] = this.market.filter(ask_orders, bid_orders);
    }
    this.maxEmptyLevels = 6;
    let hasChanged =
      this.ticks.length !== ask_orders.length + bid_orders.length;
    for (let i = 0, j = 0; i < this.ticks.length; i++, j++) {
      let orders;
      let offset = 0;
      if (j < ask_orders.length) {
        orders = ask_orders;
      } else if (j < ask_orders.length + bid_orders.length) {
        orders = bid_orders;
        offset = -ask_orders.length;
      } else {
        hasChanged = true;
        break;
      }
      if (
        !this.ticks[i].price.eq(orders[j + offset].price) ||
        !this.ticks[i].quantity.eq(orders[j + offset].quantity)
      ) {
        hasChanged = true;
        break;
      }
    }
    if (!hasChanged && this.hasSentFirstMsg) {
      return;
    }
    if (ask_orders.length > 0 && bid_orders.length > 0) {
      this.maxprice = ask_orders[ask_orders.length - 1].price;
      this.minprice = bid_orders[bid_orders.length - 1].price;
      this.bestask = ask_orders[ask_orders.length - 1].price;
      this.bestbid = bid_orders[0].price;
      this.bestask.add(this.bestbid);
      this.bbo = this.bestask
        .add(this.bestbid)
        .div(this.trades.dexterity.Fractional.New(2, 0));
    } else if (ask_orders.length > 0) {
      this.maxprice = ask_orders[0].price;
      this.minprice = ask_orders[ask_orders.length - 1].price.sub(
        this.trades.dexterity.Fractional.New(this.maxEmptyLevels, 0)
      );
      this.bestask = ask_orders[ask_orders.length - 1].price;
      this.bestbid = this.trades.dexterity.Fractional.Nan();
      this.bbo = this.bestask;
    } else if (bid_orders.length > 0) {
      this.maxprice = bid_orders[0].price.add(
        this.trades.dexterity.Fractional.New(this.maxEmptyLevels, 0)
      );
      this.minprice = bid_orders[bid_orders.length - 1].price;
      this.bestask = this.trades.dexterity.Fractional.Nan();
      this.bestbid = bid_orders[0].price;
      this.bbo = this.bestbid;
    } else {
      this.bbo = this.trades.dexterity.Fractional.Nan();
      this.bestask = this.trades.dexterity.Fractional.Nan();
      this.bestbid = this.trades.dexterity.Fractional.Nan();
      // don't update min/max price so we can render an empty book with those bounds
    }
    this.ticks = [];
    ask_orders.forEach((o) => {
      this.ticks.push({
        id: o.key,
        price: o.price.reduced(), // reduced() copies
        quantity: o.quantity.reduced(),
        isBid: false,
      });
    });
    bid_orders.forEach((o) => {
      this.ticks.push({
        id: o.key,
        price: o.price.reduced(), // reduced() copies
        quantity: o.quantity.reduced(), // reduced() copies
        isBid: true,
      });
    });
    if (typeof this.onSnapshot === 'function') {
      this.onSnapshot(book);
      this.hasSentFirstMsg = true;
    }
  }

  /**
   * Handle trades market
   * @param {*} trades
   */
  tradesHandler(trades) {
    const currDate = new Date();
    const currTime =
      String(currDate.getHours()).padStart(2, '0') +
      ':' +
      String(currDate.getMinutes()).padStart(2, '0') +
      ':' +
      String(currDate.getSeconds()).padStart(2, '0');

    if (typeof this.onTrade === 'function') {
      this.onTrade(trades);
    }
  }
}

export { Feed };
