import { DashboardShell } from '../components/dashboard/DashboardShell'
import { TopIconCarousel } from '../components/dashboard/TopIconCarousel'

export default function Screen4MapType() {
  return (
    <DashboardShell
      mapTypeDefaultOpen
      topExtra={
        <TopIconCarousel className="absolute top-[76px] left-1/2 -translate-x-1/2" />
      }
    />
  )
}
