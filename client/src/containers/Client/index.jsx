import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import decryptToken from '@utils/decryptToken';

import { selectLogin, selectToken } from '@containers/Client/selectors';

const Client = ({ login, isAdmin, token, children }) => {
  const decoded = decryptToken(token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!login && !decoded) {
      navigate('/login');
    }
    if (login && isAdmin && decoded?.role === 2) {
      navigate('/');
    }
  }, [login, navigate, decoded, isAdmin]);

  return children;
};

Client.propTypes = {
  login: PropTypes.bool,
  isAdmin: PropTypes.bool,
  children: PropTypes.element,
  token: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  token: selectToken,
});

export default connect(mapStateToProps)(Client);
