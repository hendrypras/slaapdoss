import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';

import { hidePopup } from '@containers/App/actions';
import { selectPopup, selectLoading } from '@containers/App/selectors';
import { setLogin, setToken } from '@containers/Client/actions';
import { selectLogin, selectToken } from '@containers/Client/selectors';

import Loader from '@components/Loader';
import ClientRoutes from '@components/ClientRoutes';
import PopupMessage from '@components/PopupMessage/Dialog';

import decryptToken from '@utils/decryptToken';

const App = ({ popup, loading, login, token, userData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const decoded = decryptToken(token);
  const closePopup = () => {
    dispatch(hidePopup());
  };

  // useEffect(() => {
  //   if (!userData && login && decoded) {
  //     dispatch(getUserProfile());
  //   }
  // }, [login, decoded, dispatch, userData]);
  const logout = () => {
    if (popup.ok === 'logout') {
      dispatch(setLogin(false));
      dispatch(setToken(null));
      navigate('/login');
      dispatch(hidePopup());
    }
  };
  return (
    <>
      <ClientRoutes />
      <Loader isLoading={loading} />
      <PopupMessage open={popup.open} title={popup.title} message={popup.message} onClose={closePopup} onOk={logout} />
    </>
  );
};

App.propTypes = {
  popup: PropTypes.shape({
    open: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
    ok: PropTypes.string,
  }),
  loading: PropTypes.bool,
  login: PropTypes.bool,
  token: PropTypes.string,
  userData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  popup: selectPopup,
  loading: selectLoading,
  login: selectLogin,
  token: selectToken,
});

export default connect(mapStateToProps)(App);
