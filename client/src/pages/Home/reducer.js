import { produce } from 'immer';

import { SET_LOADING } from '@pages/Home/constants';

export const initialState = {
  loading: false,
};

const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOADING:
        draft.loading = action.data;
        break;
    }
  });

export default homeReducer;
