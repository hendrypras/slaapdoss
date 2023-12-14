import PropTypes from 'prop-types';
import { Drawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DrawerMobile = ({ open, onClose, height = '100vh', children }) => (
  <Drawer
    sx={{
      height: '100vh',
      width: '100%',
      '& .MuiDrawer-paper': {
        height,
        padding: '0 1rem',
        boxSizing: 'border-box',
        position: 'absolute',
        bottom: '0',
        borderRadius: '.5rem .5rem 0 0',
      },
    }}
    anchor="bottom"
    open={open}
    onClose={onClose}
  >
    <button
      type="button"
      onClick={onClose}
      aria-label="button-close"
      style={{
        position: 'absolute',
        right: '1rem',
        top: '0.6rem',
        fontSize: '2rem',
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        zIndex: '99',
        cursor: 'pointer',
      }}
    >
      <CloseIcon style={{ color: 'black' }} />
    </button>
    {children}
  </Drawer>
);

DrawerMobile.propTypes = {
  children: PropTypes.element,
  open: PropTypes.bool,
  height: PropTypes.string,
  onClose: PropTypes.func,
};
export default DrawerMobile;
