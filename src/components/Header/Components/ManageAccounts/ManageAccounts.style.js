import styled from 'styled-components';

export const ContentModal = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  background: #000;
  margin: auto;
  padding: 8px 15px;
  border-radius: 8px;
  outline: none;
  box-shadow: 2px 6px 20px -2px rgba(255, 255, 255, 0.29);
  -webkit-box-shadow: 2px 6px 20px -2px rgba(255, 255, 255, 0.29);
  -moz-box-shadow: 2px 6px 20px -2px rgba(255, 255, 255, 0.29);
`;

export const Title = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 19px;
  text-align: center;
  color: #ffffff;
  margin: 8px 0px 20px;
  padding: 0px;
`;

export const WrapperContentModal = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    color: #fff;
    border: 0px;
    background: #1d8898;
    transition: all 0.3s;
    :active {
      outline: none;
    }
    :focus {
      outline: 0;
    }

    :hover {
      background: #47c5d8;
    }
  }
`;

export const Label = styled.p`
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  margin: 0px 0px 10px;
  padding: 0px;
`;

export const WrapperAccount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  height: 32px;

  p {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 19px;
    margin: 0px;
    padding: 0px;

    span {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #fff;
      margin-right: 8px;
    }
  }

  img {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;

export const LabelNote = styled(Label)`
  font-weight: 700;
  text-align: center;
  margin: 12px 0px;
  color: #e3627d;
`;
