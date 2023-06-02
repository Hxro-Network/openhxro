import React from 'react';
import { ButtonWrapper } from './Button.style';

const Button = ({ children, className, onClick, disable, id }) => {
  return (
    <ButtonWrapper
      className={className}
      onClick={onClick}
      disable={disable}
      id={id}
    >
      {children}
    </ButtonWrapper>
  );
};

export default Button;
