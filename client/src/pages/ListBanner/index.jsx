import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { FormattedMessage } from 'react-intl';
import { useDispatch, connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { DeleteOutline as DeleteOutlineIcon, Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';

import { selectLoading } from '@containers/App/selectors';

import { selectBannersAdmin } from '@pages/ListBanner/selectors';
import { deleteBanner, getBanners, updateStatusBanner } from '@pages/ListBanner/actions';

import HeadTitle from '@components/HeadTitle';
import Button from '@components/Button';
import PopupMessage from '@components/PopupMessage/Dialog';

import classes from './style.module.scss';

const ListBanner = ({ banners, loading }) => {
  const dispatch = useDispatch();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [bannerId, setBannerId] = useState({
    typeAction: '',
    id: null,
    titlePopupId: '',
    messagePopUpId: '',
  });
  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  const handleOpenPopUp = (type, id, titleId, messageId) => {
    setOpenPopUp(true);
    setBannerId({ typeAction: type, id, titlePopupId: titleId, messagePopUpId: messageId });
  };
  const handleAction = () => {
    if (bannerId.id && bannerId.typeAction === 'delete') {
      dispatch(
        deleteBanner(bannerId.id, () => {
          dispatch(getBanners());
        })
      );
    } else if (bannerId.id && (bannerId.typeAction === 'private' || bannerId.typeAction === 'public')) {
      dispatch(
        updateStatusBanner(bannerId.typeAction, bannerId.id, () => {
          dispatch(getBanners());
        })
      );
    }
    setOpenPopUp(false);
  };
  const handleOpenPopUpStatusBanner = (data) => {
    if (data && data?.status === 'Public') {
      handleOpenPopUp(
        'private',
        data?.bannerId,
        'dashboard_list_banner_text_question_update',
        'dashboard_list_banner_message_question_update'
      );
    } else if (data && data?.status === 'Private') {
      handleOpenPopUp(
        'public',
        data?.bannerId,
        'dashboard_list_banner_text_question_update',
        'dashboard_list_banner_message_question_update'
      );
    }
  };

  const resultBanner =
    Array.isArray(banners) && banners?.length > 0
      ? banners?.map((val, i) => ({
          id: i + 1,
          image: val?.image_url,
          status: val?.active ? 'Public' : 'Private',
          title: val?.title,
          description: val?.description,
          bannerId: val?.id,
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
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'title',
      headerName: 'Title',
      width: 200,
      renderCell: (params) => <div className={classes.titleColumn}>{params.value}</div>,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      renderCell: (params) => <div className={classes.titleDesc}>{params.value}</div>,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <div className={classes.wrapperBtnAction}>
          <Button
            aria-label="button-delete"
            className={classes.btnAction}
            type="button"
            onClick={() =>
              handleOpenPopUp(
                'delete',
                params.row.bannerId,
                'dashboard_list_banner_text_question_delete',
                'dashboard_list_banner_message_question_delete'
              )
            }
          >
            <Tooltip title="Delete">
              <DeleteOutlineIcon />
            </Tooltip>
          </Button>
          <Button
            aria-label="button-delete"
            className={classes.btnAction}
            type="button"
            onClick={() => handleOpenPopUpStatusBanner(params.row)}
          >
            <Tooltip title={params?.row?.status === 'Private' ? 'Public' : 'Private'}>
              {params?.row?.status === 'Private' ? <LockOpenIcon /> : <LockIcon />}
            </Tooltip>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PopupMessage
        open={openPopUp}
        titleId={bannerId.titlePopupId}
        messageId={bannerId.messagePopUpId}
        onClose={() => setOpenPopUp(false)}
        onOk={handleAction}
      />
      <div className={classes.container}>
        <HeadTitle size={20} className={classes.headTitle}>
          <FormattedMessage id="dashboard_list_banner_head_title" />
        </HeadTitle>
        <div className={classes.wrapperTable}>
          <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
              getRowHeight={() => 200}
              hideFooterPagination
              rows={resultBanner}
              columns={columns}
              loading={loading}
            />
          </Box>
        </div>
      </div>
    </>
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
