import { NavLink, Route, Routes } from 'react-router-dom'
import Screen1Dashboard from './pages/Screen1Dashboard'
import Screen2AircraftType from './pages/Screen2AircraftType'
import Screen3FlightStatus from './pages/Screen3FlightStatus'
import Screen4MapType from './pages/Screen4MapType'
import Screen5FlightDetail from './pages/Screen5FlightDetail'
import Screen6FlightDetailExpanded from './pages/Screen6FlightDetailExpanded'
import Screen7AirSpace from './pages/Screen7AirSpace'

const screens = [
  { path: '/', label: '1. Dashboard (Map)', Component: Screen1Dashboard },
  { path: '/aircraft-type', label: '2. Aircraft Type panel', Component: Screen2AircraftType },
  { path: '/flight-status', label: '3. Flight Status panel', Component: Screen3FlightStatus },
  { path: '/map-type', label: '4. Map Type dropdown', Component: Screen4MapType },
  { path: '/flight-detail', label: '5. Flight Detail panel', Component: Screen5FlightDetail },
  {
    path: '/flight-detail-expanded',
    label: '6. Flight Detail (expanded)',
    Component: Screen6FlightDetailExpanded,
  },
  { path: '/air-space', label: '7. Air Space panel', Component: Screen7AirSpace },
]

function ScreenNav() {
  return (
    <nav className="fixed top-0 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-b-xl bg-black/80 px-2 py-1.5 text-xs backdrop-blur">
      {screens.map((s) => (
        <NavLink
          key={s.path}
          to={s.path}
          className={({ isActive }) =>
            `rounded-md px-2 py-1 font-medium whitespace-nowrap text-white/70 hover:text-white ${
              isActive ? 'bg-white/20 text-white' : ''
            }`
          }
        >
          {s.label}
        </NavLink>
      ))}
    </nav>
  )
}

function App() {
  return (
    <>
      <ScreenNav />
      <Routes>
        {screens.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </>
  )
}

export default App
