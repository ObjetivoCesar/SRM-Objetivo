import OpenAI from "openai"

let openaiClient: OpenAI | null = null

export function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set")
    }

    openaiClient = new OpenAI({
      apiKey: apiKey,
    })
  }

  return openaiClient
}

export async function transcribeAudio(audioFile: File): Promise<string> {
  const client = getOpenAIClient()

  try {
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "es", // Spanish
      prompt:
        "Transcribe este audio de una conversación comercial con un cliente potencial. Incluye todos los detalles mencionados sobre el negocio, necesidades, presupuesto y contacto.",
    })

    return transcription.text
  } catch (error) {
    console.error("Error transcribing audio:", error)
    throw new Error("Error al transcribir el audio")
  }
}
