"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Plus, Wand2, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Lead {
  id: string
  business_name: string
  contact_name: string
  business_activity: string
  relationship_type: string
  personality_type: string
  communication_style: string
  interested_product: string
  strengths: string
  weaknesses: string
  opportunities: string
  threats: string
  created_at: string
}

interface QuotationConfig {
  mentalTrigger: "TRANQUILIDAD" | "CONTROL" | "CRECIMIENTO" | "LEGADO"
  proposalFormat: "multiples_opciones" | "proceso_fases"
  estimatedBudget: string
  urgentPromotion?: string
}

export default function CotizacionesPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<string>("")
  const [config, setConfig] = useState<QuotationConfig>({
    mentalTrigger: "CRECIMIENTO",
    proposalFormat: "multiples_opciones",
    estimatedBudget: "",
  })

  const [quotationContent, setQuotationContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error loading leads:", error)
    } else {
      setLeads(data || [])
    }
  }

  const generateFullQuotation = async () => {
    if (!selectedLead) {
      alert("Selecciona un lead primero")
      return
    }

    setIsGenerating(true)
    setShowPreview(false)
    try {
      const response = await fetch("/api/quotations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead,
          config,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setQuotationContent(result.content)
      } else {
        alert(`❌ Error generando cotización: ${result.error}`)
      }
    } catch (error) {
      console.error("Error generating full quotation:", error)
      alert(`❌ Error de conexión: ${error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const saveQuotation = async () => {
    if (!selectedLead || !quotationContent) return

    try {
      const { data, error } = await supabase.from("quotations").insert({
        title: `Cotización para ${leads.find((l) => l.id === selectedLead)?.business_name}`,
        description: quotationContent.substring(0, 255),
        notes: quotationContent,
        status: "draft",
        created_by: "00000000-0000-0000-0000-000000000000", // Admin user
        subtotal: 0,
        tax_rate: 0,
        tax_amount: 0,
        total: 0,
      })

      if (!error) {
        alert("✅ Cotización guardada exitosamente")
      } else {
        console.error("Error saving quotation:", error)
        alert("❌ Error guardando cotización")
      }
    } catch (error) {
      console.error("Error saving quotation:", error)
    }
  }

  const selectedLeadData = leads.find((l) => l.id === selectedLead)

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Constructor de Cotizaciones</h1>
          <p className="text-muted-foreground">Genera cotizaciones persuasivas con IA en un solo paso</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Selección de Lead y Configuración
              </CardTitle>
              <CardDescription>Elige el lead y ajusta los parámetros para la cotización</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="lead-select">Lead a Cotizar</Label>
                <Select value={selectedLead} onValueChange={setSelectedLead}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un lead..." />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        <div className="flex flex-col text-left">
                          <span className="font-medium">{lead.business_name}</span>
                          <span className="text-sm text-muted-foreground">
                            {lead.contact_name} - {lead.business_activity?.substring(0, 50)}...
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mental-trigger">Gatillo Mental</Label>
                <Select
                  value={config.mentalTrigger}
                  onValueChange={(value: any) => setConfig({ ...config, mentalTrigger: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRANQUILIDAD">🛡️ Tranquilidad</SelectItem>
                    <SelectItem value="CONTROL">🎯 Control</SelectItem>
                    <SelectItem value="CRECIMIENTO">📈 Crecimiento</SelectItem>
                    <SelectItem value="LEGADO">👑 Legado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budget">Presupuesto Estimado</Label>
                <Input
                  id="budget"
                  placeholder="ej: $2,000 - $5,000"
                  value={config.estimatedBudget}
                  onChange={(e) => setConfig({ ...config, estimatedBudget: e.target.value })}
                />
              </div>

              <Button
                onClick={generateFullQuotation}
                disabled={!selectedLead || isGenerating}
                className="w-full"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? "Generando Cotización..." : "Generar Cotización Completa"}
              </Button>
            </CardContent>
          </Card>

          {selectedLeadData && (
            <Card>
              <CardHeader>
                <CardTitle>Información del Lead</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground">Negocio</h4>
                  <p className="text-sm text-muted-foreground">{selectedLeadData.business_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedLeadData.contact_name}</p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground">Actividad</h4>
                  <p className="text-sm text-muted-foreground">{selectedLeadData.business_activity}</p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground">Perfil</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{selectedLeadData.personality_type}</Badge>
                    <Badge variant="outline">{selectedLeadData.communication_style}</Badge>
                    <Badge variant="outline">{selectedLeadData.relationship_type}</Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground">Análisis FODA</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium text-secondary">Fortalezas:</span>
                      <p className="text-muted-foreground">{selectedLeadData.strengths?.substring(0, 50)}...</p>
                    </div>
                    <div>
                      <span className="font-medium text-primary">Oportunidades:</span>
                      <p className="text-muted-foreground">{selectedLeadData.opportunities?.substring(0, 50)}...</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {quotationContent && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cotización Generada</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={() => setShowPreview(!showPreview)} variant="outline">
                    {showPreview ? "Editar" : "Previsualizar"}
                  </Button>
                  <Button onClick={saveQuotation}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cotización
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showPreview ? (
                <div className="prose max-w-none whitespace-pre-wrap">
                  {quotationContent}
                </div>
              ) : (
                <Textarea
                  value={quotationContent}
                  onChange={(e) => setQuotationContent(e.target.value)}
                  className="min-h-[500px] font-mono text-sm"
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
