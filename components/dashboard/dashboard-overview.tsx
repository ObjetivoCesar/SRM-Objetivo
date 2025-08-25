"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckSquare, FileText, Users, Plus, Clock } from "lucide-react"

export function DashboardOverview() {
  const stats = [
    {
      title: "Eventos Activos",
      value: "12",
      change: "+2 esta semana",
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: "Cotizaciones Pendientes",
      value: "8",
      change: "+3 nuevas",
      icon: FileText,
      color: "text-secondary",
    },
    {
      title: "Tareas Completadas",
      value: "24",
      change: "85% completado",
      icon: CheckSquare,
      color: "text-green-600",
    },
    {
      title: "Clientes Activos",
      value: "45",
      change: "+5 este mes",
      icon: Users,
      color: "text-blue-600",
    },
  ]

  const recentEvents = [
    {
      title: "Boda García-López",
      date: "2024-02-15",
      status: "confirmed",
      client: "María García",
    },
    {
      title: "Evento Corporativo Tech",
      date: "2024-02-20",
      status: "pending",
      client: "TechCorp SA",
    },
    {
      title: "Cumpleaños 50 años",
      date: "2024-02-25",
      status: "in_progress",
      client: "Carlos Mendoza",
    },
  ]

  const urgentTasks = [
    {
      title: "Confirmar catering para boda",
      dueDate: "Hoy",
      priority: "high",
    },
    {
      title: "Enviar cotización evento corporativo",
      dueDate: "Mañana",
      priority: "medium",
    },
    {
      title: "Llamar proveedor de flores",
      dueDate: "2 días",
      priority: "high",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-foreground mb-2">¡Bienvenido de vuelta, Michael! 👋</h2>
        <p className="text-muted-foreground">
          Tienes 5 eventos próximos y 12 tareas pendientes. ¡Vamos a organizarlo todo!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass hover:glass-strong transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Eventos Recientes</CardTitle>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.client}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${event.status === "confirmed" ? "bg-green-100 text-green-800" : ""}
                    ${event.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${event.status === "in_progress" ? "bg-blue-100 text-blue-800" : ""}
                  `}
                  >
                    {event.status === "confirmed" && "Confirmado"}
                    {event.status === "pending" && "Pendiente"}
                    {event.status === "in_progress" && "En Progreso"}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Urgent Tasks */}
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Tareas Urgentes</CardTitle>
            <Button size="sm" variant="outline">
              <CheckSquare className="h-4 w-4 mr-2" />
              Ver Todas
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {urgentTasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 glass rounded-lg">
                <div
                  className={`
                  w-2 h-2 rounded-full
                  ${task.priority === "high" ? "bg-red-500" : "bg-yellow-500"}
                `}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{task.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <CheckSquare className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 bg-primary hover:bg-primary/90 flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Crear Evento</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-2 bg-transparent">
              <FileText className="h-6 w-6" />
              <span>Nueva Cotización</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-2 bg-transparent">
              <Users className="h-6 w-6" />
              <span>Agregar Cliente</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
