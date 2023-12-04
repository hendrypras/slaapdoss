import {
  USER_REGISTER,
  SET_LOADING,
  REGIST_EMAIL,
  SET_TOKEN_STEP,
  VERIFY_OTP,
  SET_EXP_OTP,
} from '@pages/Register/constants';

export const userRegister = (data, cb) => ({
  type: USER_REGISTER,
  data,
  cb,
});
export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});
export const registEmail = (data, cbSuccess) => ({
  type: REGIST_EMAIL,
  data,
  cbSuccess,
});
export const verifyOtp = (data, cbError) => ({
  type: VERIFY_OTP,
  data,
  cbError,
});
export const setTokenStep = (token) => ({
  type: SET_TOKEN_STEP,
  token,
});
export const setExpOtp = (exp) => ({
  type: SET_EXP_OTP,
  exp,
});
