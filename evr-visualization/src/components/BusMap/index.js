import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import './index.css';
import L from 'leaflet';
import { Typography } from '@mui/material';

const BlueIcon = new L.Icon({
  iconUrl:
        'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const BusMap = ({ buses }) => {
  // 40.7608° N, 111.8910° W

  return (
    <MapContainer center={{ lat: 40.7608, lng: -111.8910 }} zoom={12}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {buses.map(bus => (
        <Marker position={{lat: bus.latitude, lng: bus.longitude}} icon={BlueIcon}>
          <Popup>
            <Typography variant='h6' sx={{ color: 'black' }}>Bus ID: {bus.BusId}</Typography>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default BusMap;