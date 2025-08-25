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
  business_name: string;
  owner_name: string;
  contact_info: any;
  business_activity: string;
  connection_type: string;
  personality_type: string;
  communication_style: string;
  relationship_type: string;
  foda_analysis: any;
  phase_responses: any;
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
}
