import { Card } from '../../components'

const moment = require('moment');

const BusCard = ({ route }) => {
  return (
    <Card key={route.BusId}>
      <h2>{route.BusId}</h2>
      {route.directionReference ? null : <h3 style={{color: 'red'}} >INACTIVE</h3>}
      <hr />
      <h4>Average Speed: {route.averageSpeed} MPH</h4>
      <h4>Direction: {route.directionReference || '[info not sent]'}</h4>
      <h4>Coordinates: ({route.latitude}, {route.longitude})</h4>
      <h4>Miles to empty: {route.milesToEmpty}</h4>
      <h4>Time to empty: {route.timeToEmpty}</h4>
      <h4>SOC: {route.soc}</h4>
      <h4>Time: {moment(route.gpsFixedTime).format('MMM Do, h:mm:ss a')}</h4>
    </Card>
  )
}

export default BusCard;