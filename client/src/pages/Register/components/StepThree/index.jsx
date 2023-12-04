import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Swal from 'sweetalert2';

import InputForm from '@components/InputForm';

import { userRegister } from '@pages/Register/actions';

import encryptPayload from '@utils/encryptPayload';

import 'react-datepicker/dist/react-datepicker.css';

import { useState } from 'react';
import Button from '@components/Button';
import classes from './style.module.scss';

const StepThree = ({ loading, token, intl: { formatMessage } }) => {
  const method = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState({
    password: false,
    confirmPassword: false,
  });
  const onSubmit = (data) => {
    const payload = encryptPayload(data);
    dispatch(
      userRegister({ payload, token }, () => {
        method.reset({
          password: '',
          confirmPassword: '',
        });
        Swal.fire({
          title: formatMessage({ id: 'app_sign_up_title_response_success' }),
          text: formatMessage({ id: 'app_sign_up_sub_titile_response_success' }),
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
    <FormProvider {...method}>
      <form action="#" onSubmit={method.handleSubmit(onSubmit)} className={classes.form}>
        <div className={classes.wrapperInput}>
          <div className={classes.title}>
            <FormattedMessage id="app_sign_up_username_title" />
          </div>
          <InputForm
            errorStyle={classes.errorInput}
            className={classes.input}
            name="username"
            type="text"
            placeholder={formatMessage({ id: 'app_sign_up_username_place_holder' })}
            rules={{
              required: 'Username is required',
              minLength: { value: 3, message: 'Username must be at least 3 characters' },
            }}
          />
        </div>
        <div className={classes.wrapperInput}>
          <div className={classes.title}>
            <FormattedMessage id="app_sign_up_password_title" />
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
            <FormattedMessage id="app_sign_up_confirm_password_title" />
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
  );
};

StepThree.propTypes = {
  loading: PropTypes.bool,
  token: PropTypes.string,
  intl: PropTypes.object,
};
export default injectIntl(StepThree);