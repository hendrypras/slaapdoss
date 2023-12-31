import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import clientSaga from '@containers/Client/saga';

import registerSaga from '@pages/Register/saga';
import forgotPasswordSaga from '@pages/ForgotPassword/saga';
import resetPasswordSaga from '@pages/ResetPassword/saga';
import ordersSaga from '@pages/Orders/saga';
import createCabinSaga from '@pages/CreateCabin/saga';
import userProfileSaga from '@pages/UserProfile/saga';
import detailCabinsSaga from '@pages/DetailCabins/saga';
import reservationSaga from '@pages/Reservation/saga';
import homeSaga from '@pages/Home/saga';
import createTypeRoomSaga from '@pages/CreateTypeRoom/saga';
import createRoomSaga from '@pages/CreateRoom/saga';
import createBannerSaga from '@pages/CreateBanner/saga';
import ordersAdminSaga from '@pages/OrdersAdmin/saga';
import listBannerSaga from '@pages/ListBanner/saga';
import editTypeRoomSaga from '@pages/EditTypeRoom/saga';
import cabinListSaga from '@pages/CabinList/saga';

export default function* rootSaga() {
  yield all([
    appSaga(),
    clientSaga(),
    homeSaga(),
    registerSaga(),
    forgotPasswordSaga(),
    resetPasswordSaga(),
    ordersSaga(),
    createCabinSaga(),
    userProfileSaga(),
    detailCabinsSaga(),
    reservationSaga(),
    createTypeRoomSaga(),
    createRoomSaga(),
    createBannerSaga(),
    ordersAdminSaga(),
    listBannerSaga(),
    editTypeRoomSaga(),
    cabinListSaga(),
  ]);
}
