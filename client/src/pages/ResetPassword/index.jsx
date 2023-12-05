import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { selectLogin } from '@containers/Client/selectors';

import InputForm from '@components/InputForm';
import WrapperAuthentication from '@components/WrapperAuthentication';
import Button from '@components/Button';

import { resetPassword } from '@pages/ResetPassword/actions';
import { selectLoading } from '@pages/ResetPassword/selectors';

import encryptPayload from '@utils/encryptPayload';

import classes from './style.module.scss';

const ResetPassword = ({ login, loading, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [show, setShow] = useState({
    password: false,
    confirmPassword: false,
  });
  useEffect(() => {
    if (login) {
      navigate('/');
    }
  }, [login, navigate]);
  const dispatch = useDispatch();
  const method = useForm();
  const onSubmit = (data) => {
    const payload = encryptPayload(data);
    dispatch(
      resetPassword(token, { payload }, () => {
        method.reset({ password: '', confirmPassword: '' });
        Swal.fire({
          title: formatMessage({ id: 'app_reset_password_popup_title_success' }),
          text: formatMessage({ id: 'app_reset_password_popup_message_success' }),
          icon: 'success',
          confirmButtonText: 'Oke',
          preConfirm: () => navigate('/login'),
        });
      })
    );
  };

  const handleShowPassword = (e, inputName) => {
    e.preventDefault();
    setShow((prevState) => ({
      ...prevState,
      [inputName]: !prevState[inputName],
    }));
  };
  return (
    <WrapperAuthentication subTitle="app_reset_password_sub_title" title="app_reset_password_title" isBackBtn>
      <FormProvider {...method}>
        <form action="#" onSubmit={method.handleSubmit(onSubmit)} className={classes.form}>
          <div className={classes.wrapperInput}>
            <div className={classes.title}>
              <FormattedMessage id="app_reset_password_title" />
            </div>
            <InputForm
              errorStyle={classes.errorInput}
              className={classes.input}
              name="password"
              type={show.password ? 'text' : 'password'}
              placeholder={formatMessage({ id: 'app_sign_up_password_place_holder' })}
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              }}
            />
            <button
              onClick={(e) => handleShowPassword(e, 'password')}
              type="button"
              aria-label="button-visibility"
              className={classes.icon}
            >
              {show.password ? <Visibility /> : <VisibilityOff />}
            </button>
          </div>

          <div className={classes.wrapperInput}>
            <div className={classes.title}>
              <FormattedMessage id="app_reset_password_title_input_confirm" />
            </div>
            <InputForm
              errorStyle={classes.errorInput}
              className={classes.input}
              name="confirmPassword"
              type={show.confirmPassword ? 'text' : 'password'}
              placeholder={formatMessage({ id: 'app_sign_up_confirm_password_place_holder' })}
              rules={{
                required: 'Confirm Password is required',
                minLength: { value: 6, message: 'Confirm Password  must be at least 6 characters' },
              }}
            />
            <button
              onClick={(e) => handleShowPassword(e, 'confirmPassword')}
              type="button"
              aria-label="button-visibility"
              className={classes.icon}
            >
              {show.confirmPassword ? <Visibility /> : <VisibilityOff />}
            </button>
          </div>
          <Button
            isLoading={loading}
            type="submit"
            text={loading ? 'app_text_loading_button' : 'app_forgot_submit_button_title'}
          />
        </form>
      </FormProvider>
    </WrapperAuthentication>
  );
};

ResetPassword.propTypes = {
  login: PropTypes.bool,
  loading: PropTypes.bool,
  intl: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  loading: selectLoading,
});
export default injectIntl(connect(mapStateToProps)(ResetPassword));
