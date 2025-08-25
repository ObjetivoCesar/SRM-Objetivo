-- Crear tabla de cotizaciones
CREATE TABLE IF NOT EXISTS quotations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
    
    -- Contenido generado por IA
    introduction TEXT,
    value_proposition TEXT,
    roi_closing TEXT,
    
    -- Configuración utilizada
    mental_trigger VARCHAR(50) CHECK (mental_trigger IN ('TRANQUILIDAD', 'CONTROL', 'CRECIMIENTO', 'LEGADO')),
    selected_services JSONB DEFAULT '[]',
    total_amount DECIMAL(10,2),
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100) DEFAULT 'Michael'
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_quotations_lead_id ON quotations(lead_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_quotations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_quotations_updated_at
    BEFORE UPDATE ON quotations
    FOR EACH ROW
    EXECUTE FUNCTION update_quotations_updated_at();

-- Comentarios para documentación
COMMENT ON TABLE quotations IS 'Almacena las cotizaciones generadas por el Constructor de Cotizaciones (Módulo 2)';
COMMENT ON COLUMN quotations.mental_trigger IS 'Gatillo mental utilizado: TRANQUILIDAD, CONTROL, CRECIMIENTO, LEGADO';
COMMENT ON COLUMN quotations.selected_services IS 'Array JSON de servicios seleccionados del catálogo';
COMMENT ON COLUMN quotations.introduction IS 'Introducción personalizada generada por IA';
COMMENT ON COLUMN quotations.value_proposition IS 'Propuesta de valor generada por IA';
COMMENT ON COLUMN quotations.roi_closing IS 'Cierre con ROI generado por IA';
