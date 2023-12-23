import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, connect } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { selectLogin, selectLoading } from '@containers/Client/selectors';
import { oAuthGoogle, userLogin } from '@containers/Client/actions';

import WrapperAuthentication from '@components/WrapperAuthentication';
import Button from '@components/Button';
import ButtonOauth from '@components/ButtonOauth';
import InputFormBasic from '@components/InputForm/Basic';

import encryptPayload from '@utils/encryptPayload';

import classes from './style.module.scss';

const Login = ({ login, loading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (login) {
      navigate('/');
    }
  }, [login, navigate]);

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
  const handleOAuth = (e) => {
    e.preventDefault();
    dispatch(oAuthGoogle());
  };
  return (
    <WrapperAuthentication title="app_login_sign_in_title" isBackBtn>
      <FormProvider {...method}>
        <form action="#" onSubmit={method.handleSubmit(onSubmit)} className={classes.form}>
          <InputFormBasic
            title="app_login_sign_in_email_title"
            name="email"
            type="text"
            placeholder="Enter your email"
            rules={{
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
            }}
          />
          <InputFormBasic
            title="app_login_sign_in_password_title"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            classWrapper={classes.wrapperInput}
            rules={{
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            }}
          >
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              aria-label="button-visibility"
              className={classes.icon}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </button>
          </InputFormBasic>

          <div className={classes.wrapperForgot}>
            <Link className={classes.forgot} to="/forgot-password">
              <FormattedMessage id="app_login_sign_in_forgot_password_text" />
            </Link>
          </div>
          <Button isLoading={loading} type="submit">
            {loading ? (
              <FormattedMessage id="app_text_loading_button" />
            ) : (
              <FormattedMessage id="app_login_sign_in_submit_text" />
            )}
          </Button>
          <div className={classes.orText}>
            <Divider />
            <div className={classes.text}>
              <FormattedMessage id="app_login_sign_in_or_text" />
            </div>
          </div>
          <ButtonOauth handleClick={handleOAuth} />
          <div className={classes.toRegister}>
            <FormattedMessage id="app_login_sign_in_go_to_register_text" />
            <Link to="/register">
              <FormattedMessage id="app_login_sign_in_go_to_register_button" />
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
