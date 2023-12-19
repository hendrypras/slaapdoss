import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectLocale, selectTheme } from '@containers/App/selectors';
import { selectLogin } from '@containers/Client/selectors';

import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

const MainLayout = ({ children, locale, login, userData }) => (
  <>
    <Navbar locale={locale} login={login} userData={userData} />
    {children}
    <Footer />
  </>
);

const mapStateToProps = createStructuredSelector({
  locale: selectLocale,
  theme: selectTheme,
  login: selectLogin,
});

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
  locale: PropTypes.string,
  login: PropTypes.bool,
  userData: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps)(MainLayout));
