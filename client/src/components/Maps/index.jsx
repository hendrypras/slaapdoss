import { useMemo, useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getDetailLocation } from '@pages/CreateDeatilCabin/actions';
import { selectDisplayNameLocation } from '@pages/CreateDeatilCabin/selectors';

import 'leaflet/dist/leaflet.css';

import classes from './style.module.scss';

const Maps = ({ lat, lng, draggable, displayName }) => {
  const [drag, setDrag] = useState(false);
  const [position, setPosition] = useState({ lat, lng });
  const dispatch = useDispatch();

  const eventHandlers = useMemo(
    () => ({
      dragend: (e) => {
        setPosition(e.target.getLatLng());
      },
    }),
    []
  );
  useEffect(() => {
    if (position) dispatch(getDetailLocation(position.lat, position.lng));
  }, [position, dispatch]);
  const toggleDraggable = useCallback(() => {
    setDrag((d) => !d);
  }, []);
  return (
    <MapContainer center={[position.lat, position.lng]} zoom={13} scrollWheelZoom={false} className={classes.maps}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker draggable={draggable} eventHandlers={eventHandlers} position={[position.lat, position.lng]}>
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>{drag ? 'Click here to make marker draggable' : displayName}</span>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

Maps.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  displayName: PropTypes.string,
  draggable: PropTypes.bool,
};
const mapStateToProps = createStructuredSelector({
  displayName: selectDisplayNameLocation,
});

export default connect(mapStateToProps)(Maps);
