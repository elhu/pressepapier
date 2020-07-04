import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '../const';
import firebase from '../utils/firebase';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
});
api.interceptors.request.use(async (config) => {
  const token = await firebase.auth().currentUser?.getIdToken();
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

const get = <T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> => {
  return api.get<T, R>(url, config);
};

const post = <T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> => {
  return api.post<T, R>(url, data, config);
};

const del = <T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> => {
  return api.delete<T, R>(url, config);
};

export default {
  get,
  post,
  del,
};
