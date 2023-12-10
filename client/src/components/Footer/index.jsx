import Container from '@components/Container';

import classes from './style.module.scss';

const Footer = () => (
  <Container>
    <div className={classes.wrapper}>
      <div className={classes.profile}>
        <h2>Career</h2>
        <p>Company</p>
        <p>Consumer Complaint Service</p>
      </div>
      <div className={classes.links}>
        <h2>Promotion</h2>
        <p>Blog</p>
        <p>Experience more for less</p>
      </div>
      <div className={classes.support}>
        <h2>WhatsApp</h2>
        <p>+6282119007791</p>
        <h2>Email</h2>
        <p>help@bobobox.com</p>
      </div>
    </div>
  </Container>
);

export default Footer;
