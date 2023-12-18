import { RESET_PASSWORD, SET_LOADING, VERIFY_TOKEN_RESET_PASSWORD } from '@pages/ResetPassword/constants';

export const resetPassword = (token, data, cb) => ({
  type: RESET_PASSWORD,
  payload: {
    token,
    data,
  },
  cb,
});
export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});
export const verifyTokenResetPassword = (token, cbSuccess, cbError) => ({
  type: VERIFY_TOKEN_RESET_PASSWORD,
  token,
  cbSuccess,
  cbError,
});
