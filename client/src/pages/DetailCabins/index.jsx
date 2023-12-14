import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect } from 'react';
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';
import classNames from 'classnames';
import { useParams, useLocation } from 'react-router-dom';
import moment from 'moment';

import { selectAssets } from '@containers/App/selectors';

import { getDetailCabins } from '@pages/DetailCabins/actions';
import { selectCabins, selectLoading } from '@pages/DetailCabins/selectors';
import CardCabin from '@pages/DetailCabins/components/CardCabin';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';
import SubHeadTitle from '@components/SubHeadTitle';
import Maps from '@components/Maps';

import classes from './style.module.scss';

const DetailCabins = ({ cabins, loading }) => {
  const dispatch = useDispatch();
  const { slugCabin } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const dateStart = queryParams.get('dateStart');
  const dateEnd = queryParams.get('dateEnd');
  const unixDateStart = moment(`${dateStart} 14:00:00`).valueOf();
  const unixDateEnd = moment(`${dateEnd} 12:00:00`).valueOf();

  useEffect(() => {
    dispatch(getDetailCabins(slugCabin, unixDateStart, unixDateEnd));
  }, [dispatch, slugCabin, dateStart, dateEnd]);
  return (
    <Container className={classes.container}>
      <>
        <div className={classes.wrapperImg}>
          <img src={cabins?.cabin?.image_url} alt="cabin" className={classes.mainImg} />
          <div className={classes.wrapperTextContent}>
            <HeadTitle className={classes.headTitle} title={`${cabins?.cabin?.name}, ${cabins?.cabin?.city}`} />
            <SubHeadTitle className={classes.subHead} text={cabins?.cabin?.address} />
          </div>
        </div>
        <div className={classes.wrapperFasilities}>
          <HeadTitle title="Facilities and Services" className={classes.title} />
          <div className={classes.wrapperContent}>
            {cabins?.cabinInformation?.facilities?.map((val, i) => (
              <div key={i} className={classes.content}>
                <img src={val?.icon_url} alt="icon" className={classes.icon} />
                <div className={classes.titleContent}>{val?.title}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.wrapperLocationDetails}>
          <HeadTitle title="Location Details" className={classes.title} />
          <div className={classes.wrapperContent}>
            {!loading && <Maps lat={cabins?.cabin?.latitude} lng={cabins?.cabin?.longitude} className={classes.maps} />}
            <div>
              <HeadTitle title="Address Details" className={classes.titleAddress} />
              <SubHeadTitle className={classes.subTitle} text={cabins?.cabin?.address} />
            </div>
          </div>
        </div>
        <div className={classes.wrapperCtnExp}>
          <HeadTitle title="Field Condition and Expectation" className={classes.title} />
          <HeadTitle title="What you need to prepare" className={classes.contentTitle} />
          <div className={classes.wrapperContent}>
            {cabins?.cabinInformation?.preperation?.map((val, i) => (
              <div key={i} className={classes.content}>
                <CheckCircleOutlineIcon className={classes.icon} />
                <div className={classes.titleContent}>{val}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.wrapperAccpolicy}>
          <HeadTitle title="Accomodation Policy" className={classes.title} />
          <div className={classes.wrapperContent}>
            <div className={classes.wrapperTextContent}>
              <HeadTitle title="Check-in Procedure" className={classNames(classes.headTitle, classes.check)} />
              <div className={classes.wrapperTextValue}>
                <HeadTitle title="Check-in" className={classes.title} />
                <div className={classes.textValue}>{cabins?.cabinInformation?.accomodationPolicy?.check_in}</div>
              </div>
              <div className={classes.wrapperTextValue}>
                <HeadTitle title="Check-out" className={classes.title} />
                <div className={classes.textValue}>{cabins?.cabinInformation?.accomodationPolicy?.check_out}</div>
              </div>
            </div>
            <div className={classes.wrapperTextContent}>
              <HeadTitle title="Refund, Reschedule, Relocate, and Cancellations" className={classes.headTitle} />
              <div className={classes.textValue}>{cabins?.cabinInformation?.accomodationPolicy?.refund_reschedule}</div>
            </div>
            <div className={classes.wrapperTextContent}>
              <HeadTitle title="Age Policies" className={classes.headTitle} />
              <div className={classes.wrapperLi}>
                {cabins?.cabinInformation?.accomodationPolicy?.age_policies?.map((val, i) => (
                  <li key={i} className={classes.textValue}>
                    {val}
                  </li>
                ))}
              </div>
            </div>
            {cabins?.cabinInformation?.accomodationPolicy?.other_policies?.map((item, i) => (
              <div className={classes.wrapperTextContent} key={i}>
                <HeadTitle title={item?.title} className={classes.headTitle} />
                <div className={classes.textValue}>{item?.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.wrapperCard}>
          {cabins?.cabinRooms?.map((val, i) => (
            <CardCabin key={i} cabins={val} />
          ))}
        </div>
      </>
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  assets: selectAssets,
  cabins: selectCabins,
  loading: selectLoading,
});
DetailCabins.propTypes = {
  cabins: PropTypes.object,
  loading: PropTypes.bool,
};

export default connect(mapStateToProps)(DetailCabins);
