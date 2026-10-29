import { Search, Bell } from "lucide-react";
import './Header.scss'

function Header() {
    return (
        <header className="dashboard-header">
          <div className="dashboard-header__search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar por cliente, veículo, OS..."
              aria-label="Buscar no sistema"
            />
          </div>

          <div className="dashboard-header__actions">
            <button
              type="button"
              className="dashboard-header__notification"
              aria-label="Notificações"
            >
              <Bell size={20} />
            </button>

            <div className="dashboard-header__profile">
              <span className="dashboard-header__avatar">JS</span>
              <div className="dashboard-header__profile-info">
                <strong>João Silva</strong>
                <span>Administrador</span>
              </div>
            </div>
          </div>
        </header>
    )
}

export default Header