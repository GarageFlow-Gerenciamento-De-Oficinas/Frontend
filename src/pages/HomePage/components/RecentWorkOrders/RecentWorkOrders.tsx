import { ArrowRight } from 'lucide-react'
import './RecentWorkOrders.scss'

export interface WorkOrder {
  id: string
  client: string
  vehicle: string
  status: 'Em execução' | 'Aguardando aprovação' | 'Concluída'
  value: number
}

function RecentWorkOrders({recentWorkOrders}: {recentWorkOrders: WorkOrder[]}) {
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <section className="recent-work-orders">
      <header className="recent-work-orders__header">
        <div>
          <h3>Ordens de serviço recentes</h3>
          <p>Acompanhe os últimos atendimentos da oficina.</p>
        </div>

        <a href="/work-orders" className="recent-work-orders__view-all">
          Ver todas
          <ArrowRight size={16} />
        </a>
      </header>

      <div className="recent-work-orders__table-wrapper">
        <table className="recent-work-orders__table">
          <thead>
            <tr>
              <th scope="col">Ordem</th>
              <th scope="col">Cliente</th>
              <th scope="col">Veículo</th>
              <th scope="col">Status</th>
              <th scope="col">Valor</th>
            </tr>
          </thead>

          <tbody>
            {recentWorkOrders.map((workOrder) => (
              <tr key={workOrder.id}>
                <td className="recent-work-orders__id">{workOrder.id}</td>
                <td>{workOrder.client}</td>
                <td>{workOrder.vehicle}</td>
                <td>
                  <span
                    className={`recent-work-orders__status recent-work-orders__status--${workOrder.status === 'Em execução' ? 'in-progress' : workOrder.status === 'Aguardando aprovação' ? 'pending' : 'completed'}`}
                  >
                    {workOrder.status}
                  </span>
                </td>
                <td className="recent-work-orders__value">
                  {currencyFormatter.format(workOrder.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default RecentWorkOrders