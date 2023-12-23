import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useLocation } from 'react-router-dom';

import {
  getAssets,
  getCurrentLocation,
  getTranslations,
  hidePopup,
  hideSnackBar,
  showPopup,
} from '@containers/App/actions';
import { selectPopup, selectLoading, selectSnackBar } from '@containers/App/selectors';
import { selectLogin, selectToken } from '@containers/Client/selectors';
import { setLogout } from '@containers/Client/actions';

import Loader from '@components/Loader';
import ClientRoutes from '@components/ClientRoutes';
import PopupMessage from '@components/PopupMessage/Dialog';
import SnackBar from '@components/SnackBar';

import decryptToken from '@utils/decryptToken';

import { getUserProfile } from '@pages/UserProfile/actions';
import { selectUserProfile } from '@pages/UserProfile/selectors';

const App = ({ popup, loading, login, token, userProfile, snackBar }) => {
  const dispatch = useDispatch();
  const decoded = decryptToken(token);
  const closePopup = () => {
    dispatch(hidePopup());
  };
  const closeSnackBar = () => {
    dispatch(hideSnackBar());
  };
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    dispatch(getAssets());
    dispatch(getTranslations());
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          dispatch(getCurrentLocation({ lat: coords.latitude, lng: coords.longitude }));
        },
        (error) => {
          Promise.reject(error);
        }
      );
    } else {
      dispatch(showPopup('Your browser not support for location'));
    }
  }, [dispatch]);

  useEffect(() => {
    if (login && decoded && !userProfile) {
      dispatch(getUserProfile());
    }
  }, [dispatch, login, token, userProfile]);

  const logout = () => {
    dispatch(
      setLogout(() => {
        localStorage.clear();
        window.location.href = '/login';
      })
    );
  };
  return (
    <>
      <ClientRoutes />
      <Loader isLoading={loading} />
      <PopupMessage
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={closePopup}
        onOk={popup.ok === 'logout' ? logout : null}
        titleId={popup.titleId}
        messageId={popup.messageId}
      />
      <SnackBar open={snackBar.open} handleClose={closeSnackBar} message={snackBar.message} />
    </>
  );
};

App.propTypes = {
  popup: PropTypes.shape({
    open: PropTypes.bool,
    title: PropTypes.string,
    titleId: PropTypes.string,
    message: PropTypes.string,
    messageId: PropTypes.string,
    ok: PropTypes.string,
  }),
  snackBar: PropTypes.shape({
    open: PropTypes.bool,
    message: PropTypes.string,
  }),
  loading: PropTypes.bool,
  login: PropTypes.bool,
  token: PropTypes.string,
  userProfile: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  popup: selectPopup,
  login: selectLogin,
  token: selectToken,
  loading: selectLoading,
  userProfile: selectUserProfile,
  snackBar: selectSnackBar,
});

export default connect(mapStateToProps)(App);
