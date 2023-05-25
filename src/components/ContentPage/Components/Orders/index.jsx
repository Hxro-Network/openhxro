import React, { memo, useMemo } from 'react';
import { useWallet } from '@hooks/useWallet';
import ContentOrder from './Components/ContentOrder';

function Orders() {
  const { dataOrders, productsListKey } = useWallet();

  const renderContent = useMemo(() => {
    return (
      <ContentOrder dataOrders={dataOrders} productsListKey={productsListKey} />
    );
  }, [JSON.stringify(dataOrders), JSON.stringify(productsListKey)]);

  return <>{renderContent}</>;
}

export default memo(Orders);
