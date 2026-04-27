# XMS Audit Lab

Herramienta interna de la agencia para auditorías rápidas de SEO, AEO y GEO. Permite pegar una URL, correr un análisis en segundos y obtener un reporte visual con scores, hallazgos críticos, quick wins y recomendaciones accionables.

Se usa principalmente para dos cosas:
- **Prospección de clientes** — antes de una llamada, se corre el audit del dominio del prospecto y ya tienes material concreto para hablar.
- **Auditorías rápidas internas** — diagnóstico inicial de cualquier sitio antes de arrancar un proyecto.

---

## Qué analiza

**SEO** — fundamentos técnicos: title tag, meta description, H1, canonical, HTTPS, sitemap, robots.txt, links, word count.

**AEO (Answer Engine Optimization)** — señales para featured snippets y búsqueda por voz: FAQ schema, headings con preguntas, estructura de contenido, datos estructurados.

**GEO (Generative Engine Optimization)** — visibilidad en respuestas generadas por IA (ChatGPT, Perplexity, Claude): llms.txt, acceso de crawlers de IA, señales de marca y confianza, citas externas.

---

## Stack

- **Frontend:** React + Vite + TanStack Router + TanStack Query + Tailwind CSS
- **Backend:** Express (Node.js) — corre separado en el puerto 3001
- **Fetching real:** El servidor hace el HTTP fetch de la URL y parsea el HTML con Cheerio. El navegador nunca toca sitios externos (evita CORS)
- **Storage:** Los resultados se guardan en `localStorage` del navegador. No hay base de datos por ahora.

---

## Instalación y uso local

Requisitos: Node.js 18+

```bash
# 1. Clonar el repo
git clone https://github.com/XMS-Ai/aeo-audit-tool.git
cd aeo-audit-tool

# 2. Instalar dependencias
npm install

# 3. Copiar el archivo de variables de entorno (opcional por ahora)
cp .env.example .env

# 4. Levantar cliente y servidor juntos
npm run dev
```

Abre `http://localhost:5173` en el navegador.

El servidor Express corre automáticamente en `http://localhost:3001`. El cliente Vite le hace proxy a las llamadas `/api/*`.

---

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta cliente (`:5173`) y servidor (`:3001`) en paralelo |
| `npm run dev:client` | Solo el frontend Vite |
| `npm run dev:server` | Solo el servidor Express |
| `npm run build` | Build de producción del frontend |

---

## Estructura del proyecto

```
├── src/                        # Frontend React
│   ├── routes/                 # Páginas (TanStack Router)
│   │   ├── __root.tsx          # Layout global (header, footer)
│   │   ├── index.tsx           # Home: hero + landing + form
│   │   ├── audit.$auditId.tsx  # Página de reporte individual
│   │   └── audits.tsx          # Historial de audits
│   ├── components/             # Componentes UI
│   └── lib/audit/              # Types, cliente API, storage
│
└── server/                     # Backend Express
    ├── index.ts                # Servidor + endpoint POST /api/audit
    └── audit/
        ├── fetch-site.ts       # HTTP fetch de la URL
        ├── analyze-html.ts     # Parsing con Cheerio
        ├── scoring.ts          # Cálculo de scores SEO/AEO/GEO
        └── recommendations.ts  # Generación de findings
    └── integrations/           # Stubs para conectar más adelante
        ├── ahrefs.ts
        ├── screaming-frog.ts
        ├── pagespeed.ts
        └── slack.ts
```

---

## Integraciones futuras

Los archivos en `server/integrations/` son placeholders listos para conectar. Solo necesitan la API key correspondiente en `.env`:

| Integración | Variable de entorno |
|---|---|
| Ahrefs | `AHREFS_API_KEY` |
| Google PageSpeed | `PAGESPEED_API_KEY` |
| Slack notificaciones | `SLACK_WEBHOOK_URL` |
| Screaming Frog | `SF_API_KEY` + `SF_ENDPOINT` |

---

## Notas importantes

- **No exponer el servidor directamente** sin auth si se despliega en producción.
- Los audits se guardan en el `localStorage` del navegador — no son persistentes entre dispositivos ni usuarios.
- El servidor hace fetches reales a las URLs auditadas. Respetar robots.txt y no abusar con scraping masivo.
