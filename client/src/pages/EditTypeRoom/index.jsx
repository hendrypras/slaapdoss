/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Close as CloseIcon } from '@mui/icons-material';
import { FormControlLabel, Switch, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { selectLoading } from '@containers/App/selectors';
import { showSnackBar } from '@containers/App/actions';

import { createTypeRoom } from '@pages/CreateTypeRoom/actions';
import { getCabinsLocation } from '@pages/DetailCabins/actions';
import { selectCabinsLocation } from '@pages/DetailCabins/selectors';
import { selectDetailTypeRoom } from '@pages/EditTypeRoom/selectors';
import { getTypeRoomById } from '@pages/EditTypeRoom/actions';

import InputForm from '@components/InputForm';
import Button from '@components/Button';
import InputFormBasic from '@components/InputForm/Basic';
import HeadTitle from '@components/HeadTitle';

import classes from './style.module.scss';

const EditTypeRoom = ({ loading, cabinsLocation, detailTypeRoom, intl: { formatMessage } }) => {
  console.log(detailTypeRoom, '<<<<detail');
  const method = useForm();
  const dispatch = useDispatch();
  const { typeRoomId } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const onSubmit = (data) => {
    const formData = new FormData();
    const { cabin, ...payload } = data;
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    dispatch(
      createTypeRoom(formData, () => {
        method.reset();
        setSelectedImage(null);
        dispatch(showSnackBar('Type Room created successfully'));
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
      method.setValue('typeImage', file);
    }
  };
  useEffect(() => {
    if (typeRoomId) {
      dispatch(getCabinsLocation());
      dispatch(getTypeRoomById(typeRoomId));
    }
  }, [dispatch, typeRoomId]);
  return (
    <div className={classes.container}>
      <HeadTitle size={20} className={classes.headTitle}>
        <FormattedMessage id="dashboard_edit_type_cabin_head_title" />
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

          <FormControl sx={{ m: 1, width: '100%' }}>
            <InputLabel id="select-type-cabin">Name</InputLabel>
            <Controller
              name="name"
              control={method.control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="select-type-cabin"
                  label="Cabin"
                  required
                  onChange={(e) => {
                    field.onChange(e);
                    method.setValue('name', e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>none</em>
                  </MenuItem>
                  <MenuItem value="standard cabin">Standard Cabin</MenuItem>
                  <MenuItem value="deluxe cabin">Deluxe Cabin</MenuItem>
                  <MenuItem value="executive cabin">Executive Cabin</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          <InputFormBasic
            name="price"
            type="number"
            defaultValue={method.getValues('price')}
            placeholder="Enter price"
            title="dashboard_create_type_room_title_input_price"
            rules={{
              required: 'price is required',
            }}
          />
          <InputFormBasic
            name="capacity"
            type="text"
            defaultValue={method.getValues('capacity')}
            placeholder="Enter capacity"
            title="dashboard_create_type_room_title_input_capacity"
            rules={{
              required: 'capacity is required',
            }}
          />
          <div className={classes.wrapperBreakfast}>
            <FormControlLabel
              control={
                <Controller
                  name="breakfast"
                  control={method.control}
                  defaultValue={false}
                  render={({ field }) => <Switch {...field} />}
                />
              }
              label={formatMessage({ id: 'dashboard_create_type_room_title_input_breakfast' })}
            />
          </div>
          <FormControl sx={{ m: 1, width: '100%' }}>
            <InputLabel id="select-sabin">Cabin</InputLabel>
            <Controller
              name="cabinsSlug"
              control={method.control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="select-sabin"
                  label="Cabin"
                  required
                  onChange={(e) => {
                    field.onChange(e);
                    method.setValue('cabinsSlug', e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>none</em>
                  </MenuItem>
                  {cabinsLocation.map((cabin) => (
                    <MenuItem key={cabin?.id} value={cabin.slug}>
                      {cabin.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
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
  cabinsLocation: selectCabinsLocation,
  detailTypeRoom: selectDetailTypeRoom,
});
EditTypeRoom.propTypes = {
  loading: PropTypes.bool,
  cabinsLocation: PropTypes.array,
  intl: PropTypes.object,
  detailTypeRoom: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps)(EditTypeRoom));
