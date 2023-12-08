import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import clientSaga from '@containers/Client/saga';
import registerSaga from '@pages/Register/saga';
import forgotPasswordSaga from '@pages/ForgotPassword/saga';
import resetPasswordSaga from '@pages/ResetPassword/saga';
import paymentResponseSaga from '@pages/PaymentResponse/saga';
import createDetailCabinSaga from '@pages/CreateDeatilCabin/saga';
import userProfileSaga from '@pages/UserProfile/saga';

export default function* rootSaga() {
  yield all([
    appSaga(),
    clientSaga(),
    registerSaga(),
    forgotPasswordSaga(),
    resetPasswordSaga(),
    paymentResponseSaga(),
    createDetailCabinSaga(),
    userProfileSaga(),
  ]);
}
