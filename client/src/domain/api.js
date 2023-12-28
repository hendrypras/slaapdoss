import config from '@config/index';
import { merge } from 'lodash';

import request from '@utils/request';

const urls = {
  auth: 'auth',
  payment: 'payment',
  user: 'user',
  cabin: ['cabin', 'cabins'],
  order: ['orders', 'order'],
  banner: ['banners', 'banner'],
};
export const callAPI = async (endpoint, method, header, params, data, withCredentials) => {
  const defaultHeader = {
    'Content-Type': 'application/json; charset=UTF-8',
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
export const verifyTokenResetPassword = (token) => callAPI(`${urls.auth}/verify-token/${token}`, 'POST', {}, {}, {});

export const getAssets = () => callAPI('asset/web', 'GET');
export const getTranslation = () => callAPI('translation/web', 'GET');
export const getDetailLocation = (lat, lng) =>
  request({
    url: `${config.api.openStreetMap}/reverse?lat=${lat}&lon=${lng}&zoom=18&format=json`,
    method: 'GET',
  }).then((response) => response.data);

// user
export const getUserProfile = () => callAPI(`${urls.user}/profile`, 'GET');
export const uploadIdCard = (data) => callAPI(`${urls.user}/upload/idcard`, 'POST', {}, {}, data);
export const createIdCard = (data) => callAPI(`${urls.user}/idcard`, 'POST', {}, {}, data);
export const getDataCredentialUser = () => callAPI(`${urls.user}/credential`, 'GET');
export const updateUserProfile = (data) =>
  callAPI(`${urls.user}/update/profile`, 'PATCH', { 'Content-Type': 'multipart/form-data' }, {}, data);

// Premium account

// Payment
export const requestPayment = (data) => callAPI(urls.payment, 'POST', {}, {}, data);
export const cancelPayment = (orderId) => callAPI(`${urls.payment}/cancel/${orderId}`, 'POST');
export const getPaymentMethods = () => callAPI(`${urls.payment}/methods`, 'GET');
export const getDetailOrder = (orderId) => callAPI(`${urls.order[1]}/${orderId}`, 'GET');
export const getOrdersUser = (orderId, page, limit) => {
  let url = `${urls.order[0]}?page=${page}&limit=${limit}`;
  if (orderId) {
    url += `&orderId=${orderId}&`;
  }
  return callAPI(url, 'GET');
};

export const getOrders = (orderId, page = 1, limit = 18) => {
  let url = `${urls.order[0]}/all?page=${page}&limit=${limit}`;
  if (orderId) {
    url += `&orderId=${orderId}`;
  }
  return callAPI(url, 'GET');
};

// cabin
export const getDetailCabins = (slug, dateStart, dateEnd) =>
  callAPI(`${urls.cabin[0]}/detail/${slug}?dateStart=${dateStart}&dateEnd=${dateEnd}`, 'GET');
export const getCabinsLocation = () => callAPI(`${urls.cabin[1]}/location`, 'GET');
export const getDetailCabinRoom = (slug, roomId) => callAPI(`${urls.cabin[0]}/room/${slug}/${roomId}`, 'GET');
export const getTypeRoom = () => callAPI(`${urls.cabin[0]}/type-room`, 'GET');
export const createRoom = (data) => callAPI(`${urls.cabin[0]}/room`, 'POST', {}, {}, data);
export const createCabin = (formData) =>
  callAPI(urls.cabin[0], 'POST', { 'Content-Type': 'multipart/form-data' }, {}, formData);
export const createTypeRoom = (formData) =>
  callAPI(`${urls.cabin[0]}/type-room`, 'POST', { 'Content-Type': 'multipart/form-data' }, {}, formData);

// banner
export const getBanners = () => callAPI(urls.banner[0], 'GET');
export const getBannersAdmin = () => callAPI(`${urls.banner[0]}/all`, 'GET');
export const deleteBanner = (bannerId) => callAPI(`${urls.banner[1]}/${bannerId}`, 'DELETE');
export const updateStatusBanner = (status, bannerId) => callAPI(`${urls.banner[1]}/${status}/${bannerId}`, 'PATCH');
export const createBanner = (formData) =>
  callAPI(urls.banner[1], 'POST', { 'Content-Type': 'multipart/form-data' }, {}, formData);
