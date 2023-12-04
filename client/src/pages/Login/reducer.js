import { produce } from 'immer';

import { SET_LOADING } from '@pages/Login/constants';

export const initialState = {
  loading: false,
};

const loginReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOADING:
        draft.loading = action.loading;
        break;
    }
  });

export default loginReducer;
