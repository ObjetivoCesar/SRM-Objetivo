# 📌 PDR CRM OBJETIVO
## Producto de Desarrollo de Requerimientos - Aplicación Web para Gestión Inteligente de Eventos y Tareas

### Concepto General
El presente documento describe el desarrollo de **CRM OBJETIVO**, una solución web a medida concebida para optimizar la eficiencia operativa y la capacidad de respuesta comercial de la empresa. La plataforma se fundamenta en cuatro pilares estratégicos:

- **Centralización de la Información**: Actuando como un CRM robusto que gestiona todo el ciclo de vida del cliente.
- **Automatización Inteligente**: Utilizando OpenAI LLM para procesar entradas de datos no estructuradas y convertirlas en acciones concretas.
- **Agilidad Comercial**: Proporcionando un constructor de propuestas modular para generar cotizaciones de alta calidad en tiempo récord.
- **Gestión Proactiva**: Automatizando recordatorios, tareas y reportes diarios para mantener al equipo sincronizado y enfocado.

---

## 🎨 Guía de Estilo Visual: Interfaz "Glassmorphism"

### Filosofía de Diseño:
\`\`\`json
{
  "colors": {
    "primaryDarkGreen": "#1B5E20",
    "accentGreen": "#4CAF50",
    "lightGreen": "#E8F5E9",
    "orange": "#FF5722",
    "yellow": "#FFC107",
    "successGreen": "#4CAF50",
    "textDark": "#333333",
    "textLight": "#FFFFFF",
    "backgroundGray": "#F0F0F0",
    "backgroundWhite": "#FFFFFF",
    "errorRed": "#F44336",
    "neutralGray": "#888888"
  },
  "fonts": {
    "family": "Roboto, sans-serif",
    "title": { "size": "1.5rem", "weight": "600" },
    "subtitle": { "size": "1.2rem", "weight": "500" },
    "body": { "size": "1rem", "weight": "400" },
    "small": { "size": "0.875rem", "weight": "400" }
  },
  "layout": {
    "sidebar": {
      "width": "250px",
      "background": "#1B5E20",
      "padding": "20px",
      "borderRadius": "0 20px 20px 0",
      "boxShadow": "0 4px 20px rgba(0,0,0,0.1)"
    },
    "mainContent": {
      "background": "#FFFFFF",
      "padding": "30px",
      "borderRadius": "20px",
      "boxShadow": "0 4px 20px rgba(0,0,0,0.1)",
      "margin": "20px"
    },
    "cards": {
      "background": "#FFFFFF",
      "borderRadius": "12px",
      "boxShadow": "0 2px 10px rgba(0,0,0,0.05)",
      "padding": "20px",
      "marginBottom": "20px"
    }
  }
}
\`\`\`

---

## 🛠️ Arquitectura Tecnológica Implementada

### Stack Tecnológico Actualizado:

1. **Frontend**: **Next.js 15** con App Router
   - **¿Por qué?** Framework React de última generación que permite desarrollo full-stack con componentes de servidor y cliente, optimización automática y arquitectura modular perfecta para nuestros módulos (ACC, Constructor, Gestión).

2. **Backend**: **Next.js API Routes + Server Actions**
   - **¿Por qué?** Integración nativa con el frontend, manejo eficiente de operaciones del CRM, automatizaciones y comunicación con base de datos. Permite desarrollo unificado sin separación frontend/backend.

3. **Base de Datos**: **Supabase (PostgreSQL)**
   - **¿Por qué?** Base de datos relacional robusta con autenticación integrada, APIs automáticas y escalabilidad empresarial. Ideal para CRM donde las relaciones entre clientes, cotizaciones, tareas y usuarios son críticas. Incluye Row Level Security para protección de datos.

4. **Integración con IA**: **OpenAI API**
   - **¿Cómo?** Integración directa con OpenAI GPT-4 a través de AI SDK de Vercel para procesamiento de lenguaje natural en el Asistente de Captura Conversacional y generación inteligente de contenido.

5. **Autenticación**: **Supabase Auth**
   - **Implementación inicial**: Usuario `admin` con contraseña `123` para desarrollo
   - **Evolución**: Sistema completo de roles y permisos diferenciados para César, Michael y Abel

### Esquema de Base de Datos Implementado:

\`\`\`sql
-- Usuarios y autenticación
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'sales', 'constructor', 'manager')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clientes y prospectos
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  business_activity TEXT,
  connection_type TEXT CHECK (connection_type IN ('formal', 'semiformal', 'informal')),
  profile_type TEXT CHECK (profile_type IN ('logical', 'emotional')),
  personality_type TEXT CHECK (personality_type IN ('introvert', 'extrovert')),
  key_phrases TEXT[],
  strengths TEXT,
  weaknesses TEXT,
  opportunities TEXT,
  threats TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eventos y reuniones
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cotizaciones
CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  title TEXT NOT NULL,
  template_used TEXT,
  communication_tone TEXT CHECK (communication_tone IN ('formal', 'informal')),
  content JSONB,
  total_amount DECIMAL(10,2),
  payment_terms TEXT,
  delivery_time TEXT,
  validity_period TEXT,
  status TEXT CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tareas y actividades
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id),
  quotation_id UUID REFERENCES quotations(id),
  assigned_to UUID REFERENCES profiles(id),
  due_date TIMESTAMPTZ,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notificaciones
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  task_id UUID REFERENCES tasks(id),
  title TEXT NOT NULL,
  message TEXT,
  type TEXT CHECK (type IN ('reminder', 'deadline', 'update')),
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

---

## 📋 Módulos Implementados

### Módulo 1: Ingreso de Datos - Asistente de Captura Conversacional (ACC)

**Objetivo**: Convertir cada visita de campo en una sesión de inteligencia de negocios, armando a Michael con un "expediente de persuasión" completo.

**Flujo Implementado**:

1. **Fase 1: Identificación del Prospecto**
   - Nombre del negocio
   - Nombre del contacto principal
   - Tipo de conexión (Formal/Semiformal/Informal)
   - Actividad comercial principal (texto + audio)

2. **Fase 2: Diagnóstico Comercial**
   - Producto/servicio de mayor interés
   - Acuerdos verbales y negociaciones clave

3. **Fase 3: Perfil Humano**
   - Análisis psicológico: Lógico/Emocional + Introvertido/Extrovertido
   - Frases y creencias repetidas (captura de audio)

4. **Fase 4: Análisis Estratégico (FODA)**
   - Fortalezas del negocio
   - Debilidades a solucionar
   - Oportunidades de mercado
   - Amenazas externas

**Resultado**: Expediente completo estructurado en JSON, almacenado en Supabase con tarea automática para Michael.

### Módulo 2: Constructor de Cotizaciones

**Objetivo**: Herramienta visual para ensamblar cotizaciones personalizadas y persuasivas en minutos.

**Flujo Implementado**:

1. **Inicio**: Tarea precargada con información del ACC
2. **Selección de Plantilla**: Tarjetas visuales por tipo de proyecto
3. **Configuración**:
   - Verificación de datos del cliente
   - Selección de tono (Formal/Cercano)
4. **Construcción Modular**:
   - Catálogo de servicios con búsqueda inteligente
   - Sistema de bloques editables
   - Precios dinámicos y personalizables
5. **Términos Comerciales**:
   - Inversión total calculada
   - Términos de pago configurables
   - Plazos y validez
6. **Generación**: Documento editable con export a PDF
7. **Finalización**: Tarea automática para César

### Módulo 3: Gestión de Actividades y Notificaciones

**Objetivo**: Cronograma automatizado con herramientas de productividad diaria.

**Componentes Implementados**:

1. **Calendario Centralizado**:
   - Vista diaria/semanal/mensual
   - Filtros por usuario y tipo de actividad
   - Integración con tareas y reuniones

2. **Motor de Notificaciones**:
   - Configuración personalizada por usuario
   - Recordatorios: 1 día, 2 horas, 1 hora, 50 minutos antes
   - Múltiples canales (app, email)

3. **Reportes Diarios Automatizados**:
   - Generación automática a las 8:00 AM
   - Documentos personalizados por usuario
   - Checklist de productividad editable

---

## 🔧 Funcionalidades Técnicas Clave

### Autenticación y Seguridad
- **Supabase Auth** con Row Level Security (RLS)
- **Middleware de protección** de rutas
- **Roles diferenciados**: admin, sales, constructor, manager

### Integración con IA
- **OpenAI GPT-4** para procesamiento de lenguaje natural
- **AI SDK de Vercel** para integración optimizada
- **Prompts especializados** para cada módulo

### Generación de Documentos
- **Editor de texto enriquecido** para cotizaciones
- **Export a PDF** con formato profesional
- **Plantillas personalizables** con variables dinámicas

### Notificaciones Inteligentes
- **Sistema de colas** para recordatorios
- **Configuración granular** por usuario
- **Múltiples canales** de notificación

---

## 📈 Arquitectura Modular

### Estructura de Directorios
\`\`\`
/app
  /auth          # Autenticación
  /dashboard     # Panel principal
  /clients       # Gestión de clientes
  /quotations    # Constructor de cotizaciones
  /tasks         # Gestión de tareas
  /calendar      # Calendario y eventos
/components
  /ui            # Componentes base
  /forms         # Formularios especializados
  /charts        # Gráficos y visualizaciones
/lib
  /supabase      # Configuración de base de datos
  /ai            # Integración con OpenAI
  /utils         # Utilidades compartidas
\`\`\`

### Escalabilidad
- **Componentes reutilizables** para nuevos módulos
- **API Routes modulares** para extensiones
- **Base de datos normalizada** para crecimiento
- **Sistema de permisos flexible** para nuevos roles

---

## 🎯 Próximos Pasos de Desarrollo

1. **Implementación de API Key de OpenAI** (pendiente de usuario)
2. **Refinamiento del sistema de autenticación** con roles específicos
3. **Optimización de plantillas** de cotización
4. **Integración de notificaciones por WhatsApp** (opcional)
5. **Dashboard de métricas** y reportes avanzados
6. **Sistema de backup** y recuperación de datos

---

**Documento actualizado**: Enero 2025  
**Versión**: 1.0 - Implementación Base  
**Stack**: Next.js 15 + Supabase + OpenAI + Vercel AI SDK
