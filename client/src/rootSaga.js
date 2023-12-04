import { all } from 'redux-saga/effects';

import loginSaga from '@pages/Login/saga';
import registerSaga from '@pages/Register/saga';
import forgotPasswordSaga from '@pages/ForgotPassword/saga';
import resetPasswordSaga from '@pages/ResetPassword/saga';
import paymentResponseSaga from '@pages/PaymentResponse/saga';


export default function* rootSaga() {
  yield all([
    loginSaga(),
    registerSaga(),
    forgotPasswordSaga(),
    resetPasswordSaga(),
    paymentResponseSaga(),
  ]);
}
