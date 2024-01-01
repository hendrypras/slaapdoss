import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Button from '@components/Button';

import formatCurrency from '@utils/formatCurrency';

import classes from './style.module.scss';

const CardTypeRoom = ({ data }) => {
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/dashboard/edit-type-room/${data?.id}`, { state: data });
  };
  return (
    <div className={classes.card}>
      <div className={classes.wrapper}>
        <div className={classes.wrapperImg}>
          <img src={data.image_url} alt="type-room" className={classes.img} />
        </div>
        <div className={classes.wrapperContent}>
          <div className={classes.nameTypeRoom}>{data?.name}</div>
          <div className={classes.price}>{formatCurrency(Number(data?.price))}</div>
          <div>{data?.capacity}</div>
        </div>
      </div>
      <Button onClick={handleEdit} title="edit" type="button" className={classes.btnEdit} />
    </div>
  );
};

CardTypeRoom.propTypes = {
  data: PropTypes.object,
};
export default CardTypeRoom;
