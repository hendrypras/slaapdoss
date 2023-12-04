import { OAUTH_GOOGLE, USER_LOGIN, SET_LOADING } from '@pages/Login/constants';

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
