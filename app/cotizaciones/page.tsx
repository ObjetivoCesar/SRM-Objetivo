"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Plus, Save, BookOpen, Loader2, Sparkles, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ProductSearchCard } from "@/components/quotations/product-search-card"

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
  quotation?: string
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
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const [productSearchResults, setProductSearchResults] = useState("")
  const [isSearchingProducts, setIsSearchingProducts] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    loadLeads()
  }, [])

  useEffect(() => {
    const lead = leads.find((l) => l.id === selectedLead);
    if (lead && lead.quotation) {
      setQuotationContent(lead.quotation);
    } else {
      setQuotationContent("");
    }
  }, [selectedLead, leads]);

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
      const { data, error } = await supabase
        .from("leads")
        .update({ quotation: quotationContent, status: 'cotizado' })
        .eq("id", selectedLead)

      if (!error) {
        alert("✅ Cotización guardada exitosamente")
        // Optionally, refresh the leads data to reflect the change
        loadLeads()
      } else {
        console.error("Error saving quotation:", error)
        alert("❌ Error guardando cotización")
      }
    } catch (error) {
      console.error("Error saving quotation:", error)
    }
  }

  const handleProductSearch = async () => {
    if (!productSearchQuery) {
      alert("Por favor, ingresa un nombre de producto para buscar.")
      return
    }
    setIsSearchingProducts(true)
    setProductSearchResults("")
    try {
      const response = await fetch("/api/products/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: productSearchQuery }),
      })
      const result = await response.json()
      if (result.success) {
        setProductSearchResults(result.productData || "Producto no encontrado.")
      } else {
        alert(`❌ Error buscando producto: ${result.error}`)
      }
    } catch (error) {
      console.error("Error calling product search API:", error)
      alert(`❌ Error de conexión al buscar producto.`)
    } finally {
      setIsSearchingProducts(false)
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

                {selectedLeadData && (
                  <div className="mb-4">
                    <Label className="text-sm font-semibold text-foreground">Personalidad del Lead:</Label>
                    <Badge variant="secondary" className="ml-2 text-base">
                      {selectedLeadData.personality_type}
                    </Badge>
                  </div>
                )}
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
                        <CardDescription>
                            Detalles completos del lead seleccionado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoField label="Nombre de Contacto" value={selectedLeadData.contact_name} />
                        <InfoField label="Email" value={selectedLeadData.email} />
                        <InfoField label="Teléfono" value={selectedLeadData.phone} />
                        <InfoField label="Actividad del Negocio" value={selectedLeadData.business_activity} />
                        <InfoField label="Ubicación" value={selectedLeadData.business_location} />
                        <InfoField label="Años en el Mercado" value={selectedLeadData.years_in_business} />
                        <InfoField label="Número de Empleados" value={selectedLeadData.number_of_employees} />
                        <InfoField label="Sucursales" value={selectedLeadData.number_of_branches} />
                        <InfoField label="Clientes Actuales por Mes" value={selectedLeadData.current_clients_per_month} />
                        <InfoField label="Ticket Promedio" value={selectedLeadData.average_ticket} />
                        <InfoField label="Problema Cuantificado" value={selectedLeadData.quantified_problem} />
                        <InfoField label="Meta Conservadora" value={selectedLeadData.conservative_goal} />
                        <InfoField label="Acuerdos Verbales" value={selectedLeadData.verbal_agreements} />
                        <InfoField label="Competencia Conocida" value={selectedLeadData.known_competition} />
                        <InfoField label="Seguidores en Facebook" value={selectedLeadData.facebook_followers} />
                        <InfoField label="Otros Logros" value={selectedLeadData.other_achievements} />
                        <InfoField label="Reconocimientos Específicos" value={selectedLeadData.specific_recognitions} />
                        <InfoField label="Temporada Alta" value={selectedLeadData.high_season} />
                        <InfoField label="Fechas Críticas" value={selectedLeadData.critical_dates} />
                        <InfoField label="Frases Clave" value={selectedLeadData.key_phrases} />
                        <InfoField label="Productos de Interés" value={selectedLeadData.interested_product} />
                        <InfoField label="Fortalezas" value={selectedLeadData.strengths} />
                        <InfoField label="Oportunidades" value={selectedLeadData.opportunities} />
                        <InfoField label="Debilidades" value={selectedLeadData.weaknesses} />
                        <InfoField label="Amenazas" value={selectedLeadData.threats} />
                    </CardContent>
                </Card>
            )}

            <ProductSearchCard
              productSearchQuery={productSearchQuery}
              setProductSearchQuery={setProductSearchQuery}
              productSearchResults={productSearchResults}
              isSearchingProducts={isSearchingProducts}
              handleProductSearch={handleProductSearch}
            />
          </div>

          {/* Columna Derecha: Editor de Cotización */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Editor de Cotización
                  </CardTitle>
                  <CardDescription>
                    Modifica el contenido antes de guardarlo.
                  </CardDescription>
                </div>
                <Button onClick={saveQuotation} size="sm" disabled={!quotationContent}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingTemplate ? (
                  <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Textarea
                    value={quotationContent}
                    onChange={(e) => setQuotationContent(e.target.value)}
                    placeholder="Aquí aparecerá el contenido de la plantilla seleccionada..."
                    className="h-[calc(100vh-20rem)] resize-none border rounded-md p-4 text-sm leading-relaxed"
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