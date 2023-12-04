import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { selectAssets, selectLocale } from '@containers/App/selectors';

import ButtonLang from '@components/ButtonLang';

import classes from './style.module.scss';

const WrapperAuthentication = ({ children, locale, title, assets, subTitle }) => (
  <div className={classes.wrapper}>
    <div className={classes.wrapperLeftAuth}>
      <div className={classes.wrapperCard}>
        {assets?.dropStep?.map((val, i) => (
          <div key={i} className={classes.card}>
            <img src={val?.icon} alt="icon" className={classes.icon} />
            <div className={classes.wrapperText}>
              <div className={classes.title}>{val?.title}</div>
              <div className={classes.description}>{val?.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className={classes.wrapperRightAuth}>
      <div className={classes.wrapperHead}>
        <ButtonLang locale={locale} />
      </div>

      <div className={classes.wrapperChildren}>
        <div className={classes.wrapperLogo}>
          <img src="/logo.svg" alt="logo" className={classes.logo} />
          <div className={classes.wrapperText}>
            <div className={classes.title}>
              <FormattedMessage id={title} />
            </div>
            <div className={classes.subTitle}>
              <FormattedMessage id={subTitle || 'app_login_sign_in_subtitle'} />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  </div>
);
WrapperAuthentication.propTypes = {
  children: PropTypes.element.isRequired,
  locale: PropTypes.string,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  assets: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  locale: selectLocale,
  assets: selectAssets,
});
export default connect(mapStateToProps)(WrapperAuthentication);
