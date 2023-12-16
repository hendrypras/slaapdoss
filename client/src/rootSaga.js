import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import clientSaga from '@containers/Client/saga';

import registerSaga from '@pages/Register/saga';
import forgotPasswordSaga from '@pages/ForgotPassword/saga';
import resetPasswordSaga from '@pages/ResetPassword/saga';
import ordersSaga from '@pages/Orders/saga';
import createDetailCabinSaga from '@pages/CreateDeatilCabin/saga';
import userProfileSaga from '@pages/UserProfile/saga';
import detailCabinsSaga from '@pages/DetailCabins/saga';
import reservationSaga from '@pages/Reservation/saga';

export default function* rootSaga() {
  yield all([
    appSaga(),
    clientSaga(),
    registerSaga(),
    forgotPasswordSaga(),
    resetPasswordSaga(),
    ordersSaga(),
    createDetailCabinSaga(),
    userProfileSaga(),
    detailCabinsSaga(),
    reservationSaga(),
  ]);
}
