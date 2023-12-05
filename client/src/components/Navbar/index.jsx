import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';
import { SwipeableDrawer, Divider } from '@mui/material';

import { selectToken } from '@containers/Client/selectors';

import ButtonLang from '@components/ButtonLang';
import Button from '@components/Button';

import classes from './style.module.scss';

const Navbar = ({ locale }) => {
  const navigate = useNavigate();
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
      <div className={classes.wrapperContent}>
        <div className={classes.wrapperBtn}>
          <Button type="button" onClick={() => navigate('/login')} text="app_login_sign_in_submit_text" />
          <Button type="button" onClick={() => navigate('/register')} text="app_sign_up_button_text" />
        </div>
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
          <button
            aria-label="menu-button"
            type="button"
            onClick={() => setOpenDrawer(true)}
            className={classes.menuBtn}
          >
            <MenuIcon className={classes.icon} />
          </button>
          <div className={classes.wrapperBtn}>
            <Button
              className={classes.login}
              type="button"
              onClick={() => navigate('/login')}
              text="app_login_sign_in_submit_text"
            />
            <Button onClick={() => navigate('/register')} className={classes.register} text="app_sign_up_button_text" />
          </div>

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
});

Navbar.propTypes = {
  locale: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Navbar);
