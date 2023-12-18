import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { FormattedMessage } from 'react-intl';
import { useDispatch, connect } from 'react-redux';
import { useEffect } from 'react';
import { createStructuredSelector } from 'reselect';

import { selectLoading } from '@containers/App/selectors';

import { selectBannersAdmin } from '@pages/ListBanner/selectors';
import { getBanners } from '@pages/ListBanner/actions';

import HeadTitle from '@components/HeadTitle';

import classes from './style.module.scss';

const ListBanner = ({ banners, loading }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);
  const resultBanner =
    Array.isArray(banners) && banners?.length > 0
      ? banners?.map((val, i) => ({
          id: i + 1,
          image: val?.image_url,
          status: val?.active,
        }))
      : [];

  const columns = [
    { field: 'id', headerName: 'No', width: 50 },
    {
      field: 'image',
      headerName: 'Banner',
      width: 300,
      renderCell: (params) => <img src={params.value} alt="Banner" className={classes.customImage} />,

      slotProps: {
        renderCell: (slotProps) => ({
          ...slotProps,
          value: <img src={slotProps.row.image} alt="Banner" className={classes.customImage} />,
        }),
      },
    },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

  return (
    <div className={classes.container}>
      <HeadTitle size={20} className={classes.headTitle}>
        <FormattedMessage id="dashboard_list_banner_head_title" />
      </HeadTitle>
      <div className={classes.wrapperTable}>
        <DataGrid getRowHeight={() => 200} rows={resultBanner} columns={columns} loading={loading} />
      </div>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  banners: selectBannersAdmin,
  loading: selectLoading,
});

ListBanner.propTypes = {
  banners: PropTypes.array,
  loading: PropTypes.bool,
};

export default connect(mapStateToProps)(ListBanner);
