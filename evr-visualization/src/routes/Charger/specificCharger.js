import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams } from "react-router";
import { Check, Cancel } from '@mui/icons-material';
import { Alert, Collapse, Divider, Input, TextField, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'; // Optional theme CSS

const api = require('../../api');

const moment = require('moment');

const CHARGER_REFRESH_RATE = 30000;

const SpecificCharger = () => {
  let params = useParams();
  const { id } = params;

  const [ chargerStatus, setChargerStatus ] = useState([]);

  const [ chargerProfiles, setChargerProfiles ] = useState([]);

  const [ chargerTransactions, setChargerTransactions ] = useState([]);

  const [ alert, setAlert ] = useState('');

  const setAlertMessage = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert('');
    } , 3000);
  }

  const loadChargerData = useCallback(async () => {
    
    const chargerData = {id: id};

    const chargerStatus = await api.charger(id).getAllStatus();
    
    if (chargerStatus.error)
      setAlertMessage(chargerStatus.error);
    else
      setChargerStatus(chargerStatus.data);

    const chargerMeterValues = await api.charger(id).getMeterValues();

    if (chargerMeterValues.error)
      setAlertMessage(chargerMeterValues.error);
    else
      chargerData.meterValues = chargerMeterValues.data;

    const chargeProfiles = await api.charger(id).getAllProfiles();

    if (chargeProfiles.error)
      setAlertMessage(chargeProfiles.error);
    else
      setChargerProfiles(chargeProfiles.data);

    const chargerTransactions = await api.charger(id).getTransactions();

    if (chargerTransactions.error)
      setAlertMessage(chargerTransactions.error);
    else
      setChargerTransactions(chargerTransactions.data);

  }, [id]);

  const onFilterStatus = useCallback((e) => {
    statusGridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  const onFilterProfile = useCallback((e) => {
    profileGridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  const onFilterTransaction = useCallback((e) => {
    transactionGridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  const statusGridRef = useRef();
  const profileGridRef = useRef();
  const transactionGridRef = useRef();

  const [statusColumnDefs, setColumnDefs] = useState([
    {field: 'status'},
    {field: 'connected', cellRenderer: (params) => params.value ? <Check /> : <Cancel sx={{ color: 'red' }} />},
    {field: 'statusTime', getQuickFilterText: (params) => moment(params.value).format('M/D/YYYY h:mm:ss a'), cellRenderer: (params) => moment(params.value).format('M/D/YYYY h:mm:ss a')},
  ]);

  const [profileColumnDefs, setProfileColumnDefs] = useState([
    {field: 'chargingProfileId'},
    {field: 'chargingProfileKind'},
    {field: 'chargingProfilePurpose'},
    {field: 'stackLevel'},
    {field: 'cleared', cellRenderer: (params) => params.value ? <Check /> : <Cancel sx={{ color: 'red' }} />},
    {field: 'createdAt', getQuickFilterText: (params) => moment(params.value).format('M/D/YYYY h:mm:ss a'), cellRenderer: (params) => moment(params.value).format('M/D/YYYY h:mm:ss a')},
  ]);

  const [transactionColumnDefs, setTransactionColumnDefs] = useState([
    {field: 'id'},
    {field: 'meterStart'},
    {field: 'meterStop'},
    {field: 'powerConsumed'},
    {field: 'timestampStart', getQuickFilterText: (params) => moment(params.value).format('M/D/YYYY h:mm:ss a'), cellRenderer: (params) => moment(params.value).format('M/D/YYYY h:mm:ss a')},
    {field: 'timestampEnd', getQuickFilterText: (params) => moment(params.value).format('M/D/YYYY h:mm:ss a'), cellRenderer: (params) => moment(params.value).format('M/D/YYYY h:mm:ss a')},
    {field: 'connectorId'}
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    flex: 1,
  }), []);

  const cellClickedListener = useCallback((event) => {
    console.log('cellClicked', event)
  }, []);

  useEffect(() => {
    loadChargerData();
    const loadId = setInterval(loadChargerData, CHARGER_REFRESH_RATE);
    return () => { clearInterval(loadId); }
  }, [loadChargerData])

  return (
    <div>
      <h1>Charger {id}</h1>
      <Collapse in={alert !== ''}>
        <Alert severity="error" variant="filled">{alert}</Alert>
      </Collapse>
      <Typography variant='h5'>Charger Status</Typography>
      <TextField InputLabelProps={{ sx: { color: 'white' }}} variant='filled' label='Search' onChange={onFilterStatus} />
      <div className='ag-theme-alpine-dark' style={{ height: 500 }}>
        <AgGridReact
          columnDefs={statusColumnDefs}
          defaultColDef={defaultColDef}
          rowData={chargerStatus}
          onCellClicked={cellClickedListener}
          ref={statusGridRef}
          animateRows={true}
        />
      </div>

      <Divider sx={{ m: 4 }} />

      <Typography variant='h5'>Charger Profiles</Typography>
      <TextField InputLabelProps={{ sx: { color: 'white' }}} variant='filled' label='Search' onChange={onFilterProfile} />
      <div className='ag-theme-alpine-dark' style={{ height: 500 }}>
        <AgGridReact
          columnDefs={profileColumnDefs}
          defaultColDef={defaultColDef}
          rowData={chargerProfiles}
          onCellClicked={cellClickedListener}
          ref={profileGridRef}
          animateRows={true}
        />
      </div>

      <Divider sx={{ m: 4 }} />

      <Typography variant='h5'>Charger Transactions</Typography>
      <TextField InputLabelProps={{ sx: { color: 'white' }}} variant='filled' label='Search' onChange={onFilterTransaction} />
      <div className='ag-theme-alpine-dark' style={{ height: 500 }}>
        <AgGridReact
          columnDefs={transactionColumnDefs}
          defaultColDef={defaultColDef}
          rowData={chargerTransactions}
          onCellClicked={cellClickedListener}
          ref={transactionGridRef}
          animateRows={true}
        />
      </div>
    </div>
  );
}

export default SpecificCharger;