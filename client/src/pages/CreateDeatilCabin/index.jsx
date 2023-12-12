/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { FormProvider, useForm } from 'react-hook-form';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import CloseIcon from '@mui/icons-material/Close';

import { selectLoading } from '@containers/App/selectors';

import { createCabin } from '@pages/CreateDeatilCabin/actions';
import { selectPositionSelected } from '@pages/CreateDeatilCabin/selectors';

import InputForm from '@components/InputForm';
import Button from '@components/Button';
import Maps from '@components/Maps';

import { useState } from 'react';
import InputFormBasic from '@components/InputForm/Basic';
import classes from './style.module.scss';

const CreateDetailCabin = ({ positionSelected, loading }) => {
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
  return (
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
              Upload Image
            </label>
            <InputForm
              id="fileInputCabin"
              className={classes.buttonImage}
              name="cabin"
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
          name="city_name"
          type="text"
          placeholder="Enter city name of cabin"
          title="app_dashboard_create_cabins_title_form_city_name"
          rules={{
            required: 'City Name is required',
          }}
        />

        <InputFormBasic
          name="description"
          type="text"
          placeholder="Enter description of cabin"
          title="app_dashboard_create_cabins_title_form_description"
          rules={{
            required: 'Description is required',
          }}
        />
        <InputFormBasic
          name="address"
          type="text"
          placeholder="Enter address of cabin"
          title="app_dashboard_create_cabins_title_form_address"
          rules={{
            required: 'Address is required',
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
        <InputFormBasic
          name="province"
          type="text"
          placeholder="Enter province of cabin"
          title="app_dashboard_create_cabins_title_form_province"
          rules={{
            required: 'province is required',
          }}
        />
        <InputFormBasic
          name="village"
          type="text"
          placeholder="Enter village of cabin"
          title="app_dashboard_create_cabins_title_form_village"
          rules={{
            required: 'village is required',
          }}
        />
        <InputFormBasic
          name="district"
          type="text"
          placeholder="Enter district of cabin"
          title="app_dashboard_create_cabins_title_form_district"
          rules={{
            required: 'district is required',
          }}
        />

        <div className={classes.titleMaps}>
          <span className={classes.star}>*</span>
          <FormattedMessage id="app_dashboard_create_cabins_title_select_location" />
        </div>
        <Maps className={classes.maps} draggable />
        <Button
          isLoading={loading}
          type="submit"
          text={loading ? 'app_text_loading_button' : 'app_forgot_submit_button_title'}
        />
      </form>
    </FormProvider>
  );
};

const mapStateToProps = createStructuredSelector({
  loading: selectLoading,
  positionSelected: selectPositionSelected,
});
CreateDetailCabin.propTypes = {
  positionSelected: PropTypes.object,
  loading: PropTypes.bool,
};

export default connect(mapStateToProps)(CreateDetailCabin);
