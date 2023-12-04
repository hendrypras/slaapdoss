import { produce } from 'immer';

import { SET_LOADING } from '@pages/ResetPassword/constants';

export const initialState = {
  loading: false,
};

const resetReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOADING:
        draft.loading = action.loading;
        break;
    }
  });

export default resetReducer;
