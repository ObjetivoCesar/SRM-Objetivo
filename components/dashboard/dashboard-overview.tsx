"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckSquare, FileText, Users, Plus } from "lucide-react"

export function DashboardOverview() {
  // The hardcoded data has been removed.
  // TODO: Fetch real data from Supabase for stats, events, and tasks.

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-foreground mb-2">¡Bienvenido de vuelta! 👋</h2>
        <p className="text-muted-foreground">
          Aquí verás un resumen de tu actividad cuando agregues datos.
        </p>
      </div>

      {/* Stats Grid - Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder for stats cards. Real data will be mapped here. */}
        <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Eventos Activos</CardTitle>
              <Calendar className={`h-5 w-5 text-primary`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">-</div>
              <p className="text-xs text-muted-foreground mt-1">Sin datos</p>
            </CardContent>
        </Card>
        <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cotizaciones Pendientes</CardTitle>
              <FileText className={`h-5 w-5 text-secondary`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">-</div>
              <p className="text-xs text-muted-foreground mt-1">Sin datos</p>
            </CardContent>
        </Card>
        <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tareas Completadas</CardTitle>
              <CheckSquare className={`h-5 w-5 text-green-600`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">-</div>
              <p className="text-xs text-muted-foreground mt-1">Sin datos</p>
            </CardContent>
        </Card>
        <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Activos</CardTitle>
              <Users className={`h-5 w-5 text-blue-600`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">-</div>
              <p className="text-xs text-muted-foreground mt-1">Sin datos</p>
            </CardContent>
        </Card>
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
            <div className="text-center text-muted-foreground py-8">
              <p>No hay eventos recientes.</p>
            </div>
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
            <div className="text-center text-muted-foreground py-8">
              <p>No hay tareas urgentes.</p>
            </div>
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
