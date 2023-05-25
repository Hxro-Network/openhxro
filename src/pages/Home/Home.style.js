import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100vh;
  padding: 8px;
  padding-bottom: 0px;
  box-sizing: border-box;

  .select-content {
    width: 100%;
    height: 28px;
    background: transparent;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 2px;
    .option-content {
      background: #eee;
      color: #000;
    }
  }
`;
