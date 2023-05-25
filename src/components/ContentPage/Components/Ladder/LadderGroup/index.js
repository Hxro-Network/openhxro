import React, { useState } from 'react';

import GroupItem from './Components/GroupItem';
import EntryGroup from './Components/EntryGroup';
import { WrapperIcon } from '../Ladder.style';
import iconHidden from '../Icon/icon_hidden.svg';
import styled from 'styled-components';

export default function LadderGroup({
  dataLadder,
  totalSize,
  indexGroupSelect,
  qtyGlobal,
  handleCancel,
  handleOrder,
  product = 'btc',
  isCollapse,
  onSetIsCollapse,
}) {
  const [indexAsk, setIndexAsk] = useState(0);
  const [indexBid, setIndexBid] = useState(0);

  return (
    <>
      <GroupItem
        dataLadder={dataLadder}
        totalSize={totalSize}
        typeGroup="ask"
        indexGroupSelect={indexGroupSelect * 5}
        qtyGlobal={qtyGlobal}
        handleCancel={handleCancel}
        handleOrder={handleOrder}
        product={product}
        onSetIndexAsk={setIndexAsk}
      />
      {isCollapse && !!dataLadder?.length ? (
        <Collapse>
          <WrapperIcon onClick={() => onSetIsCollapse(false)}>
            <img src={iconHidden} alt="icon" />
          </WrapperIcon>
        </Collapse>
      ) : (
        !!dataLadder?.length && (
          <EntryGroup
            indexAsk={indexAsk}
            indexBid={indexBid}
            dataLadder={dataLadder}
            indexGroupSelect={indexGroupSelect * 5}
            product={product}
            qtyGlobal={qtyGlobal}
            handleCancel={handleCancel}
            handleOrder={handleOrder}
          />
        )
      )}
      <GroupItem
        dataLadder={dataLadder}
        totalSize={totalSize}
        typeGroup="bid"
        indexGroupSelect={indexGroupSelect * 5}
        qtyGlobal={qtyGlobal}
        handleCancel={handleCancel}
        handleOrder={handleOrder}
        product={product}
        onSetIndexBid={setIndexBid}
      />
    </>
  );
}

const Collapse = styled.div`
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
  background: #0e879c;
  display: flex;
  justify-content: flex-start;
  z-index: 10;
  position: relative;
`;
