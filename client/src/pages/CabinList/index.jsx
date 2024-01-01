import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Pagination, PaginationItem, Stack, TextField, Autocomplete } from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

import { selectCabins } from '@pages/CabinList/selectors';
import { getAllCabin } from '@pages/CabinList/actions';
import CardCabin from '@pages/CabinList/components/CardCabin';

import HeadTitle from '@components/HeadTitle';

import classes from './style.module.scss';

const CabinList = ({ cabins }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get('page'), 10) || 1;
  const limit = parseInt(queryParams.get('limit'), 10) || 5;
  const slugCabin = queryParams.get('slug');
  const [selectedCabin, setSelectedCabin] = useState(slugCabin || 'all'); // State untuk menyimpan nilai terpilih

  useEffect(() => {
    dispatch(getAllCabin(slugCabin, page, limit));
  }, [dispatch, page, limit, slugCabin]);
  const handlePaginationChange = (e, newPage) => {
    e.preventDefault();
    queryParams.set('page', newPage);
    queryParams.set('limit', 5);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };
  let cabinNames = cabins?.results?.map((val) => ({ label: val.name, value: val?.slug }));

  cabinNames = [{ label: 'All', value: 'all' }, ...(cabinNames || [])];

  const handleAutocompleteChange = (e, newValue) => {
    e.preventDefault();
    const selectedValue = newValue ? newValue.value : 'all';
    setSelectedCabin(selectedValue);
    if (newValue && newValue?.value !== 'all') {
      navigate(`${location.pathname}?page=1&limit=1&slug=${newValue?.value}`);
    } else {
      navigate(location.pathname);
    }
  };
  const selectedLabel = cabinNames.find((cabin) => cabin.value === selectedCabin)?.label || 'All';
  return (
    <div className={classes.container}>
      <HeadTitle size={20} className={classes.headTitle}>
        <FormattedMessage id="dashboard_list_cabin_head_title" />
      </HeadTitle>
      <Autocomplete
        id="combo-box-demo"
        disablePortal
        value={selectedLabel}
        options={cabinNames}
        onChange={handleAutocompleteChange}
        sx={{ width: 300, marginTop: '2rem' }}
        renderInput={(params) => <TextField {...params} label="Search Cabin" />}
      />
      <div className={classes.wrapperCard}>
        {cabins?.results?.map((val) => (
          <CardCabin cabin={val} key={val?.id} />
        ))}
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil((cabins?.count || 0) / limit)}
            onChange={handlePaginationChange}
            page={page}
            renderItem={(item) => (
              <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
            )}
          />
        </Stack>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  cabins: selectCabins,
});
CabinList.propTypes = {
  cabins: PropTypes.object,
};

export default connect(mapStateToProps)(CabinList);
