export const PROMPTS = {
  // Prompt para transcripción de audio
  AUDIO_TRANSCRIPTION: `
    Transcribe este audio de una conversación comercial con un cliente potencial. 
    Incluye todos los detalles mencionados sobre el negocio, necesidades, presupuesto y contacto.
    Mantén el formato natural de la conversación pero organiza la información de manera clara.
  `,

  // Prompt para análisis de información del lead
  LEAD_ANALYSIS: `
    Analiza la siguiente información de un lead comercial y extrae:
    1. Datos básicos del negocio (nombre, tipo, ubicación)
    2. Necesidades identificadas
    3. Presupuesto aproximado mencionado
    4. Urgencia del proyecto
    5. Datos de contacto
    6. Observaciones importantes
    
    Organiza la información de manera estructurada y profesional.
  `,

  // Prompt para sugerencias de seguimiento
  FOLLOW_UP_SUGGESTIONS: `
    Basándote en la información del lead, sugiere:
    1. Próximos pasos recomendados
    2. Información adicional que se debe recopilar
    3. Propuesta de valor específica para este cliente
    4. Timeframe sugerido para el seguimiento
    
    Sé específico y orientado a la acción comercial.
  `,
}

export function getPrompt(type: keyof typeof PROMPTS, context?: string): string {
  const basePrompt = PROMPTS[type]
  return context ? `${basePrompt}\n\nContexto: ${context}` : basePrompt
}
