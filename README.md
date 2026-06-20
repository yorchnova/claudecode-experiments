# 🧭 Línea de pensamiento

Guía educativa de uso libre que, a partir de un **concepto, hipótesis o idea**,
ayuda a encontrar **voces reconocidas y con autoridad** (académicos, emprendedores,
creadores de contenido) asociadas a ese tema, y genera un **informe simple y
compartible** de esa línea de pensamiento.

Es, en esencia, un **mapa mental de referentes** para inspirarte, guiarte y
aprender sobre lo que te interesa.

## ✨ Cómo funciona (flujo)

1. **Buscar** — escribes un concepto o idea.
2. **Refinar** — la herramienta te encuadra el tema y te hace preguntas para
   afinar la perspectiva (práctica/teórica, formato, nivel…).
3. **Voces** — propone referentes validados; tú **apruebas/marcas** los que te
   interesan.
4. **Informe** — genera una investigación acotada en **Markdown**, lista para
   **copiar** o **descargar** (`.md`) y compartir.

## 🧩 Fuente de voces: modelo híbrido

- **Curada** — una base propia de referentes con datos factuales
  (`server/src/data/voices.ts`). Pensada para crecer manualmente.
- **IA** — un proveedor Claude (`server/src/services/claudeProvider.ts`) que
  complementa la base con más voces y redacta el encuadre y la relevancia a medida.
- **Web en tiempo real** — preparado como siguiente paso: puede añadirse
  activando la herramienta de búsqueda web de la API de Claude dentro del
  proveedor (ver comentarios en `claudeProvider.ts`).

La app funciona **sin clave de IA** gracias al proveedor `mock`, que usa solo la
base curada con un buscador por palabras clave y sinónimos de tema. Cuando tengas
una clave, se activa Claude cambiando dos variables de entorno — sin tocar el resto.

## 🚀 Puesta en marcha

Requisitos: Node 18+.

```bash
npm install            # instala server y web (workspaces)
npm run dev            # levanta backend (:3001) y frontend (:5173)
```

Abre http://localhost:5173

### Activar la IA (opcional)

```bash
cp server/.env.example server/.env
# edita server/.env:
#   AI_PROVIDER=claude
#   ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

## 🗂️ Estructura

```
linea-de-pensamiento/
├─ server/                 # API Express + TypeScript
│  └─ src/
│     ├─ data/voices.ts        # base curada de voces
│     ├─ services/             # proveedores (mock / claude) + factory
│     ├─ lib/report.ts         # generación del informe Markdown
│     ├─ routes.ts             # /api/refine, /api/search, /api/report
│     └─ types.ts
└─ web/                    # frontend React + Vite + TypeScript
   └─ src/
      ├─ App.tsx               # asistente por pasos
      ├─ components/VoiceCard.tsx
      └─ api.ts
```

## 🔌 API

| Método | Ruta           | Descripción                                   |
| ------ | -------------- | --------------------------------------------- |
| GET    | `/api/health`  | Estado y proveedor activo                     |
| POST   | `/api/refine`  | `{ query }` → encuadre + preguntas            |
| POST   | `/api/search`  | `{ query, answers }` → voces candidatas       |
| POST   | `/api/report`  | `{ query, answers, voiceIds, voices }` → `.md`|

## 🛠️ Próximos pasos sugeridos

- Búsqueda web en tiempo real (herramienta `web_search` de Claude) con citas.
- Persistencia: guardar y volver a abrir líneas de pensamiento.
- Compartir por enlace y exportar a PDF / tarjeta visual.
- Panel de curación para ampliar la base de voces sin tocar código.

---

_Guía educativa de uso libre. Las voces y obras citadas pertenecen a sus autores._
