import { FORGOT_PASSWORD, SET_LOADING } from '@pages/ForgotPassword/constants';

export const forgotPassword = (data, cb) => ({
  type: FORGOT_PASSWORD,
  data,
  cb,
});
export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});
