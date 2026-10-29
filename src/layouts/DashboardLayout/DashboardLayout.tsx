
import type { ReactNode } from 'react'
import './DashboardLayout.scss'
import { SideBar, type SideBarProps } from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'

interface DashboardLayoutProps {
  children: ReactNode
  navigationItems: SideBarProps
}


function DashboardLayout({ children, navigationItems }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <SideBar {...navigationItems}/>

      <div className="dashboard-layout__main">
        <Header />

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
