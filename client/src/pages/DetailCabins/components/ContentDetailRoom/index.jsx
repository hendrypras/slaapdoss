import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NoFood, InfoOutlined } from '@mui/icons-material';
import { Divider } from '@mui/material';

import HeadTitle from '@components/HeadTitle';

import classes from './style.module.scss';

const ContentDetailRoom = ({ data, nameCabin }) => (
  <div className={classes.wrapper}>
    <HeadTitle title={nameCabin} className={classes.headTitle} />
    <div className={classes.wrapperContent}>
      <HeadTitle title="Room Facilities" className={classes.titleContent} />
      {data?.facilities?.slice(3).map((val, i) => (
        <div key={i} className={classes.content}>
          <img src={val?.icon_url} alt="icon" className={classes.icon} />
          <div className={classes.titleContent}>{val?.title}</div>
        </div>
      ))}
    </div>
    <Divider className={classes.divider} />
    <div className={classes.wrapperContent}>
      <HeadTitle title="Room Features" className={classes.titleContent} />
      {data?.roomFeatures?.map((val, i) => (
        <div key={i} className={classes.content}>
          <img src={val?.icon_url} alt="icon" className={classes.icon} />
          <div className={classes.titleContent}>{val?.title}</div>
        </div>
      ))}
    </div>
    <Divider className={classes.divider} />
    <div className={classes.wrapperContent}>
      <HeadTitle title="No Refund and No Cancellations" className={classes.titleContent} />
      <div className={classNames(classes.content, classes.info)}>
        <NoFood className={classes.icon} />
        <div className={classes.titleContent}>No Breakfast</div>
      </div>
      <div className={classNames(classes.content, classes.info)}>
        <InfoOutlined className={classes.icon} />
        <div className={classes.titleContent}>No refund and no cancellations</div>
      </div>
    </div>
  </div>
);
ContentDetailRoom.propTypes = {
  data: PropTypes.object,
  nameCabin: PropTypes.string,
};
export default ContentDetailRoom;
