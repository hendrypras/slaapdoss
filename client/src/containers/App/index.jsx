import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';

import { getAssets, hidePopup } from '@containers/App/actions';
import { selectPopup, selectLoading, selectAssets } from '@containers/App/selectors';
import { setLogin, setToken } from '@containers/Client/actions';

import Loader from '@components/Loader';
import ClientRoutes from '@components/ClientRoutes';
import PopupMessage from '@components/PopupMessage/Dialog';

const App = ({ popup, loading, assets }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const closePopup = () => {
    dispatch(hidePopup());
  };

  useEffect(() => {
    if (!assets) {
      dispatch(getAssets());
    }
  }, [assets, dispatch]);
  const logout = () => {
    dispatch(setLogin(false));
    dispatch(setToken(null));
    navigate('/login');
    dispatch(hidePopup());
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
  assets: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  popup: selectPopup,
  loading: selectLoading,
  assets: selectAssets,
});

export default connect(mapStateToProps)(App);
