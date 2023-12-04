import { produce } from 'immer';

import { SET_EXP_OTP, SET_LOADING, SET_TOKEN_STEP } from '@pages/Register/constants';

export const initialState = {
  loading: false,
  tokenStep: null,
  otpExp: null,
};

export const storedKey = ['tokenStep', 'otpExp'];

const registerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOADING:
        draft.loading = action.loading;
        break;
      case SET_TOKEN_STEP:
        draft.tokenStep = action.token;
        break;
      case SET_EXP_OTP:
        draft.otpExp = action.exp;
        break;
    }
  });

export default registerReducer;
