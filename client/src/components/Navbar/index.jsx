import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';
import { SwipeableDrawer, Avatar } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { selectLogin, selectToken } from '@containers/Client/selectors';
import { showPopup } from '@containers/App/actions';

import ButtonLang from '@components/ButtonLang';
import Button from '@components/Button';
import ContentDrawer from '@components/Navbar/ContentDrawer';

import avatar from '@static/images/avatar.svg';

import decryptToken from '@utils/decryptToken';

import { selectUserProfile } from '@pages/UserProfile/selectors';

import classes from './style.module.scss';

const Navbar = ({ locale, login, token, userProfile }) => {
  const decoded = decryptToken(token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleClickAvatar = () => {
    setOpenDrawer(false);
    if (decoded?.role === 2) {
      navigate('/user/profile');
    } else {
      navigate('/dashboard/cabins');
    }
  };
  return (
    <>
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
        <ContentDrawer
          decoded={decoded}
          logout={() => dispatch(showPopup('', '', 'logout', 'app_popup_logout_title', 'app_popup_logout_message'))}
          onClose={() => setOpenDrawer(false)}
          login={login}
          handleClickAvatar={handleClickAvatar}
          userProfile={userProfile}
        />
      </SwipeableDrawer>
      <div
        className={classNames({ [classes.headerWrapper]: true, [classes.activeDrawer]: openDrawer || false })}
        data-testid="navbar"
      >
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
              <button type="button" onClick={handleClickAvatar} className={classes.wrapperAvatar}>
                <Avatar alt="avatar" src={userProfile?.image_url || avatar} />
                <div className={classes.username}>{userProfile?.username}</div>
              </button>
            ) : (
              <div className={classes.wrapperBtn}>
                <Button className={classes.login} type="button" onClick={() => navigate('/login')}>
                  <FormattedMessage id="app_login_sign_in_submit_text" />
                </Button>
                <Button onClick={() => navigate('/register')} className={classes.register}>
                  <FormattedMessage id="app_sign_up_button_text" />
                </Button>
              </div>
            )}
            <div className={classes.wrapperBtnLang}>
              <ButtonLang locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </>
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
