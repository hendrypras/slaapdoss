import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import Container from '@components/Container';

import { useEffect } from 'react';
import { getUserProfile, getUserProfile2 } from '@domain/api';
import classes from './style.module.scss';

const HomePage = () => {
  const marker = [{ geocode: [-6.177082, 106.838581] }];
  const getProfile = async () => {
    const response = await getUserProfile();
    console.log(response, '<<<response1');
  };
  const getProfile2 = async () => {
    const response = await getUserProfile2();
    console.log(response, '<<<response2');
  };
  useEffect(() => {
    getProfile();
    getProfile2();
  }, []);
  return (
    <Container>
      <div className={classes.home}>
        <div className={classes.text}>test</div>
        {/* <MapContainer style={{ width: '100%', height: '100vh' }} center={[-6.17476, 106.827072]} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {marker.map((val, i) => (
            <Marker key={i} position={val.geocode} />
          ))}
        </MapContainer> */}
      </div>
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({});

HomePage.propTypes = {};

export default connect(mapStateToProps)(HomePage);
