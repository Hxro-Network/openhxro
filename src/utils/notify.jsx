import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

export const toastUISenOrder = {
  loading: <div className="title">Getting blockhash to send new order...!</div>,
  sending: {
    render: <div>Sending new order transaction...</div>,
    type: 'pending',
    isLoading: true,
    autoClose: 1000,
  },
  new: (message) => {
    return {
      render: (
        <div> New order transaction sent to chain. Confirming... {message}</div>
      ),
      type: 'pending',
      isLoading: true,
      autoClose: 1000,
    };
  },
  success: (message) => {
    return {
      render: <div className="title"> New order succeeded! {message}</div>,
      type: 'success',
      isLoading: false,
      autoClose: 3000,
    };
  },
  error: (message) => {
    return {
      render: <div className="title"> Failed to send new order! {message}</div>,
      type: 'error',
      isLoading: false,
      autoClose: 3000,
    };
  },
};

export const toastUICancelOrder = {
  loading: (
    <div className="title">Getting blockhash to send cancel orders...!</div>
  ),
  sending: {
    render: <div>Sending cancel orders transaction...</div>,
    type: 'pending',
    isLoading: true,
    autoClose: 1000,
  },
  new: (message) => {
    return {
      render: (
        <div>
          {' '}
          Cancel orders transaction sent to chain. Confirming... {message}
        </div>
      ),
      type: 'pending',
      isLoading: true,
      autoClose: 1000,
    };
  },
  success: (message) => {
    return {
      render: <div className="title"> Cancel orders succeeded! {message}</div>,
      type: 'success',
      isLoading: false,
      autoClose: 3000,
    };
  },
  error: (message) => {
    return {
      render: (
        <div className="title"> Failed to send cancel orders! {message}</div>
      ),
      type: 'error',
      isLoading: false,
      autoClose: 3000,
    };
  },
};

export const NotifyContainer = () => (
  <WrapperToast>
    <ToastContainer
      position="bottom-left"
      limit={10}
      autoClose={1500}
      closeOnClick
      theme="dark"
      pauseOnFocusLoss={false}
    />
  </WrapperToast>
);

const WrapperToast = styled.div`
  .Toastify__toast-container {
    width: auto;
    max-width: 500px;
  }
`;
