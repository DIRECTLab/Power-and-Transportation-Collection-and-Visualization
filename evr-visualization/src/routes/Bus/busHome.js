import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { BusMap } from '../../components';
import { Collapse, Alert, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'; // Optional theme CSS

const api = require('../../api');

const BUS_REFRESH_RATE = 30000;

const BusHome = () => {

  const navigate = useNavigate();

  const [buses, setBuses] = useState([]);
  const [error, setError] = useState(null);

  const fetchBuses = useCallback(async () => {
    const buses = await api.newflyer.getAll();
    if (buses.error) {
      return setErrorMessage(buses.error);
    }

    const busWithRoutes = await Promise.all(buses.data.map(async (bus) => {
      const routes = await api.newflyer.specific(bus.id).getRoute();
      if (routes.error)
        return setErrorMessage(routes.error);
      return { ...routes.data.lastRoute, ...bus };
    }));

    setBuses(busWithRoutes);
  }, []);

  const setErrorMessage = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    } , 3000);
  }

  useEffect(() => {
    fetchBuses();
    const loadId = setInterval(fetchBuses, BUS_REFRESH_RATE);
    return () => { clearInterval(loadId); }
  }
  , [fetchBuses]);

  const [columnDefs, setColumnDefs] = useState([
    { field: 'BusId' },
    { field: 'speed' },
    { field: 'dcEnergyConsumptionKwh' },
    { field: 'directionReference' },
    { field: 'latitude' },
    { field: 'longitude'},
    { field: 'soc', label: 'SOC' },
    { field: 'lineName' },
    { field: 'timeToEmpty' },
    { field: 'totalVehicleDistance' },
  ]);

  const gridRef = useRef();
  const onFilterStatus = useCallback((e) => {
    gridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    flex: 1,
  }), []);
  const cellClickedListener = useCallback((event) => {
    navigate(`/bus/${event.data.id}`);
  }, []);

  return (
    <div>
      <h1>Buses</h1>
      <Collapse in={error !== null}>
        <Alert severity="error" variant="filled">{error?.message}</Alert>
      </Collapse>
      <div style={{ height: '50%' }}>
        <BusMap buses={buses} />

      </div>

      <Typography variant='h5'>Bus Information</Typography>
      <TextField InputLabelProps={{ sx: { color: 'white' }}} variant='filled' label='Search' onChange={onFilterStatus} />
      <div className='ag-theme-alpine-dark' style={{ height: 500 }}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={buses}
          onCellClicked={cellClickedListener}
          ref={gridRef}
          animateRows={true}
        />
      </div>

    </div>
  )
}

export default BusHome;