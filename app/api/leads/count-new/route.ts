import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.from("leads").select("id").eq("status", "nuevo")

    if (error) {
      console.error("Error counting new leads:", error)
      return NextResponse.json({ error: "Failed to count leads" }, { status: 500 })
    }

    return NextResponse.json({ count: data?.length || 0 })
  } catch (error) {
    console.error("Error in count-new API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
