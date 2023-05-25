import axios from 'axios'
const TIME_OUT = 30 * 1000

const request = axios.create({
  baseURL: '/api',
  timeout: TIME_OUT,
})

// Add a response interceptor
request.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return {
      status: response.status,
      data: response.data,
    }
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default request
