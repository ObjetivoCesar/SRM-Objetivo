"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText, Phone, MapPin, Calendar, User } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface Lead {
  id: string
  business_name: string
  contact_name: string
  phone?: string
  email?: string
  address?: string
  connection_type: string
  business_activity: string
  interested_product: string
  personality_type: string
  status: string
  phase: number
  created_at: string
  strengths?: string
  weaknesses?: string
  opportunities?: string
  threats?: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching leads:", error)
        return
      }

      setLeads(data || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "nuevo":
        return "bg-green-500"
      case "contactado":
        return "bg-blue-500"
      case "cotizado":
        return "bg-yellow-500"
      case "cerrado":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPhaseText = (phase: number) => {
    switch (phase) {
      case 1:
        return "Información Básica"
      case 2:
        return "Análisis de Personalidad"
      case 3:
        return "Análisis FODA"
      case 4:
        return "Expediente Completo"
      default:
        return "Sin definir"
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Cargando leads...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Gestión de Leads</h2>
            <p className="text-muted-foreground">Expedientes de clientes potenciales recopilados en campo</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {leads.length} Leads Total
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <Card key={lead.id} className="glass-card hover:shadow-lg transition-all duration-200 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">{lead.business_name}</CardTitle>
                  <Badge className={`${getStatusColor(lead.status)} text-white`}>{lead.status}</Badge>
                </div>
                <CardDescription className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{lead.contact_name}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{lead.business_activity}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{lead.interested_product}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline" className="text-xs">
                    {getPhaseText(lead.phase)}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-primary/10"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {leads.length === 0 && (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">No hay leads disponibles</h3>
                  <p className="text-muted-foreground">Los leads creados desde Recorridos aparecerán aquí</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 bg-[rgba(216,214,214,0.28804347826086957)] gap-1 mx-3 tracking-normal text-black font-semibold font-mono">
            <Card className="glass-strong max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-foreground">{selectedLead.business_name}</CardTitle>
                    <CardDescription>{selectedLead.contact_name}</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedLead(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Información del Negocio</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Actividad:</span> {selectedLead.business_activity}
                      </p>
                      <p>
                        <span className="font-medium">Producto de Interés:</span> {selectedLead.interested_product}
                      </p>
                      <p>
                        <span className="font-medium">Tipo de Conexión:</span> {selectedLead.connection_type}
                      </p>
                      <p>
                        <span className="font-medium">Personalidad:</span> {selectedLead.personality_type}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Análisis FODA</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium text-green-600">Fortalezas:</span> {selectedLead.strengths}
                      </p>
                      <p>
                        <span className="font-medium text-red-600">Debilidades:</span> {selectedLead.weaknesses}
                      </p>
                      <p>
                        <span className="font-medium text-blue-600">Oportunidades:</span> {selectedLead.opportunities}
                      </p>
                      <p>
                        <span className="font-medium text-orange-600">Amenazas:</span> {selectedLead.threats}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-primary/20">
                  <Button className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Crear Cotización
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Contactar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
