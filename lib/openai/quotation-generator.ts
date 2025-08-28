import OpenAI from "openai";
import { readFileSync } from "fs";
import { join } from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getPromptContent = (promptName: string): string => {
  try {
    const promptPath = join(process.cwd(), "lib", "prompts", `${promptName}.md`);
    return readFileSync(promptPath, "utf-8");
  } catch (error) {
    console.error(`Error reading prompt ${promptName}:`, error);
    throw new Error(`Could not load prompt: ${promptName}`);
  }
};

const getProductCatalog = (): string => {
    try {
        const csvPath = join(process.cwd(), "lib", "prompts", "Servicios y Productos.csv");
        return readFileSync(csvPath, "utf-8");
    } catch (error) {
        console.error("Error reading product catalog:", error);
        throw new Error("Could not load product catalog");
    }
}

export interface LeadData {
  id: string;
  business_name?: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  business_activity?: string;
  relationship_type?: string;
  personality_type?: string;
  communication_style?: string;
  interested_product?: string[];
  strengths?: string;
  weaknesses?: string;
  opportunities?: string;
  threats?: string;
  created_at?: string;
  business_location?: string;
  years_in_business?: number;
  number_of_employees?: number;
  number_of_branches?: number;
  current_clients_per_month?: number;
  average_ticket?: number;
  quantified_problem?: string;
  conservative_goal?: string;
  verbal_agreements?: string;
  known_competition?: string;
  facebook_followers?: number;
  other_achievements?: string;
  specific_recognitions?: string;
  high_season?: string;
  critical_dates?: string;
  key_phrases?: string;
}

export interface QuotationConfig {
  mentalTrigger: "TRANQUILIDAD" | "CONTROL" | "CRECIMIENTO" | "LEGADO";
  proposalFormat: "multiples_opciones" | "proceso_fases";
  selectedServices: string[];
  estimatedBudget: string;
  urgentPromotion?: string;
}

export class QuotationGenerator {
  async generateFullQuotation(leadData: LeadData, config: QuotationConfig): Promise<string> {
    const prompt = getPromptContent("prompt_unified_quotation");
    const catalog = getProductCatalog();

    const systemMessage = `${prompt}

--- DATOS DEL LEAD SELECCIONADO ---
${JSON.stringify(leadData, null, 2)}

--- CONFIGURACIÓN DE LA COTIZACIÓN ---
${JSON.stringify(config, null, 2)}

--- CATÁLOGO COMPLETO DE SERVICIOS ---
${catalog}
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: "Genera la cotización completa usando todos los datos proporcionados. Asegúrate de seguir la estructura y las instrucciones del prompt al pie de la letra." },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      return response.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error generating full quotation:", error);
      throw new Error("Failed to generate full quotation");
    }
  }

  async generateDescription(leadData: Partial<LeadData>, templateId: string): Promise<string> {
    const promptMap: { [key: string]: string } = {
      'plantilla_1_emocional_extrovertido': 'prompt_desc_emocional_extrovertido',
      'plantilla_2_emocional_introvertido': 'prompt_desc_emocional_introvertido',
      'plantilla_3_logico_extrovertido': 'prompt_desc_logico_extrovertido',
      'plantilla_4_logico_introvertido': 'prompt_desc_logico_introvertido',
    };

    const promptName = promptMap[templateId];
    if (!promptName) {
      throw new Error("Invalid templateId for description generation");
    }

    let prompt = getPromptContent(promptName);

    // Replace placeholders in the prompt
    for (const key in leadData) {
        const typedKey = key as keyof LeadData;
        const value = leadData[typedKey] || '';
        prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }

    try {
      console.log("Prompt sent to OpenAI:", prompt);
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 100,
      });

      console.log("Full OpenAI response:", JSON.stringify(response, null, 2));

      return response.choices[0]?.message?.content?.trim().replace(/^"|"$/g, '') || "";
    } catch (error) {
      console.error("Error generating description:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        if (error.stack) {
          console.error("Error stack:", error.stack);
        }
      } else {
        console.error("Non-Error object caught:", error);
      }
      throw new Error("Failed to generate description");
    }
  }
}
