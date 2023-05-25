import React, { useMemo } from 'react';
import ChartView from './Components/Chart';
import Market from './Components/Market';
import Modes from './Components/Modes';
import Orders from './Components/Orders';
import Position from './Components/Positions';
import Ladder from './Components/Ladder';

import {
  WrapperContent,
  WrapperContentLeft,
  WrapperContentChart,
  WrapperContentRight,
  WrapperContentOrder,
  WrapperOrderRight,
} from './Content.style';
import { useWallet } from '../../hooks/useWallet';

export default function ContentPage() {
  const { productSelect } = useWallet();

  const chart = useMemo(() => {
    return <ChartView productSelect={productSelect} />;
  }, [JSON.stringify(productSelect)]);
  return (
    <WrapperContent>
      <WrapperContentLeft>
        <WrapperContentChart>
          <Market />
          {chart}
        </WrapperContentChart>
        <WrapperContentOrder>
          <Position />
          <WrapperOrderRight>
            <Orders />
            <Modes />
          </WrapperOrderRight>
        </WrapperContentOrder>
      </WrapperContentLeft>
      <WrapperContentRight>
        <Ladder />
      </WrapperContentRight>
    </WrapperContent>
  );
}
