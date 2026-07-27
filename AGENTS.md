# AGENTS.md

## Descripción del Proyecto

**Maaya Xíinbal** es una plataforma de turismo y exploración cultural para la Península de Yucatán (región de Maxcanú). Funciona como una guía interactiva con un chatbot de IA, mapa interactivo y categorías curadas de atractivos.

## Stack Tecnológico

| Categoría        | Tecnología              | Versión         |
| ---------------- | ----------------------- | --------------- |
| Meta-Framework   | Astro                   | ^6.4.2          |
| UI               | React                   | ^19.2.6         |
| Estilos          | TailwindCSS             | ^4.3.0          |
| Lenguaje         | TypeScript              | strict          |
| Mapas            | Leaflet + React-Leaflet | ^1.9.4 / ^5.0.0 |
| Mapas (cluster)  | react-leaflet-cluster   | ^4.1.3          |
| Markdown         | marked                  | ^18.0.7         |
| Adaptador        | @astrojs/node           | ^10             |
| Runtime          | Node.js                 | >= 22.12.0      |

## Comandos

| Comando           | Descripción              |
| ----------------- | ------------------------ |
| `npm run dev`     | Iniciar servidor de dev  |
| `npm run build`   | Build de producción      |
| `npm run preview` | Previsualizar build      |

**Nota:** No hay scripts de lint o typecheck configurados. Para typecheck ejecutar `npx astro check`.

## Estructura del Proyecto

```
src/
├── components/
│   ├── *.astro              # Componentes Astro (SSR/estático)
│   └── map/                 # Componentes React (client:only)
│       ├── AttractionDetail.tsx
│       ├── InteractiveMap.tsx
│       ├── MaayaChat.tsx
│       ├── MapCanvas.tsx
│       └── MapSidebar.tsx
├── layouts/
│   └── Layout.astro         # Shell HTML base (Header + slot + Footer)
├── pages/
│   ├── index.astro          # Página principal "/"
│   ├── map.astro            # Mapa interactivo "/map"
│   ├── login.astro          # Inicio de sesión "/login"
│   ├── register.astro       # Registro "/register"
│   ├── profile.astro        # Perfil de usuario "/profile"
│   └── atractivo/
│       └── [id].astro       # Detalle de atractivo "/atractivo/:id" (SSR)
├── services/
│   ├── api.ts               # Cliente HTTP (adjunta token JWT Bearer)
│   └── auth.ts              # Funciones auth: login, register, logout, getMe
├── styles/
│   └── global.css           # Import de Tailwind + colores tema Maya + estilos markdown
└── utils/
    └── mapHelpers.ts        # Tipos de atractivos, colores de marcadores, iconos Leaflet
```

## Arquitectura

- **Astro** renderiza contenido estático/SSR: landing page, layout, tarjetas, formularios
- **React** maneja componentes interactivos del cliente: mapa, chatbot, detalle de atractivo
- Los componentes React usan la directiva `client:only="react"` en las páginas de mapa y detalle
- Los archivos `.astro` usan frontmatter (`---`) para imports y lógica; template abajo para el HTML
- `Layout.astro` envuelve todas las páginas con Header + Footer; contiene los scripts del SDK de Google Translate + atributo `lang` dinámico
- `astro.config.mjs` usa `output: "static"` + adaptador `@astrojs/node` en modo `standalone`; las páginas SSR optan por inclusión con `export const prerender = false`
- TailwindCSS v4 mediante el plugin `@tailwindcss/vite`; los gradientes usan sintaxis `bg-linear-to-br`
- Los estilos globales se importan una vez en `Layout.astro`

## Colores del Tema Maya (Tailwind v4 @theme)

| Token           | Hex       |
| --------------- | --------- |
| `maya-azul`     | `#395c6b` |
| `maya-verde`    | `#517a5e` |
| `maya-rojo`     | `#9a382d` |
| `maya-amarillo` | `#cca044` |
| `maya-blanco`   | `#eaddc9` |
| `maya-negro`    | `#2c2e2f` |
| `maya-morado`   | `#654b6b` |
| `maya-rosa`     | `#b55375` |
| `maya-naranja`  | `#b86a3d` |

## Soporte Multilingüe — 9 Idiomas

- **Google Translate SDK:** Cargado mediante script en `Layout.astro`; idioma base es español (`es`)
- **`includedLanguages`:** `es,yua,en,fr,de,pt,it,zh-CN,ja`
- **UI:** Dropdown personalizado en `Header.astro` (no el widget por defecto de Google — oculto con `class="hidden"` y CSS global)
- **Mecanismo:** El cambio de idioma setea la cookie `googtrans` y recarga la página; volver a español limpia la cookie
- **Lang del navegador:** `Layout.astro` tiene un script inline que lee la cookie `googtrans` y actualiza `document.documentElement.lang` para SEO
- **Lista de idiomas (definida en el script de Header.astro):**

| Código | Nombre     | Valor de cookie |
|--------|-----------|-----------------|
| es     | Español   | (por defecto — limpia la cookie) |
| yua    | Maya      | `/es/yua` |
| en     | English   | `/es/en` |
| fr     | Français  | `/es/fr` |
| de     | Deutsch   | `/es/de` |
| pt     | Português | `/es/pt` |
| it     | Italiano  | `/es/it` |
| zh-CN  | 中文        | `/es/zh-CN` |
| ja     | 日本語       | `/es/ja` |

## Convenciones Clave

- **Imports en `.astro`**: Usar rutas relativas (`../components/Header.astro`)
- **Imports en `.tsx`**: Usar rutas relativas (`../../utils/mapHelpers`)
- **Clases CSS**: Usar clases utilitarias de Tailwind con tokens `maya-*` (ej. `bg-maya-verde`, `text-maya-blanco`)
- **Scripts del cliente**: Escritos inline en tags `<script>` de `.astro` (no módulos externos)
- **Idioma**: El texto de la UI está en español; soporte multilingüe mediante dropdown de Google Translate (9 idiomas, basado en cookies)
- **API**: La variable de entorno `PUBLIC_API_URL` apunta a la URL base del backend (ej. `http://localhost:3000/api`); se accede mediante `import.meta.env.PUBLIC_API_URL`
- **Formas de respuesta de la API**:
  - Lista de atractivos: `{ success: boolean, cantidad: number, data: Attraction[] }`
  - Atractivo individual: `{ success: boolean, data: Attraction }`
  - Chat: `{ success: boolean, response: string }`
  - Auth: `{ success: boolean, token: string, user: User }` / `{ success: boolean, user: User }`
- **Interfaz Attraction**: Definida en `src/utils/mapHelpers.ts` con campos: `id` (number), `nombre`, `descripcion`, `categoria`, `municipio`, `estado`, `lat`, `long`, `imagenes?`, `direccion?`, `precio?`, `hora_apertura?`, `hora_cierre?`
- **Los componentes React usan `fetch` directamente** (no `apiClient`) — leen el token de `localStorage` y adjuntan el header `Authorization` manualmente
- **Las páginas de auth usan imports dinámicos**: `const { login } = await import("../services/auth")` en `login.astro`, `register.astro`, `profile.astro`

## Autenticación

- El token JWT se almacena en `localStorage` bajo la clave `auth_token`
- El token se adjunta automáticamente a las peticiones API mediante el header `Authorization: Bearer <token>`
- `src/services/api.ts` provee `apiClient()`, `setToken()`, `removeToken()`, `hasToken()`
- `src/services/auth.ts` provee `login()`, `register()`, `getMe()`, `logout()`, `isAuthenticated()`
- `Header.astro` detecta el token en `localStorage` y muestra "Mi Perfil" + "Cerrar sesión" cuando está autenticado
- Los endpoints protegidos (`/api/atractivos`, `/api/chat`) requieren el token Bearer
- El formulario de registro envía `{ nombre, apellido, correo, contrasena }` (nombres de campos del backend)
- El formulario de login envía `{ correo, contrasena }`
- Al autenticarse exitosamente, el usuario es redirigido a `/map`

## MaayaChat — Componente del Chatbot IA

- Archivo: `src/components/map/MaayaChat.tsx`
- Se renderiza dentro de `MapSidebar.tsx` como un panel colapsable en la parte inferior
- Llama a `POST /api/chat` con body `{ message, history }` donde `history` es `ChatMessage[]` compatible con Gemini
- **Renderizado de markdown:** Las respuestas de Mayita se parsean con `marked` y se inyectan mediante `dangerouslySetInnerHTML` con clase `maaya-markdown`
- Los estilos de markdown están definidos en `global.css` (listas, negritas, itálicas, encabezados, párrafos)
- Los mensajes del usuario son texto plano; solo los mensajes de la IA usan renderizado markdown

## Patrones de Archivos

### Componente `.astro`

```astro
---
import Componente from "../ruta/Componente.astro";
---

<div class="clases-tailwind">
  <Componente />
</div>

<script>
  // JS del cliente (vanilla, sin framework)
</script>
```

### Componente React `.tsx`

```tsx
import { useState } from "react";

export default function MiComponente() {
  return <div className="clases-tailwind">...</div>;
}
```

## Dependencias Externas

- **Google Translate API**: Cargado mediante script en `Layout.astro` para el dropdown de 9 idiomas en todas las páginas; CSS personalizado oculta los banners/popups/burbujas por defecto de Google
- **Leaflet CSS**: Debe importarse en las páginas del mapa para el renderizado de marcadores
- **react-leaflet-cluster**: Agrupación de marcadores en el mapa interactivo; iconos de cluster con tema `maya-azul`
- **marked**: Parser de markdown para las respuestas de MaayaChat; permite negritas, itálicas, listas y encabezados en los globos del chat
- **@astrojs/node**: Adaptador de servidor para páginas SSR (ej. detalle de atractivo `/atractivo/[id]`); ejecuta en modo `standalone`

## Variables de Entorno

| Variable         | Requerida | Descripción                                                  |
| ---------------- | --------- | ------------------------------------------------------------ |
| `PUBLIC_API_URL` | Sí        | URL base de la API del backend (ej. `http://localhost:3000/api`) |
