import Container from '@components/Container';

import classes from './style.module.scss';

const Footer = () => (
  <footer className={classes.footer}>
    <Container>
      <div className={classes.footerContent}>
        <div className={classes.logo}>
          <img src="/logo.svg" alt="Enterprise Logo" />
        </div>
        <div className={classes.links}>
          <ul>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
        <div className={classes.contactInfo}>
          <p>123 Enterprise St,</p>
          <p>Enterprise City,</p>
          <p>Country</p>
          <p>Email: enterprise@example.com</p>
        </div>
      </div>
      <div className={classes.footerBottom}>
        <p>© {new Date().getFullYear()} Your Enterprise. All Rights Reserved.</p>
      </div>
    </Container>
  </footer>
);

export default Footer;
