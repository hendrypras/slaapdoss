import { DELETE_BANNER, GET_BANNERS, UPDATE_STATUS_BANNER, SET_BANNERS } from '@pages/ListBanner/constants';

export const getBanners = () => ({
  type: GET_BANNERS,
});
export const setBanners = (banners) => ({
  type: SET_BANNERS,
  banners,
});
export const deleteBanner = (bannerId, cbSuccess) => ({
  type: DELETE_BANNER,
  bannerId,
  cbSuccess,
});
export const updateStatusBanner = (status, bannerId, cbSuccess) => ({
  type: UPDATE_STATUS_BANNER,
  status,
  bannerId,
  cbSuccess,
});
