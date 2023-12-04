import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import OtpInput from 'react-otp-input';
import Countdown from 'react-countdown';

import { registEmail, verifyOtp } from '@pages/Register/actions';

import Button from '@components/Button';

import encryptPayload from '@utils/encryptPayload';

import classes from './style.module.scss';

const StepTwo = ({ loading, token, email, otpExp }) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const currentTime = Math.floor(Date.now() / 1000);
  const handleSubmitOtp = (e) => {
    e.preventDefault();
    dispatch(
      verifyOtp({ code: Number(otp), token }, () => {
        setOtp('');
      })
    );
  };

  const resendOtp = (e) => {
    e.preventDefault();
    const emailBody = encryptPayload(email);
    dispatch(
      registEmail({ email: emailBody }, () => {
        window.location.reload();
      })
    );
  };

  return (
    <form className={classes.form} onSubmit={handleSubmitOtp}>
      <div className={classes.wrapperInput}>
        <OtpInput
          containerStyle={classes.containerInput}
          inputStyle={classes.input}
          shouldAutoFocus
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderInput={(props) => <input {...props} />}
        />
      </div>
      <div className={classes.resendWrapper}>
        <FormattedMessage id="app_sign_up_otp_message" />
        <Countdown
          date={Date.now() + (otpExp - currentTime) * 1000}
          renderer={({ minutes, seconds, completed }) => {
            if (completed) {
              return (
                <button
                  onClick={resendOtp}
                  disabled={loading}
                  type="button"
                  className={classes.button}
                  aria-label="button"
                >
                  {loading ? (
                    <FormattedMessage id="app_text_loading_button" />
                  ) : (
                    <FormattedMessage id="app_sign_up_resend_otp_text" />
                  )}
                </button>
              );
            }
            return (
              <div style={{ color: '#333333', fontWeight: '600' }}>
                ( {minutes} : {seconds} )
              </div>
            );
          }}
        />
      </div>
      <Button
        isLoading={loading}
        type="submit"
        text={loading ? 'app_text_loading_button' : 'app_sign_up_button_verify_text'}
      />
    </form>
  );
};
StepTwo.propTypes = {
  loading: PropTypes.bool,
  token: PropTypes.string,
  email: PropTypes.string,
  otpExp: PropTypes.number,
};
export default StepTwo;
