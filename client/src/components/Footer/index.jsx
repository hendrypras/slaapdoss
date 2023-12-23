import Container from '@components/Container';

import classes from './style.module.scss';

const Footer = () => (
  <Container data-testid="footer">
    <div className={classes.content}>© {new Date().getFullYear()} Slaapdoss. All Rights Reserved.</div>
  </Container>
);

export default Footer;
