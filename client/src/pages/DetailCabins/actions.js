import {
  GET_CABINS_LOCATION,
  GET_DETAIL_CABINS,
  GET_DETAIL_ROOM_CABIN,
  SET_CABINS_LOCATION,
  SET_DATAIL_CABINS,
  SET_DETAIL_ROOM_CABIN,
  SET_LOADING,
} from '@pages/DetailCabins/constants';

export const getDetailCabin = (slug, dateStart, dateEnd, cbSuccess, cbError) => ({
  type: GET_DETAIL_CABINS,
  slug,
  dateStart,
  dateEnd,
  cbSuccess,
  cbError,
});

export const setDetailCabin = (cabins) => ({
  type: SET_DATAIL_CABINS,
  cabins,
});

export const getCabinsLocation = () => ({
  type: GET_CABINS_LOCATION,
});

export const setCabinsLocation = (cabinsLocation) => ({
  type: SET_CABINS_LOCATION,
  cabinsLocation,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});

export const getDetailRoomCabin = (slug, roomId) => ({
  type: GET_DETAIL_ROOM_CABIN,
  slug,
  roomId,
});
export const setDetailRoomCabin = (data) => ({
  type: SET_DETAIL_ROOM_CABIN,
  data,
});
