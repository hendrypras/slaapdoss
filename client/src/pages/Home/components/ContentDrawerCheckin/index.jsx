import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { setSearchValue } from '@pages/Home/actions';

import classes from './style.module.scss';

const ContentDrawerCheckin = ({ searchValue, onClose }) => {
  const value = moment(searchValue?.checkIn?.value);
  const today = moment();
  const dispatch = useDispatch();
  const handleDateChange = (date) => {
    dispatch(
      setSearchValue(
        searchValue.location,
        { display: date.format('ddd, D MMMM YYYY'), value: date.format('YYYY-MM-DD') },
        searchValue.duration,
        {
          display: date.add(searchValue?.duration?.value, 'days').format('ddd, D MMMM YYYY'),
          value: date.add(searchValue?.duration?.value, 'days').format('YYYY-MM-DD'),
        }
      )
    );
    onClose();
  };
  return (
    <div className={classes.wrapper}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateCalendar
          minDate={today}
          value={value}
          onChange={handleDateChange}
          classes={{
            root: classes.calender,
          }}
        />
      </LocalizationProvider>
    </div>
  );
};
ContentDrawerCheckin.propTypes = {
  searchValue: PropTypes.object,
  onClose: PropTypes.func,
};
export default ContentDrawerCheckin;
