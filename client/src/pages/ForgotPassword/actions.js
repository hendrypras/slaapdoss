import { FORGOT_PASSWORD, SET_LOADING } from '@pages/ForgotPassword/constants';

export const forgotPassword = (data, cbSuccess, cbError) => ({
  type: FORGOT_PASSWORD,
  data,
  cbSuccess,
  cbError,
});
export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});
