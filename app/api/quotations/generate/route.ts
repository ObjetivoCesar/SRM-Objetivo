import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QuotationGenerator } from "@/lib/openai/quotation-generator";

export async function POST(request: NextRequest) {
  try {
    const { leadId, config } = await request.json();

    if (!leadId || !config) {
        return NextResponse.json({ error: "Missing leadId or config" }, { status: 400 });
    }

    const supabase = await createClient();
    const generator = new QuotationGenerator();

    // Get lead data
    const { data: leadData, error: leadError } = await supabase.from("leads").select("*").eq("id", leadId).single();

    if (leadError || !leadData) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Generate the full quotation
    const fullQuotation = await generator.generateFullQuotation(leadData, config);

    return NextResponse.json({ success: true, content: fullQuotation });

  } catch (error) {
    console.error("Error generating quotation:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ success: false, error: `Failed to generate quotation: ${errorMessage}` }, { status: 500 });
  }
}