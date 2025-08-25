import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No se encontró archivo de audio" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const transcriptionFormData = new FormData()
    transcriptionFormData.append("file", audioFile)
    transcriptionFormData.append("model", "whisper-1")
    transcriptionFormData.append("language", "es")
    transcriptionFormData.append(
      "prompt",
      "Transcribe con la mayor precisión posible este audio. Mantén la estructura del habla natural, diferenciando frases y pausas según el contexto. Si hay ruido de fondo o interferencia, intenta interpretar el mensaje principal sin agregar palabras que no estén en el audio. No reformules ni corrijas el lenguaje coloquial, modismos o errores gramaticales, respeta la forma original del discurso. Si hay múltiples hablantes, intenta diferenciarlos si es posible. No añadas anotaciones ni comentarios adicionales.",
    )

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: transcriptionFormData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenAI API Error:", errorData)
      return NextResponse.json({ error: "Error en la API de OpenAI" }, { status: 500 })
    }

    const result = await response.json()
    return NextResponse.json({ transcription: result.text })
  } catch (error) {
    console.error("Error in transcribe API:", error)
    return NextResponse.json({ error: "Error al transcribir el audio" }, { status: 500 })
  }
}
