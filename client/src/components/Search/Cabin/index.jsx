import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DateRange, Schedule as ScheduleIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import ContentLocation from '@components/Search/ContentLocation';
import ContentCheckin from '@components/Search/ContentCheckin';
import ContentDuration from '@components/Search/ContentDuration';
import DrawerMobile from '@components/DrawerMobile';
import Select from '@components/Search/Select';
import ModalPopUp from '@components/ModalPopUp';
import Button from '@components/Button';

import { selectSearchValue } from '@pages/Home/selectors';
import { selectCabinsLocation } from '@pages/DetailCabins/selectors';

import classes from './style.module.scss';

const SearchCabin = ({ searchValue, cabinsLocation, className }) => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width:992px)');
  const [openDrawer, setOpenDrawer] = useState({
    location: false,
    duration: false,
    checkIn: false,
  });
  const handleOpenDrawerSearchSelect = (selectName) => {
    if (selectName === 'duration' && !searchValue.location.value) {
      return;
    }
    setOpenDrawer((prevState) => ({
      ...prevState,
      [selectName]: !prevState[selectName],
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/cabins/${searchValue.location.value}?checkIn=${searchValue.checkIn.value}&checkOut=${searchValue.checkOut.value}&duration=${searchValue.duration.value}`
    );
  };
  return (
    <form data-testid="search-cabin" className={classNames(classes.form, className)}>
      <div className={classes.selectWrapper}>
        <Select
          value={searchValue.location.display}
          title="app_home_title_location_search_selelct"
          placeHolder="app_home_title_placeholder_location_search_selelct"
          icon={LocationOnIcon}
          handleClick={() => handleOpenDrawerSearchSelect('location')}
        />
        {isDesktop ? (
          <ModalPopUp open={openDrawer.location} onClose={() => handleOpenDrawerSearchSelect('location')}>
            <ContentLocation
              onClose={() => handleOpenDrawerSearchSelect('location')}
              searchValue={searchValue}
              cabinsLocation={cabinsLocation}
            />
          </ModalPopUp>
        ) : (
          <DrawerMobile
            height="60vh"
            open={openDrawer.location}
            onClose={() => handleOpenDrawerSearchSelect('location')}
          >
            <ContentLocation
              onClose={() => handleOpenDrawerSearchSelect('location')}
              searchValue={searchValue}
              cabinsLocation={cabinsLocation}
            />
          </DrawerMobile>
        )}
        <Select
          value={searchValue.checkIn.display}
          title="app_home_title_checkin_search_selelct"
          placeHolder="app_home_title_placeholder_checkin_search_selelct"
          icon={DateRange}
          handleClick={() => handleOpenDrawerSearchSelect('checkIn')}
        />
        {isDesktop ? (
          <ModalPopUp open={openDrawer.checkIn} onClose={() => handleOpenDrawerSearchSelect('checkIn')}>
            <ContentCheckin searchValue={searchValue} onClose={() => handleOpenDrawerSearchSelect('checkIn')} />
          </ModalPopUp>
        ) : (
          <DrawerMobile height="50vh" open={openDrawer.checkIn} onClose={() => handleOpenDrawerSearchSelect('checkIn')}>
            <ContentCheckin searchValue={searchValue} onClose={() => handleOpenDrawerSearchSelect('checkIn')} />
          </DrawerMobile>
        )}
        <Select
          value={searchValue.duration.display}
          title="app_home_title_duration_search_selelct"
          placeHolder="app_home_title_placeholder_duration_search_selelct"
          icon={ScheduleIcon}
          handleClick={() => handleOpenDrawerSearchSelect('duration')}
        />
        {isDesktop ? (
          <ModalPopUp open={openDrawer.duration} onClose={() => handleOpenDrawerSearchSelect('duration')}>
            <ContentDuration searchValue={searchValue} onClose={() => handleOpenDrawerSearchSelect('duration')} />
          </ModalPopUp>
        ) : (
          <DrawerMobile
            height="50vh"
            open={openDrawer.duration}
            onClose={() => handleOpenDrawerSearchSelect('duration')}
          >
            <ContentDuration searchValue={searchValue} onClose={() => handleOpenDrawerSearchSelect('duration')} />
          </DrawerMobile>
        )}
        <Select
          value={searchValue.checkOut.display}
          title="app_home_title_checkout_search_selelct"
          placeHolder="app_home_title_placeholder_checkout_search_selelct"
          icon={DateRange}
          disabled
        />
      </div>
      <Button onClick={handleSearch} disabled={!searchValue.location.value} className={classes.buttonSearch}>
        <FormattedMessage id="app_home_button_text_search_select" />
      </Button>
    </form>
  );
};
const mapStateToProps = createStructuredSelector({
  searchValue: selectSearchValue,
  cabinsLocation: selectCabinsLocation,
});
SearchCabin.propTypes = {
  searchValue: PropTypes.object,
  className: PropTypes.string,
  cabinsLocation: PropTypes.array,
};
export default connect(mapStateToProps)(SearchCabin);
