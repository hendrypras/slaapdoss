import Container from '@components/Container';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { selectAssets } from '@containers/App/selectors';

import { getDetailCabins } from '@pages/DetailCabins/actions';
import { selectCabins } from '@pages/DetailCabins/selectors';

import HeadTitle from '@components/HeadTitle';
import SubHeadTitle from '@components/SubHeadTitle';
import Maps from '@components/Maps';
import classes from './style.module.scss';

const DetailCabins = ({ cabins }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDetailCabins({ province: 'jawabarat', slug: 'asdasdas' }));
  }, [dispatch]);
  return (
    <Container className={classes.container}>
      <>
        <div className={classes.wrapperImg}>
          <img
            src="https://res.cloudinary.com/dlm3iavym/image/upload/v1702314770/image/gp63ds5entcceexk1yt9.jpg"
            alt="cabins"
            className={classes.mainImg}
          />
          <div className={classes.wrapperTextContent}>
            <HeadTitle className={classes.headTitle} title="Bobocabin Ranca Upas, Bandung" />
            <SubHeadTitle
              className={classes.subHead}
              text="Ranca Upas Camping Ground, Patengan, Kec. Ciwidey, Kabupaten Bandung, Jawa Barat 40973"
            />
          </div>
        </div>

        <div className={classes.wrapperFasilities}>
          <HeadTitle title="Facilities and Services" className={classes.title} />
          <div className={classes.wrapperContent}>
            {cabins?.cabin_information?.facilities?.map((val, i) => (
              <div key={i} className={classes.content}>
                <img src={val?.icon_url} alt="icon" className={classes.icon} />
                <div className={classes.titleContent}>{val?.title}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.wrapperLocationDetails}>
          <HeadTitle title="Location Details" className={classes.title} />
          <Maps lat={0} lng={2836} className={classes.maps} />
          <HeadTitle title="Address Details" className={classes.titleAddress} />
          <SubHeadTitle
            className={classes.subTitle}
            text="Ranca Upas Camping Ground, Patengan, Kec. Ciwidey, Kabupaten Bandung, Jawa Barat 40973

"
          />
        </div>
        <div className={classes.wrapperCtnExp}>
          <HeadTitle title="Field Condition and Expectetion" className={classes.title} />
          <HeadTitle title="What you need to prepare" className={classes.contentTitle} />
          <div className={classes.wrapperContent}>
            {cabins?.cabin_information?.preperation?.map((val, i) => (
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
              <HeadTitle title="Check-in Procedure" className={classes.headTitle} />
              <div className={classes.wrapperTextValue}>
                <HeadTitle title="Check-in" className={classes.title} />
                <div>{cabins?.cabin_information?.accomodationPolicy?.check_in}</div>
              </div>
              <div className={classes.wrapperTextValue}>
                <HeadTitle title="Check-out" className={classes.title} />
                <div>{cabins?.cabin_information?.accomodationPolicy?.check_out}</div>
              </div>
            </div>
            <div className={classes.wrapperTextContent}>
              <HeadTitle title="Refund, Reschedule, Relocate, and Cancellations" className={classes.headTitle} />
              <div>{cabins?.cabin_information?.accomodationPolicy?.refund_reschedule}</div>
            </div>
            <div className={classes.wrapperTextContent}>
              <HeadTitle title="Age Policies" className={classes.headTitle} />
              {cabins?.cabin_information?.accomodationPolicy?.age_policies?.map((val, i) => (
                <li key={i}>{val}</li>
              ))}
            </div>
            {cabins?.cabin_information?.accomodationPolicy?.other_policies?.map((item, i) => (
              <div className={classes.wrapperTextContent} key={i}>
                <HeadTitle title={item?.title} className={classes.headTitle} />
                <div>{item?.value}</div>
              </div>
            ))}
          </div>
        </div>
        {console.log(cabins)}
      </>
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  assets: selectAssets,
  cabins: selectCabins,
});
DetailCabins.propTypes = {
  cabins: PropTypes.object,
};

export default connect(mapStateToProps)(DetailCabins);
