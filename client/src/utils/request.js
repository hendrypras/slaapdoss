/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';

import { logout, refreshToken } from '@domain/api';
import { setToken } from '@containers/Client/actions';
import store from '../configureStore';

let isRefreshing = false;
const failedRequestsQueue = [];

axios.interceptors.request.use((requestConfig) => {
  const state = store.getState();
  const { token } = state.client;
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

const processFailedRequests = async () => {
  while (failedRequestsQueue.length > 0) {
    const { request, resolve, reject } = failedRequestsQueue.shift();
    try {
      const response = await axios(request);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  }
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { dispatch } = store;
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await refreshToken();

          if (response?.data?.token) {
            dispatch(setToken(response?.data?.token));
            originalRequest.headers.Authorization = `Bearer ${response?.data?.token}`;
            originalRequest._retry = true;

            await processFailedRequests();
            return axios(originalRequest);
          }
        } catch (err) {
          try {
            await logout();
          } catch {
            return Promise.reject(err);
          } finally {
            localStorage.clear();
            window.location.href = '/';
          }
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Jika sedang refresh token, menambahkan permintaan yang gagal ke antrian
        const retryOriginalRequest = new Promise((resolve, reject) => {
          failedRequestsQueue.push({ request: originalRequest, resolve, reject });
        });
        return retryOriginalRequest;
      }
    }
    return Promise.reject(error);
  }
);

const request = (options) => axios(options);

export default request;
