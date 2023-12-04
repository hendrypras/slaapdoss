import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Avatar, Menu, MenuItem, ListItemIcon, Tooltip, IconButton, Divider } from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  HomeOutlined as HomeOutlinedIcon,
  SubscriptionsOutlined as SubscriptionsOutlinedIcon,
  NotificationsOutlined as NotificationsOutlinedIcon,
  MonetizationOnOutlined as MonetizationOnOutlinedIcon,
  QueueOutlined as QueueOutlinedIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Logout,
  Login as LoginIcon,
  Search,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { filter } from 'lodash';

import { setLocale } from '@containers/App/actions';

import { selectToken } from '@containers/Client/selectors';
import decryptToken from '@utils/decryptToken';
import success from '@static/images/success-payment.svg';

import classes from './style.module.scss';

const Navbar = ({ locale, login, userData, token }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const open = Boolean(menuPosition);
  const { role: userRole } = token !== null && decryptToken(token);

  const handleClick = (e) => {
    setMenuPosition(e.currentTarget);
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

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div className={classes.headerWrapper} data-testid="navbar">
      <div className={classes.contentWrapper}>
        <div className={classes.wrapperLeft}>
          <button type="button" aria-label="button" className={classes.wrapperLogo} onClick={() => navigate('/')}>
            <img src="/logo.svg" alt="logo" className={classes.logo} />
            <div className={classes.logoTitle}>SLAPPDOOS</div>
          </button>
        </div>
        <div className={classes.links}>
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
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
});

Navbar.propTypes = {
  locale: PropTypes.string.isRequired,
  login: PropTypes.bool,
  userData: PropTypes.object,
  token: PropTypes.string,
};

export default connect(mapStateToProps)(Navbar);
