import { produce } from 'immer';
import moment from 'moment';
import formateDate from '@utils/formateDate';

import { SET_LOADING, SET_VALUE_SEARCH } from '@pages/Home/constants';

export const initialState = {
  loading: false,
  search: {
    location: { display: '', value: '' },
    checkIn: { display: formateDate(null, 'ddd, D MMMM YYYY'), value: formateDate(null, 'YYYY-MM-DD') },
    duration: { display: '1 Malam', value: 1 },
    checkOut: {
      display: moment().add(1, 'days').format('ddd, D MMMM YYYY'),
      value: moment().add(1, 'days').format('YYYY-MM-DD'),
    },
  },
};

const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOADING:
        draft.loading = action.data;
        break;
      case SET_VALUE_SEARCH:
        draft.search = action.search;
        break;
    }
  });

export default homeReducer;
