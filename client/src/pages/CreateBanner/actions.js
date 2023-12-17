import { CREATE_BANNER } from '@pages/CreateBanner/constants';

export const createBanner = (data, cbSuccess) => ({
  type: CREATE_BANNER,
  data,
  cbSuccess,
});
