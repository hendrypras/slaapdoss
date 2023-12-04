import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import { selectLogin } from '@containers/Client/selectors';

import InputForm from '@components/InputForm';
import WrapperAuthentication from '@components/WrapperAuthentication';

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
      forgotPassword({ email }, () => {
        method.reset({ email: '' });
        Swal.fire({
          title: formatMessage({ id: 'app_forgot_password_success_title_message' }),
          text: formatMessage({ id: 'app_forgot_password_success_text_message' }),
          icon: 'success',
          confirmButtonText: 'Oke',
          preConfirm: () => navigate('/login'),
        });
      })
    );
  };

  return (
    <WrapperAuthentication title="app_forgot_password_title" isBackBtn>
      <FormProvider {...method}>
        <form className={classes.form} onSubmit={method.handleSubmit(onSubmit)}>
          <div className={classes.paragraf}>
            <FormattedMessage id="app_forgot_password_paragraf_info" />
          </div>
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
              <FormattedMessage id="app_forgot_submit_button_title" />
            )}
          </button>
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
