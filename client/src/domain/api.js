import config from '@config/index';
import { merge } from 'lodash';

import request from '@utils/request';

const urls = {
  auth: 'auth',
  payment: 'payment',
  user: 'user',
  asset: 'asset',


export const callAPI = async (endpoint, method, header, params, data, withCredentials) => {
  const defaultHeader = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  };

  const headers = merge(defaultHeader, header);
  const options = {
    url: config.api.host + endpoint,
    method,
    headers,
    data,
    params,
    withCredentials,
  };

  return request(options).then((response) => {
    const responseAPI = response.data;
    return responseAPI;
  });
};

// Authentication
export const oAuthGoogle = (data) => callAPI(`${urls.auth}/register/google`, 'POST', {}, {}, data, true);
export const login = (data) => callAPI(`${urls.auth}/login`, 'POST', {}, {}, data, true);
export const refreshToken = () => callAPI(`${urls.auth}/refresh-token`, 'GET', {}, {}, {}, true);
export const logout = () => callAPI(`${urls.auth}/logout`, 'POST', {}, {}, {}, true);
export const registEmail = (data) => callAPI(`${urls.auth}/otp`, 'POST', {}, {}, data);
export const verifyOtp = (data) => callAPI(`${urls.auth}/verify-otp`, 'POST', {}, {}, data);
export const register = (data) => callAPI(`${urls.auth}/register`, 'POST', {}, {}, data);
export const forgotPassword = (data) => callAPI(`${urls.auth}/forgot-password`, 'POST', {}, {}, data);
export const resetPassword = (token, data) => callAPI(`${urls.auth}/reset-password/${token}`, 'PATCH', {}, {}, data);
export const getAssets = () => callAPI(`${urls.asset}/web`, 'GET');


export const getUserProfile = () => callAPI(`${urls.user}/profile`, 'GET');
export const getUserProfile2 = () => callAPI(`${urls.user}/profile/2`, 'GET');

// Premium account

// Payment
export const requestPayment = (data) => callAPI(urls.payment, 'POST', {}, {}, data);
export const getPaymentMethods = () => callAPI(`${urls.payment}/methods`, 'GET');
export const getResponsePaymentByOrderId = (orderId) => callAPI(`${urls.payment}/response/${orderId}`, 'GET');
