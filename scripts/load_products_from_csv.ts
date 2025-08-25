const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Servicios%20y%20Productos%20de%20AutomatizoTuNegocio%20-%20Hoja%201-U8xQKtohmmVlK8h3sD9Neyk8E0Oekk.csv"

async function loadProductsFromCSV() {
  try {
    console.log("[v0] Fetching CSV from:", csvUrl)

    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csvText = await response.text()
    console.log("[v0] CSV fetched successfully, length:", csvText.length)

    // Parse CSV manually (simple parser for this specific format)
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("[v0] Headers found:", headers)

    const products = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Simple CSV parsing (handles quoted fields)
      const values = []
      let current = ""
      let inQuotes = false

      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim()) // Add last value

      if (values.length >= headers.length) {
        const product = {
          source_id: values[0] || "",
          name: values[1] || "",
          price: Number.parseFloat(values[2]) || 0,
          description: values[3] || "",
          benefits: values[4] || "",
          blog_category: values[5] || "",
          internal_category: values[6] || "",
          tags: values[7] || "",
          payment_type: values[8] || "",
          video_link: values[9] || "",
          included_services: values[10] || "",
        }

        products.push(product)
      }
    }

    console.log("[v0] Parsed products:", products.length)

    // Insert into Supabase
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Clear existing products
    await supabase.from("products_services").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    // Insert new products
    const { data, error } = await supabase.from("products_services").insert(products)

    if (error) {
      console.error("[v0] Error inserting products:", error)
      throw error
    }

    console.log("[v0] Successfully loaded", products.length, "products into database")
    return { success: true, count: products.length }
  } catch (error) {
    console.error("[v0] Error loading products:", error)
    throw error
  }
}

// Execute the function
loadProductsFromCSV()
  .then((result) => {
    console.log("[v0] Products loading completed:", result)
  })
  .catch((error) => {
    console.error("[v0] Products loading failed:", error)
  })
