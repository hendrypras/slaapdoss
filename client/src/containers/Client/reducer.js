import { produce } from 'immer';

import { SET_LOADING, SET_LOGIN, SET_TOKEN } from '@containers/Client/constants';

export const initialState = {
  login: false,
  loading: false,
  token: null,
};

export const storedKey = ['token', 'login'];

const clientReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOGIN:
        draft.login = action.login;
        break;
      case SET_TOKEN:
        draft.token = action.token;
        break;
      case SET_LOADING:
        draft.loading = action.loading;
        break;
    }
  });

export default clientReducer;
