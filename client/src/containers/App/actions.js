import {
  SET_LOCAL,
  SET_POPUP,
  SET_LOADING,
  GET_ASSETS,
  SET_ASSETS,
  GET_TRANSLATIONS,
  GET_CURRENT_LOCATION,
  SET_SNACKBAR,
} from '@containers/App/constants';

export const setLocale = (locale) => ({
  type: SET_LOCAL,
  locale,
});

export const showPopup = (title = '', message = '', ok = '', titleId = '', messageId = '') => ({
  type: SET_POPUP,
  popup: {
    open: true,
    title,
    message,
    titleId,
    messageId,
    ok,
  },
});
export const showSnackBar = (message = '') => ({
  type: SET_SNACKBAR,
  snack: {
    open: true,
    message,
  },
});

export const hideSnackBar = () => ({
  type: SET_SNACKBAR,
  snack: {
    open: false,
    message: '',
  },
});

export const hidePopup = () => ({
  type: SET_POPUP,
  popup: {
    open: false,
    title: '',
    message: '',
    ok: '',
  },
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});
export const setAssets = (assets) => ({
  type: SET_ASSETS,
  assets,
});

export const getAssets = () => ({
  type: GET_ASSETS,
});

export const getTranslations = () => ({
  type: GET_TRANSLATIONS,
});

export const getCurrentLocation = (position) => ({
  type: GET_CURRENT_LOCATION,
  position,
});
