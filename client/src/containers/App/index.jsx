import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useLocation } from 'react-router-dom';

import { getAssets, getCurrentLocation, getTranslations, hidePopup, showPopup } from '@containers/App/actions';
import { selectPopup, selectLoading } from '@containers/App/selectors';
import { selectLogin, selectToken } from '@containers/Client/selectors';
import { setLogout } from '@containers/Client/actions';

import Loader from '@components/Loader';
import ClientRoutes from '@components/ClientRoutes';
import PopupMessage from '@components/PopupMessage/Dialog';

import decryptToken from '@utils/decryptToken';

import { getUserProfile } from '@pages/UserProfile/actions';
import { selectUserProfile } from '@pages/UserProfile/selectors';

const App = ({ popup, loading, login, token, userProfile }) => {
  const dispatch = useDispatch();
  const decoded = decryptToken(token);
  const closePopup = () => {
    dispatch(hidePopup());
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
        (pos) => {
          dispatch(getCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
        },
        (error) => {
          dispatch(showPopup('Error getting the location', error?.message));
        }
      );
    } else {
      dispatch(showPopup('Geolocation not support in this browser'));
    }
  }, [dispatch]);

  useEffect(() => {
    if (login && decoded && !userProfile) {
      dispatch(getUserProfile());
    }
  }, [dispatch, login, token, userProfile]);

  const logout = () => {
    dispatch(setLogout());
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
});

export default connect(mapStateToProps)(App);
