import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createStructuredSelector } from 'reselect';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Skeleton, Box, useMediaQuery } from '@mui/material';

import { selectAssets } from '@containers/App/selectors';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';
import SubHeadTitle from '@components/SubHeadTitle';

import Banner from '@pages/Home/components/Banner';
import SearchCabin from '@pages/Home/components/SearchCabinHome';
import { selectBanners, selectLoading, selectSearchValue } from '@pages/Home/selectors';
import { getCabinsLocation } from '@pages/DetailCabins/actions';
import { selectCabinsLocation } from '@pages/DetailCabins/selectors';
import { getBanners } from '@pages/Home/actions';

import classes from './style.module.scss';

const Home = ({ assets, searchValue, cabinsLocation, banners, loading }) => {
  const dispatch = useDispatch();
  const isTablet = useMediaQuery('(min-width:992px)');

  useEffect(() => {
    dispatch(getCabinsLocation());
    dispatch(getBanners());
  }, [dispatch]);

  return (
    <>
      <Container>
        <>
          {loading ? (
            <Box sx={{ width: '100%' }}>
              <Skeleton variant="rectangular" height={isTablet ? 400 : 300} />
              {!isTablet && (
                <Box sx={{ width: '90%', padding: '0 1rem', marginTop: '1rem' }}>
                  <Skeleton animation="pulse" height={35} />
                  <Skeleton animation="pulse" height={35} />
                </Box>
              )}
            </Box>
          ) : (
            <Banner banner={banners} />
          )}
          <SearchCabin cabinsLocation={cabinsLocation} searchValue={searchValue} />
        </>
      </Container>
      <Container className={classes.containerCabin}>
        <>
          <div className={classes.wrapperTitle}>
            <HeadTitle size={19} className={classes.headTitle}>
              <FormattedMessage id="app_home_title_perfect_solition" />
            </HeadTitle>
            <SubHeadTitle className={classes.subTitle}>
              <FormattedMessage id="app_home_sub_title_perfect_solition" />
            </SubHeadTitle>
          </div>
          <div className={classes.wrapperCabin}>
            {assets?.cabin?.map((val, i) => (
              <div key={i} className={classNames({ [classes.cabinCard]: true, [classes.genap]: i % 2 !== 0 || false })}>
                <img src={val?.imageUrl} alt="cabin" className={classes.img} />
                <HeadTitle size={17} className={classes.title}>
                  <FormattedMessage id={val?.title} />
                </HeadTitle>
                <SubHeadTitle
                  className={classNames({ [classes.subTitle]: true, [classes.subgenap]: i % 2 !== 0 || false })}
                >
                  <FormattedMessage id={val?.subTitle} />
                </SubHeadTitle>
              </div>
            ))}
          </div>
        </>
      </Container>
      <section className={classes.secSatisfication}>
        <HeadTitle size={19} className={classes.headTitle}>
          <FormattedMessage id="app_title_satisfaction" />
        </HeadTitle>
        <SubHeadTitle className={classes.subTitle}>
          <FormattedMessage id="app_subtitle_satisfaction" />
        </SubHeadTitle>
        <div className={classes.wrapperCard}>
          {assets?.dropStep?.map((val, i) => (
            <div key={i} className={classes.card}>
              <img src={val?.icon} alt="icon" className={classes.icon} />
              <div className={classes.wrapperText}>
                <div className={classes.title}>
                  <FormattedMessage id={val?.title} />
                </div>
                <div className={classes.description}>
                  <FormattedMessage id={val?.description} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className={classes.wrapperBranch}>
        <img className={classes.img} src={assets?.images?.branch} alt="branch" />
      </section>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  assets: selectAssets,
  searchValue: selectSearchValue,
  cabinsLocation: selectCabinsLocation,
  banners: selectBanners,
  loading: selectLoading,
});

Home.propTypes = {
  assets: PropTypes.object,
  searchValue: PropTypes.object,
  cabinsLocation: PropTypes.array,
  banners: PropTypes.array,
  loading: PropTypes.bool,
};

export default connect(mapStateToProps)(Home);
