import Container from '@components/Container';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useEffect } from 'react';

import { selectAssets } from '@containers/App/selectors';

import { getDetailCabins } from '@pages/DetailCabins/actions';
import { selectCabins } from '@pages/DetailCabins/selectors';

import classes from './style.module.scss';

const DetailCabins = ({ assets, cabins }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDetailCabins({ province: 'jawabarat' }));
  }, [dispatch]);
  return (
    <>
      <div>
        <img src="" alt="" />
      </div>
      <Container>
        <div />
      </Container>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  assets: selectAssets,
  cabins: selectCabins,
});
DetailCabins.propTypes = {
  assets: PropTypes.object,
  cabins: PropTypes.object,
};

export default connect(mapStateToProps)(DetailCabins);
