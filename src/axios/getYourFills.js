import axios from 'axios';
import request from './request';

let cancelToken = undefined;

/**
 * Get Market
 * @param {productSelect, walletAddress} product
 * @returns your fills information
 */
export const getYourFills = (productSelect, walletAddress) => {
  if (typeof cancelToken !== typeof undefined) {
    cancelToken.cancel('cancelToken');
  }
  cancelToken = axios.CancelToken.source();
  return request({
    method: 'GET',
    url: `${process.env.API_URL}/fills?product=${productSelect}&trg=${walletAddress}`,
    cancelToken: cancelToken.token,
  });
};
