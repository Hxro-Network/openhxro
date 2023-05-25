import axios from 'axios'
import request from './request'

let cancelToken = undefined

/**
 * Get Market
 * @param {*} productSelect
 * @returns market information
 */
export const getMarKet = (productSelect) => {
  if (typeof cancelToken !== typeof undefined) {
    cancelToken.cancel('cancelToken')
  }
  cancelToken = axios.CancelToken.source()
  return request({
    method: 'GET',
    url: `${process.env.API_URL}/fills?product=${productSelect}`,
    cancelToken: cancelToken.token,
  })
}
