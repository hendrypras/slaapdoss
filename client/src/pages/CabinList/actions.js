import { GET_ALL_CABIN, SET_ALL_CABIN } from '@pages/CabinList/constants';

export const getAllCabin = (slug, page, limit) => ({
  type: GET_ALL_CABIN,
  slug,
  page,
  limit,
});
export const setAllCabin = (data) => ({
  type: SET_ALL_CABIN,
  data,
});
