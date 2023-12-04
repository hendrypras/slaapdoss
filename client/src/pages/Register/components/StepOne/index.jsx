import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { Divider } from '@mui/material';
import { Link } from 'react-router-dom';

import InputForm from '@components/InputForm';
import Button from '@components/Button';
import ButtonOauth from '@components/ButtonOauth';

import { registEmail } from '@pages/Register/actions';

import encryptPayload from '@utils/encryptPayload';

import classes from './style.module.scss';

const StepOne = ({ loading, handleAuth, loadingOauth, intl: { formatMessage } }) => {
  const method = useForm();
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    const email = encryptPayload(data?.email);
    dispatch(registEmail({ email }));
  };
  return (
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
            placeholder={formatMessage({ id: 'app_sign_up_email_place_holder' })}
            errorStyle={classes.errorInput}
            rules={{
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
            }}
          />
        </div>
        <Button
          isLoading={loading}
          type="submit"
          text={loading ? 'app_text_loading_button' : 'app_sign_up_button_text'}
        />

        <div className={classes.orText}>
          <Divider />
          <div className={classes.text}>
            <FormattedMessage id="app_login_sign_in_or_text" />
          </div>
        </div>
        <ButtonOauth handleClick={handleAuth} loading={loadingOauth} />
        <div className={classes.toLogin}>
          <FormattedMessage id="app_sign_up_text_to_login" />
          <Link to="/login">
            <FormattedMessage id="app_sign_up_go_to_login_button" />
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

StepOne.propTypes = {
  loading: PropTypes.bool,
  loadingOauth: PropTypes.bool,
  handleAuth: PropTypes.func,
  intl: PropTypes.object,
};
export default injectIntl(StepOne);
