import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Swal from 'sweetalert2';

import { selectLogin } from '@containers/Client/selectors';

import InputForm from '@components/InputForm';
import WrapperAuthentication from '@components/WrapperAuthentication';

import { resetPassword } from '@pages/ResetPassword/actions';
import { selectLoading } from '@pages/ResetPassword/selectors';

import encryptPayload from '@utils/encryptPayload';

import classes from './style.module.scss';

const ResetPassword = ({ login, loading, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const { token } = useParams();
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

  return (
    <WrapperAuthentication title="app_reset_password_title" isBackBtn>
      <FormProvider {...method}>
        <form action="#" onSubmit={method.handleSubmit(onSubmit)} className={classes.form}>
          <div className={classes.wrapperInput}>
            <div className={classes.title}>
              <FormattedMessage id="app_reset_password_title_input" />
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
          <div className={classes.wrapperInput}>
            <div className={classes.title}>
              <FormattedMessage id="app_reset_password_title_input_confirm" />
            </div>
            <InputForm
              errorStyle={classes.errorInput}
              className={classes.input}
              name="confirmPassword"
              type="password"
              placeholder="Enter your password"
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
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
