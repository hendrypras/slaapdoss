import { GET_BANNERS, SET_BANNERS, SET_LOADING, SET_VALUE_SEARCH } from '@pages/Home/constants';

export const setSearchValue = (location, checkIn, duration, checkOut) => ({
  type: SET_VALUE_SEARCH,
  search: {
    location: { display: location.display, value: location.value },
    checkIn: { display: checkIn.display, value: checkIn.value },
    duration: { display: duration.display, value: duration.value },
    checkOut: { display: checkOut.display, value: checkOut.value },
  },
});
export const getBanners = () => ({
  type: GET_BANNERS,
});
export const setBanners = (banners) => ({
  type: SET_BANNERS,
  banners,
});
export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});
