import Container from '@components/Container';

import classes from './style.module.scss';

const Footer = () => (
  <footer className={classes.footer}>
    <Container>
      <div className={classes.footerBottom}>
        <p>© {new Date().getFullYear()} Your Enterprise. All Rights Reserved.</p>
      </div>
    </Container>
  </footer>
);

export default Footer;
