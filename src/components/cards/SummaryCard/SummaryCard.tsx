
import type { LucideIcon } from 'lucide-react'
import './SummaryCard.scss'

interface SummaryCardProps {
  title: string
  value: number
  description: string
  icon: LucideIcon
  variant: 'primary' | 'warning' | 'purple' | 'success'
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  variant,
}: SummaryCardProps) {
  return (
    <article className={`summary-card summary-card--${variant}`}>
      <div className="summary-card__header">
        <h3 className="summary-card__title">{title}</h3>

        <span className="summary-card__icon">
          <Icon size={20} strokeWidth={1.8} />
        </span>
      </div>
      <p className="summary-card__value">{value}</p>
      <p className="summary-card__description">{description}</p>
    </article>
  )
}

export default SummaryCard
