"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FileText, Plus, Save, BookOpen, Loader2, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Lead {
  id: string
  business_name: string
  contact_name: string
  phone: string
  email: string
  business_activity: string
  relationship_type: string
  personality_type: string
  communication_style: string
  interested_product: string[]
  strengths: string
  weaknesses: string
  opportunities: string
  threats: string
  created_at: string
  business_location: string
  years_in_business: number
  number_of_employees: number
  number_of_branches: number
  current_clients_per_month: number
  average_ticket: number
  quantified_problem: string
  conservative_goal: string
  verbal_agreements: string
  known_competition: string
  facebook_followers: number
  other_achievements: string
  specific_recognitions: string
  high_season: string
  critical_dates: string
  key_phrases: string
}

const templates = [
    { id: "plantilla_1_emocional_extrovertido", name: "Emocional Extrovertido" },
    { id: "plantilla_2_emocional_introvertido", name: "Emocional Introvertido" },
    { id: "plantilla_3_logico_extrovertido", name: "Lógico Extrovertido" },
    { id: "plantilla_4_logico_introvertido", name: "Lógico Introvertido" },
]

const InfoField = ({ label, value }: { label: string; value: string | number | string[] | undefined }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null
    return (
        <div>
            <h5 className="font-semibold text-foreground">{label}</h5>
            <p className="text-muted-foreground whitespace-pre-wrap">{Array.isArray(value) ? value.join(", ") : value}</p>
        </div>
    )
}

export default function CotizacionesPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [generatedDescription, setGeneratedDescription] = useState("")
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  
  const [quotationContent, setQuotationContent] = useState<string>("")
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error loading leads:", error)
    } else {
      setLeads(data as Lead[] || [])
    }
  }

  const generateDescription = async () => {
    if (!selectedLead || !selectedTemplate) {
      alert("Selecciona un lead y una plantilla primero")
      return
    }
    setIsGeneratingDescription(true)
    try {
      const response = await fetch("/api/quotations/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: selectedLead, templateId: selectedTemplate }),
      })
      const result = await response.json()
      if (result.success) {
        setGeneratedDescription(result.description)
      } else {
        alert(`❌ Error generando descripción: ${result.error}`)
      }
    } catch (error) {
      console.error("Error calling generate-description API:", error)
      alert(`❌ Error de conexión al generar descripción.`)
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  const loadTemplate = async () => {
    if (!selectedLead || !selectedTemplate) {
      alert("Selecciona un lead y una plantilla")
      return
    }
    if (!generatedDescription) {
      alert("Genera o escribe una descripción primero")
      return
    }

    setIsLoadingTemplate(true)
    setQuotationContent("")
    try {
      const response = await fetch(`/templates/${selectedTemplate}.md`);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      let content = await response.text();
      
      const leadData = leads.find((l) => l.id === selectedLead)
      if (leadData) {
        content = content.replace(/\{\{llm_description\}\}/g, generatedDescription)
        content = content.replace(/\[Nombre del Cliente\]/g, leadData.contact_name || '[Nombre del Cliente]')
        content = content.replace(/\[Nombre del Negocio\]/g, leadData.business_name || '[Nombre del Negocio]')
        content = content.replace(/\[Actividad Comercial\]/g, leadData.business_activity || '[Actividad Comercial]')
      }
      
      content = content.replace(/\[Fecha Actual\]/g, new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }))

      setQuotationContent(content)

    } catch (error) {
      console.error("Error loading template:", error)
      alert(`❌ Error cargando la plantilla. Asegúrate que el archivo existe en la carpeta 'public/templates'.`)
    } finally {
      setIsLoadingTemplate(false)
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
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Constructor de Cotizaciones</h1>
          <p className="text-muted-foreground">Crea cotizaciones personalizadas usando plantillas y asistencia de IA.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Controles y Datos */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Pasos de Creación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="lead-select">1. Lead a Cotizar</Label>
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
                              {lead.contact_name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="template-select">2. Plantilla</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una plantilla..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>3. Descripción con IA</Label>
                  <Button
                    onClick={generateDescription}
                    disabled={!selectedLead || !selectedTemplate || isGeneratingDescription}
                    className="w-full"
                    variant="outline"
                  >
                    {isGeneratingDescription ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generar Descripción (IA)
                  </Button>
                  <Textarea
                    placeholder="La descripción generada aparecerá aquí. También puedes escribirla manualmente."
                    value={generatedDescription}
                    onChange={(e) => setGeneratedDescription(e.target.value)}
                    className="min-h-[100px] text-sm"
                    disabled={isGeneratingDescription}
                  />
                </div>

                <Button
                  onClick={loadTemplate}
                  disabled={!generatedDescription || isLoadingTemplate}
                  className="w-full"
                >
                  {isLoadingTemplate ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <BookOpen className="h-4 w-4 mr-2" />
                  )}
                  4. Cargar Plantilla en Editor
                </Button>
              </CardContent>
            </Card>

            {selectedLeadData && (
              <Card>
                <CardHeader>
                  <CardTitle>Información del Lead</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Información General</AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-3">
                                <InfoField label="Negocio" value={selectedLeadData.business_name} />
                                <InfoField label="Contacto" value={selectedLeadData.contact_name} />
                                <InfoField label="Teléfono" value={selectedLeadData.phone} />
                                <InfoField label="Email" value={selectedLeadData.email} />
                                <InfoField label="Ubicación" value={selectedLeadData.business_location} />
                                <InfoField label="Actividad" value={selectedLeadData.business_activity} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Perfil y Relación</AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-3">
                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant="secondary">{selectedLeadData.personality_type}</Badge>
                                    <Badge variant="outline">{selectedLeadData.communication_style}</Badge>
                                    <Badge variant="outline">{selectedLeadData.relationship_type}</Badge>
                                </div>
                                <InfoField label="Frases Clave" value={selectedLeadData.key_phrases} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Diagnóstico y Metas</AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-3">
                                <InfoField label="Productos de Interés" value={selectedLeadData.interested_product} />
                                <InfoField label="Problema Cuantificado" value={selectedLeadData.quantified_problem} />
                                <InfoField label="Meta Conservadora" value={selectedLeadData.conservative_goal} />
                                <InfoField label="Acuerdos Verbales" value={selectedLeadData.verbal_agreements} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Datos del Negocio</AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-3">
                                <InfoField label="Años en Negocio" value={selectedLeadData.years_in_business} />
                                <InfoField label="N° de Empleados" value={selectedLeadData.number_of_employees} />
                                <InfoField label="N° de Sucursales" value={selectedLeadData.number_of_branches} />
                                <InfoField label="Clientes/Mes" value={selectedLeadData.current_clients_per_month} />
                                <InfoField label="Ticket Promedio" value={selectedLeadData.average_ticket} />
                                <InfoField label="Seguidores Facebook" value={selectedLeadData.facebook_followers} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger>Contexto Estratégico</AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-3">
                                <InfoField label="Competencia Conocida" value={selectedLeadData.known_competition} />
                                <InfoField label="Temporada Alta" value={selectedLeadData.high_season} />
                                <InfoField label="Fechas Críticas" value={selectedLeadData.critical_dates} />
                                <InfoField label="Logros y Reconocimientos" value={selectedLeadData.other_achievements} />
                                <InfoField label="Reconocimientos Específicos" value={selectedLeadData.specific_recognitions} />
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-6">
                            <AccordionTrigger>Análisis FODA</AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-3">
                                <InfoField label="Fortalezas" value={selectedLeadData.strengths} />
                                <InfoField label="Oportunidades" value={selectedLeadData.opportunities} />
                                <InfoField label="Debilidades" value={selectedLeadData.weaknesses} />
                                <InfoField label="Amenazas" value={selectedLeadData.threats} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Columna Derecha: Editor */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Editor de Cotización
                  </CardTitle>
                  <Button onClick={saveQuotation} disabled={!quotationContent}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cotización
                  </Button>
                </div>
                 <CardDescription>
                    {quotationContent ? "Edita el contenido y guárdalo cuando esté listo." : "La plantilla cargada aparecerá aquí."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTemplate && (
                    <div className="flex items-center justify-center h-96">
                        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                    </div>
                )}
                {!isLoadingTemplate && (
                    <Textarea
                        value={quotationContent}
                        onChange={(e) => setQuotationContent(e.target.value)}
                        placeholder="Completa los pasos de la izquierda para cargar una plantilla..."
                        className="min-h-[70vh] font-mono text-sm"
                        disabled={!quotationContent}
                    />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
