/* eslint-disable no-irregular-whitespace */
import React, { useRef } from 'react';
import styled from 'styled-components';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import IconLoading from '@components/IconLoading';
const ChartView = ({ productSelect }) => {
  const containerId = useRef(
    `tv_container_${Math.random().toString(36).substring(7)}`
  );

  const handleReturnCoin = (product) => {
    if (!product) {
      return 'BTCUSD';
    }
    if (`${product}`.toLowerCase().includes('eth')) {
      return 'ETHUSD';
    }
    if (`${product}`.toLowerCase().includes('sol')) {
      return 'SOLUSD';
    }
    return 'BTCUSD';
  };

  return (
    <WrapperChart>
      <TradingViewWidget
        symbol={`PYTH:${handleReturnCoin(productSelect)}`}
        theme={Themes.DARK}
        interval="1"
        locale="en"
        autosize
        container_id={containerId.current}
        // toolbar_bg={'red'}
        // hide_top_toolbar
        // allow_symbol_change

        overrides={{
          'mainSeriesProperties.candleStyle.upColor': '#47C5D8',
          'mainSeriesProperties.candleStyle.downColor': '#E3627D',
          'mainSeriesProperties.candleStyle.borderColor': '#378658',
          'mainSeriesProperties.candleStyle.borderUpColor': '#47C5D8',
          'mainSeriesProperties.candleStyle.borderDownColor': '#E3627D',
          'mainSeriesProperties.candleStyle.wickUpColor': '#47C5D8',
          'mainSeriesProperties.candleStyle.wickDownColor': '#E3627D',
        }}
      />
      <IconLoading className="icon-loading-chart" isWhite />
    </WrapperChart>
  );
};

export default ChartView;

const WrapperChart = styled.div`
  width: 60%;
  min-width: 706px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #262c2e;
  position: relative;

  .icon-loading-chart {
    position: absolute;
    z-index: 1;
    width: 60px;
    height: 60px;
    margin: auto;
  }

  article {
    z-index: 2;
  }
`;
