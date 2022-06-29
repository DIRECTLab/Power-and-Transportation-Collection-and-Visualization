import { Carousel } from 'react-responsive-carousel';
import { LevitonChart, ChargerCard, Transactions, BusCard } from '../../components';
// eslint-disable-next-line
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Collapse, Grid } from '@mui/material';

const api = require('../../api')

const CHARGER_REFRESH_RATE = 60000; // time to ask if there's any new chargers
const BUS_REFRESH_RATE = 10000;


function Home() {

  const [ chargers, setChargers ] = useState([]);

  const [ alert, setAlert ] = useState('');

  const setAlertMessage = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert('');
    }
    , 3000);
  }

  const loadChargerData = useCallback(async () => {
    const res = await api.getChargers();
    if (res.error)
      setAlertMessage(res.error);
    const separatedChargers = res.data.reduce((previous, current, index) => {
      if (index % 4 === 0){
        previous.push([]);
      }

      previous[previous.length - 1].push(current);
      return previous;
    }, []);

    setChargers(separatedChargers);
  }, []);

  const [ busRoutes, setBusRoutes ] = useState([]);

  const loadBusRoutes = useCallback(async () => {
    const allBusRes = await api.newflyer.getAll();
    if (allBusRes.error)
      return setAlertMessage(allBusRes.error);
    
    const busses = allBusRes.data;

    const busRoutes = await Promise.all(busses.map(async bus => {
      const busRes = await api.newflyer.specific(bus.id).getRoute();
      if (busRes.error){
        setAlertMessage(busRes.error);
        return;
      }
      return { BusId: bus.id, ...busRes.data};
    }));

    const flattenedRoutes = busRoutes.map(route => ({ ...route, ...route.lastRoute }));

    const segmentedRoutes = flattenedRoutes.reduce((previous, current, index) => {
      if (index % 4 === 0){
        previous.push([]);
      }

      previous[previous.length - 1].push(current);
      return previous;
    }, []);

    setBusRoutes(segmentedRoutes);
  }, []);

  useEffect(() => {
    loadChargerData();
    loadBusRoutes();
    const loadId = setInterval(loadChargerData, CHARGER_REFRESH_RATE);
    const loadBusId = setInterval(loadBusRoutes, BUS_REFRESH_RATE);
    return () => { clearInterval(loadId); clearInterval(loadBusId); };
  }, [loadChargerData, loadBusRoutes])

  return (
    <>
    <div>
      <Collapse in={alert !== ''}>
        <Alert severity="error" variant='filled'>{alert}</Alert>
      </Collapse>
      <Carousel swipeable={false} showThumbs={false} showIndicators={false} showArrows={true} infiniteLoop={true} autoPlay={true} interval={10000} transitionTime={500} >
        <div
          style={{
            height: '90%',
          }}
        >
          <LevitonChart />
        </div>
        {chargers.map((chargerGroup, idx) =>
        <>
        <h2 key={`h2chargerstatus${idx}`}>Charger Status {idx+1}/{chargers.length}</h2>
        <Grid key={`id:${idx}charger`} container spacing={1}>
          {chargerGroup.map(charger =>
            <Grid key={charger.id} item xs={6}>
              <ChargerCard charger={charger} />
            </Grid>
          )}
        </Grid>
        </>
        )}
        <Transactions />
        {busRoutes.map((busGroup, idx) => 
        <>
        <h2 key={`h2busstatus${idx}`}>Bus Status {idx+1}/{busRoutes.length}</h2>
        <Grid key={`id:${idx}bus`} container spacing={1}>
          {busGroup.map((bus, idx) =>
            <Grid key={bus.BusId} item xs={6}>
              <BusCard route={bus} />
            </Grid>
          )}
        </Grid>
        </>
        )}
      </Carousel>
    </div>
    </>
  );
}

export default Home;