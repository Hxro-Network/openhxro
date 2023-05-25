import { ReactComponent as Signature } from '@assets/signature.svg';
import { StyledFooterWrapper } from './Footer.style';

const Footer = () => {
  return (
    <StyledFooterWrapper>
    <span>POWERED BY</span>
      <Signature />
    </StyledFooterWrapper>
  );
};

export default Footer;
