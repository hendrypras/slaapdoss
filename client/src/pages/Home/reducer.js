import { produce } from 'immer';

import { SET_BANNERS, SET_LOADING, SET_VALUE_SEARCH } from '@pages/Home/constants';

import { getCheckIn, getCheckOut } from '@utils/times';

const dateCheckIn = getCheckIn();
const dateCheckout = getCheckOut();
export const initialState = {
  loading: false,
  search: {
    location: { display: '', value: '' },
    checkIn: { display: dateCheckIn.display, value: dateCheckIn.value },
    duration: { display: '1 Malam', value: 1 },
    checkOut: {
      display: dateCheckout.display,
      value: dateCheckout.value,
    },
  },
  banners: [],
};

const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOADING:
        draft.loading = action.loading;
        break;
      case SET_VALUE_SEARCH:
        draft.search = action.search;
        break;
      case SET_BANNERS:
        draft.banners = action.banners;
        break;
    }
  });

export default homeReducer;
