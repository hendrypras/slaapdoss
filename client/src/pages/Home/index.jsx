import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { useState } from 'react';
import { connect } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FormattedMessage } from 'react-intl';
import { Autoplay, Pagination } from 'swiper/modules';
import { selectAssets } from '@containers/App/selectors';
import moment from 'moment';
import { DateRange, Schedule as ScheduleIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';
import SubHeadTitle from '@components/SubHeadTitle';
import SearchSelect from '@components/SearchSelect';
import DrawerMobile from '@components/DrawerMobile';
import Maps from '@components/Maps';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import Button from '@components/Button';
import classes from './style.module.scss';

const Home = ({ assets }) => {
  const [openDrawer, setOpenDrawer] = useState({
    location: false,
    duration: false,
  });
  const [valueSelect, setValueSelect] = useState({
    location: '',
    checkIn: moment().format('ddd, D MMMM YYYY'),
    duration: '',
    checkOut: '',
  });
  const handleOpenDrawerSearchSelect = (selectName) => {
    if (selectName === 'duration' && !valueSelect.location) {
      return;
    }
    setOpenDrawer((prevState) => ({
      ...prevState,
      [selectName]: !prevState[selectName],
    }));
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
                  value={valueSelect.location}
                  title="app_home_title_location_search_selelct"
                  placeHolder="app_home_title_placeholder_location_search_selelct"
                  icon={LocationOnIcon}
                  handleClick={() => handleOpenDrawerSearchSelect('location')}
                />
                <DrawerMobile
                  height="80vh"
                  open={openDrawer.location}
                  onClose={() => handleOpenDrawerSearchSelect('location')}
                >
                  <div>location</div>
                </DrawerMobile>
                <SearchSelect
                  value={valueSelect.checkIn}
                  title="app_home_title_checkin_search_selelct"
                  placeHolder="app_home_title_placeholder_checkin_search_selelct"
                  icon={DateRange}
                  disabled
                />
                <SearchSelect
                  value={valueSelect.duration}
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
                  <div>durasi</div>
                </DrawerMobile>
                <SearchSelect
                  value={valueSelect.checkOut}
                  title="app_home_title_checkout_search_selelct"
                  placeHolder="app_home_title_placeholder_checkout_search_selelct"
                  icon={DateRange}
                  disabled
                />
              </div>
              <Button className={classes.buttonSearch} text="app_home_button_text_search_select" />
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
      <Maps lat={-6.23827} lng={106.975571} draggable />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  assets: selectAssets,
});

Home.propTypes = {
  assets: PropTypes.object,
};

export default connect(mapStateToProps)(Home);
