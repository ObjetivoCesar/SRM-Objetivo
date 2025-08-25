# CRM OBJETIVO - Documentación Técnica

## Estructura General del Sistema

### Arquitectura
- **Frontend**: Next.js 15 con TypeScript
- **Backend**: Next.js API Routes
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth (inicial: admin/123)
- **Almacenamiento**: Supabase Storage
- **IA**: OpenAI (Whisper para transcripción)

### Módulos Implementados

## 1. MÓDULO DE RECORRIDOS (ACC - Asistente de Captura Conversacional)

### Propósito
Crear un "expediente de persuasión" completo para Michael, capturando información estratégica durante visitas comerciales.

### Funcionalidades
- **Captura multimodal**: Texto, audio (transcripción con Whisper), fotos
- **4 fases estructuradas**:
  1. **Identificación**: Datos básicos + relación previa (sesgo de correspondencia)
  2. **Diagnóstico**: Necesidades comerciales y acuerdos verbales
  3. **Perfil Humano**: Análisis psicológico (lógico vs emocional)
  4. **Análisis FODA**: Fortalezas, debilidades, oportunidades, amenazas

### Información Capturada
- Nombre del negocio y propietario
- **Relación previa** (amigo, conocido, César cliente, sin relación)
- Tipo de conexión (formal, semiformal, cercana)
- Actividad comercial
- Productos de interés
- Negociaciones verbales
- Perfil psicológico del cliente
- Análisis FODA completo

### Base de Datos - Tabla `leads`
\`\`\`sql
- id (UUID)
- business_name (TEXT)
- contact_name (TEXT)
- connection_type (TEXT)
- relationship_type (TEXT) -- NUEVO: Para sesgo de correspondencia
- business_activity (TEXT)
- interested_product (TEXT)
- verbal_agreements (TEXT)
- personality_type (TEXT)
- communication_style (TEXT)
- key_phrases (TEXT)
- strengths, weaknesses, opportunities, threats (TEXT)
- status (TEXT)
- files (TEXT[])
- created_at, updated_at (TIMESTAMP)
\`\`\`

## 2. SISTEMA DE PRODUCTOS Y SERVICIOS

### Estructura de Datos
\`\`\`sql
products_services:
- id (UUID)
- source_id (TEXT)
- name (TEXT) -- Nombre del producto/servicio
- price (DECIMAL) -- Precio
- description (TEXT) -- Descripción detallada
- benefits (TEXT) -- Beneficios
- blog_category (TEXT) -- Categoría para blog
- internal_category (TEXT) -- Categoría interna
- tags (TEXT) -- Etiquetas para búsqueda
- payment_type (TEXT) -- Forma de pago
- video_link (TEXT) -- Link de video
- included_services (TEXT) -- Servicios incluidos
\`\`\`

### Fuente de Datos
- CSV con 22 productos/servicios de AutomatizoTuNegocio
- Carga automática via script de Node.js
- Búsqueda por nombre, categoría y tags

## 3. DASHBOARD Y NAVEGACIÓN

### Estructura
- **Sidebar**: Navegación principal con glassmorphism
- **Notificaciones**: Campanita para nuevos leads
- **Módulos disponibles**:
  - Dashboard (métricas)
  - Recorridos (captura de leads)
  - Leads (gestión de expedientes)
  - Eventos, Cotizaciones, Tareas, Clientes (preparados)

### Notificaciones
- API `/api/leads/count-new` para contar leads nuevos
- Actualización automática cada 30 segundos
- Indicador visual en campanita

## 4. AUTENTICACIÓN Y SEGURIDAD

### Sistema Actual
- Login básico: admin/123
- Cookies para sesión
- Middleware de protección de rutas
- RLS (Row Level Security) en Supabase

### Mejoras Planificadas
- Sistema de roles (César, Michael, Abel)
- Autenticación más robusta
- Permisos granulares

## 5. INTEGRACIÓN CON IA

### OpenAI Whisper
- Transcripción de audio en tiempo real
- Prompt específico para mantener naturalidad del habla
- API route `/api/transcribe` para seguridad

### Prompt de Transcripción
\`\`\`
"Transcribe con la mayor precisión posible este audio. Mantén la estructura del habla natural, diferenciando frases y pausas según el contexto. Si hay ruido de fondo o interferencia, intenta interpretar el mensaje principal sin agregar palabras que no estén en el audio. No reformules ni corrijas el lenguaje coloquial, modismos o errores gramaticales, respeta la forma original del discurso. Si hay múltiples hablantes, intenta diferenciarlos si es posible. No añadas anotaciones ni comentarios adicionales."
\`\`\`

## PRÓXIMOS MÓDULOS

### Módulo 2: Constructor de Cotizaciones (Para Michael)

### Propósito
Generar cotizaciones completas y personalizadas para leads en un solo paso, utilizando inteligencia artificial para redactar el contenido persuasivo.

### Funcionalidades
- **Generación Unificada**: La cotización completa (introducción, propuesta de valor, cierre con ROI) se genera en una única llamada a la IA.
- **Personalización Profunda**: Utiliza toda la información detallada del lead (obtenida del Módulo 1) para adaptar el contenido de la cotización.
- **Catálogo de Servicios Local**: El catálogo de productos y servicios se carga directamente desde el archivo `lib/prompts/Servicios y Productos.csv`, asegurando que la IA siempre use la información más actualizada y precisa de los servicios ofrecidos.
- **Configuración Flexible**: Permite ajustar parámetros como el "gatillo mental" para influir en el tono y enfoque de la cotización.
- **Edición y Guardado**: El contenido generado puede ser revisado y editado directamente en la interfaz antes de ser guardado en la base de datos.

### Componentes Clave
- **Frontend**: `app/cotizaciones/page.tsx` (Interfaz de usuario para selección de lead, configuración y visualización/edición de la cotización).
- **Backend API**: `app/api/quotations/generate/route.ts` (Endpoint que orquesta la generación de la cotización completa).
- **Lógica de IA**: `lib/openai/quotation-generator.ts` (Clase que interactúa con la API de OpenAI, lee el prompt unificado y el catálogo de servicios, y construye el mensaje para la IA).
- **Prompt Principal**: `lib/prompts/prompt_unified_quotation.md` (Contiene todas las instrucciones y la estructura para la generación de la cotización completa).
- **Catálogo de Productos**: `lib/prompts/Servicios y Productos.csv` (Archivo CSV que contiene la información detallada de todos los productos y servicios).

### Flujo de Generación
1.  El usuario selecciona un lead y configura los parámetros iniciales en `app/cotizaciones/page.tsx`.
2.  Al hacer clic en "Generar Cotización Completa", se envía una solicitud a `app/api/quotations/generate/route.ts` con el ID del lead y la configuración.
3.  El API obtiene los datos completos del lead desde Supabase.
4.  La clase `QuotationGenerator` lee el `prompt_unified_quotation.md` y el `Servicios y Productos.csv`.
5.  Se construye un mensaje de sistema integral para OpenAI, que incluye el prompt, todos los datos del lead y el catálogo de servicios.
6.  OpenAI genera la cotización completa en un solo bloque de texto.
7.  La cotización generada se devuelve al frontend para su visualización, edición y posterior guardado.

### Módulo 3: Gestión de Actividades y Notificaciones
- Tareas automáticas
- Seguimiento de leads
- Notificaciones inteligentes

## ARCHIVOS CLAVE

### Componentes Principales
- `components/recorridos/lead-capture-form.tsx` - Formulario ACC
- `components/dashboard/dashboard-layout.tsx` - Layout principal
- `app/leads/page.tsx` - Gestión de leads

### APIs
- `app/api/transcribe/route.ts` - Transcripción de audio
- `app/api/leads/count-new/route.ts` - Conteo de leads nuevos

### Scripts de Base de Datos
- `scripts/001_create_database_schema.sql` - Esquema inicial
- `scripts/003_create_leads_table.sql` - Tabla de leads
- `scripts/004_add_relationship_type_and_products.sql` - Productos y relación

### Configuración
- `lib/supabase/` - Clientes de Supabase
- `lib/openai/` - Configuración de OpenAI
- `app/globals.css` - Estilos glassmorphism

## Dependencias y Configuración

### tw-animate-css
Para las animaciones de la interfaz, el proyecto utiliza `tw-animate-css`. Para instalarlo, ejecuta el siguiente comando:

```bash
pnpm add tw-animate-css
```

## DISEÑO VISUAL

### Esquema de Colores
- **Primario**: Verde oscuro (#1B5E20)
- **Secundario**: Verde acento (#4CAF50)  
- **Acento**: Naranja (#FF5722)
- **Glassmorphism**: Efectos de transparencia y blur

### Tipografía
- **Principal**: Roboto
- **Jerarquía**: Clara diferenciación de tamaños
- **Contraste**: Optimizado para legibilidad

## ESTADO ACTUAL
✅ Módulo de Recorridos (ACC) - Completo
✅ Sistema de Productos/Servicios - Implementado
✅ Dashboard y Navegación - Funcional
✅ Autenticación Básica - Operativa
✅ Integración OpenAI - Funcional
✅ Constructor de Cotizaciones - Implementado
⏳ Gestión de Actividades - Pendiente
