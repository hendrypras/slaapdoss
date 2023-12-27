import L from 'leaflet';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getDetailLocation } from '@pages/CreateCabin/actions';
import { selectDisplayNameLocation } from '@pages/CreateCabin/selectors';

import { selectCurrentLocation } from '@containers/App/selectors';

import 'leaflet/dist/leaflet.css';

import classes from './style.module.scss';

const Maps = ({ lat, lng, currentPosition, draggable, displayName, className }) => {
  const [drag, setDrag] = useState(false);
  const [position, setPosition] = useState({ lat: lat || currentPosition?.lat, lng: lng || currentPosition?.lng });
  const dispatch = useDispatch();

  const customeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

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
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={13}
      scrollWheelZoom={false}
      className={classNames(classes.maps, className)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        icon={customeIcon}
        draggable={draggable}
        eventHandlers={eventHandlers}
        position={[position.lat, position.lng]}
      >
        <Popup minWidth={90}>
          <div onClick={toggleDraggable}>{drag ? 'Click here to make marker draggable' : displayName}</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

Maps.propTypes = {
  displayName: PropTypes.string,
  className: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
  draggable: PropTypes.bool,
  currentPosition: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  displayName: selectDisplayNameLocation,
  currentPosition: selectCurrentLocation,
});

export default connect(mapStateToProps)(Maps);
