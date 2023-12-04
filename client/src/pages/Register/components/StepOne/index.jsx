import PropTypes from 'prop-types';
import EastIcon from '@mui/icons-material/East';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import GoogleIcon from '@mui/icons-material/Google';
import { Link } from 'react-router-dom';

import InputForm from '@components/InputForm';

import { registEmail } from '@pages/Register/actions';

import encryptPayload from '@utils/encryptPayload';

import classes from './style.module.scss';

const StepOne = ({ loading, handleAuth }) => {
  const method = useForm();
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    const email = encryptPayload(data?.email);
    dispatch(registEmail({ email }));
  };
  return (
    <FormProvider {...method}>
      <form className={classes.form} onSubmit={method.handleSubmit(onSubmit)}>
        <div className={classes.wrapperInput}>
          <div className={classes.title}>
            <FormattedMessage id="app_sign_up_email_title" />
          </div>
          <InputForm
            className={classes.input}
            name="email"
            type="text"
            placeholder="Enter your email"
            errorStyle={classes.errorInput}
            rules={{
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
            }}
          />
        </div>
        <button disabled={loading} type="submit" className={classes.button}>
          {loading ? (
            <FormattedMessage id="app_text_loading_button" />
          ) : (
            <>
              <FormattedMessage id="app_sign_up_button_next_text" /> <EastIcon />
            </>
          )}
        </button>
        <div className={classes.toLogin}>
          <FormattedMessage id="app_sign_up_text_to_login" />
          <Link to="/login">
            <FormattedMessage id="app_login_sign_in_title" />
          </Link>
        </div>
        <div className={classes.orText}>
          <FormattedMessage id="app_login_sign_in_or_text" />
        </div>
        <button onClick={handleAuth} type="button" aria-label="oauth" className={classes.googleBtn}>
          <GoogleIcon />
          <span className="ml-2">
            <FormattedMessage id="app_login_sign_in_with_google_text" />
          </span>
        </button>
      </form>
    </FormProvider>
  );
};

StepOne.propTypes = {
  loading: PropTypes.bool,
  handleAuth: PropTypes.func,
};
export default StepOne;
