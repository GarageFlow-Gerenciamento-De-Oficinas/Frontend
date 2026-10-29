import { CalendarClock } from 'lucide-react'
import './UpcomingAppointments.scss'

export interface Appointment {
  id: string
  time: string
  client: string
  vehicle: string
  service: string
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[]
}

function UpcomingAppointments({
  appointments,
}: UpcomingAppointmentsProps) {
  return (
    <section className="upcoming-appointments">
      <header className="upcoming-appointments__header">
        <div>
          <h3>Próximos agendamentos</h3>
          <p>Atendimentos previstos para hoje.</p>
        </div>

        <CalendarClock size={20} />
      </header>

      {appointments.length > 0 ? (
        <ul className="upcoming-appointments__list">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="upcoming-appointments__item"
            >
              <time className="upcoming-appointments__time">
                {appointment.time}
              </time>

              <div className="upcoming-appointments__details">
                <strong>{appointment.client}</strong>
                <span>{appointment.vehicle}</span>
                <p>{appointment.service}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="upcoming-appointments__empty">
          Nenhum agendamento previsto para hoje.
        </div>
      )}
    </section>
  )
}

export default UpcomingAppointments