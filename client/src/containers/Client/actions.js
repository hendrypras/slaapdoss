import { OAUTH_GOOGLE, SET_LOADING, SET_LOGIN, SET_TOKEN, USER_LOGIN } from '@containers/Client/constants';

export const setLogin = (login) => ({
  type: SET_LOGIN,
  login,
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  token,
});

export const oAuthGoogle = (data) => ({
  type: OAUTH_GOOGLE,
  data,
});
export const userLogin = (data, cb) => ({
  type: USER_LOGIN,
  data,
  cb,
});
export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});
