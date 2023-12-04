/* eslint-disable no-underscore-dangle */
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import GoogleIcon from '@mui/icons-material/Google';
import { useDispatch, connect } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import toast from 'react-hot-toast';

import { selectLogin } from '@containers/Client/selectors';

import WrapperAuthentication from '@components/WrapperAuthentication';
import InputForm from '@components/InputForm';

import encryptPayload from '@utils/encryptPayload';
import { auth } from '@utils/firebase';

import { oAuthGoogle, userLogin } from '@pages/Login/actions';
import { selectLoading } from '@pages/Login/selectors';

import classes from './style.module.scss';

const Login = ({ login, loading }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (login) {
      navigate('/');
    }
  }, [login, navigate]);

  useEffect(() => {
    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = 'c79da583-5675-4635-8906-e766993011d6';

    // Buat element script untuk menambahkan Snap.js ke halaman
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const dispatch = useDispatch();
  const method = useForm();
  const onSubmit = (data) => {
    const email = encryptPayload(data?.email);
    const password = encryptPayload(data?.password);
    dispatch(
      userLogin({ email, password }, () => {
        navigate('/');
      })
    );
  };
  // const provider = new GoogleAuthProvider();
  // const result = await signInWithPopup(auth, provider);
  // const firstName = result?._tokenResponse?.firstName;
  // const lastName = result?._tokenResponse?.fullName;
  // const email = result?._tokenResponse?.email;
  // const image = result?._tokenResponse?.photoUrl;
  // dispatch(
  //   oAuthGoogle({
  //     first_name: firstName,
  //     last_name: lastName,
  //     image,
  //     email,
  //   })
  // );

  const handleAuth = async () => {
    try {
      window.snap.pay('af414eaf-e1f0-48aa-93a6-9e307c0e128d');
    } catch (error) {
      Promise.reject(error);
    }
  };
  return (
    <WrapperAuthentication title="app_login_sign_in_title" isBackBtn>
      <FormProvider {...method}>
        <form action="#" onSubmit={method.handleSubmit(onSubmit)} className={classes.form}>
          <div className={classes.wrapperInput}>
            <div className={classes.title}>
              <FormattedMessage id="app_login_sign_in_email_title" />
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

          <div className={classes.wrapperInput}>
            <div className={classes.title}>
              <FormattedMessage id="app_login_sign_in_password_title" />
            </div>
            <InputForm
              errorStyle={classes.errorInput}
              className={classes.input}
              name="password"
              type="password"
              placeholder="Enter your password"
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              }}
            />
          </div>
          <Link className={classes.forgot} to="/forgot-password">
            <FormattedMessage id="app_login_sign_in_forgot_password_text" />
          </Link>
          <button disabled={loading} type="submit">
            {loading ? (
              <FormattedMessage id="app_text_loading_button" />
            ) : (
              <FormattedMessage id="app_login_sign_in_title" />
            )}
          </button>
          <div className={classes.orText}>
            <FormattedMessage id="app_login_sign_in_or_text" />
          </div>
          <button onClick={handleAuth} type="button" aria-label="oauth" className={classes.googleBtn}>
            <GoogleIcon />
            <span className="ml-2">
              <FormattedMessage id="app_login_sign_in_with_google_text" />
            </span>
          </button>
          <div className={classes.toRegister}>
            <FormattedMessage id="app_login_sign_in_go_to_register" />
            <Link to="/register">
              <FormattedMessage id="app_sign_up_title" />
            </Link>
          </div>
        </form>
      </FormProvider>
    </WrapperAuthentication>
  );
};
const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  loading: selectLoading,
});
Login.propTypes = {
  login: PropTypes.bool,
  loading: PropTypes.bool,
};

export default connect(mapStateToProps)(Login);
