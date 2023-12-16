import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { selectAssets } from '@containers/App/selectors';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';
import SubHeadTitle from '@components/SubHeadTitle';

import { selectSearchValue } from '@pages/Home/selectors';
import { getCabinsLocation } from '@pages/DetailCabins/actions';
import { selectCabinsLocation } from '@pages/DetailCabins/selectors';

import Footer from '@components/Footer';
import Banner from './components/Banner';

import classes from './style.module.scss';
import SearchCabin from './components/SearchCabinHome';

const Home = ({ assets, searchValue, cabinsLocation }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCabinsLocation());
  }, [dispatch]);

  return (
    <>
      <Container>
        <>
          <Banner banner={assets?.banner} />
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
          {assets?.cabin?.map((val, i) => (
            <div key={i} className={classes.wrapperCard}>
              <img src={val?.imageUrl} alt="cabin" className={classes.img} />
              <HeadTitle className={classes.title}>
                <FormattedMessage id={val?.title} />
              </HeadTitle>
              <SubHeadTitle className={classes.subTitle}>
                <FormattedMessage id={val?.subTitle} />
              </SubHeadTitle>
            </div>
          ))}
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
                <div className={classes.title}>{val?.title}</div>
                <div className={classes.description}>{val?.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className={classes.wrapperBranch}>
        <img className={classes.img} src={assets?.images?.branch} alt="branch" />
      </section>
      <Footer />
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
