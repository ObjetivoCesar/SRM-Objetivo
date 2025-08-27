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
Generar cotizaciones completas y personalizadas para leads utilizando un sistema de plantillas editables.

### Funcionalidades
- **Selección de Plantillas**: Permite escoger entre varias plantillas predefinidas según el perfil del cliente (emocional, lógico, etc.).
- **Personalización Manual**: Carga la plantilla seleccionada en un editor de texto, reemplazando automáticamente variables (como nombre del cliente, nombre del negocio) con la información del lead.
- **Edición y Guardado**: El contenido puede ser revisado y editado libremente en la interfaz antes de ser guardado en la base de datos.
- **Información del Lead a la Vista**: Muestra la información clave del lead seleccionado para facilitar la personalización manual de la cotización.

**Nota sobre la Generación con IA**: La funcionalidad de generación de cotizaciones mediante Inteligencia Artificial (OpenAI) ha sido temporalmente desactivada. El código y los prompts se conservan en `lib/openai/` y `lib/prompts/` para una posible reactivación o reutilización en el futuro. El sistema actual prioriza un enfoque manual y controlado a través de plantillas.

### Componentes Clave
- **Frontend**: `app/cotizaciones/page.tsx` (Interfaz de usuario para selección de lead, selección de plantilla y edición de la cotización).
- **Plantillas**: Archivos Markdown en `lib/templates/` que sirven como base para las cotizaciones.
- **Lógica de Negocio**: La lógica para leer plantillas y reemplazar variables se encuentra directamente en el componente del frontend.

### Flujo de Generación
1.  El usuario selecciona un lead de la lista.
2.  El sistema muestra la información relevante del lead.
3.  El usuario elige una de las plantillas disponibles.
4.  Al hacer clic en "Cargar Plantilla", el contenido de la plantilla se carga en un editor de texto.
5.  El sistema reemplaza automáticamente las variables conocidas (ej. `{{contact_name}}`) en la plantilla con los datos del lead.
6.  El usuario edita y personaliza el texto final en el editor.
7.  Una vez satisfecho, el usuario guarda la cotización, que se almacena en la base de datos.

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
