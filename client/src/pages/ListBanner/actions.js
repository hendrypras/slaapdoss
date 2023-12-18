import { GET_BANNERS, SET_BANNERS } from '@pages/ListBanner/constants';

export const getBanners = () => ({
  type: GET_BANNERS,
});
export const setBanners = (banners) => ({
  type: SET_BANNERS,
  banners,
});
