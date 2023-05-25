import React, { useState } from 'react';
import styled from 'styled-components';
import Icon from '../../assets/copy-icon.svg';

export default function IconCopy({ className, value }) {
  const [showCopped, setShowCopped] = useState(false);
  const handleClickCopyAccount = () => {
    setShowCopped(true);
    navigator.clipboard.writeText(value);
    setTimeout(() => {
      setShowCopped(false);
    }, 2000);
  };

  return (
    <WrapperIconCopy className={className}>
      <img src={Icon} alt="icon" onClick={handleClickCopyAccount} />
      {showCopped && <div className="copped">Copped!</div>}
    </WrapperIconCopy>
  );
}

const WrapperIconCopy = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
  }

  .copped {
    font-size: 12px;
    font-weight: 600;
    padding: 2px 4px;
    margin: 0px;
    border-radius: 4px;
    position: absolute;
    background: #fff;
    color: #131b28;
    z-index: 2;
  }
`;
