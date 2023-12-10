import { GET_DETAIL_CABINS, SET_DATAIL_CABINS } from '@pages/DetailCabins/constants';

export const getDetailCabins = (data) => ({
  type: GET_DETAIL_CABINS,
  data,
});
export const setDetailCabin = (cabins) => ({
  type: SET_DATAIL_CABINS,
  cabins,
});
