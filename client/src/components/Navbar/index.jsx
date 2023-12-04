import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { selectToken } from '@containers/Client/selectors';

import ButtonLang from '@components/ButtonLang';

import classes from './style.module.scss';

const Navbar = ({ locale }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.headerWrapper} data-testid="navbar">
      <div className={classes.contentWrapper}>
        <div className={classes.wrapperLeft}>
          <button type="button" aria-label="button" className={classes.wrapperLogo} onClick={() => navigate('/')}>
            <img src="/logo.svg" alt="logo" className={classes.logo} />
            <div className={classes.logoTitle}>SLAPPDOOS</div>
          </button>
        </div>
        <div className={classes.links}>
          <ButtonLang locale={locale} />
        </div>
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
