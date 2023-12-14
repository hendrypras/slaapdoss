import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FormattedMessage } from 'react-intl';
import { Autoplay, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { selectAssets } from '@containers/App/selectors';
import { DateRange, Schedule as ScheduleIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';
import SubHeadTitle from '@components/SubHeadTitle';
import SearchSelect from '@components/SearchSelect';
import DrawerMobile from '@components/DrawerMobile';
import Button from '@components/Button';
import Maps from '@components/Maps';

import { selectSearchValue } from '@pages/Home/selectors';
import { getCabinsLocation } from '@pages/DetailCabins/actions';
import ContentDrawerLocation from '@pages/Home/components/ContentDrawerLocation';
import { selectCabinsLocation } from '@pages/DetailCabins/selectors';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import classes from './style.module.scss';
import ContentDrawerCheckin from './components/ContentDrawerCheckin';

const Home = ({ assets, searchValue, cabinsLocation }) => {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState({
    location: false,
    duration: false,
    checkIn: false,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCabinsLocation());
  }, [dispatch]);
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
      `/cabins/${searchValue.location.value}?dateStart=${searchValue.checkIn.value}&dateEnd=${searchValue.checkOut.value}&duration=${searchValue.duration.value}`
    );
  };
  return (
    <>
      <Container>
        <>
          <Swiper
            spaceBetween={30}
            centeredSlides
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className={classes.swiper}
          >
            {assets?.banner?.map((val, i) => (
              <SwiperSlide key={i} className={classes.swiperSlide}>
                <div className={classes.wrapperText}>
                  <div className={classes.title}>
                    <FormattedMessage id={val?.title} />
                  </div>
                  <div className={classes.subTitle}>
                    <FormattedMessage id={val?.subTitle} />
                  </div>
                </div>
                <img src={val?.imageUrl} alt="bannerImage" className={classes.img} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={classes.searchWrapper}>
            <div className={classes.subTitle}>Good afternoon</div>
            <div className={classes.title}>
              <FormattedMessage id="app_home_title_search_select" />
            </div>
            <form className={classes.form}>
              <div className={classes.selectWrapper}>
                <SearchSelect
                  value={searchValue.location.display}
                  title="app_home_title_location_search_selelct"
                  placeHolder="app_home_title_placeholder_location_search_selelct"
                  icon={LocationOnIcon}
                  handleClick={() => handleOpenDrawerSearchSelect('location')}
                />
                <DrawerMobile
                  height="60vh"
                  open={openDrawer.location}
                  onClose={() => handleOpenDrawerSearchSelect('location')}
                >
                  <ContentDrawerLocation
                    onClose={() => handleOpenDrawerSearchSelect('location')}
                    searchValue={searchValue}
                    cabinsLocation={cabinsLocation}
                  />
                </DrawerMobile>
                <SearchSelect
                  value={searchValue.checkIn.display}
                  title="app_home_title_checkin_search_selelct"
                  placeHolder="app_home_title_placeholder_checkin_search_selelct"
                  icon={DateRange}
                  handleClick={() => handleOpenDrawerSearchSelect('checkIn')}
                />
                <DrawerMobile
                  height="50vh"
                  open={openDrawer.checkIn}
                  onClose={() => handleOpenDrawerSearchSelect('checkIn')}
                >
                  <ContentDrawerCheckin
                    searchValue={searchValue}
                    onClose={() => handleOpenDrawerSearchSelect('checkIn')}
                  />
                </DrawerMobile>
                <SearchSelect
                  value={searchValue.duration.display}
                  title="app_home_title_duration_search_selelct"
                  placeHolder="app_home_title_placeholder_duration_search_selelct"
                  icon={ScheduleIcon}
                  handleClick={() => handleOpenDrawerSearchSelect('duration')}
                />
                <DrawerMobile
                  height="80vh"
                  open={openDrawer.duration}
                  onClose={() => handleOpenDrawerSearchSelect('duration')}
                >
                  <ContentDrawerCheckin />
                </DrawerMobile>
                <SearchSelect
                  value={searchValue.checkOut.display}
                  title="app_home_title_checkout_search_selelct"
                  placeHolder="app_home_title_placeholder_checkout_search_selelct"
                  icon={DateRange}
                  disabled
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!searchValue.location.value}
                className={classes.buttonSearch}
                text="app_home_button_text_search_select"
              />
            </form>
          </div>
        </>
      </Container>
      <Container className={classes.containerCabin}>
        <>
          <div className={classes.wrapperTitle}>
            <HeadTitle titleId="app_home_title_perfect_solition" className={classes.headTitle} />
            <SubHeadTitle className={classes.subTitle} textId="app_home_sub_title_perfect_solition" />
          </div>
          {assets?.cabin?.map((val, i) => (
            <div key={i} className={classes.wrapperCard}>
              <img src={val?.imageUrl} alt="cabin" className={classes.img} />
              <HeadTitle className={classes.title} titleId="app_home_cabin_head_title" />
              <SubHeadTitle className={classes.subTitle} textId="app_home_cabin_sub_title" />
            </div>
          ))}
        </>
      </Container>
      <section className={classes.secSatisfication}>
        <HeadTitle titleId="app_title_satisfaction" className={classes.headTitle} />
        <SubHeadTitle className={classes.subTitle} textId="app_subtitle_satisfaction" />
        <div className={classes.wrapperCard}>
          {assets?.dropStep?.map((val, i) => (
            <div key={i} className={classes.card}>
              <img src={val?.icon} alt="icon" className={classes.icon} />
              <div className={classes.wrapperText}>
                <div className={classes.title}>{val?.title}</div>
                <div className={classes.description}>{val?.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Maps />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  assets: selectAssets,
  searchValue: selectSearchValue,
  cabinsLocation: selectCabinsLocation,
});

Home.propTypes = {
  assets: PropTypes.object,
  searchValue: PropTypes.object,
  cabinsLocation: PropTypes.array,
};

export default connect(mapStateToProps)(Home);
