import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

import { useParams } from 'react-router';
import { Collapse, Alert, CircularProgress, Button, Box, Divider, Typography, TextField, Stack } from '@mui/material';
import { SocChart } from '../../components';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'; // Optional theme CSS

const moment = require('moment');

const api = require('../../api');

const DEFAULT_DAYS = 2;

const SpecificBus = () => {
  const { id } = useParams();
  const [bus, setBus] = useState([]);
  const [error, setError] = useState('');
  const [alertType, setAlertType] = useState('error');

  const [ soc, setSoc ] = useState([]);
  const [ time, setTime ] = useState([]);

  const [ days, setDays ] = useState(DEFAULT_DAYS);

  const setErrorMessage = (message, severity='error') => {
    setError(message);
    setAlertType(severity);
    setTimeout(() => {
      setError('');
    } , 5000);
  }

  const getBusInfo = useCallback(async (numOfDays) => {
    const busRes = await api.newflyer.specific(id).getAllRoutes(numOfDays);

    if (busRes.error)
      return setErrorMessage(busRes.error);
    setBus(busRes.data);

    // If the last n days don't have any data, we should try further back so we can show something
    if (!busRes.data.length){
      return setErrorMessage(`No data has been found for this bus for the last ${numOfDays} day(s)`, 'warning');
    }

    // Make sure only unique times make it into the SOC graph
    const socData = busRes.data.reduce((prev, curr) => {
      if (prev.usedTimes.has(curr.gpsFixTime)){
        return prev;
      }
      else{
        prev.socDataUnique.push(curr.soc);
        prev.usedTimes.add(curr.gpsFixTime);
        prev.timeData.push(moment(curr.gpsFixTime).format('M/D/YYYY h:mm:ss a'));
        return prev;
      }
    }, {socDataUnique: [], timeData: [], usedTimes: new Set()});

    setSoc(socData.socDataUnique.reverse());
    setTime(socData.timeData.reverse());

  }, [id]);

  useEffect(() => {
    setBus([]);
    getBusInfo(days);
  }
  , [getBusInfo, days]);

  const [columnDefs, setColumnDefs] = useState([
    { field: 'lineName' },
    { field: 'speed' },
    { field: 'dcEnergyConsumptionKwh' },
    { field: 'directionReference' },
    { field: 'latitude' },
    { field: 'longitude' },
    { field: 'soc' },
    { field: 'timeToEmpty' },
    { field: 'totalVehicleDistance' },
    { field: 'gpsFixTime', cellRenderer: (params) => moment(params.value).format('M/D/YY h:mm:ss a'), getQuickFilterText: (params) => moment(params.value).format('M/D/YY h:mm:ss a') },
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

  const [dayInput, setDayInput] = useState(DEFAULT_DAYS);
  


  return (
    <div style={{ height: '90%' }}>
      <h1>Bus {id}</h1>
      <Collapse in={soc === null}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>
          <CircularProgress />
        </Box>
      </Collapse>
      <Collapse in={soc !== null}>
        <SocChart labels={time} data={soc} name={`Bus ${id} SOC`} />
      </Collapse>
      <Divider sx={{ m: 2 }} />
      <Typography variant='h5'>New Flyer Data for Bus {id}</Typography>
      <Typography variant='h6'>Showing data from the past {days} day(s) ({bus.length} datapoints)</Typography>
      <Collapse in={error !== ''}>
        <Alert severity={alertType} variant="filled">{error}</Alert>
      </Collapse>
      <Stack my={4} direction='row' spacing={2}>
        <TextField label='Enter number of days to search' inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} InputLabelProps={{ sx: {color: 'white'}}} value={dayInput} onChange={(e) => { setDayInput(e.target.value)}} />
        <Button variant='contained' color='primary' onClick={() => { setDays(dayInput) }}>Search</Button>
      </Stack>
      <TextField InputLabelProps={{ sx: { color: 'white' }}} variant='filled' label='Search' onChange={onFilter} />
      <div className='ag-theme-alpine-dark' style={{ height: 500, marginBottom: 16 }}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={bus}
          ref={gridRef}
          animateRows={true}
        />
      </div>
    </div>
  )

}


export default SpecificBus;