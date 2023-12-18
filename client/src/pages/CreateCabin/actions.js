import {
  CREATE_CABIN,
  GET_DATAIL_LOCATION,
  SET_DATAIL_LOCATION,
  SET_DISPLAY_LOCATION,
} from '@pages/CreateCabin/constants';

export const getDetailLocation = (lat, lng) => ({
  type: GET_DATAIL_LOCATION,
  lat,
  lng,
});
export const setDisplayLocation = (displayName) => ({
  type: SET_DISPLAY_LOCATION,
  displayName,
});
export const setPosition = (selectedPosition) => ({
  type: SET_DATAIL_LOCATION,
  selectedPosition,
});
export const createCabin = (data, cbSuccess) => ({
  type: CREATE_CABIN,
  data,
  cbSuccess,
});
