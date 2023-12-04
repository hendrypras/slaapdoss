import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, connect } from 'react-redux';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createStructuredSelector } from 'reselect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

import BackButton from '@components/BackButton';

import { selectLocale } from '@containers/App/selectors';
import { setLocale } from '@containers/App/actions';

import classes from './style.module.scss';

const WrapperAuthentication = ({ children, locale, title, isBackBtn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuPosition, setMenuPosition] = useState(null);
  const open = Boolean(menuPosition);
  const handleClick = (event) => {
    setMenuPosition(event.currentTarget);
  };
  const handleClose = () => {
    setMenuPosition(null);
  };
  const onSelectLang = (lang) => {
    if (lang !== locale) {
      dispatch(setLocale(lang));
    }
    handleClose();
  };
  return (
    <div className={classes.wrapper}>
      <div className={classes.wrapperLeftAuth} />
      <div className={classes.wrapperRightAuth}>
        <div className={classes.wrapperHead}>
          {isBackBtn && <BackButton onClick={() => navigate(-1)} />}
          <button type="button" className={classes.toggle} onClick={handleClick}>
            <Avatar className={classes.avatar} src={locale === 'id' ? '/id.png' : '/en.png'} />
            <div className={classes.lang}>{locale}</div>
            <ExpandMoreIcon className={classes.arrowIcon} />
          </button>
        </div>
        <Menu open={open} anchorEl={menuPosition} onClose={handleClose}>
          <MenuItem onClick={() => onSelectLang('id')} selected={locale === 'id'}>
            <div className={classes.menu}>
              <div className={classes.menuLang}>
                <FormattedMessage id="app_lang_id" />
              </div>
            </div>
          </MenuItem>
          <MenuItem onClick={() => onSelectLang('en')} selected={locale === 'en'}>
            <div className={classes.menu}>
              <div className={classes.menuLang}>
                <FormattedMessage id="app_lang_en" />
              </div>
            </div>
          </MenuItem>
        </Menu>
        <div className={classes.wrapperLogo}>
          <button type="button" onClick={() => navigate('/')} className={classes.button}>
            <div className={classes.logo}>HahTube</div>
            <p className={classes.subLogo}>Find Your Video</p>
          </button>
        </div>
        <div className={classes.wrapperTitle}>
          <div className={classes.title}>
            <FormattedMessage id={title} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
WrapperAuthentication.propTypes = {
  children: PropTypes.element.isRequired,
  locale: PropTypes.string,
  title: PropTypes.string.isRequired,
  isBackBtn: PropTypes.bool,
};
const mapStateToProps = createStructuredSelector({
  locale: selectLocale,
});
export default connect(mapStateToProps)(WrapperAuthentication);
