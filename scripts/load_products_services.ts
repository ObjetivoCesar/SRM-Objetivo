// Script to load products and services from CSV
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Servicios%20y%20Productos%20de%20AutomatizoTuNegocio%20-%20Hoja%201-U8xQKtohmmVlK8h3sD9Neyk8E0Oekk.csv"

async function loadProductsServices() {
  try {
    console.log("[v0] Fetching CSV data from:", csvUrl)

    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csvText = await response.text()
    console.log("[v0] CSV data fetched successfully, length:", csvText.length)

    // Parse CSV manually (simple implementation)
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("[v0] CSV Headers:", headers)

    const products = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Simple CSV parsing (handles basic cases)
      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))

      if (values.length >= headers.length) {
        const product = {
          source_id: values[0] || null,
          name: values[1] || "Sin nombre",
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
    console.log("[v0] Sample product:", products[0])

    // Here you would insert into Supabase
    // This is a demonstration of the data structure
    return products
  } catch (error) {
    console.error("[v0] Error loading products and services:", error)
    throw error
  }
}

// Execute the function
loadProductsServices()
  .then((products) => {
    console.log("[v0] Successfully loaded", products.length, "products and services")
  })
  .catch((error) => {
    console.error("[v0] Failed to load products and services:", error)
  })
