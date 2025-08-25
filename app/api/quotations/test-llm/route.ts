import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { leadId, config } = await request.json()

    console.log("[v0] Testing LLM with leadId:", leadId)

    const supabase = await createServerClient()
    const { data: lead, error: leadError } = await supabase.from("leads").select("*").eq("id", leadId).single()

    if (leadError || !lead) {
      return NextResponse.json({
        success: false,
        error: "Lead no encontrado",
      })
    }

    const testPrompt = `Eres un experto redactor comercial especializado en crear cotizaciones completas y persuasivas para servicios digitales.

INFORMACIÓN DEL CLIENTE:
- Negocio: ${lead.business_name}
- Contacto: ${lead.contact_name}
- Actividad: ${lead.business_activity}
- Personalidad: ${lead.personality_type}
- Relación: ${lead.relationship_type}
- Tipo de conexión: ${lead.connection_type}

INSTRUCCIÓN: Escribe solo una línea de saludo personalizado para este cliente usando la información proporcionada.`

    console.log("[v0] Sending test prompt to OpenAI...")

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: testPrompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] OpenAI API error:", errorText)
      return NextResponse.json({
        success: false,
        error: `OpenAI API error: ${response.status}`,
      })
    }

    const result = await response.json()
    const generatedText = result.choices[0]?.message?.content || ""

    console.log("[v0] LLM test successful, response:", generatedText.substring(0, 100))

    return NextResponse.json({
      success: true,
      promptLength: testPrompt.length,
      responseLength: generatedText.length,
      sampleResponse: generatedText,
      leadData: {
        business_name: lead.business_name,
        contact_name: lead.contact_name,
        business_activity: lead.business_activity,
        personality_type: lead.personality_type,
        relationship_type: lead.relationship_type,
        hasAllRequiredFields: !!(lead.business_name && lead.contact_name && lead.business_activity),
      },
    })
  } catch (error) {
    console.error("[v0] Error testing LLM:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}
