import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const leadId = params.id

  if (!leadId) {
    return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 })
  }

  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

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

    // 2. Create a new client
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: lead.contact_name,
        company: lead.business_name,
        email: lead.email,
        phone: lead.phone,
        address: lead.address,
        created_by: user.id,
        connection_type: lead.connection_type,
        business_activity: lead.business_activity,
        interested_product: lead.interested_product,
        verbal_agreements: lead.verbal_agreements,
        personality_type: lead.personality_type,
        communication_style: lead.communication_style,
        key_phrases: lead.key_phrases,
        strengths: lead.strengths,
        weaknesses: lead.weaknesses,
        opportunities: lead.opportunities,
        threats: lead.threats,
        relationship_type: lead.relationship_type,
        quantified_problem: lead.quantified_problem,
        conservative_goal: lead.conservative_goal,
        years_in_business: lead.years_in_business,
        number_of_employees: lead.number_of_employees,
        number_of_branches: lead.number_of_branches,
        current_clients_per_month: lead.current_clients_per_month,
        average_ticket: lead.average_ticket,
        known_competition: lead.known_competition,
        high_season: lead.high_season,
        critical_dates: lead.critical_dates,
        facebook_followers: lead.facebook_followers,
        other_achievements: lead.other_achievements,
        specific_recognitions: lead.specific_recognitions,
      })
      .select()
      .single()

    if (clientError) {
      throw new Error(`Failed to create client: ${clientError.message}`)
    }

    // 3. Update the lead's status
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