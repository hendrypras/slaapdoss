import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';
import { Avatar } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import ButtonLang from '@components/ButtonLang';
import Button from '@components/Button';

import avatar from '@static/images/avatar.svg';

import { showPopup } from '@containers/App/actions';

import { selectUserProfile } from '@pages/UserProfile/selectors';

import classes from './style.module.scss';

const SideBar = ({ children, userProfile, locale }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div data-testid="sidebar" className={classes.wrapper}>
      <aside className={classes.aside}>
        <button
          className={classes.wrapperLogo}
          type="button"
          data-testid="navigate-back-to-home"
          onClick={() => navigate('/')}
        >
          <img src="/logo.svg" alt="logo" className={classes.logo} />
          <div className={classes.logoTitle}>slaapdoss</div>
        </button>
        <ul className={classes.links}>
          <li className={classes.link}>
            <Link to="/dashboard/cabins">
              <FormattedMessage id="dashboard_list_cabin_head_title" />
            </Link>
          </li>
          <li className={classes.link}>
            <Link to="/dashboard/create-cabin">
              <FormattedMessage id="dashboard_create_cabin_head_title" />
            </Link>
          </li>
          <li className={classes.link}>
            <Link to="/dashboard/create-type-room">
              <FormattedMessage id="dashboard_create_type_cabin_head_title" />
            </Link>
          </li>
          <li className={classes.link}>
            <Link to="/dashboard/create-room">
              <FormattedMessage id="dashboard_create_room_head_title" />
            </Link>
          </li>
          <li className={classes.link}>
            <Link to="/dashboard/create-banner">
              <FormattedMessage id="dashboard_create_banner_head_title" />
            </Link>
          </li>
          <li className={classes.link}>
            <Link to="/dashboard/list-banner">
              <FormattedMessage id="dashboard_list_banner_head_title" />
            </Link>
          </li>
          <li className={classes.link}>
            <Link to="/dashboard/list-order">
              <FormattedMessage id="dashboard_list_orders_head_title" />
            </Link>
          </li>
        </ul>
        <div className={classes.wrapperFooter}>
          <button type="button" onClick={() => navigate('/user/profile')} className={classes.btnAvatar}>
            <Avatar alt="avatar" src={userProfile?.image_url || avatar} />
          </button>
          <Button
            className={classes.logout}
            type="button"
            onClick={() => dispatch(showPopup('', '', 'logout', 'app_popup_logout_title', 'app_popup_logout_message'))}
          >
            <FormattedMessage id="app_logout_text_button" />
          </Button>
        </div>
      </aside>
      <div>
        <div className={classes.wrapperBtnLang}>
          <ButtonLang locale={locale} />
        </div>
        <main className={classes.main}>{children}</main>
      </div>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  userProfile: selectUserProfile,
});
SideBar.propTypes = {
  children: PropTypes.element.isRequired,
  locale: PropTypes.string,
  userProfile: PropTypes.object,
};
export default connect(mapStateToProps)(SideBar);
