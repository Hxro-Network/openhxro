import React from 'react';
import { WrapperInput, InputContent, Percent } from './Input.style';

const Input = ({ percent, className, ...rest }) => {
  return (
    <WrapperInput className={`wrapper-${className}`}>
      <InputContent {...rest} />
      {percent && <Percent>%</Percent>}
    </WrapperInput>
  );
};

export default Input;
