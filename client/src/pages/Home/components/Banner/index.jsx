import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import PropTypes from 'prop-types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import classes from './style.module.scss';

const Banner = ({ banner }) => (
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
    {banner?.map((val, i) => (
      <SwiperSlide key={i} className={classes.swiperSlide}>
        <div className={classes.wrapperText}>
          <div className={classes.title}>{val?.title}</div>
          <div className={classes.subTitle}>{val?.description}</div>
        </div>
        <img src={val?.image_url} alt="bannerImage" className={classes.img} />
      </SwiperSlide>
    ))}
  </Swiper>
);
Banner.propTypes = {
  banner: PropTypes.array,
};
export default Banner;
