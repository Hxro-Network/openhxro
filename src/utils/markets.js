/**
 * Trim value of map item
 * @param {*} item
 * @returns map item
 */
function clean(item, trader) {
  return trader.dexterity.bytesToString(item).trim();
}

/**
 * Class Market define and handle services to Generate the market to order/cancel order
 */
class Market {
  constructor(manifest, mpgName, productName, kind, traderFunction) {
    this.manifest = manifest;
    this.mpgName = mpgName;
    this.productName = productName;
    this.traders = traderFunction;
    this.kind = kind;
    for (const [pk, { mpg, orderbooks }] of this.manifest.fields.mpgs) {
      if (clean(mpg.name, this.traders) !== mpgName.trim()) {
        continue;
      }
      if (
        (manifest.fields.rpc === process.env.MAINNET_NETWORK_URL &&
          pk !== process.env.MAINNET_MPG_KEY) ||
        (manifest.fields.rpc === process.env.TESTNET_NETWORK_URL &&
          pk !== process.env.TESTNET_MPG_KEY) ||
        (manifest.fields.rpc === process.env.DEVNET_NETWORK_URL &&
          pk !== process.env.DEVNET_MPG_KEY)
      ) {
        continue;
      }
      this.mpg = mpg;
      this.mpgPk = pk;
    }
  }

  /**
   * Get products depend on Market product group
   */
  async updateBook() {
    for (const [
      _,
      { index, product },
    ] of this.traders.dexterity?.Manifest?.GetProductsOfMPG?.(this.mpg) || []) {
      const meta = await this.traders.dexterity.productToMeta(product);
      if (clean(meta.name, this.traders) === this.productName.trim()) {
        await this.manifest.fetchOrderbook(meta.orderbook);
        const { orderbooks } = this.manifest.fields.mpgs.get(this.mpgPk);
        this.marketState = orderbooks.get(meta.orderbook.toBase58());
        this.productIndex = index;
        // eslint-disable-next-line no-prototype-builtins
        if (product.hasOwnProperty('outright')) {
          this.product = product.outright.outright;
        } else {
          this.product = product.combo.combo;
        }
        break;
      }
    }
  }
}

/**
 * Filter market
 * @param {*} market
 * @param {*} f
 * @returns market
 */
function Filter(market, f) {
  market.filter = f;
  return market;
}

/**
 * Filter best n market
 * @param {*} market
 * @param {*} n
 * @returns best n market
 */
function FilterBestN(market, n) {
  return Filter(market, (ask_levels, bid_levels) => [
    ask_levels.slice(0, n),
    bid_levels.slice(0, n),
  ]);
}

/**
 * Filter best 5 market
 * @param {*} market
 * @returns best 5 market
 */
function FilterBest5(market) {
  return FilterBestN(market, 5);
}

/**
 * Filter best 10 market
 * @param {*} market
 * @returns best 10 market
 */
function FilterBest10(market) {
  return FilterBestN(market, 10);
}

/**
 * Filter best 15 market
 * @param {*} market
 * @returns best 15 market
 */
function FilterBest15(market) {
  return FilterBestN(market, 15);
}

/**
 * Filter best 25 market
 * @param {*} market
 * @returns best 25 market
 */
function Market2String(market) {
  return market.productName;
}

export {
  Filter,
  FilterBestN,
  FilterBest5,
  FilterBest10,
  FilterBest15,
  Market2String,
  Market,
};
