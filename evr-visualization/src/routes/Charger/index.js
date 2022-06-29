import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

import { Check, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Alert, Collapse, Typography, TextField } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'; // Optional theme CSS


const moment = require('moment');


const api = require('../../api');

const CHARGER_REFRESH_RATE = 10000;

const headcells = [
  {
    id: 'chargerName',
    numeric: false,
    disablePadding: false,
    label: 'Charger Name',
  },
  {
    id: 'ChargerId',
    numeric: false,
    disablePadding: false,
    label: 'Charger ID',
  },
  {
    id: 'connected',
    numeric: false,
    disablePadding: false,
    label: 'Connected',
    customRender: (rowData) => rowData.connected ? <Check /> : <Cancel />,
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'statusTime',
    numeric: true,
    disablePadding: false,
    label: 'Last Status Time',
    customRender: (rowData) => moment(rowData.statusTime).fromNow(),
  },
]

const Charger = () => {

  const [columnDefs, setColumnDefs] = useState([
    { field: 'chargerName' },
    { field: 'ChargerId' },
    { field: 'connected', cellRenderer: (params) => params.value ? <Check /> : <Cancel /> },
    { field: 'status' },
    { field: 'statusTime', cellRenderer: (params) => moment(params.value).fromNow(), getQuickFilterText: (params) => moment(params.value).fromNow() },
  ]);

  const gridRef = useRef();
  const onFilter = useCallback((e) => {
    gridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    flex: 1,
  }), []);

  let navigate = useNavigate();
  const [ chargers, setChargers ] = useState([]);

  const [ alert, setAlert ] = useState('');

  const setAlertMessage = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert('');
    } , 3000);
  }

  const loadChargerData = useCallback(async () => {
    const res = await api.getChargers();
    if (res.error)
      setAlertMessage(res.error);
    
    const chargerData = await Promise.all(res.data.map(async charger => {
      const chargerRes = await api.charger(charger.id).getStatus();
      if (chargerRes.error)
        setAlertMessage(chargerRes.error);
      return { ...charger, ...chargerRes.data };
    }));

    setChargers(chargerData);
  }, [])

  useEffect(() => {
    loadChargerData();
    const loadId = setInterval(loadChargerData, CHARGER_REFRESH_RATE);
    return () => { clearInterval(loadId); }
  }, [loadChargerData])

  const cellClickedListener = useCallback((event) => {
    navigate(`/charger/${event.data.ChargerId}`);
  }, [navigate]);

  return (
    <div>
      <h1>All Chargers</h1>
      <Collapse in={alert}>
        <Alert severity="error" variant='filled'>{alert}</Alert>
      </Collapse>
      <Typography variant='h5'>Click to view individual charger</Typography>
      <TextField InputLabelProps={{ sx: { color: 'white' }}} variant='filled' label='Search' onChange={onFilter} />
      <div className='ag-theme-alpine-dark' style={{ height: 500, marginBottom: 16 }}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={chargers}
          ref={gridRef}
          animateRows={true}
          onCellClicked={cellClickedListener}
        />
      </div>
    </div>
  );
}

export default Charger;