import { combineReducers } from 'redux';

import appReducer, { storedKey as storedAppState } from '@containers/App/reducer';
import clientReducer, { storedKey as storedClientState } from '@containers/Client/reducer';
import languageReducer from '@containers/Language/reducer';

import userProfileReducer, { storedKey as storedUserProfile } from '@pages/UserProfile/reducer';
import registerReducer, { storedKey as storedRegisterState } from '@pages/Register/reducer';
import detailCabinsReducer, { storedKey as storedDetailCabins } from '@pages/DetailCabins/reducer';
import homeReducer from '@pages/Home/reducer';
import forgotPasswordReducer from '@pages/ForgotPassword/reducer';
import resetPasswordReducer from '@pages/ResetPassword/reducer';
import ordersReducer from '@pages/Orders/reducer';
import createCabinReducer from '@pages/CreateCabin/reducer';
import reservationReducer from '@pages/Reservation/reducer';
import ordersAdminReducer from '@pages/OrdersAdmin/reducer';
import createTypeRoomReducer from '@pages/CreateTypeRoom/reducer';
import listBannerReducer from '@pages/ListBanner/reducer';
import editTypeRoomReducer from '@pages/EditTypeRoom/reducer';
import cabinListReducer from '@pages/CabinList/reducer';

import { mapWithPersistor } from './persistence';

const storedReducers = {
  app: { reducer: appReducer, whitelist: storedAppState },
  client: { reducer: clientReducer, whitelist: storedClientState },
  register: { reducer: registerReducer, whitelist: storedRegisterState },
  userProfile: { reducer: userProfileReducer, whitelist: storedUserProfile },
  detailCabins: { reducer: detailCabinsReducer, whitelist: storedDetailCabins },
};

const temporaryReducers = {
  language: languageReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  home: homeReducer,
  orders: ordersReducer,
  ordersAdmin: ordersAdminReducer,
  createCabin: createCabinReducer,
  createTypeRoom: createTypeRoomReducer,
  reservation: reservationReducer,
  listBanner: listBannerReducer,
  editTypeRoom: editTypeRoomReducer,
  cabinList: cabinListReducer,
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
