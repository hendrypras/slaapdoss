import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';

import { selectOrders } from '@pages/Orders/selectors';
import CardOrder from '@pages/Orders/components/CardOrder';
import { getOrdersUser } from '@pages/Orders/actions';

import classes from './style.module.scss';

const PaymentResponse = ({ orders }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrdersUser());
  }, [dispatch]);

  return (
    <Container className={classes.wrapper}>
      <>
        <HeadTitle>
          <FormattedMessage id="app_orders_head_title" />
        </HeadTitle>
        <div className={classes.wrapperCardOrder}>
          {orders?.results?.map((val, i) => (
            <CardOrder key={i} orderDetail={val} />
          ))}
        </div>
      </>
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  orders: selectOrders,
});
PaymentResponse.propTypes = {
  orders: PropTypes.object,
};

export default connect(mapStateToProps)(PaymentResponse);
