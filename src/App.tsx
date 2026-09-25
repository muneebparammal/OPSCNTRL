import { Route, Routes } from 'react-router-dom'
import Screen1Dashboard from './pages/Screen1Dashboard'
import Screen2AircraftType from './pages/Screen2AircraftType'
import Screen3FlightStatus from './pages/Screen3FlightStatus'
import Screen4MapType from './pages/Screen4MapType'
import Screen5FlightDetail from './pages/Screen5FlightDetail'
import Screen6FlightDetailExpanded from './pages/Screen6FlightDetailExpanded'
import Screen7AirSpace from './pages/Screen7AirSpace'

const screens = [
  { path: '/', Component: Screen1Dashboard },
  { path: '/aircraft-type', Component: Screen2AircraftType },
  { path: '/flight-status', Component: Screen3FlightStatus },
  { path: '/map-type', Component: Screen4MapType },
  { path: '/flight-detail', Component: Screen5FlightDetail },
  { path: '/flight-detail-expanded', Component: Screen6FlightDetailExpanded },
  { path: '/air-space', Component: Screen7AirSpace },
]

function App() {
  return (
    <Routes>
      {screens.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  )
}

export default App
