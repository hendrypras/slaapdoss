import {
  CREATE_ID_CARD,
  GET_DATA_CRUTIAL_USER,
  GET_USER_PROFILE,
  SET_DATA_CRUTIAL_USER,
  SET_DATA_ID_CARD,
  SET_IMAGE_CAPTURED,
  SET_IMAGE_SELECTED,
  SET_LOADING,
  SET_USER_PROFILE,
  UPDATE_USER_PROFILE,
  UPLOAD_ID_CARD,
} from '@pages/UserProfile/constants';

export const getUserProfile = () => ({
  type: GET_USER_PROFILE,
});
export const setUserProfile = (profile) => ({
  type: SET_USER_PROFILE,
  profile,
});
export const createIdCard = (data, cbSuccess, cbError) => ({
  type: CREATE_ID_CARD,
  data,
  cbSuccess,
  cbError,
});
export const uploadIdCard = (imageUrl) => ({
  type: UPLOAD_ID_CARD,
  imageUrl,
});
export const setDataIdCard = (data) => ({
  type: SET_DATA_ID_CARD,
  data,
});
export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});
export const setDataCrutialUser = (data) => ({
  type: SET_DATA_CRUTIAL_USER,
  data,
});
export const getDataCrutialUser = () => ({
  type: GET_DATA_CRUTIAL_USER,
});
export const setImageCaptured = (image) => ({
  type: SET_IMAGE_CAPTURED,
  image,
});
export const updateUserProfile = (data, cbSuccess) => ({
  type: UPDATE_USER_PROFILE,
  data,
  cbSuccess,
});
export const setImageSelected = (idCard, profile) => ({
  type: SET_IMAGE_SELECTED,
  imageSelected: {
    idCard,
    profile,
  },
});
