import { createSelector } from 'reselect';
import { initialState } from '@pages/ListBanner/reducer';

const selectBannerState = (state) => state.listBanner || initialState;

export const selectBannersAdmin = createSelector(selectBannerState, (state) => state.banners);
