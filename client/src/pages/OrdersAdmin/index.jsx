import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { FormattedMessage } from 'react-intl';
import { useDispatch, connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pagination, Chip, PaginationItem, Stack, Box } from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

import { selectLoading, selectOrdersAdmin } from '@pages/OrdersAdmin/selectors';
import { getOrders } from '@pages/OrdersAdmin/actions';

import HeadTitle from '@components/HeadTitle';
import Button from '@components/Button';

import formateDate from '@utils/formateDate';

import formatCurrency from '@utils/formatCurrency';
import classes from './style.module.scss';

const columns = [
  { field: 'id', headerName: 'Order ID', width: 150 },
  { field: 'status', headerName: 'Status', width: 100 },
  { field: 'email', headerName: 'Email User', width: 200 },
  { field: 'nameUser', headerName: 'Name User', width: 100 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'price', headerName: 'Price', type: 'number', width: 130 },
  {
    field: 'duration',
    headerName: 'Duration',
    type: 'number',
    width: 90,
  },
  {
    field: 'reservationDate',
    headerName: 'Reservation Date',
    width: 200,
  },
];

const OrdersAdmin = ({ orders, loading }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get('page'), 10) || 1;
  const limit = parseInt(queryParams.get('limit'), 10) || 18;
  const orderId = queryParams.get('orderId');
  const [orderIdInput, setOrderIdInput] = useState(orderId || '');
  const handlePaginationChange = (e, newPage) => {
    e.preventDefault();
    queryParams.set('page', newPage);
    queryParams.set('limit', 18);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  useEffect(() => {
    dispatch(getOrders(orderId, page, limit));
  }, [dispatch, page, limit, orderId]);

  useEffect(() => {
    if (!orderIdInput) {
      queryParams.delete('orderId');
      navigate(`${location.pathname}?${queryParams.toString()}`);
    }
  }, [orderIdInput, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    queryParams.set('orderId', orderIdInput);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };
  const resultOrders =
    Array.isArray(orders?.results) && orders?.results?.length > 0
      ? orders?.results?.map((val) => ({
          id: val?.order_id,
          status: val?.response_payment?.transaction_status,
          email: val?.user?.email,
          nameUser: val?.user?.username,
          name: `${val?.room?.cabin?.name}, ${val?.room?.cabin?.city}`,
          price: val?.total_price,
          duration: `${val?.stay_duration} Night(s)`,
          reservationDate: `${formateDate(parseInt(val?.start_reservation, 10), 'DD/MM/YYYY')} - ${formateDate(
            parseInt(val?.end_reservation, 10),
            'DD/MM/YYYY'
          )}`,
        }))
      : [];
  return (
    <div className={classes.container}>
      <HeadTitle size={20} className={classes.headTitle}>
        <FormattedMessage id="dashboard_list_orders_head_title" />
      </HeadTitle>
      <div className={classes.wrapperTable}>
        <div className={classes.wrapperSearchById}>
          <HeadTitle title="Search By Order Id" />
          <form onSubmit={handleSearch} className={classes.formSearch}>
            <input
              value={orderIdInput}
              className={classes.input}
              onChange={(e) => setOrderIdInput(e.target.value)}
              type="search"
            />
            <Button className={classes.btnSubmit} type="submit" title="Search" />
          </form>
        </div>
        <Stack className={classes.wrapperCounts}>
          <Chip label={`${orders?.transactionStatusCounts?.pending || 0} Pending`} color="primary" />
          <Chip label={`${orders?.transactionStatusCounts?.settlement || 0} Completed`} color="success" />
          <Chip label={`${orders?.transactionStatusCounts?.cancel || 0} Canceled`} color="error" />
          <Chip label={`${orders?.transactionStatusCounts?.expiry || 0} Expired`} color="warning" />
          <Chip
            label={`Total Amount Completed = ${formatCurrency(orders?.totalGrossAmountSettlement || 0)}`}
            color="success"
          />
        </Stack>
        <Box sx={{ width: '90%' }}>
          <DataGrid rows={resultOrders} columns={columns} loading={loading} hideFooterPagination />
        </Box>
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
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  orders: selectOrdersAdmin,
  loading: selectLoading,
});

OrdersAdmin.propTypes = {
  orders: PropTypes.object,
  loading: PropTypes.bool,
};

export default connect(mapStateToProps)(OrdersAdmin);
