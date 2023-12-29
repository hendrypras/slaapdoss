/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Close as CloseIcon } from '@mui/icons-material';

import { selectLoading } from '@containers/App/selectors';
import { showSnackBar } from '@containers/App/actions';

import { createCabin } from '@pages/CreateCabin/actions';
import { selectDisplayNameLocation, selectPositionSelected } from '@pages/CreateCabin/selectors';

import InputForm from '@components/InputForm';
import Button from '@components/Button';
import Maps from '@components/Maps';
import InputFormBasic from '@components/InputForm/Basic';
import HeadTitle from '@components/HeadTitle';

import classes from './style.module.scss';

const CreateCabin = ({ positionSelected, loading, address }) => {
  const method = useForm();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append('latitude', positionSelected?.lat);
    formData.append('longitude', positionSelected?.lng);
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    dispatch(
      createCabin(formData, () => {
        method.reset();
        setSelectedImage(null);
        dispatch(showSnackBar('Cabin created successfully'));
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
      method.setValue('cabin', file);
    }
  };

  useEffect(() => {
    method.setValue('address', address);
  }, [address, method]);

  return (
    <div className={classes.container}>
      <HeadTitle size={20} className={classes.headTitle}>
        <FormattedMessage id="dashboard_create_cabin_head_title" />
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
              <label htmlFor="fileInputCabin" className={classes.customFileInput}>
                <FormattedMessage id="dashboard_upload_image_title" />
              </label>
              <InputForm
                id="fileInputCabin"
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
            name="name"
            type="text"
            placeholder="Enter name of cabin"
            title="app_dashboard_create_cabins_title_form_name"
            rules={{
              required: 'Name is required',
            }}
          />
          <InputFormBasic
            name="city"
            type="text"
            placeholder="Enter city of cabin"
            title="app_dashboard_create_cabins_title_form_city"
            rules={{
              required: 'City is required',
            }}
          />
          <div className={classes.titleMaps}>
            <span className={classes.star}>*</span>
            <FormattedMessage id="app_dashboard_create_cabins_title_select_location" />
          </div>
          <Maps className={classes.maps} draggable />
          <InputFormBasic
            name="address"
            type="text"
            placeholder="Enter address of cabin"
            title="app_dashboard_create_cabins_title_form_address"
            rules={{
              required: 'Address is required',
            }}
          />
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
  positionSelected: selectPositionSelected,
  address: selectDisplayNameLocation,
});
CreateCabin.propTypes = {
  positionSelected: PropTypes.object,
  loading: PropTypes.bool,
  address: PropTypes.string,
};

export default connect(mapStateToProps)(CreateCabin);
