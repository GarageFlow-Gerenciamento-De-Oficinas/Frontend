import { CarFront } from 'lucide-react'
import './WaitingVehicles.scss'

export interface WaitingVehicle {
  id: string
  plate: string
  vehicle: string
  client: string
  arrivalTime: string
  status: 'Aguardando avaliação' | 'Aguardando início'
}

interface WaitingVehiclesProps {
  vehicles: WaitingVehicle[]
}

function WaitingVehicles({ vehicles }: WaitingVehiclesProps) {
  return (
    <section className="waiting-vehicles">
      <header className="waiting-vehicles__header">
        <div>
          <h3>Veículos aguardando atendimento</h3>
          <p>Veículos que ainda precisam de atendimento inicial.</p>
        </div>

        <CarFront size={20} />
      </header>

      {vehicles.length > 0 ? (
        <ul className="waiting-vehicles__list">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="waiting-vehicles__item">
              <div className="waiting-vehicles__icon">
                <CarFront size={20} strokeWidth={1.8} />
              </div>

              <div className="waiting-vehicles__details">
                <strong>{vehicle.vehicle}</strong>
                <span>
                  {vehicle.plate} · {vehicle.client}
                </span>
                <span className="waiting-vehicles__arrival">
                  Chegada às {vehicle.arrivalTime}
                </span>
              </div>

              <span
                className={`waiting-vehicles__status waiting-vehicles__status--${vehicle.status === 'Aguardando avaliação' ? 'evaluation' : 'service'}`}
              >
                {vehicle.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="waiting-vehicles__empty">
          Nenhum veículo aguardando atendimento.
        </div>
      )}
    </section>
  )
}

export default WaitingVehicles