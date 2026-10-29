
import { LayoutDashboard, Users, CarFront, ClipboardList, Boxes } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout'
import './HomePage.scss'
import type { SideBarProps } from '../../components/Sidebar/Sidebar'

const navigationItems: SideBarProps = {
    items: [
        { label: 'Visão geral', path: '/', icon: LayoutDashboard },
        { label: 'Clientes', path: '/clients', icon: Users },
        { label: 'Veículos', path: '/vehicles', icon: CarFront },
        { label: 'Ordens de serviço', path: '/work-orders', icon: ClipboardList },
        { label: 'Estoque', path: '/inventory', icon: Boxes },
    ]
}

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

        <div className="home-page__empty-state">
          <h3>Seu painel começa aqui</h3>
          <p>
            Em breve, você poderá acompanhar ordens de serviço,
            veículos em manutenção e outras informações da oficina.
          </p>
        </div>
      </section>
    </DashboardLayout>
  )
}

export default HomePage
