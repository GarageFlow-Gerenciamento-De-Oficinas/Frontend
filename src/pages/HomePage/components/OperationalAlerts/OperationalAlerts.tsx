
import {
  Clock3,
  Package,
  CarFront,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import './OperationalAlerts.scss'

export type OperationalAlertSeverity =
  | 'critical'
  | 'warning'
  | 'info'

export interface OperationalAlert {
  id: string
  title: string
  description: string
  severity: OperationalAlertSeverity
  type: 'approval' | 'stock' | 'vehicle'
}

interface OperationalAlertsProps {
  alerts: OperationalAlert[]
}

const alertIcons: Record<OperationalAlert['type'], LucideIcon> = {
  approval: Clock3,
  stock: Package,
  vehicle: CarFront,
}

const severityLabels: Record<OperationalAlertSeverity, string> = {
  critical: 'Crítico',
  warning: 'Atenção',
  info: 'Pendente',
}

function OperationalAlerts({ alerts }: OperationalAlertsProps) {
  return (
    <section className="operational-alerts">
      <header className="operational-alerts__header">
        <div>
          <h3>Alertas operacionais</h3>
          <p>Situações que precisam de atenção.</p>
        </div>

        <span className="operational-alerts__count">
          {alerts.length}
        </span>
      </header>

      {alerts.length > 0 ? (
        <ul className="operational-alerts__list">
          {alerts.map((alert) => {
            const Icon = alertIcons[alert.type]

            return (
              <li
                key={alert.id}
                className={`operational-alerts__item operational-alerts__item--${alert.severity}`}
              >
                <span className="operational-alerts__icon">
                  <Icon size={20} strokeWidth={1.8} />
                </span>

                <div className="operational-alerts__content">
                  <strong>{alert.title}</strong>
                  <p>{alert.description}</p>
                </div>

                <span
                  className={`operational-alerts__badge operational-alerts__badge--${alert.severity}`}
                >
                  {severityLabels[alert.severity]}
                </span>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="operational-alerts__empty">
          <p>Nenhum alerta operacional no momento.</p>
        </div>
      )}
    </section>
  )
}

export default OperationalAlerts
