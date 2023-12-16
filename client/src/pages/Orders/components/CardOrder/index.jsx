import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classes from './style.module.scss';

const CardOrder = ({ orderDetail }) => {
  console.log(orderDetail);
  return (
    <div className={classes.card}>
      <div className={classes.wrapperOrderId}>
        <div className={classes.titleOrderId}>OrderId</div>
        <div className={classes.valueOrderId}>{orderDetail?.order_id}</div>
      </div>
    </div>
  );
};

CardOrder.propTypes = {
  orderDetail: PropTypes.object,
};

export default CardOrder;
