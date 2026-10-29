import './WorkOrderDistribution.scss'

export interface WorkOrderStatus {
  status: string
  count: number
  color: string
}

interface WorkOrderDistributionProps {
  statuses: WorkOrderStatus[]
}

function WorkOrderDistribution({
  statuses,
}: WorkOrderDistributionProps) {
  const total = statuses.reduce(
    (sum, item) => sum + item.count,
    0,
  )

  return (
    <section className="work-order-distribution">
      <header className="work-order-distribution__header">
        <div>
          <h3>Ordens de serviço por status</h3>
          <p>Distribuição atual das ordens da oficina.</p>
        </div>
      </header>

      {statuses.length > 0 ? (
        <>
          <ul className="work-order-distribution__list">
            {statuses.map((item) => {
              const percentage =
                total > 0 ? (item.count / total) * 100 : 0

              return (
                <li
                  key={item.status}
                  className="work-order-distribution__item"
                >
                  <div className="work-order-distribution__label">
                    <span>{item.status}</span>
                    <strong>{item.count}</strong>
                  </div>

                  <div
                    className="work-order-distribution__track"
                    role="progressbar"
                    aria-label={item.status}
                    aria-valuenow={item.count}
                    aria-valuemin={0}
                    aria-valuemax={total}
                  >
                    <span
                      className="work-order-distribution__bar"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>

          <footer className="work-order-distribution__footer">
            <span>Total de ordens</span>
            <strong>{total}</strong>
          </footer>
        </>
      ) : (
        <div className="work-order-distribution__empty">
          Nenhuma ordem de serviço para exibir.
        </div>
      )}
    </section>
  )
}

export default WorkOrderDistribution