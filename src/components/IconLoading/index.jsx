import React from 'react';
import styled, { keyframes } from 'styled-components';
import iconLoading from '@assets/loading.svg';
import iconLoadingWhite from '@assets/loading_white.svg';

export default function IconLoading({
  isWhite = false,
  isturn = true,
  className,
}) {
  return (
    <WrapperIcon
      id="icon-loading"
      className={`style-icon-loading ${className}`}
      isturn={isturn}
    >
      <img src={isWhite ? iconLoadingWhite : iconLoading} alt="" />
    </WrapperIcon>
  );
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const WrapperIcon = styled.div`
  width: 24px;
  height: 24px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    animation: ${(props) => (props.isturn ? rotate : '')} 2s linear infinite;
  }
`;
