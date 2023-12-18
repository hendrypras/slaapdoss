import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import { selectLogin } from '@containers/Client/selectors';

import InputForm from '@components/InputForm';
import WrapperAuthentication from '@components/WrapperAuthentication';
import Button from '@components/Button';

import encryptPayload from '@utils/encryptPayload';

import { forgotPassword } from '@pages/ForgotPassword/actions';
import { selectLoading } from '@pages/ForgotPassword/selectors';

import classes from './style.module.scss';

const ForgotPassword = ({ login, loading, intl: { formatMessage } }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (login) {
      navigate('/');
    }
  }, [login, navigate]);

  const dispatch = useDispatch();
  const method = useForm();
  const onSubmit = (data) => {
    const email = encryptPayload(data?.email);
    dispatch(
      forgotPassword(
        { email },
        () => {
          method.reset({ email: '' });
          Swal.fire({
            title: formatMessage({ id: 'app_forgot_password_success_title_message' }),
            text: formatMessage({ id: 'app_forgot_password_success_text_message' }),
            icon: 'success',
            confirmButtonText: 'Oke',
            preConfirm: () => navigate('/login'),
          });
        },
        () => {
          method.reset({ email: '' });
        }
      )
    );
  };

  return (
    <WrapperAuthentication subTitle="app_forgot_password_paragraf_info" title="app_forgot_password_title" isBackBtn>
      <FormProvider {...method}>
        <form action="#" onSubmit={method.handleSubmit(onSubmit)} className={classes.form}>
          <div className={classes.wrapperInput}>
            <div className={classes.title}>
              <FormattedMessage id="app_forgot_password_email_title" />
            </div>
            <InputForm
              className={classes.input}
              name="email"
              type="text"
              placeholder={formatMessage({ id: 'app_sign_up_email_place_holder' })}
              errorStyle={classes.errorInput}
              rules={{
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
              }}
            />
          </div>
          <Button isLoading={loading} type="submit">
            {loading ? (
              <FormattedMessage id="app_text_loading_button" />
            ) : (
              <FormattedMessage id="app_forgot_submit_button_title" />
            )}
          </Button>
          <div className={classes.toLogin}>
            <FormattedMessage id="app_sign_up_text_to_login" />
            <Link to="/login">
              <FormattedMessage id="app_sign_up_go_to_login_button" />
            </Link>
          </div>
        </form>
      </FormProvider>
    </WrapperAuthentication>
  );
};

ForgotPassword.propTypes = {
  login: PropTypes.bool,
  loading: PropTypes.bool,
  intl: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  loading: selectLoading,
});
export default injectIntl(connect(mapStateToProps)(ForgotPassword));
