import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { QuotationGenerator } from '@/lib/openai/quotation-generator'

export async function POST(request: Request) {
  const { leadId, templateId } = await request.json()

  if (!leadId || !templateId) {
    return NextResponse.json({ success: false, error: 'Missing leadId or templateId' }, { status: 400 })
  }

  try {
    const supabase = createServerClient()
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError || !leadData) {
      throw new Error(leadError?.message || 'Lead not found')
    }

    const quotationGenerator = new QuotationGenerator()
    const description = await quotationGenerator.generateDescription(leadData, templateId)

    return NextResponse.json({ success: true, description })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error generating description:', errorMessage)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
