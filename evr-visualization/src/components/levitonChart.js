import { Alert, Collapse } from '@mui/material';
import React, { useEffect, createRef, useState, useCallback } from 'react';
import { Card, ConditionalView } from '.';
import CustomChart from './CustomChart';

const { getLeviton } = require('../api');


const LevitonChart = () => {
  const [chartData, setChartData] = useState(null);
  const [ chartLabels, setChartLabels ] = useState(null);

  const [ alert, setAlert ] = useState('');

  const setAlertMessage = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert('');
    } , 3000);
  }

  useEffect(() => {
    loadLevitonData();
    const levitonId = setInterval(loadLevitonData, 60000);
    return () => { clearInterval(levitonId); };
  }, [])

  const loadLevitonData = useCallback(async () => {
    const res = await getLeviton();
    if (res.error)
      return setAlertMessage(res.error);

    const labels = res.data.map(data => data.time);
    const data = res.data.map(data => data.power);
    setChartData(data);
    setChartLabels(labels);
  }, []);

  return (
    <>
      <h2>EVR Load</h2>
      <Collapse in={alert !== ''}>
        <Alert severity="error" variant='filled'>{alert}</Alert>
      </Collapse>
      <Card styleOverride={{ height:'100%' }}>
        <ConditionalView visible={chartData}>
          <CustomChart labels={chartLabels} data={chartData} />
        </ConditionalView>
      </Card>
    </>
  )
}

export default LevitonChart;