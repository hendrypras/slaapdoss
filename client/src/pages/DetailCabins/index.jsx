import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';
import { useMediaQuery, Box, Skeleton } from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { selectAssets } from '@containers/App/selectors';

import { getDetailCabin } from '@pages/DetailCabins/actions';
import { selectCabins, selectLoading } from '@pages/DetailCabins/selectors';
import { setSearchValue } from '@pages/Home/actions';
import CardCabin from '@pages/DetailCabins/components/CardCabin';
import NavSearchCabin from '@pages/DetailCabins/components/NavSearchCabin';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';
import SubHeadTitle from '@components/SubHeadTitle';
import Maps from '@components/Maps';
import DrawerMobile from '@components/DrawerMobile';
import SearchCabin from '@components/Search/Cabin';

import formateDate from '@utils/formateDate';
import { getCheckIn, getCheckOut } from '@utils/times';

import iconNotfound from '@static/images/not-found.svg';

import classes from './style.module.scss';

const DetailCabins = ({ cabins, loading }) => {
  const { slugCabin } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const checkIn = queryParams.get('checkIn');
  const checkOut = queryParams.get('checkOut');
  const duration = queryParams.get('duration');
  const isTablet = useMediaQuery('(min-width:992px)');
  const dateCheckIn = getCheckIn(checkIn);
  const dateCheckout = getCheckOut(checkOut);
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    navSearch: false,
    drawer: false,
  });

  useEffect(() => {
    if (slugCabin) {
      dispatch(
        getDetailCabin(slugCabin, dateCheckIn.unix, dateCheckout.unix, null, () => {
          navigate('/notfound');
        })
      );
    }
  }, [dispatch, slugCabin, checkIn, duration]);

  useEffect(() => {
    const formattedCheckIn = checkIn ? formateDate(checkIn, 'ddd, D MMMM YYYY') : dateCheckIn.display;
    const formattedCheckOut = checkOut ? formateDate(checkOut, 'ddd, D MMMM YYYY') : dateCheckout.display;
    if (cabins) {
      dispatch(
        setSearchValue(
          { display: `${cabins?.cabin?.name}, ${cabins?.cabin?.city}`, value: slugCabin },
          {
            display: formattedCheckIn,
            value: checkIn || dateCheckIn.value,
          },
          { display: duration ? `${duration} Night` : '1 Night', value: duration ? Number(duration) : 1 },
          {
            display: formattedCheckOut,
            value: checkOut || dateCheckout.value,
          }
        )
      );
    }
    return () => {
      dispatch(
        setSearchValue(
          { display: '', value: '' },
          { display: dateCheckIn.display, value: dateCheckIn.value },
          { display: '1 Malam', value: 1 },
          {
            display: dateCheckout.display,
            value: dateCheckout.value,
          }
        )
      );
    };
  }, [dispatch, cabins, checkIn, checkOut, duration, slugCabin]);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    const isScrollingDown = currentScrollPos > 300;
    setOpen((prev) => ({ ...prev, navSearch: isScrollingDown }));
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleEditNavSearch = () => {
    setOpen((prev) => ({ ...prev, drawer: !prev.drawer }));
  };
  return (
    <>
      {open.navSearch &&
        (isTablet ? (
          <div className={classes.containerSearch}>
            <SearchCabin className={classes.searchCabin} />
          </div>
        ) : (
          <>
            <NavSearchCabin
              cabinName={`${cabins?.cabin?.name}, ${cabins?.cabin?.city}`}
              checkIn={formateDate(checkIn, 'DD MMM YYYY')}
              checkOut={formateDate(checkOut, 'DD MMM YYYY')}
              duration={duration}
              handleEdit={handleEditNavSearch}
            />

            <DrawerMobile
              display="none"
              padding="1rem"
              height="max-content"
              open={open.drawer}
              onClose={handleEditNavSearch}
            >
              <SearchCabin />
            </DrawerMobile>
          </>
        ))}
      <Container className={classes.container}>
        <>
          {loading ? (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: isTablet ? 'column-reverse' : 'column' }}>
              <Skeleton variant="rounded" height={isTablet ? 400 : 300} />
              <Box sx={{ width: '80%', padding: isTablet ? '0' : '0 1rem', margin: '1rem 0' }}>
                <Skeleton animation="pulse" height={35} />
                <Skeleton animation="pulse" height={35} />
              </Box>
            </Box>
          ) : (
            <div className={classes.wrapperImg}>
              <img src={cabins?.cabin?.image_url} alt="cabin" className={classes.mainImg} />
              <div className={classes.wrapperTextContent}>
                <HeadTitle size={19} title={`${cabins?.cabin?.name}, ${cabins?.cabin?.city}`} />
                <SubHeadTitle mt={3} size={14} title={cabins?.cabin?.address} className={classes.address} />
              </div>
            </div>
          )}
          <div className={classes.wrapperFasilities}>
            <HeadTitle>
              <FormattedMessage id="app_detail_cabin_title_facilities_service" />
            </HeadTitle>
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
            <HeadTitle>
              <FormattedMessage id="app_detail_cabin_title_location_details" />
            </HeadTitle>
            <div className={classes.wrapperContent}>
              {!loading && (
                <Maps lat={cabins?.cabin?.latitude} lng={cabins?.cabin?.longitude} className={classes.maps} />
              )}
              <SubHeadTitle mt={3} size={14} className={classes.subTitle} title={cabins?.cabin?.address} />
            </div>
          </div>
          <div className={classes.wrapperCtnExp}>
            <HeadTitle className={classes.contentTitle}>
              <FormattedMessage id="app_detail_cabin_title_prepare" />
            </HeadTitle>
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
            <HeadTitle>
              <FormattedMessage id="app_detail_cabin_title_accommodation_policy" />
            </HeadTitle>
            <div className={classes.wrapperContent}>
              <div className={classes.wrapperTextContent}>
                <HeadTitle size={14} className={classNames(classes.headTitle, classes.check)}>
                  <FormattedMessage id="app_detail_cabin_title_checkin_procedur" />
                </HeadTitle>
                <div className={classes.wrapperTextValue}>
                  <HeadTitle size={12}>
                    <FormattedMessage id="app_home_title_checkin_search_selelct" />
                  </HeadTitle>
                  <div className={classes.textValue}>{cabins?.cabinInformation?.accomodationPolicy?.check_in}</div>
                </div>
                <div className={classes.wrapperTextValue}>
                  <HeadTitle size={12}>
                    <FormattedMessage id="app_home_title_checkout_search_selelct" />
                  </HeadTitle>
                  <div className={classes.textValue}>{cabins?.cabinInformation?.accomodationPolicy?.check_out}</div>
                </div>
              </div>
              <div className={classes.wrapperTextContent}>
                <HeadTitle size={14} className={classes.headTitle}>
                  <FormattedMessage id="app_detail_cabin_title_reschedule_and_cancel" />
                </HeadTitle>
                <div className={classes.textValue}>
                  {cabins?.cabinInformation?.accomodationPolicy?.refund_reschedule}
                </div>
              </div>
              <div className={classes.wrapperTextContent}>
                <HeadTitle size={14} className={classes.headTitle}>
                  <FormattedMessage id="app_detail_cabin_title_age_policies" />
                </HeadTitle>
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
                  <HeadTitle size={14} title={item?.title} className={classes.headTitle} />
                  <div className={classes.textValue}>{item?.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={classes.wrapperCard}>
            {!loading && Array.isArray(cabins?.cabinRooms) && cabins?.cabinRooms?.length > 0 ? (
              cabins?.cabinRooms?.map((val, i) => <CardCabin key={i} cabins={val} />)
            ) : (
              <div className={classes.emptyRoom}>
                <img src={iconNotfound} alt="notfound" className={classes.imgnotfound} />
                <HeadTitle size={17}>
                  <FormattedMessage id="app_detail_cabin_text_empty_room" />
                </HeadTitle>
              </div>
            )}
          </div>
        </>
      </Container>
    </>
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
