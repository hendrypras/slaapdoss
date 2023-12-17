import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Pagination, PaginationItem, Stack } from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

import emptyImage from '@static/images/empty.svg';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';

import { selectLoading as selectLoadingGlobal } from '@containers/App/selectors';

import CardOrder from '@pages/Orders/components/CardOrder';
import { selectLoading, selectOrders } from '@pages/Orders/selectors';
import { cancelTransaction, getOrdersUser } from '@pages/Orders/actions';

import Button from '@components/Button';
import classes from './style.module.scss';

const PaymentResponse = ({ orders, loadingGlobal, loading }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get('page'), 10) || 1;
  const limit = parseInt(queryParams.get('limit'), 10) || 2;
  const handlePaginationChange = (e, newPage) => {
    e.preventDefault();
    queryParams.set('page', newPage);
    queryParams.set('limit', 2);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };
  useEffect(() => {
    dispatch(getOrdersUser(null, page, limit));
  }, [dispatch, page, limit]);

  const handleCancelTransaction = (orderId) => {
    dispatch(
      cancelTransaction(orderId, () => {
        dispatch(getOrdersUser());
      })
    );
  };

  return (
    <Container className={classes.wrapper}>
      <>
        <HeadTitle size={22} className={classes.headTitle}>
          <FormattedMessage id="app_orders_head_title" />
        </HeadTitle>
        {!loading && Array.isArray(orders?.results) && orders?.results?.length > 0 ? (
          <div className={classes.wrapperCardOrder}>
            {orders?.results?.map((val, i) => (
              <CardOrder
                key={i}
                loadingGlobal={loadingGlobal}
                cancelTransaction={(orderId) => handleCancelTransaction(orderId)}
                orderDetail={val}
              />
            ))}
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil((orders?.count || 0) / limit)}
                onChange={handlePaginationChange}
                page={page}
                renderItem={(item) => (
                  <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                )}
              />
            </Stack>
          </div>
        ) : (
          <div className={classes.wrapperEmpty}>
            <HeadTitle className={classes.title}>
              <FormattedMessage id="app_orders_text_empty_orders" />
            </HeadTitle>
            <img src={emptyImage} alt="empty" className={classes.img} />
            <Button onClick={() => navigate('/')} className={classes.btnBook} type="button">
              <FormattedMessage id="app_orders_text_button_empty_orders" />
            </Button>
          </div>
        )}
      </>
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  orders: selectOrders,
  loadingGlobal: selectLoadingGlobal,
  loading: selectLoading,
});
PaymentResponse.propTypes = {
  loadingGlobal: PropTypes.bool,
  loading: PropTypes.bool,
  orders: PropTypes.object,
};

export default connect(mapStateToProps)(PaymentResponse);
