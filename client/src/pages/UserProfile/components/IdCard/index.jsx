/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';

import { createIdCard, getDataCrutialUser, setDataIdCard } from '@pages/UserProfile/actions';

import InputForm from '@components/InputForm';
import Button from '@components/Button';

import { decryptObjectPayload, decryptTextPayload } from '@utils/decryptPayload';
import encryptPayload from '@utils/encryptPayload';

import classNames from 'classnames';
import classes from './style.module.scss';

const IdCard = ({ disabled, dataIdCard, loading, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const method = useForm();
  const idCardResult = decryptObjectPayload(dataIdCard?.idCard);
  const idCardUrl = decryptTextPayload(dataIdCard?.imageIdCard?.url);
  const idCardPublicId = decryptTextPayload(dataIdCard?.imageIdCard?.publicId);
  useEffect(() => {
    if (idCardResult) {
      Object.entries(idCardResult).forEach(([key, value]) => {
        method.setValue(key, value);
      });
    }
  }, [dataIdCard, method]);

  const onSubmitIdCard = (data) => {
    const { birthday: birthdayDate, ...rest } = data;
    const dataEncrypted = encryptPayload({
      id_card_url: idCardUrl,
      id_card_public_id: idCardPublicId,
      birthday: moment(birthdayDate, 'DD-MM-YYYY').toISOString(),
      ...rest,
    });
    dispatch(
      createIdCard({ payload: dataEncrypted }, () => {
        dispatch(setDataIdCard(null));
        dispatch(getDataCrutialUser());
        Swal.fire({
          title: formatMessage({ id: 'app_user_profile_title_success_submit_id_card' }),
          text: formatMessage({ id: 'app_user_profile_message_success_submit_id_card' }),
          icon: 'success',
          confirmButtonText: 'Oke',
        });
      })
    );
  };

  return (
    dataIdCard && (
      <FormProvider {...method}>
        <form
          action=""
          className={classNames({ [classes.form]: true, [classes.dissabled]: disabled || false })}
          onSubmit={method.handleSubmit(onSubmitIdCard)}
        >
          <div className={classes.warningText}>
            <span className={classes.star}>*</span>
            <FormattedMessage id="app_user_profile_text_warning_update_data_id_card" />
          </div>
          <div className={classes.inputBox}>
            <InputForm
              type="text"
              name="nik"
              rules={{
                required: 'NIK is required',
                minLength: { value: 16, message: 'NIK must be 16 Number' },
                maxLength: { value: 16, message: 'NIK must be 16 Number' },
              }}
              className={classes.input}
              errorStyle={classes.errorInput}
            />
            <div className={classes.title}>NIK</div>
          </div>
          <div className={classes.inputBox}>
            <InputForm
              rules={{
                required: 'Name is required',
              }}
              type="text"
              name="name"
              className={classes.input}
              errorStyle={classes.errorInput}
            />
            <div className={classes.title}>Name</div>
          </div>
          <div className={classes.formateBirtday}>
            <span className={classes.star}>*</span>DD-MM-YYYY
          </div>
          <div className={classes.inputBox}>
            <InputForm
              rules={{
                required: 'Birthday is required',
              }}
              type="text"
              name="birthday"
              className={classes.input}
              errorStyle={classes.errorInput}
            />
            <div className={classes.title}>Birthday</div>
          </div>
          <div className={classes.inputBox}>
            <InputForm
              rules={{
                required: 'NIK is required',
              }}
              type="text"
              name="address"
              className={classes.input}
              errorStyle={classes.errorInput}
            />
            <div className={classes.title}>Address</div>
          </div>
          <div className={classes.inputBox}>
            <InputForm type="text" name="job" className={classes.input} errorStyle={classes.errorInput} />
            <div className={classes.title}>Job</div>
          </div>
          <div className={classes.inputBox}>
            <InputForm
              rules={{
                required: 'Religion is required',
              }}
              type="text"
              name="religion"
              className={classes.input}
              errorStyle={classes.errorInput}
            />
            <div className={classes.title}>Religion</div>
          </div>
          <div className={classes.inputBox}>
            <InputForm type="text" name="marial_status" className={classes.input} />
            <div className={classes.title}>Marial Status</div>
          </div>

          <Button
            isLoading={loading}
            className={classes.button}
            text="app_user_profile_text_button_submit_data_id_card"
            type="submit"
          />
        </form>
      </FormProvider>
    )
  );
};

IdCard.propTypes = {
  dataIdCard: PropTypes.object,
  dataUser: PropTypes.object,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  intl: PropTypes.object,
};

export default injectIntl(IdCard);
