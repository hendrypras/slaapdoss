import DraftsIcon from '@mui/icons-material/Drafts';
import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';
import classes from './style.module.scss';

const Footer = () => (
  <Container data-testid="footer">
    <>
      <div className={classes.wrapperContentlogo}>
        <div className={classes.wrapperLogo}>
          <img src="/logo.svg" alt="logo" className={classes.logo} />
          <div className={classes.logoTitle}>slaapdoss</div>
        </div>
        <Link to="mailto:slaapdoss@gmail.com" target="_blank" className={classes.buttonEmail}>
          <DraftsIcon className={classes.icon} />
          <div className={classes.wrapperText}>
            <HeadTitle size={12} title="Email" />
            <div>slaapdoss@gmail.com</div>
          </div>
        </Link>
      </div>
      <Divider />
      <div className={classes.content}>© {new Date().getFullYear()} Slaapdoss. All Rights Reserved.</div>
    </>
  </Container>
);

export default Footer;
