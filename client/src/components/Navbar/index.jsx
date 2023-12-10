import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';
import { SwipeableDrawer, Divider, Avatar } from '@mui/material';

import { selectLogin, selectToken } from '@containers/Client/selectors';

import ButtonLang from '@components/ButtonLang';
import Button from '@components/Button';

import avatar from '@static/images/avatar.svg';

import decryptToken from '@utils/decryptToken';

import { selectUserProfile } from '@pages/UserProfile/selectors';

import { showPopup } from '@containers/App/actions';
import classes from './style.module.scss';

const Navbar = ({ locale, login, token, userProfile }) => {
  const decoded = decryptToken(token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);

  const contentDrawer = () => (
    <>
      <div className={classes.wrapperHead}>
        <button type="button" aria-label="button" className={classes.wrapperLogo} onClick={() => navigate('/')}>
          <img src="/logo.svg" alt="logo" className={classes.logo} />
          <div className={classes.logoTitle}>slaapdoss</div>
        </button>
        <button
          onClick={() => setOpenDrawer(false)}
          type="button"
          className={classes.closeBtn}
          aria-label="close-button"
        >
          <CloseIcon className={classes.icon} />
        </button>
      </div>
      <Divider />
      <div className={classes.wrapperContentDrawer}>
        {login && decoded ? (
          <div className={classes.wrapperFooter}>
            <button type="button" onClick={() => navigate('/user/profile')} className={classes.btnAvatar}>
              <Avatar alt="avatar" src={userProfile?.image_url || avatar} />
              <div className={classes.username}>{userProfile?.username}</div>
            </button>
            <Button
              className={classes.logout}
              type="button"
              onClick={() =>
                dispatch(showPopup('', '', 'logout', 'app_popup_logout_title', 'app_popup_logout_message'))
              }
              text="app_logout_text_button"
            />
          </div>
        ) : (
          <div className={classes.wrapperBtn}>
            <Button type="button" onClick={() => navigate('/login')} text="app_login_sign_in_submit_text" />
            <Button type="button" onClick={() => navigate('/register')} text="app_sign_up_button_text" />
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className={classes.headerWrapper} data-testid="navbar">
      <div className={classes.contentWrapper}>
        <div className={classes.wrapperLeft}>
          <button type="button" aria-label="button" className={classes.wrapperLogo} onClick={() => navigate('/')}>
            <img src="/logo.svg" alt="logo" className={classes.logo} />
            <div className={classes.logoTitle}>slaapdoss</div>
          </button>
        </div>
        <div className={classes.wrapperRight}>
          <div className={classes.wapperBtnRight}>
            <ButtonLang locale={locale} />
            <button
              aria-label="menu-button"
              type="button"
              onClick={() => setOpenDrawer(true)}
              className={classes.menuBtn}
            >
              <MenuIcon className={classes.icon} />
            </button>
          </div>
          {login && decoded ? (
            <button type="button" onClick={() => navigate('/user/profile')} className={classes.wrapperAvatar}>
              <Avatar alt="avatar" src={userProfile?.image_url || avatar} />
              <div className={classes.username}>{userProfile?.username}</div>
            </button>
          ) : (
            <div className={classes.wrapperBtn}>
              <Button
                className={classes.login}
                type="button"
                onClick={() => navigate('/login')}
                text="app_login_sign_in_submit_text"
              />
              <Button
                onClick={() => navigate('/register')}
                className={classes.register}
                text="app_sign_up_button_text"
              />
            </div>
          )}
          <div className={classes.wrapperBtnLang}>
            <ButtonLang locale={locale} />
          </div>
        </div>
        <SwipeableDrawer
          anchor="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          onOpen={() => setOpenDrawer(true)}
          PaperProps={{
            sx: {
              width: '100%',
            },
          }}
        >
          {contentDrawer()}
        </SwipeableDrawer>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  login: selectLogin,
  userProfile: selectUserProfile,
});

Navbar.propTypes = {
  locale: PropTypes.string.isRequired,
  token: PropTypes.string,
  login: PropTypes.bool,
  userProfile: PropTypes.object,
};

export default connect(mapStateToProps)(Navbar);
