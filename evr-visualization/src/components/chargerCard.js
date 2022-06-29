import moment from "moment";
import { useEffect, useState } from "react";
import { Card } from ".";
const api = require('../api');


const CHARGER_REFRESH_RATE = 10000; // how long it takes for a charger to request it's new data

const ChargerCard = ({ charger }) => {

  const [ chargerData, setChargerData ] = useState({});
  const [ mounted, setMounted ] = useState(false);

  const LoadChargerData = async () => {
    const meterValues = await api.charger(charger.id).getMeterValues();

    const status = await api.charger(charger.id).getStatus();

    const chargeProfile = await api.charger(charger.id).getChargeProfile();

    setChargerData({
      ...chargerData,
      status: status.data.status,
      statusTime: moment(status.data.statusTime).fromNow(),
      meterValues: meterValues.data,
      chargeProfile: chargeProfile.data,
    });

  };

  useEffect(() => {
    setMounted(true);

    LoadChargerData();
    const loadId = setInterval(LoadChargerData, CHARGER_REFRESH_RATE);

    return () => {
      setMounted(false);
      clearInterval(loadId);
    }

  }, [])

  return (
    <Card>
      <h2>{charger.chargerName}</h2>
      <h4>{charger.id}</h4>
      <hr/>
      <h4>Status: {chargerData.status}</h4>
      <h5>Last status notification: {chargerData.statusTime}</h5>
      <hr/>
      <h4>Power Curtailment: {chargerData.chargeProfile?.chargingSchedule.chargingSchedulePeriod[0].limit ?? 'Not Set'}</h4>
    </Card>
  )
}

export default ChargerCard;