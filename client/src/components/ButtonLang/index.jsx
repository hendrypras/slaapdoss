import PropTypes from 'prop-types';
import classNames from 'classnames';
import { KeyboardArrowRightOutlined as KeyboardArrowRightOutlinedIcon, CheckOutlined } from '@mui/icons-material';
import { Avatar, Modal, Fade, MenuItem, Divider, ListSubheader } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { setLocale } from '@containers/App/actions';

import classes from './style.module.scss';

const ButtonLang = ({ locale, className }) => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const onSelectLang = (lang) => {
    if (lang !== locale) {
      dispatch(setLocale(lang));
    }
    handleCloseModal();
  };

  return (
    <>
      <button
        data-testid="button-lang"
        type="button"
        className={classNames(classes.toggle, className)}
        onClick={handleOpenModal}
      >
        <Avatar className={classes.avatar} src={locale === 'id' ? '/id.png' : '/en.png'} />
        <div className={classes.lang}>{locale}</div>
        <KeyboardArrowRightOutlinedIcon className={classes.arrowIcon} />
      </button>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(3px)',
            },
          },
        }}
        className={classes.modal}
      >
        <Fade in={openModal}>
          <div className={classes.paper}>
            <ListSubheader className={classes.headTitle}>Pilih Bahasa</ListSubheader>
            <Divider />
            <MenuItem onClick={() => onSelectLang('id')} selected={locale === 'id'} className={classes.menu}>
              <div className={classes.wrapperLeft}>
                <Avatar className={classes.avatar} src="/id.png" />
                <div className={classes.textLang}>
                  <FormattedMessage id="app_lang_id" />
                </div>
              </div>
              {locale === 'id' && <CheckOutlined className={classes.checkIcon} />}
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => onSelectLang('en')} selected={locale === 'en'} className={classes.menu}>
              <div className={classes.wrapperLeft}>
                <Avatar className={classes.avatar} src="/en.png" />
                <div className={classes.textLang}>
                  <FormattedMessage id="app_lang_en" />
                </div>
              </div>
              {locale === 'en' && <CheckOutlined className={classes.checkIcon} />}
            </MenuItem>
            <Divider />
          </div>
        </Fade>
      </Modal>
    </>
  );
};

ButtonLang.propTypes = {
  locale: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ButtonLang;
