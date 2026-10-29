
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import './HomePage.scss'
import SummaryCard from '../../components/cards/SummaryCard/SummaryCard'
import RecentWorkOrders from './components/RecentWorkOrders/RecentWorkOrders'
import UpcomingAppointments from './components/UpcomingAppointments/UpcomingAppointments'
import { mockAppointments, navigationItems, operationalAlerts, recentActivities, recentWorkOrders, summaryCards, waitingVehicles, workOrderStatuses } from './mocks'
import WaitingVehicles from './components/WaitingVehicles/WaitingVehicles'
import RecentActivity from './components/RecentActivity/RecentActivity'
import WorkOrderDistribution from './components/WorkOrderDistribution/WorkOrderDistribution'
import OperationalAlerts from './components/OperationalAlerts/OperationalAlerts'

function HomePage() {
  return (
    <DashboardLayout navigationItems={navigationItems}>
      <section className="home-page">
        <div className="home-page__intro">
          <div>
            <h2>Visão geral</h2>
            <p>Acompanhe a operação da sua oficina.</p>
          </div>
        </div>
        <div className="home-page__summary">
          {summaryCards.map((card) => (
            <SummaryCard key={card.title} {...card} />
          ))}
        </div>
        <div className='home-page__content'>
          <div className="home-page__sections">
            <RecentWorkOrders recentWorkOrders={recentWorkOrders} />
            <UpcomingAppointments appointments={mockAppointments} />
          </div>
          <WaitingVehicles vehicles={waitingVehicles} />
          <RecentActivity activities={recentActivities} />
          <WorkOrderDistribution statuses={workOrderStatuses} />
          <OperationalAlerts alerts={operationalAlerts} />
        </div>
      </section>
    </DashboardLayout>
  )
}

export default HomePage
