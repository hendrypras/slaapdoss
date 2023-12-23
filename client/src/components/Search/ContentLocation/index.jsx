import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import HeadTitle from '@components/HeadTitle';
import Button from '@components/Button';

import { setSearchValue } from '@pages/Home/actions';

import classes from './style.module.scss';

const ContentLocation = ({ cabinsLocation, onClose, searchValue }) => {
  const dispatch = useDispatch();

  const handleSetSearchValue = (location) => {
    dispatch(setSearchValue(location, searchValue.checkIn, searchValue.duration, searchValue.checkOut));
    onClose();
  };

  const cityMap = cabinsLocation.reduce((acc, cabin) => {
    if (!acc[cabin.city]) {
      acc[cabin.city] = {
        city: cabin.city,
        names: [],
      };
    }
    acc[cabin.city].names.push({ name: cabin.name, slug: cabin.slug });
    return acc;
  }, {});

  const formattedData = Object.values(cityMap);

  return (
    <div className={classes.wrapper}>
      <HeadTitle title="List Location" className={classes.headTitle} />
      <div className={classes.wrapperLocation}>
        {formattedData.map((cityData, i) => (
          <React.Fragment key={i}>
            <HeadTitle className={classes.titleCity} title={cityData?.city} />
            <div className={classes.wrapperNames}>
              {cityData.names.map((val, index) => (
                <Button
                  className={classNames({
                    [classes.names]: true,
                    [classes.selected]: val?.slug === searchValue?.location?.value || false,
                  })}
                  to="/"
                  key={index}
                  title={val?.name}
                  onClick={() => handleSetSearchValue({ display: `${val.name},${cityData.city}`, value: val.slug })}
                />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

ContentLocation.propTypes = {
  cabinsLocation: PropTypes.array,
  searchValue: PropTypes.object,
  onClose: PropTypes.func,
};

export default ContentLocation;
