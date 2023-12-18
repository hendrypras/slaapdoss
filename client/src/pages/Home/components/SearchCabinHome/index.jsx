import { FormattedMessage } from 'react-intl';

import SearchCabin from '@components/Search/Cabin';

import { getGreeting } from '@utils/times';

import classes from './style.module.scss';

const SearchCabinHome = () => {
  const greeting = getGreeting();
  return (
    <div className={classes.searchWrapper}>
      <div className={classes.subTitle}>{greeting}</div>
      <div className={classes.title}>
        <FormattedMessage id="app_home_title_search_select" />
      </div>
      <SearchCabin />
    </div>
  );
};

export default SearchCabinHome;
