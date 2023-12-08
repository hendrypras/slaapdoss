import { combineReducers } from 'redux';

import appReducer, { storedKey as storedAppState } from '@containers/App/reducer';
import clientReducer, { storedKey as storedClientState } from '@containers/Client/reducer';
import registerReducer, { storedKey as storedRegisterState } from '@pages/Register/reducer';
import languageReducer from '@containers/Language/reducer';

import homeReducer from '@pages/Home/reducer';
import forgotPasswordReducer from '@pages/ForgotPassword/reducer';
import resetPasswordReducer from '@pages/ResetPassword/reducer';
import paymentResponseReducer from '@pages/PaymentResponse/reducer';
import createDetailCabinReducer from '@pages/CreateDeatilCabin/reducer';
import userProfileReducer, { storedKey as storedUserProfile } from '@pages/UserProfile/reducer';

import { mapWithPersistor } from './persistence';

const storedReducers = {
  app: { reducer: appReducer, whitelist: storedAppState },
  client: { reducer: clientReducer, whitelist: storedClientState },
  register: { reducer: registerReducer, whitelist: storedRegisterState },
  userProfile: { reducer: userProfileReducer, whitelist: storedUserProfile },
};

const temporaryReducers = {
  language: languageReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  home: homeReducer,
  responsePayment: paymentResponseReducer,
  createDetailCabin: createDetailCabinReducer,
};

const createReducer = () => {
  const coreReducer = combineReducers({
    ...mapWithPersistor(storedReducers),
    ...temporaryReducers,
  });
  const rootReducer = (state, action) => coreReducer(state, action);
  return rootReducer;
};

export default createReducer;
