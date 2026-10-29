import { Wrench, type LucideIcon } from "lucide-react";
import { NavLink } from "react-router";
import './Sidebar.scss';

interface NavigationItemProps {
    label: string,
    path: string,
    icon: LucideIcon
}

interface SideBarProps {
    items: NavigationItemProps[]
}

function SideBar({items}: SideBarProps) {
    return (
        <aside className="dashboard-sidebar">
        <NavLink to="/" className="dashboard-sidebar__brand">
          <span className="dashboard-sidebar__brand-icon">
            <Wrench size={22} />
          </span>
          <span>GarageFlow</span>
        </NavLink>

        <nav
          className="dashboard-sidebar__navigation"
          aria-label="Navegação principal"
        >
          {items.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `dashboard-sidebar__link${isActive ? ' dashboard-sidebar__link--active' : ''}`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <footer className="dashboard-sidebar__footer">
          <div className="dashboard-sidebar__workshop-icon">
            <Wrench size={20} />
          </div>
          <div>
            <strong>Oficina Central</strong>
            <span>SP · São Paulo</span>
          </div>
        </footer>
      </aside>
    )
}

export { SideBar, type SideBarProps }