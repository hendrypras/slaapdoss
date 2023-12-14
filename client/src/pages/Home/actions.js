import { SET_VALUE_SEARCH } from '@pages/Home/constants';

export const setSearchValue = (location, checkIn, duration, checkOut) => ({
  type: SET_VALUE_SEARCH,
  search: {
    location: { display: location.display, value: location.value },
    checkIn: { display: checkIn.display, value: checkIn.value },
    duration: { display: duration.display, value: duration.value },
    checkOut: { display: checkOut.display, value: checkOut.value },
  },
});
