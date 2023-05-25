import React from 'react';
import { ButtonWrapper } from './Button.style';

const Button = ({ children, className, onClick, disable }) => {
  return (
    <ButtonWrapper className={className} onClick={onClick} disable={disable}>
      {children}
    </ButtonWrapper>
  );
};

export default Button;
