import { produce } from 'immer';

import { SET_BANNERS } from '@pages/ListBanner/constants';

export const initialState = {
  banners: [],
};

const listBannerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_BANNERS:
        draft.banners = action.banners;
        break;
    }
  });

export default listBannerReducer;
