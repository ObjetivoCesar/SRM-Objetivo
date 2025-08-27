import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const leadId = params.id

  if (!leadId) {
    return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 })
  }

  try {
    const supabase = await createClient(cookies())

    // 1. Fetch the lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      throw new Error(leadError?.message || 'Lead not found')
    }

    if (lead.status === 'Convertido') {
        return NextResponse.json({ success: false, error: 'Lead already converted' }, { status: 400 })
    }

    // 2. Prepare a notes field with extra details
    const notes = `
      Información Adicional del Lead Convertido:
      =========================================
      Actividad del Negocio: ${lead.business_activity || 'N/A'}
      Producto de Interés: ${lead.interested_product || 'N/A'}
      Tipo de Conexión: ${lead.connection_type || 'N/A'}
      
      PERFIL HUMANO:
      - Personalidad: ${lead.personality_type || 'N/A'}
      - Estilo de Comunicación: ${lead.communication_style || 'N/A'}
      - Frases Clave: ${lead.key_phrases || 'N/A'}

      DIAGNÓSTICO Y METAS:
      - Problema Cuantificado: ${lead.quantified_problem || 'N/A'}
      - Meta Conservadora: ${lead.conservative_goal || 'N/A'}
      - Acuerdos Verbales: ${lead.verbal_agreements || 'N/A'}

      DATOS DEL NEGOCIO:
      - Años en Negocio: ${lead.years_in_business || 'N/A'}
      - N° Empleados: ${lead.number_of_employees || 'N/A'}
      - N° Sucursales: ${lead.number_of_branches || 'N/A'}
      - Clientes/Mes: ${lead.current_clients_per_month || 'N/A'}
      - Ticket Promedio: ${lead.average_ticket || 'N/A'}
      - Seguidores Facebook: ${lead.facebook_followers || 'N/A'}

      CONTEXTO ESTRATÉGICO:
      - Competencia: ${lead.known_competition || 'N/A'}
      - Temporada Alta: ${lead.high_season || 'N/A'}
      - Fechas Críticas: ${lead.critical_dates || 'N/A'}
      - Logros: ${lead.other_achievements || 'N/A'}
      - Reconocimientos: ${lead.specific_recognitions || 'N/A'}

      ANÁLISIS FODA:
      - Fortalezas: ${lead.strengths || 'N/A'}
      - Oportunidades: ${lead.opportunities || 'N/A'}
      - Debilidades: ${lead.weaknesses || 'N/A'}
      - Amenazas: ${lead.threats || 'N/A'}
    `

    // 3. Create a new client
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: lead.contact_name,
        company: lead.business_name,
        email: lead.email,
        phone: lead.phone,
        address: lead.address,
        notes: notes,
        // created_by should be the current user, but auth is not fully implemented here
      })
      .select()
      .single()

    if (clientError) {
      throw new Error(`Failed to create client: ${clientError.message}`)
    }

    // 4. Update the lead's status
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status: 'Convertido' })
      .eq('id', leadId)

    if (updateError) {
      // If this fails, we should ideally roll back the client creation
      // For now, we'll just log the error
      console.error('Failed to update lead status, but client was created:', updateError.message)
    }

    return NextResponse.json({ success: true, client: newClient })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error converting lead to client:', errorMessage)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
