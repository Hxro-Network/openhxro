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
  isConnect,
  onSelectPrice,
  hadNewData,
  isMouseEnter,
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
        onSetIndexAsk={(index) => {
          if (!isMouseEnter) {
            setIndexAsk(index);
          }
        }}
        isConnect={isConnect}
        onSelectPrice={onSelectPrice}
        indexAsk={indexAsk}
        isMouseEnter={isMouseEnter}
      />
      {isCollapse && !!dataLadder?.length ? (
        <Collapse>
          <WrapperIcon
            onClick={() => {
              onSetIsCollapse(false);
            }}
          >
            <img src={iconHidden} alt="icon" />
          </WrapperIcon>
          {isMouseEnter && hadNewData && <p className="new-data">New data</p>}
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
            onSelectPrice={onSelectPrice}
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
        onSetIndexBid={(index) => {
          if (!isMouseEnter) {
            setIndexBid(index);
          }
        }}
        isConnect={isConnect}
        onSelectPrice={onSelectPrice}
        indexBid={indexBid}
        isMouseEnter={isMouseEnter}
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

  .new-data {
    position: absolute;
    font-size: 14px;
    margin: 0px;
    padding: 0px;
    left: 20px;
    top: -18px;
  }
`;
