import {
  ClipboardCheck,
  ClipboardList,
  CheckCircle2,
  PackageCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import './RecentActivity.scss'

export interface Activity {
  id: string
  description: string
  details: string
  time: string
  type: 'work-order' | 'approval' | 'completion' | 'inventory'
}

interface RecentActivityProps {
  activities: Activity[]
}

const activityIcons: Record<Activity['type'], LucideIcon> = {
  'work-order': ClipboardList,
  approval: ClipboardCheck,
  completion: CheckCircle2,
  inventory: PackageCheck,
}

function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <section className="recent-activity">
      <header className="recent-activity__header">
        <div>
          <h3>Atividade recente</h3>
          <p>Últimos acontecimentos da oficina.</p>
        </div>
      </header>

      {activities.length > 0 ? (
        <ul className="recent-activity__list">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type]

            return (
              <li key={activity.id} className="recent-activity__item">
                <span className={`recent-activity__icon recent-activity__icon--${activity.type}`}>
                  <Icon size={18} strokeWidth={1.8} />
                </span>

                <div className="recent-activity__content">
                  <p>{activity.description}</p>
                  <span>{activity.details}</span>
                </div>

                <time className="recent-activity__time">
                  {activity.time}
                </time>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="recent-activity__empty">
          Nenhuma atividade recente.
        </div>
      )}
    </section>
  )
}

export default RecentActivity