import {
  GET_CABINS_LOCATION,
  GET_DETAIL_CABINS,
  GET_DETAIL_ROOM_CABIN,
  ROOM_SELECTED_TO_PAYMENT,
  SET_CABINS_LOCATION,
  SET_DATAIL_CABINS,
  SET_DETAIL_ROOM_CABIN,
  SET_LOADING,
} from '@pages/DetailCabins/constants';

export const getDetailCabins = (slug, dateStart, dateEnd) => ({
  type: GET_DETAIL_CABINS,
  slug,
  dateStart,
  dateEnd,
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

export const setRoomSelected = (roomId) => ({
  type: ROOM_SELECTED_TO_PAYMENT,
  roomId,
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
