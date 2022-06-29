import { Link, Outlet } from "react-router-dom";
import Home from "./Home";
import Charger from "./Charger";
import { BusHome, SpecificBus } from "./Bus";
import SpecificCharger from "./Charger/specificCharger";
import { Button } from "@mui/material";

const Container = () => {

  return (
    <>
      <header style={{ backgroundColor: 'rgb(42, 44, 57)', position: 'fixed', zIndex: 10, top: 0, left: 0, width: '100%', paddingLeft: '1em' }}>
        <Button sx={{ color: 'white', fontSize: '26px' }} component={Link} to="/">ASPIRE</Button>
        <Button sx={{ color: 'white', fontSize: '12' }} component={Link} to="/charger">OCPP</Button>
        <Button sx={{ color: 'white', fontSize: '12' }} component={Link} to="/bus">BUSES</Button>
      </header>
      <div style={{ padding: 8, marginTop: '6em' }}>
        <Outlet />
      </div>
    </>
  )
}

export {
  Home,
  Container,
  Charger,
  SpecificCharger,
  BusHome,
  SpecificBus
}