import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import Button from '@components/Button';
import HeadTitle from '@components/HeadTitle';

import SubHeadTitle from '@components/SubHeadTitle';
import classes from './style.module.scss';
import CardTypeRoom from '../CardTypeRoom';

const CardCabin = ({ cabin }) => {
  const nvaigate = useNavigate();
  return (
    <div className={classes.card}>
      <div className={classes.wrapperImg}>
        <HeadTitle size={16} title={cabin?.type_room?.name} />
        <img src={cabin?.image_url} alt="cabin" className={classes.img} />
        <Button type="button" className={classes.btnDetail} onClick={() => nvaigate(`/cabin/${cabin?.slug}`)}>
          <FormattedMessage id="app_component_button_title_room_details" />
        </Button>
      </div>

      <div className={classes.wrapperContent}>
        <div className={classes.contentCabin}>
          <HeadTitle size={16} title={`${cabin?.name}, ${cabin?.city}`} />
          <SubHeadTitle mt={2} className={classes.address} title={cabin?.address} />
        </div>
        <div className={classes.wrapperCardTypeRom}>
          {cabin?.type_rooms?.map((val) => (
            <CardTypeRoom key={val.id} data={val} />
          ))}
        </div>
      </div>
    </div>
  );
};
CardCabin.propTypes = {
  cabin: PropTypes.object,
};
export default CardCabin;
