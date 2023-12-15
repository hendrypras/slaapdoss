import PropTypes from 'prop-types';
import {
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  ModeEditOutlineOutlined as ModeEditOutlineOutlinedIcon,
} from '@mui/icons-material';

import HeadTitle from '@components/HeadTitle';
import Button from '@components/Button';
import SubHeadTitle from '@components/SubHeadTitle';
import classes from './style.module.scss';

const NavSearchCabin = ({ cabinName, checkIn, checkOut, duration, handleEdit }) => (
  <div className={classes.wrapper}>
    <div className={classes.wrapperContent}>
      <div className={classes.head}>
        <div className={classes.leftHead}>
          <SearchIcon className={classes.iconSearch} />
          <HeadTitle title={cabinName} size={15} />
        </div>
        <Button onClick={handleEdit} type="button" className={classes.btnEdit}>
          <ModeEditOutlineOutlinedIcon />
        </Button>
      </div>
      <div className={classes.bottom}>
        <DateRangeIcon className={classes.iconDate} />
        <SubHeadTitle size={13.5} mt={0} title={` ${checkIn} - ${checkOut} (${duration} Night(s))`} />
      </div>
    </div>
  </div>
);

NavSearchCabin.propTypes = {
  cabinName: PropTypes.string,
  checkIn: PropTypes.string,
  checkOut: PropTypes.string,
  duration: PropTypes.string,
  handleEdit: PropTypes.func,
};
export default NavSearchCabin;
