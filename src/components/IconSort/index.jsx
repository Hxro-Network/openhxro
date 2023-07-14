import React from 'react';
import iconSort from '../../assets/icon_sort.png';
import styled from 'styled-components';

export default function IconSort({ increases, onClick }) {
  const handleClickSort = (e) => {
    e.stopPropagation();
    onClick();
  };
  return (
    <WrapperIconSort increases={`${increases}`} onClick={handleClickSort}>
      <img src={iconSort} alt="icon-sort" />
    </WrapperIconSort>
  );
}

const WrapperIconSort = styled.div`
  width: 12px;
  height: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
  cursor: pointer;

  img {
    width: 100%;
    transition: all 0.2s;
    transform: ${({ increases }) =>
      increases === 'true'
        ? 'rotate(0deg)'
        : increases === 'false'
        ? 'rotate(180deg)'
        : ''};
  }
`;
