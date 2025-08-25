"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Mic, User, Building, Brain, Target, CheckCircle, Sparkles } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface LeadCaptureFormProps {
  leadId?: string | null
  onBack: () => void
}

const sectionIcons = {
  1: User,
  2: Building,
  3: Brain,
  4: Target,
  5: CheckCircle,
  6: Sparkles,
}

export function LeadCaptureForm({ leadId, onBack }: LeadCaptureFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [animation, setAnimation] = useState("animate-slide-in-right")
  const [products, setProducts] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcribingField, setTranscribingField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createBrowserClient()

  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    businessActivity: "",
    interestedProduct: "",
    quantifiedProblem: "",
    conservativeGoal: "",
    personalityType: "",
    communicationStyle: "",
    keyPhrases: "",
    strengths: "",
    weaknesses: "",
    opportunities: "",
    threats: "",
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (response.ok && data.products) {
          setProducts(data.products);
        } else {
          console.error("Failed to fetch products:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  const steps = [
    { id: 1, title: "Identificación" },
    { id: 2, title: "Diagnóstico" },
    { id: 3, title: "Perfil Humano" },
    { id: 4, title: "Análisis FODA" },
    { id: 5, title: "Revisión" },
    { id: 6, title: "Éxito" },
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setAnimation("animate-slide-out-left")
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setAnimation("animate-slide-in-right")
      }, 400)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setAnimation("animate-slide-out-left")
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setAnimation("animate-slide-in-right")
      }, 400)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const startRecording = async (field: string) => {
    if (isRecording) {
        mediaRecorder?.stop()
        setIsRecording(false)
        return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        await transcribeAudio(blob, field)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      alert("No se pudo acceder al micrófono. Verifica los permisos.")
    }
  }

  const transcribeAudio = async (audioBlob: Blob, field: string) => {
    setTranscribingField(field)
    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.wav")

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { transcription } = await response.json()
        const currentValue = formData[field as keyof typeof formData]
        const newValue = currentValue ? `${currentValue}\n${transcription}` : transcription
        handleInputChange(field, newValue)
      } else {
        alert("Error al transcribir el audio.")
      }
    } catch (error) {
      alert("Error al transcribir el audio.")
    } finally {
      setIsTranscribing(false)
      setTranscribingField(null)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // ... submission logic ...
    setTimeout(() => {
        setIsSubmitting(false)
        handleNext()
    }, 2000)
  }

  const renderField = (fieldName: string, label: string) => (
    <div className="relative form-field mb-6">
      <Input
        id={fieldName}
        value={formData[fieldName as keyof typeof formData]}
        onChange={(e) => handleInputChange(fieldName, e.target.value)}
        placeholder=" "
        className="peer form-input w-full p-4 border-2 border-[#e8e6e3] rounded-xl text-base bg-white transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(255,107,53,0.2)] focus:-translate-y-0.5"
      />
      <label htmlFor={fieldName} className="form-label absolute top-4 left-5 text-muted-foreground transition-all duration-300 pointer-events-none peer-focus:top-[-10px] peer-focus:left-4 peer-focus:scale-90 peer-focus:text-primary peer-focus:bg-white peer-focus:px-2 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2">
        {label}
      </label>
    </div>
  )

  const renderTextarea = (fieldName: string, label: string) => (
    <div className="relative form-field mb-6">
        <Textarea
            id={fieldName}
            value={formData[fieldName as keyof typeof formData]}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            placeholder=" "
            className="peer form-input w-full p-4 border-2 border-[#e8e6e3] rounded-xl text-base bg-white transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(255,107,53,0.2)] min-h-[120px] resize-none pr-12"
        />
        <label htmlFor={fieldName} className="form-label absolute top-4 left-5 text-muted-foreground transition-all duration-300 pointer-events-none peer-focus:top-[-10px] peer-focus:left-4 peer-focus:scale-90 peer-focus:text-primary peer-focus:bg-white peer-focus:px-2 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2">
            {label}
        </label>
        <Button type="button" size="icon" onClick={() => startRecording(fieldName)} disabled={isTranscribing && transcribingField !== fieldName} className={cn("absolute top-3 right-3 w-8 h-8 rounded-full transition-all", isRecording && transcribingField === fieldName ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-primary/10 text-primary hover:bg-primary/20")}>
            {(isTranscribing && transcribingField === fieldName) ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> : <Mic className="w-4 h-4" />}
        </Button>
    </div>
  )

  const renderSelect = (fieldName: string, label: string, options: string[]) => (
    <div className="form-field mb-6 space-y-2">
        <Label htmlFor={fieldName} className="text-sm font-semibold text-foreground pl-1">{label}</Label>
        <Select onValueChange={(value) => handleInputChange(fieldName, value)} value={formData[fieldName as keyof typeof formData]}>
            <SelectTrigger className="form-input w-full h-auto p-4 border-2 border-[#e8e6e3] rounded-xl text-base bg-white transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(255,107,53,0.2)]">
                <SelectValue placeholder="Selecciona un producto..." />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            {renderField("businessName", "Nombre del negocio")}
            {renderField("contactName", "Nombre del contacto")}
            {renderTextarea("businessActivity", "Actividad comercial principal")}
          </>
        )
      case 2:
        return (
            <>
                {renderSelect("interestedProduct", "Producto/Servicio de interés", products)}
                {renderTextarea("quantifiedProblem", "Problema cuantificado")}
                {renderTextarea("conservativeGoal", "Objetivo conservador")}
            </>
        )
      case 3:
        return (
            <>
                {renderField("personalityType", "Estilo de decisión")}
                {renderField("communicationStyle", "Estilo de comunicación")}
                {renderTextarea("keyPhrases", "Frases clave repetidas")}
            </>
        )
      case 4:
        return (
            <>
                {renderTextarea("strengths", "Fortalezas")}
                {renderTextarea("weaknesses", "Debilidades")}
                {renderTextarea("opportunities", "Oportunidades")}
                {renderTextarea("threats", "Amenazas")}
            </>
        )
      case 5:
        return (
            <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Revisar y Enviar</h3>
                <p className="text-muted-foreground mb-6">Asegúrate que toda la información sea correcta.</p>
                <Button onClick={handleSubmit} className="w-full py-4 text-base font-semibold bg-gradient-to-r from-[#ff6b35] to-[#ffd23f] text-white rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Finalizar y Crear Expediente'}
                </Button>
            </div>
        )
      case 6:
        return (
            <div className="text-center animate-pop-in">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">¡Expediente Creado!</h3>
                <Button onClick={onBack} className="w-full py-4 text-base font-semibold bg-gradient-to-r from-[#ff6b35] to-[#ffd23f] text-white rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                    Volver a la lista
                </Button>
            </div>
        )
      default:
        return null
    }
  }

  const Icon = sectionIcons[currentStep as keyof typeof sectionIcons]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f5f3] to-[#e8e6e3] p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-2xl mx-auto">
            <div className="progress-indicator flex justify-center mb-8 gap-2">
                {steps.map(step => (
                    <div key={step.id} className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        currentStep === step.id && "scale-150 bg-primary-gradient",
                        currentStep > step.id && "bg-green-500",
                        currentStep < step.id && "bg-gray-300"
                    )} />
                ))}
            </div>

            <div className={cn("form-section bg-white rounded-2xl p-8 shadow-xl mb-4", animation)}>
                <div className={cn("icon-container w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg bg-primary-gradient")}>
                    {Icon && <Icon className="w-8 h-8 text-white" />}
                </div>
                {renderStep()}
            </div>

            {currentStep < 5 && (
                <div className="flex justify-between items-center mt-8">
                    <Button onClick={handlePrev} disabled={currentStep === 1} className="py-3 px-6 bg-transparent border-2 border-[#e8e6e3] rounded-xl text-muted-foreground font-semibold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                        Anterior
                    </Button>
                    <Button onClick={handleNext} className="py-3 px-6 text-white rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 font-semibold bg-primary-gradient">
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    </div>
  )
}