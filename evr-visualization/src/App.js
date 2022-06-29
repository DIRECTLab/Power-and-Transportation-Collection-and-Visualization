import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Home, Charger, SpecificCharger, BusHome, SpecificBus } from './routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Container />}>
          <Route path="" element={<Home />} />
          <Route path="/charger/:id" element={<SpecificCharger />} />
          <Route path="/charger" element={<Charger />} />
          <Route path="/bus/:id" element={<SpecificBus />} />
          <Route path="/bus" element={<BusHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;