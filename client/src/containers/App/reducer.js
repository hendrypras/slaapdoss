import { produce } from 'immer';

import { SET_LOCAL, SET_POPUP, SET_LOADING, SET_ASSETS } from '@containers/App/constants';

export const initialState = {
  locale: 'id',
  popup: {
    open: false,
    title: '',
    titleId: '',
    message: '',
    messageId: '',
    ok: '',
  },
  loading: false,
  assets: null,
};

export const storedKey = ['locale', 'assets'];

const appReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOCAL:
        draft.locale = action.locale;
        break;
      case SET_POPUP:
        draft.popup = action.popup;
        break;
      case SET_LOADING:
        draft.loading = action.loading;
        break;
      case SET_ASSETS:
        draft.assets = action.assets;
        break;
    }
  });

export default appReducer;
