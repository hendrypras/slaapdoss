import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectLocale, selectTheme } from '@containers/App/selectors';

import { selectLogin } from '@containers/Client/selectors';

import SideBar from '@components/Sidebar';

const AdminLayout = ({ children, locale, login }) => (
  <SideBar locale={locale} login={login}>
    {children}
  </SideBar>
);

const mapStateToProps = createStructuredSelector({
  locale: selectLocale,
  theme: selectTheme,
  login: selectLogin,
});

AdminLayout.propTypes = {
  children: PropTypes.element.isRequired,
  locale: PropTypes.string,
  login: PropTypes.bool,
};

export default injectIntl(connect(mapStateToProps)(AdminLayout));
