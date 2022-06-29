import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {Card} from '../'

import { Collapse, Alert } from '@mui/material';

const api = require('../../api');

const TRANSACTION_REFRESH_RATE = 30000;

const Transactions = () => {

  const [ transactions, setTransactions ] = useState([]);

  const [ alert, setAlert ] = useState('');

  const setAlertMessage = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert('');
    } , 3000);
  }

  useEffect(() => {
    loadTransactions();
    const loadId = setInterval(loadTransactions, TRANSACTION_REFRESH_RATE);
    return () => { clearInterval(loadId); }
  }, [])

  const loadTransactions = async () => {
    const res = await api.transactions.getTransactions();
    if (res.error)
      return setAlertMessage(res.error);
    setTransactions(res.data);
  }

  return (
    <div style={{ padding: '0 10%' }}>
      <h1>Transactions</h1>
      <Collapse in={alert !== ''}>
        <Alert severity="error" variant="filled">{alert}</Alert>
      </Collapse>
      {transactions.map(transaction => (
        <Card key={transaction.id} styleOverride={{ margin: '8px' }}>
          <h2>{transaction.id} - ({transaction.Charger.chargerName || transaction.Charger.id})</h2>
          <hr />
          <h4>Started: {moment(transaction.timestampStart).format('MMM Do, h:mm:ss a')}</h4>
          <h4>Ended: {transaction.current ? '[IN PROGRESS]' : transaction.timestampEnd ? moment(transaction.timestampEnd).format('MMM Do, h:mm:ss a') : '[MISSED STOP TRANSACTION]'}</h4>
          <h4>Power Consumed: {transaction.current ? '[IN PROGRESS]' : transaction.powerConsumed ? `${transaction.powerConsumed} W` : '[MISSED STOP TRANSACTION]'}</h4>
        </Card>
      ))}
    </div>
  );
}

export default Transactions;
