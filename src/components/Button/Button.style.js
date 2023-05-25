import styled from 'styled-components';

export const ButtonWrapper = styled.button`
  background-color: ${(props) => (props.primary ? '#E3627D' : '#47C5D8')};
  color: ${(props) => (props.primary ? '#FFFFFF' : '#000000')};
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border: 2px solid ${(props) => (props.primary ? 'blue' : 'black')};
  border-radius: 0.25rem;
  cursor: ${(props) => (props.disable ? 'auto' : 'pointer')};
  pointer-events: ${(props) => (props.disable ? 'none' : 'auto')};
  opacity: ${(props) => (props.disable ? '0.5' : '1')};

  :active {
    outline: none;
  }
  :focus {
    outline: 0;
  }
`;
