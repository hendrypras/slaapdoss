import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';

import InputForm from '@components/InputForm';

import { userRegister } from '@pages/Register/actions';

import encryptPayload from '@utils/encryptPayload';

import 'react-datepicker/dist/react-datepicker.css';

import { useState } from 'react';
import classes from './style.module.scss';

const StepThree = ({ loading, token }) => {
  const method = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [birthday, setBirthday] = useState(new Date());
  const onSubmit = (data) => {
    const payload = encryptPayload(data);
    dispatch(
      userRegister({ payload, token }, () => {
        method.reset({
          first_name: '',
          last_name: '',
          password: '',
          confirmPassword: '',
        });
        Swal.fire({
          title: 'Register successfully!',
          text: 'Please log in to enjoy superior features',
          icon: 'success',
          confirmButtonText: 'Oke',
          preConfirm: () => navigate('/login'),
        });
      })
    );
  };

  return (
    <FormProvider {...method}>
      <form action="#" onSubmit={method.handleSubmit(onSubmit)} className={classes.form}>
        <div className={classes.wrapperInput}>
          <div className={classes.title}>
            <FormattedMessage id="app_sign_up_first_name" />
          </div>
          <InputForm
            className={classes.input}
            name="first_name"
            type="text"
            placeholder="Enter your first name"
            errorStyle={classes.errorInput}
            rules={{
              required: 'First name is required',
            }}
          />
        </div>
        <div className={classes.wrapperInput}>
          <div className={classes.title}>
            <FormattedMessage id="app_sign_up_last_name" />
          </div>
          <InputForm
            className={classes.input}
            name="last_name"
            type="text"
            placeholder="Enter your last name"
            errorStyle={classes.errorInput}
            rules={{
              required: 'First name is required',
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
            <FormattedMessage id="app_sign_up_confirm_password_title" />
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
        <div className={classes.wrapperInput}>
          <div className={classes.title}>
            <FormattedMessage id="app_sign_up_birtday" />
          </div>
          <DatePicker selected={birthday} onChange={(date) => setBirthday(date)} />
        </div>
        <button disabled={loading} type="submit">
          {loading ? <FormattedMessage id="app_text_loading_button" /> : <FormattedMessage id="app_sign_up_title" />}
        </button>
      </form>
    </FormProvider>
  );
};

StepThree.propTypes = {
  loading: PropTypes.bool,
  token: PropTypes.string,
};
export default StepThree;
