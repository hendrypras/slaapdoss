import { SET_LOCAL, SET_THEME, SET_POPUP, SET_LOADING } from '@containers/App/constants';

export const setLocale = (locale) => ({
  type: SET_LOCAL,
  locale,
});

export const setTheme = (theme) => ({
  type: SET_THEME,
  theme,
});

export const showPopup = (title = '', message = '', ok = '') => ({
  type: SET_POPUP,
  popup: {
    open: true,
    title,
    message,
    ok,
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
