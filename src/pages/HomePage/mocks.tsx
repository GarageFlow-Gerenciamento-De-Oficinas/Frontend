import { LayoutDashboard, Users, CarFront, ClipboardList, Boxes, CheckCircle2, Clock3, Wrench } from "lucide-react";
import type { SideBarProps } from "../../components/Sidebar/Sidebar";
import type { WorkOrder } from "./components/RecentWorkOrders/RecentWorkOrders";
import type { Appointment } from "./components/UpcomingAppointments/UpcomingAppointments";
import type { WaitingVehicle } from "./components/WaitingVehicles/WaitingVehicles";
import type { Activity } from "./components/RecentActivity/RecentActivity";
import type { WorkOrderStatus } from "./components/WorkOrderDistribution/WorkOrderDistribution";
import type { OperationalAlert } from "./components/OperationalAlerts/OperationalAlerts";

export const navigationItems: SideBarProps = {
    items: [
        { label: 'Visão geral', path: '/', icon: LayoutDashboard },
        { label: 'Clientes', path: '/clients', icon: Users },
        { label: 'Veículos', path: '/vehicles', icon: CarFront },
        { label: 'Ordens de serviço', path: '/work-orders', icon: ClipboardList },
        { label: 'Estoque', path: '/inventory', icon: Boxes },
    ]
}

export const recentWorkOrders: WorkOrder[] = [
  {
    id: 'OS-1024',
    client: 'Carlos Mendes',
    vehicle: 'Honda Civic · 2020',
    status: 'Em execução',
    value: 1250,
  },
  {
    id: 'OS-1023',
    client: 'Mariana Costa',
    vehicle: 'Toyota Corolla · 2022',
    status: 'Aguardando aprovação',
    value: 840,
  },
  {
    id: 'OS-1022',
    client: 'Roberto Almeida',
    vehicle: 'Volkswagen Polo · 2019',
    status: 'Concluída',
    value: 560,
  },
  {
    id: 'OS-1021',
    client: 'Fernanda Lima',
    vehicle: 'Chevrolet Onix · 2021',
    status: 'Em execução',
    value: 1920,
  },
]

export const summaryCards = [
  {
    title: 'OS abertas',
    value: 12,
    description: 'Ordens ainda não concluídas',
    icon: ClipboardList,
    variant: 'primary',
  },
  {
    title: 'Em manutenção',
    value: 8,
    description: 'Veículos em atendimento',
    icon: Wrench,
    variant: 'warning',
  },
  {
    title: 'Aguardando aprovação',
    value: 3,
    description: 'Orçamentos pendentes',
    icon: Clock3,
    variant: 'purple',
  },
  {
    title: 'Prontos para entrega',
    value: 2,
    description: 'Serviços finalizados',
    icon: CheckCircle2,
    variant: 'success',
  },
] as const

export const mockAppointments: Appointment[] = [
  {
    id: 'appointment-1',
    time: '09:00',
    client: 'Mariana Costa',
    vehicle: 'Toyota Corolla · 2022',
    service: 'Revisão preventiva',
  },
  {
    id: 'appointment-2',
    time: '10:30',
    client: 'Pedro Santos',
    vehicle: 'Honda Civic · 2020',
    service: 'Diagnóstico do motor',
  },
  {
    id: 'appointment-3',
    time: '13:00',
    client: 'Ana Oliveira',
    vehicle: 'Volkswagen Polo · 2021',
    service: 'Troca de óleo e filtros',
  },
]

export const waitingVehicles: WaitingVehicle[] = [
  {
    id: 'vehicle-1',
    plate: 'ABC-1D23',
    vehicle: 'Fiat Argo · 2022',
    client: 'Lucas Ferreira',
    arrivalTime: '08:15',
    status: 'Aguardando avaliação',
  },
  {
    id: 'vehicle-2',
    plate: 'DEF-4G56',
    vehicle: 'Hyundai HB20 · 2021',
    client: 'Camila Rocha',
    arrivalTime: '08:40',
    status: 'Aguardando início',
  },
  {
    id: 'vehicle-3',
    plate: 'GHI-7J89',
    vehicle: 'Ford Ka · 2019',
    client: 'André Martins',
    arrivalTime: '09:10',
    status: 'Aguardando avaliação',
  },
]

export const recentActivities: Activity[] = [
  {
    id: 'activity-1',
    description: 'Ordem de serviço criada',
    details: 'OS-1025 · Fiat Argo',
    time: '09:42',
    type: 'work-order',
  },
  {
    id: 'activity-2',
    description: 'Orçamento aprovado',
    details: 'OS-1023 · Toyota Corolla',
    time: '09:25',
    type: 'approval',
  },
  {
    id: 'activity-3',
    description: 'Serviço concluído',
    details: 'OS-1022 · Volkswagen Polo',
    time: '09:10',
    type: 'completion',
  },
  {
    id: 'activity-4',
    description: 'Peças separadas para atendimento',
    details: 'Filtro de óleo · OS-1021',
    time: '08:55',
    type: 'inventory',
  },
]

export const workOrderStatuses: WorkOrderStatus[] = [
  { status: 'Em avaliação', count: 4, color: '#64748b' },
  { status: 'Aguardando aprovação', count: 7, color: '#d97706' },
  { status: 'Em execução', count: 12, color: '#2563eb' },
  { status: 'Em testes', count: 3, color: '#7c3aed' },
  { status: 'Concluídas', count: 9, color: '#16a34a' },
]


export const operationalAlerts: OperationalAlert[] = [
  {
    id: 'alert-1',
    title: 'Orçamentos aguardando aprovação',
    description: '3 ordens aguardam retorno dos clientes.',
    severity: 'warning',
    type: 'approval',
  },
  {
    id: 'alert-2',
    title: 'Estoque abaixo do mínimo',
    description: '2 peças precisam de reposição.',
    severity: 'critical',
    type: 'stock',
  },
  {
    id: 'alert-3',
    title: 'Veículo aguardando avaliação',
    description: 'Um veículo ainda não teve o atendimento iniciado.',
    severity: 'info',
    type: 'vehicle',
  },
]
