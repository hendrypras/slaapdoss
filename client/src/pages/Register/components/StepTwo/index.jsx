import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import OtpInput from 'react-otp-input';

import { registEmail, verifyOtp } from '@pages/Register/actions';

import encryptPayload from '@utils/encryptPayload';
import classes from './stye.module.scss';

const StepTwo = ({ loading, token, email }) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const handleSubmitOtp = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ code: Number(otp), token }));
  };
  const resendOtp = (e) => {
    e.preventDefault();
    const emailBody = encryptPayload(email);
    dispatch(registEmail({ email: emailBody }));
  };
  return (
    <form className={classes.form} onSubmit={handleSubmitOtp}>
      <div className={classes.wrapperInput}>
        <OtpInput
          containerStyle={classes.containerInput}
          inputStyle={classes.input}
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderInput={(props) => <input {...props} />}
        />
      </div>
      <div className={classes.resendWrapper}>
        <FormattedMessage id="app_sign_up_otp_message" />
        <button onClick={resendOtp} disabled={loading} type="button" className={classes.button} aria-label="button">
          {loading ? (
            <FormattedMessage id="app_text_loading_button" />
          ) : (
            <FormattedMessage id="app_sign_up_resend_otp_text" />
          )}
        </button>
      </div>
      <button disabled={loading} type="submit" aria-label="button">
        {loading ? (
          <FormattedMessage id="app_text_loading_button" />
        ) : (
          <FormattedMessage id="app_sign_up_button_verify_text" />
        )}
      </button>
    </form>
  );
};
StepTwo.propTypes = {
  loading: PropTypes.bool,
  token: PropTypes.string,
  email: PropTypes.string,
};
export default StepTwo;
