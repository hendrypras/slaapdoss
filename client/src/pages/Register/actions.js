import { USER_REGISTER, SET_LOADING, REGIST_EMAIL, SET_TOKEN_STEP, VERIFY_OTP } from '@pages/Register/constants';

export const userRegister = (data, cb) => ({
  type: USER_REGISTER,
  data,
  cb,
});
export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});
export const registEmail = (data) => ({
  type: REGIST_EMAIL,
  data,
});
export const verifyOtp = (data) => ({
  type: VERIFY_OTP,
  data,
});
export const setTokenStep = (token) => ({
  type: SET_TOKEN_STEP,
  token,
});
