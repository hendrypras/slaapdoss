import { RESET_PASSWORD, SET_LOADING } from '@pages/ResetPassword/constants';

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
