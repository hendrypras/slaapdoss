import { GET_DATAIL_LOCATION, SET_DATAIL_LOCATION } from '@pages/CreateDeatilCabin/constants';

export const getDetailLocation = (lat, lng) => ({
  type: GET_DATAIL_LOCATION,
  lat,
  lng,
});
export const setDetailLocation = (displayName) => ({
  type: SET_DATAIL_LOCATION,
  displayName,
});
