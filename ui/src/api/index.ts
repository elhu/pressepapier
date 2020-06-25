import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_URL } from '../const'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
})

const setToken = (token: string) => {
  api.defaults.headers['Authorization'] = `Bearer ${token}`
}

const get = <T = any, R = AxiosResponse<T>>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<R> => {
  return api.get<T, R>(url, config)
}

const post = <T = any, R = AxiosResponse<T>>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<R> => {
  return api.post<T, R>(url, data, config)
}

export default {
  setToken,
  get,
  post,
}
