/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';

import { selectLoading } from '@containers/App/selectors';
import { showSnackBar } from '@containers/App/actions';

import { getTypeRoom } from '@pages/CreateTypeRoom/actions';
import { getCabinsLocation } from '@pages/DetailCabins/actions';
import { selectCabinsLocation } from '@pages/DetailCabins/selectors';
import { createRoom } from '@pages/CreateRoom/actions';
import { selectTypeRoom } from '@pages/CreateTypeRoom/selectors';

import Button from '@components/Button';
import InputFormBasic from '@components/InputForm/Basic';
import HeadTitle from '@components/HeadTitle';

import classes from './style.module.scss';

const CreateRoom = ({ loading, cabinsLocation, typeRoom }) => {
  const method = useForm();
  const dispatch = useDispatch();
  const [slugSelected, setSlugSelected] = useState('');

  const onSubmit = (data) => {
    const convertedData = {
      ...data,
      typeRoomId: data.typeRoomId,
      roomNumber: data.roomNumber,
    };
    dispatch(
      createRoom(convertedData, () => {
        method.reset();
        dispatch(showSnackBar('Room created successfully'));
      })
    );
  };
  useEffect(() => {
    dispatch(getCabinsLocation());
    dispatch(getTypeRoom());
  }, [dispatch]);
  const filteredTypeRoom = slugSelected ? typeRoom?.filter((val) => val.cabins_slug === slugSelected) : [];
  return (
    <div className={classes.container}>
      <HeadTitle size={20} className={classes.headTitle}>
        <FormattedMessage id="dashboard_create_room_head_title" />
      </HeadTitle>
      <FormProvider {...method}>
        <form action="#" onSubmit={method.handleSubmit(onSubmit)} className={classes.form}>
          <InputFormBasic
            name="roomNumber"
            defaultValue={method.getValues('roomNumber')}
            type="number"
            title="app_reservation_room_number_title"
            rules={{
              required: 'Room Number is required',
            }}
          />
          <FormControl sx={{ m: 1, width: '100%' }}>
            <InputLabel id="select-cabin-slug">Cabin</InputLabel>
            <Controller
              name="cabinsSlug"
              control={method.control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="select-cabin-slug"
                  label="Cabin"
                  required
                  onChange={(e) => {
                    field.onChange(e);
                    setSlugSelected(e.target.value);
                    method.setValue('cabinsSlug', e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>none</em>
                  </MenuItem>
                  {cabinsLocation.map((cabin) => (
                    <MenuItem key={cabin?.id} value={cabin.slug}>
                      {cabin.slug}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: '100%' }}>
            <InputLabel id="select-typeroom-id">Type Room</InputLabel>
            <Controller
              name="typeRoomId"
              control={method.control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="select-typeroom-id"
                  label="Cabin"
                  required
                  onChange={(e) => {
                    field.onChange(e);
                    method.setValue('typeRoomId', e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>none</em>
                  </MenuItem>
                  {filteredTypeRoom?.map((type, index) => (
                    <MenuItem key={index} value={type.id}>
                      {type.name}
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
  typeRoom: selectTypeRoom,
});
CreateRoom.propTypes = {
  loading: PropTypes.bool,
  cabinsLocation: PropTypes.array,
  typeRoom: PropTypes.array,
};

export default connect(mapStateToProps)(CreateRoom);
