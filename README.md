# Coca-Cola Event Intelligence · Backend API

Backend empresarial para la plataforma de eventos interactivos, muestreo (sampling) de bebidas, analítica en tiempo real y pipeline de Consumer Insights impulsado por Inteligencia Artificial de The Coca-Cola Company.

---

## 🛠 Stack Tecnológico

- **Framework:** NestJS 11 con TypeScript (compilación estricta y decoradores).
- **Arquitectura:** Por capas estrictas (*Clean / Hexagonal Architecture*):
  - `domain`: Reglas de negocio puras, Value Objects, agregados y errores de dominio tipados.
  - `application`: Casos de uso, orquestación y puertos (gateways/repositorios).
  - `infrastructure`: Adaptadores para Prisma ORM, Meta WhatsApp Cloud API, OpenAI y BullMQ.
  - `presentation`: Controladores REST, Webhooks, DTOs con validación estricta (`class-validator`) e interceptores/filtros estándar.
- **Base de Datos & ORM:** PostgreSQL 16 con Prisma ORM (modelado completo, índices y vistas analíticas para Power BI).
- **Procesamiento Asíncrono:** BullMQ + Redis para colas de mensajería entrante/saliente de WhatsApp y el pipeline de transcripción/análisis.
- **Inteligencia Artificial:**
  - **OpenAI Whisper (`whisper-1`):** Transcripción automática de notas de voz de asistentes.
  - **GPT-4o-mini con Structured Outputs (`zodResponseFormat`):** Extracción confiable de sentimiento (1 a 5), atributos de sabor, temas clave, intención de compra y citas ejecutivas.
- **Business Intelligence & Power BI:** Vistas SQL (`analytics.vw_event_performance`, `analytics.vw_product_sampling`, etc.) agregadas con CTEs para eliminar problemas de *fan-out* y alimentar tableros directos.

---

## 📂 Estructura de Directorios

```text
hacka_Coca_Cola_backend/
├── prisma/
│   ├── schema.prisma              # Definición de entidades, relaciones y enums
│   ├── seed.ts                    # Script de sembrado de datos (admin, productos, evento demo)
│   └── sql/
│       └── power_bi_views.sql     # Vistas SQL analíticas para Power BI
├── src/
│   ├── main.ts                    # Bootstrap HTTP (prefijo /api/v1, CORS, pipes, interceptores)
│   ├── app.module.ts              # Módulo raíz que integra módulos de dominio e infraestructura
│   ├── shared/
│   │   ├── domain/                # AggregateRoot, DomainError, DomainEvent
│   │   ├── infrastructure/        # PrismaService, QueueConfig (BullMQ), Seguridad QR
│   │   └── presentation/          # GlobalExceptionFilter, ResponseTransformInterceptor
│   └── modules/
│       ├── auth/                  # Autenticación Admin y Staff (PIN + EventCode)
│       ├── scanning/              # Check-in de asistentes, Sampling y Manifiesto Offline
│       ├── feedback/              # Pipeline Audio-to-Insights con OpenAI y BullMQ
│       ├── conversations/         # Bot WhatsApp (Meta Cloud & Twilio), máquina de estados
│       └── analytics/             # Métricas agregadas y analítica para KPIs
├── .env                           # Variables de entorno locales
├── package.json
└── tsconfig.json
```

---

## 🚀 Requisitos Previos

- **Node.js:** v20.x, v22.x o v24.x
- **PostgreSQL:** v16+
- **Redis:** v7+

---

## ⚙️ Configuración de Variables de Entorno (`.env`)

Copia y ajusta las siguientes variables en tu archivo `.env`:

```env
# Base de Datos (PostgreSQL 16)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/coca_cola_events?schema=public"

# Servidor NestJS
PORT=3000
NODE_ENV=development

# Redis (BullMQ & Cache)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secrets
JWT_SECRET=super-secret-jwt-key-cocacola-2026-very-secure
JWT_REFRESH_SECRET=super-secret-refresh-jwt-key-cocacola-2026-very-secure
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Seguridad QR (HMAC-SHA256 con prefijo cei1)
QR_SIGNING_SECRET=qr-signing-key-cocacola-experience-2026-very-secret
QR_SIGNING_SECRET_PREVIOUS=

# Meta WhatsApp Business Cloud API
WHATSAPP_API_URL=https://graph.facebook.com/v21.0
WHATSAPP_PHONE_NUMBER_ID=100000000000001
WHATSAPP_ACCESS_TOKEN=fake_meta_access_token_for_dev
WHATSAPP_APP_SECRET=fake_meta_app_secret_for_webhook_signature
WHATSAPP_VERIFY_TOKEN=cocacola_webhook_verify_token_2026

# Twilio (Alternativa opcional de WhatsApp)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=+14155238886

# OpenAI (Whisper STT & GPT-4o-mini Insights)
OPENAI_API_KEY=sk-proj-demo-openai-key-for-local-development
STT_MODEL=whisper-1
LLM_MODEL=gpt-4o-mini
FEEDBACK_CONCURRENCY=5

# Privacidad y Anonimización
ANON_SALT=cocacola_salt_for_gdpr_anonymization_2026
```

---

## 📦 Instalación y Puesta en Marcha

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Generar Cliente de Prisma:**
   ```bash
   npx prisma generate
   ```

3. **Ejecutar Migraciones de Base de Datos:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Crear Vistas Analíticas para Power BI:**
   Ejecuta el script SQL en tu base de datos PostgreSQL:
   ```bash
   psql -U postgres -d coca_cola_events -f prisma/sql/power_bi_views.sql
   ```

5. **Poblar Datos de Prueba (Seed):**
   ```bash
   npx ts-node prisma/seed.ts
   ```
   *Esto creará el Super Administrador (`admin@cocacola.test` / `CocaCola2026!`), el catálogo de productos Coca-Cola y el evento demo `LOLLA26` con PIN de staff `123456`.*

6. **Compilar e Iniciar el Servidor:**
   ```bash
   # Modo desarrollo (hot-reload)
   npm run start:dev

   # Compilación a producción
   npm run build
   npm run start:prod
   ```

La API estará disponible en `http://localhost:3000/api/v1`.

---

## 📡 Endpoints Principales

- `POST /api/v1/auth/admin/login`: Inicio de sesión para administradores.
- `POST /api/v1/auth/staff/login`: Inicio de sesión para staff en punto de acceso (`eventCode` + `pin`).
- `POST /api/v1/scan/check-in`: Check-in del asistente en la entrada mediante token QR con prevención de duplicados.
- `POST /api/v1/scan/sampling`: Entrega de muestra/bebida con validación de aforo por actividad (`maxClaimsPerUser`).
- `GET /api/v1/scan/offline-manifest`: Descarga de manifiesto para sincronización offline de la PWA.
- `POST /api/v1/webhooks/whatsapp`: Recepción de mensajes y flujos conversacionales de onboarding.
- `POST /api/v1/feedback/:id/reprocess`: Re-procesamiento manual de audios fallidos.
- `GET /api/v1/events/:id/metrics`: KPIs en tiempo real de asistencia, muestreo, engagement y sentimiento.
