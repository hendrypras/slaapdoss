import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { NoFood } from '@mui/icons-material';
import { useState } from 'react';
import { useMediaQuery } from '@mui/material';

import Button from '@components/Button';
import DrawerMobile from '@components/DrawerMobile';
import HeadTitle from '@components/HeadTitle';

import formatCurrency from '@utils/formatCurrency';

import ContentDetailRoom from '@pages/DetailCabins/components/ContentDetailRoom';
import ContentRoomNumber from '@pages/DetailCabins/components/ContentRoomNumber';

import ModalPopUp from '@components/ModalPopUp';

import classes from './style.module.scss';

const CardCabin = ({ cabins }) => {
  const isDesktop = useMediaQuery('(min-width:992px)');

  const [open, setOpen] = useState({
    drawerRoomNumber: false,
    drawerDetailRoom: false,
  });
  const handleOpenAndCloseDrawer = (drawerName) => {
    setOpen((prev) => ({ ...prev, [drawerName]: !prev[drawerName] }));
  };
  return (
    <>
      {isDesktop ? (
        <>
          <ModalPopUp
            className={classes.modalDetailRoom}
            open={open.drawerDetailRoom}
            onClose={() => handleOpenAndCloseDrawer('drawerDetailRoom')}
          >
            <ContentDetailRoom data={cabins?.include} nameCabin={cabins?.type_room?.name} />
          </ModalPopUp>
          <ModalPopUp
            className={classes.modalRoomNumber}
            open={open.drawerRoomNumber}
            onClose={() => handleOpenAndCloseDrawer('drawerRoomNumber')}
          >
            <ContentRoomNumber rooms={cabins?.cabins} />
          </ModalPopUp>
        </>
      ) : (
        <>
          <DrawerMobile
            open={open.drawerDetailRoom}
            height="70vh"
            onClose={() => handleOpenAndCloseDrawer('drawerDetailRoom')}
          >
            <ContentDetailRoom data={cabins?.include} nameCabin={cabins?.type_room?.name} />
          </DrawerMobile>
          <DrawerMobile
            open={open.drawerRoomNumber}
            height="max-content"
            onClose={() => handleOpenAndCloseDrawer('drawerRoomNumber')}
          >
            <ContentRoomNumber rooms={cabins?.cabins} />
          </DrawerMobile>
        </>
      )}
      <div className={classes.card}>
        <div className={classes.cardTop}>
          <HeadTitle size={16} title={cabins?.type_room?.name} />
          <img src={cabins?.type_room?.image_url} alt="cabins" className={classes.img} />
          <Button
            type="button"
            className={classes.btnDetail}
            onClick={() => handleOpenAndCloseDrawer('drawerDetailRoom')}
          >
            <FormattedMessage id="app_component_button_title_room_details" />
          </Button>
        </div>

        <div className={classes.wrapperCenter}>
          <div className={classes.wrapperFacilities}>
            {cabins?.include?.facilities?.slice(0, 3).map((val, i) => (
              <div key={i} className={classes.content}>
                <img src={val?.icon_url} alt="icon" className={classNames(classes.icon, classes.facility)} />
                <div className={classes.titleContent}>{val?.title}</div>
              </div>
            ))}
            <div className={classNames(classes.content, classes.info)}>
              <NoFood className={classes.icon} />
              <div className={classes.titleContent}>
                {cabins?.type_room?.breakfast ? 'Include Breakfast' : 'No Breakfast'}
              </div>
            </div>
            <div className={classNames(classes.content, classes.info)}>
              <img src={cabins?.include?.rule?.icon_url} alt="rule" className={classes.icon} />
              <div className={classes.titleContent}>{cabins?.include?.rule?.title}</div>
            </div>
          </div>
          <div className={classes.cardFooter}>
            <div className={classes.price}>{formatCurrency(cabins?.type_room?.price)}</div>
            <div className={classes.information}>{cabins?.type_room?.information}</div>
            <Button
              type="button"
              className={classes.btnSelect}
              onClick={() => handleOpenAndCloseDrawer('drawerRoomNumber')}
            >
              <FormattedMessage id="app_component_button_title_select" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
CardCabin.propTypes = {
  cabins: PropTypes.object,
};
export default CardCabin;
