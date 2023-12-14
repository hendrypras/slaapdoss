import PropTypes from 'prop-types';
import { NoFood } from '@mui/icons-material';
import classNames from 'classnames';
import { useState } from 'react';

import Button from '@components/Button';
import DrawerMobile from '@components/DrawerMobile';
import HeadTitle from '@components/HeadTitle';

import formatCurrency from '@utils/formatCurrency';

import ContentDetailRoom from '@pages/DetailCabins/components/ContentDetailRoom';
import ContentRoomNumber from '@pages/DetailCabins/components/ContentRoomNumber';

import classes from './style.module.scss';

const CardCabin = ({ cabins }) => {
  const [open, setOpen] = useState({
    drawerRoomNumber: false,
    drawerDetailRoom: false,
  });
  console.log(cabins);
  return (
    <div className={classes.card}>
      <div className={classes.cardTop}>
        <HeadTitle title={cabins?.type_cabin?.name} className={classes.titleCard} />
        <img src={cabins?.type_cabin?.image_url} alt="cabins" className={classes.img} />
        <Button className={classes.btnDetail} text="Room Details" onClick={() => setOpen({ drawerDetailRoom: true })} />
      </div>
      <DrawerMobile open={open.drawerDetailRoom} height="70vh" onClose={() => setOpen({ drawerDetailRoom: false })}>
        <ContentDetailRoom data={cabins?.include} nameCabin={cabins?.type_cabin?.name} />
      </DrawerMobile>
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
              {cabins?.type_cabin?.breakfast ? 'Include Breakfast' : 'No Breakfast'}
            </div>
          </div>
          <div className={classNames(classes.content, classes.info)}>
            <img src={cabins?.include?.rule?.icon_url} alt="rule" className={classes.icon} />
            <div className={classes.titleContent}>{cabins?.include?.rule?.title}</div>
          </div>
        </div>
        <div className={classes.cardFooter}>
          <div className={classes.price}>{formatCurrency(cabins?.type_cabin?.price)}</div>
          <div className={classes.information}>{cabins?.type_cabin?.information}</div>
          <Button text="Select" className={classes.btnSelect} onClick={() => setOpen({ drawerRoomNumber: true })} />
          <DrawerMobile open={open.drawerRoomNumber} height="50vh" onClose={() => setOpen({ drawerRoomNumber: false })}>
            <ContentRoomNumber rooms={cabins?.cabins} />
          </DrawerMobile>
        </div>
      </div>
    </div>
  );
};
CardCabin.propTypes = {
  cabins: PropTypes.object,
};
export default CardCabin;
