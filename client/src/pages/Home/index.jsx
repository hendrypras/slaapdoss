import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { useState } from 'react';
import { connect } from 'react-redux';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FormattedMessage } from 'react-intl';
import { Autoplay, Pagination } from 'swiper/modules';
import moment from 'moment';
import { selectAssets } from '@containers/App/selectors';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';
import SubHeadTitle from '@components/SubHeadTitle';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import SearchSelect from '@components/SearchSelect';
import classes from './style.module.scss';

const HomePage = ({ assets }) => {
  const marker = [{ geocode: [-6.177082, 106.838581] }];
  const [valueSelect, setValueSelect] = useState({
    location: '',
    checkIn: new Date(),
    duration: '',
    checkOut: '',
  });

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
            <div>Good afternoon</div>
            <div>where do you want to stay</div>
            <form className={classes.form}>
              <SearchSelect
                value={valueSelect.location}
                title="app_home_title_location_search_selelct"
                placeHolder="app_home_title_placeholder_location_search_selelct"
              />
              <SearchSelect
                value={valueSelect.checkIn}
                title="app_home_title_checkin_search_selelct"
                placeHolder="app_home_title_placeholder_checkin_search_selelct"
              />
              <SearchSelect
                value={valueSelect.duration}
                title="app_home_title_duration_search_selelct"
                placeHolder="app_home_title_placeholder_duration_search_selelct"
              />
              <SearchSelect
                value={valueSelect.checkOut}
                title="app_home_title_checkout_search_selelct"
                placeHolder="app_home_title_placeholder_checkout_search_selelct"
              />
            </form>
          </div>
        </>
      </Container>
      <Container className={classes.containerCabin}>
        <div>
          {assets?.cabin?.map((val, i) => (
            <div key={i}>
              <img src={val?.imageUrl} alt="cabin" className={classes.img} />
              <HeadTitle titleId="app_home_cabin_head_title" />
              <SubHeadTitle textId="app_home_cabin_sub_title" />
            </div>
          ))}
        </div>
      </Container>
      <section className={classes.secSatisfication}>
        <div>test</div>
      </section>
      {/* <MapContainer style={{ width: '100%', height: '100vh' }} center={[-6.17476, 106.827072]} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {marker.map((val, i) => (
            <Marker key={i} position={val.geocode} />
          ))}
        </MapContainer> */}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  assets: selectAssets,
});

HomePage.propTypes = {
  assets: PropTypes.object,
};

export default connect(mapStateToProps)(HomePage);
