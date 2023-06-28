/**
 * Generate new Ladder Id
 */
var clobIdFountain = 0;
function getNewLadderId() {
  const id = clobIdFountain;
  clobIdFountain++;
  return id;
}

/**
 * Class Ladder define and handle services to render Ladder market
 */
class Ladder {
  constructor(feed, trader = null, traderFunction, isConnect = false) {
    this.id = getNewLadderId();
    this.feed = feed;
    this.trader = trader;
    this.isKilled = false;
    this.traderFunction = traderFunction;
    this.cashBalance = 0;
    this.isConnect = isConnect;
  }

  /**
   * Get Buy/Sell prices to render Market
   * @param {*} callback return values Bids/Asks/Trades
   */
  getDataLadder(callback) {
    setTimeout(() => {
      try {
        // if (this.isConnect) {
        //   if (this.trader?.getCashBalance?.() + '' !== '0') {
        //     this.cashBalance = this.trader?.getCashBalance() + '' || 0;
        //   }
        // }
        let ticks = [];
        const MAX_NUM_LEVELS = 500;
        let openOrderIds = new Set();
        let maxSize = this.traderFunction.dexterity.Fractional.New(1, 0);
        let lastPrice = this.traderFunction.dexterity.Fractional.Zero();
        let sum = this.traderFunction.dexterity.Fractional.Zero();
        if (this.trader && this.feed && this.feed.market) {
          if (this.isConnect && !!this.traderFunction?.listAccounts?.length) {
            openOrderIds = this.trader.getOpenOrderIds(
              this.feed.market.productName
            );
          }

          const tickSize = this.traderFunction.dexterity.Fractional.From(
            this.feed.market.product?.metadata?.tickSize
          );

          const maxLevelsRadius = tickSize?.mul(
            this.traderFunction.dexterity.Fractional.New(22, 0)
          );

          let tickPrice = this.feed.bestask?.add(maxLevelsRadius);
          tickPrice = tickPrice?.isNan()
            ? this.feed.bestbid?.add(maxLevelsRadius)
            : tickPrice;

          let endPrice = this.feed.bestbid?.sub(maxLevelsRadius);
          endPrice = endPrice?.isNan()
            ? this.feed.bestask?.add(maxLevelsRadius)
            : endPrice;
          if (endPrice.isNan()) {
            endPrice = this.traderFunction.dexterity.Fractional.Zero();
          }

          for (const t of this.feed.ticks) {
            if (t.price?.gt(tickPrice) || t.price?.lt(endPrice)) {
              continue;
            }
            if (!t.price?.eq(lastPrice)) {
              sum = this.traderFunction.dexterity.Fractional.Zero();
            }
            lastPrice = t.price?.reduced();
            sum = sum.add(t.quantity);
            if (sum.gt(maxSize)) {
              maxSize = sum.reduced(); // reduced() copies this
            }
          }

          let numLevels = 0;
          while (
            tickPrice &&
            !tickPrice.isNan() &&
            tickPrice.gt(endPrice) &&
            numLevels < MAX_NUM_LEVELS
          ) {
            // if (
            //   tickPrice.lt(this.feed.bestask) &&
            //   tickPrice.gt(this.feed.bestbid) &&
            //   this.feed.bestask?.sub(this.feed.bestbid).lt(maxLevelsRadius)
            // ) {
            //   // don't render the spread if it's too wide
            //   tickPrice = this.feed.bestbid;
            //   if (tickPrice.isNan()) {
            //     tickPrice = this.traderFunction.dexterity.Fractional.Zero();
            //   }
            //   continue;
            // }

            const tick = {};
            let totalAskSize = this.traderFunction.dexterity.Fractional.Zero();
            let totalBidSize = this.traderFunction.dexterity.Fractional.Zero();
            let price = tickPrice.reduced(); // reduced() copies this
            for (const t of this.feed.ticks) {
              if (price.eq(t.price)) {
                if (t.isBid) {
                  totalBidSize = totalBidSize.add(t.quantity);
                } else {
                  totalAskSize = totalAskSize.add(t.quantity);
                }
              }
              if (t.price.lt(price)) {
                break;
              }
            }

            // Put to trader array prices of Ask/Bid
            let traderAskSize = this.traderFunction.dexterity.Fractional.Zero();
            let traderBidSize = this.traderFunction.dexterity.Fractional.Zero();
            const bidOrderIds = [];
            const askOrderIds = [];
            const askSizeSlots = []; // 1 entry per order. entry == percent of totalAsk/AskSize
            const bidSizeSlots = [];
            for (const t of this.feed.ticks) {
              if (price.eq(t.price)) {
                if (t.isBid) {
                  const bidPercent = t.quantity?.div(totalBidSize);
                  if (openOrderIds !== null && openOrderIds.has(t.id)) {
                    bidSizeSlots.push(
                      bidPercent.mul(
                        this.traderFunction.dexterity.Fractional.NegativeOne()
                      )
                    );
                    traderBidSize = traderBidSize.add(t.quantity);
                    bidOrderIds.push(t.id);
                  } else {
                    bidSizeSlots.push(bidPercent);
                  }
                } else {
                  const askPercent = t.quantity.div(totalAskSize);
                  if (openOrderIds !== null && openOrderIds.has(t.id)) {
                    askSizeSlots.push(
                      askPercent.mul(
                        this.traderFunction.dexterity.Fractional.NegativeOne()
                      )
                    );
                    traderAskSize = traderAskSize.add(t.quantity);
                    askOrderIds.push(t.id);
                  } else {
                    askSizeSlots.push(askPercent);
                  }
                }
              }
              if (t.price.lt(price)) {
                break;
              }
            }
            askSizeSlots.reverse();

            const traderBid = {
              value: traderBidSize.isZero()
                ? ''
                : traderBidSize.toString(this.feed.baseDecimals),
              orderIds: bidOrderIds,
              size: traderBidSize,
            };

            tick.traderBid = traderBid;

            const tickBid = {
              isBid: true,
              value: totalBidSize.isZero()
                ? ''
                : totalBidSize.toString(this.feed.baseDecimals),
              tickPrice: tickPrice,
              price: price.reduced(),
            };
            tick.tickBid = tickBid;

            let tickPrices = {
              value: price.toString(this.feed.priceDecimals),
            };
            tick.tickPrices = tickPrices;

            const tickAsk = {
              isBid: false,
              value: totalAskSize.isZero()
                ? ''
                : totalAskSize.toString(this.feed.baseDecimals),
              tickPrice: tickPrice,
              price: price.reduced(),
            };

            tick.tickAsk = tickAsk;

            const traderAsk = {
              value: traderAskSize.isZero()
                ? ''
                : traderAskSize.toString(this.feed.baseDecimals),
              orderIds: askOrderIds,
              size: traderAskSize,
            };

            tick.traderAsk = traderAsk;
            tickPrice = tickPrice.sub(tickSize);
            ticks.push(tick);
            numLevels++;
          }
        }
        // Return data to trading connection to render the Market Ladder
        callback({
          ticks,
          indexPriceList: this.feed.indexPriceList,
          markPriceList: this.feed.markPriceList,
          cashBalance: this.cashBalance,
          markPrice: this.feed.markPrice.isNan()
            ? '-'
            : `${this.feed.markPrice.toString(2, true)}`,
          fundingRateList: this.feed.fundingRateList || [],
        });
      } catch (e) {
        console.error(e);
      }
    }, 500);
  }
}

export { Ladder };
