/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Close as CloseIcon } from '@mui/icons-material';
import { FormControlLabel, Switch } from '@mui/material';
import { useState } from 'react';
import { selectLoading } from '@containers/App/selectors';

import { createBanner } from '@pages/CreateBanner/actions';

import InputForm from '@components/InputForm';
import Button from '@components/Button';
import InputFormBasic from '@components/InputForm/Basic';
import HeadTitle from '@components/HeadTitle';

import classes from './style.module.scss';

const CreateBanner = ({ loading, intl: { formatMessage } }) => {
  const method = useForm();
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(null);
  const onSubmit = (data) => {
    const formData = new FormData();
    const { cabin, ...payload } = data;
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    dispatch(
      createBanner(formData, () => {
        method.reset();
        setSelectedImage(null);
      })
    );
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
      method.setValue('banner', file);
    }
  };

  return (
    <div className={classes.container}>
      <HeadTitle size={20} className={classes.headTitle}>
        <FormattedMessage id="dashboard_create_banner_head_title" />
      </HeadTitle>
      <FormProvider {...method}>
        <form action="#" onSubmit={method.handleSubmit(onSubmit)} className={classes.form}>
          {selectedImage ? (
            <div className={classes.wrapperImageResult}>
              <img src={selectedImage} alt="imageCabin" className={classes.imageResult} />
              <button
                type="button"
                aria-label="remove-image"
                className={classes.btnRemoveImg}
                onClick={() => setSelectedImage(null)}
              >
                <CloseIcon />
              </button>
            </div>
          ) : (
            <div className={classes.wrapperInput}>
              <label htmlFor="fileInputTypeRoom" className={classes.customFileInput}>
                <FormattedMessage id="dashboard_upload_image_title" />
              </label>
              <InputForm
                id="fileInputTypeRoom"
                className={classes.buttonImage}
                name="cabin"
                accept=".png, .jpg, .jpeg"
                type="file"
                placeholder="Enter name cabins"
                errorStyle={classes.errorInput}
                onChange={handleImageChange}
              />
            </div>
          )}

          <InputFormBasic
            name="title"
            defaultValue={method.getValues('title')}
            type="text"
            placeholder="Enter Title"
            title="dashboard_create_banner_title_input"
            rules={{
              required: 'Title is required',
            }}
          />
          <InputFormBasic
            name="description"
            type="text"
            defaultValue={method.getValues('description')}
            placeholder="Enter description"
            title="dashboard_create_banner_title_input_description"
            rules={{
              required: 'information is required',
            }}
          />
          <div className={classes.wrapperBreakfast}>
            <FormControlLabel
              control={
                <Controller
                  name="active"
                  control={method.control}
                  defaultValue
                  render={({ field }) => <Switch {...field} checked={method.getValues('active')} />}
                />
              }
              label={formatMessage({ id: 'dashboard_create_banner_title_input_active' })}
            />
          </div>
          <Button isLoading={loading} type="submit">
            {loading ? (
              <FormattedMessage id="app_text_loading_button" />
            ) : (
              <FormattedMessage id="app_forgot_submit_button_title" />
            )}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  loading: selectLoading,
});
CreateBanner.propTypes = {
  loading: PropTypes.bool,
  intl: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps)(CreateBanner));
