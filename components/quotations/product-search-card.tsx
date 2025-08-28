import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Search } from "lucide-react"

interface ProductSearchCardProps {
  productSearchQuery: string;
  setProductSearchQuery: (query: string) => void;
  productSearchResults: string;
  isSearchingProducts: boolean;
  handleProductSearch: () => Promise<void>;
}

export function ProductSearchCard({
  productSearchQuery,
  setProductSearchQuery,
  productSearchResults,
  isSearchingProducts,
  handleProductSearch,
}: ProductSearchCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          5. Buscar Productos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="product-search">Nombre del Producto o Servicio</Label>
          <Input
            id="product-search"
            type="text"
            placeholder="Ej: Tu Negocio 24/7"
            value={productSearchQuery}
            onChange={(e) => setProductSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleProductSearch} className="w-full">
          {isSearchingProducts ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Buscar Producto
        </Button>
        <Textarea
          placeholder="Los resultados de la búsqueda aparecerán aquí."
          value={productSearchResults}
          readOnly
          className="min-h-[100px] text-sm"
        />
      </CardContent>
    </Card>
  );
}
