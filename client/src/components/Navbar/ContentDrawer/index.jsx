import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Close as CloseIcon, DashboardCustomizeOutlined as DashboardCustomizeOutlinedIcon } from '@mui/icons-material';
import { Divider, Avatar } from '@mui/material';
import avatar from '@static/images/avatar.svg';

import Button from '@components/Button';

import classes from './style.module.scss';

const ContentDrawer = ({ onClose, login, decoded, logout, userProfile, handleClickAvatar }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className={classes.wrapperHead}>
        <button type="button" aria-label="button" className={classes.wrapperLogo} onClick={() => navigate('/')}>
          <img src="/logo.svg" alt="logo" className={classes.logo} />
          <div className={classes.logoTitle}>slaapdoss</div>
        </button>
        <button onClick={onClose} type="button" className={classes.closeBtn} aria-label="close-button">
          <CloseIcon className={classes.icon} />
        </button>
      </div>
      <Divider />
      <div className={classes.wrapperContentDrawer}>
        {login && decoded ? (
          <>
            {decoded?.role === 1 ? (
              <Button className={classes.btnDashboard} type="button" onClick={() => navigate('/dashboard/cabins')}>
                <>
                  <DashboardCustomizeOutlinedIcon /> Dashboard
                </>
              </Button>
            ) : (
              <Button className={classes.btnDashboard} type="button" onClick={() => navigate('/user/orders')}>
                <>
                  <DashboardCustomizeOutlinedIcon /> History Orders
                </>
              </Button>
            )}

            <div className={classes.wrapperFooter}>
              <button type="button" onClick={handleClickAvatar} className={classes.btnAvatar}>
                <Avatar alt="avatar" src={userProfile?.image_url || avatar} />
                <div className={classes.username}>{userProfile?.username}</div>
              </button>
              <Button className={classes.logout} type="button" onClick={logout}>
                <FormattedMessage id="app_logout_text_button" />
              </Button>
            </div>
          </>
        ) : (
          <div className={classes.wrapperBtn}>
            <Button type="button" onClick={() => navigate('/login')}>
              <FormattedMessage id="app_login_sign_in_submit_text" />
            </Button>
            <Button type="button" onClick={() => navigate('/register')}>
              <FormattedMessage id="app_sign_up_button_text" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
ContentDrawer.propTypes = {
  onClose: PropTypes.func,
  logout: PropTypes.func,
  handleClickAvatar: PropTypes.func,
  login: PropTypes.bool,
  decoded: PropTypes.object,
  userProfile: PropTypes.object,
};

export default ContentDrawer;
