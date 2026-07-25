# AGENTS.md

## Project Overview

**Maaya Xíinbal** is a tourism and cultural exploration platform for the Yucatán Peninsula (Maxcanú region). It serves as an interactive guide featuring an AI chatbot, interactive map, and curated attraction categories.

## Tech Stack

| Category       | Technology              | Version         |
| -------------- | ----------------------- | --------------- |
| Meta-Framework | Astro                   | ^6.4.2          |
| UI Library     | React                   | ^19.2.6         |
| Styling        | TailwindCSS             | ^4.3.0          |
| Language       | TypeScript              | strict          |
| Maps           | Leaflet + React-Leaflet | ^1.9.4 / ^5.0.0 |
| Maps (cluster) | react-leaflet-cluster   | —               |
| Adapter        | @astrojs/node           | ^10             |
| Runtime        | Node.js                 | >= 22.12.0      |

## Commands

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |

**Note:** There is no lint or typecheck script configured. To typecheck, run `npx astro check`.

## Project Structure

```
src/
├── components/
│   ├── *.astro              # Astro components (SSR/static)
│   └── map/                 # React components (client:only)
│       ├── AttractionDetail.tsx
│       ├── InteractiveMap.tsx
│       ├── MaayaChat.tsx
│       ├── MapCanvas.tsx
│       └── MapSidebar.tsx
├── layouts/
│   └── Layout.astro         # Base HTML shell (Header + slot + Footer)
├── pages/
│   ├── index.astro          # Homepage "/"
│   ├── map.astro            # Interactive map "/map"
│   ├── login.astro          # Login form "/login"
│   ├── register.astro       # Registration form "/register"
│   ├── profile.astro        # User profile "/profile"
│   └── atractivo/
│       └── [id].astro       # Attraction detail "/atractivo/:id" (SSR)
├── services/
│   ├── api.ts               # HTTP client (auto-attaches JWT Bearer token)
│   └── auth.ts              # Auth functions: login, register, logout, getMe
├── styles/
│   └── global.css           # Tailwind imports + Maya theme colors
└── utils/
    └── mapHelpers.ts        # Attraction types, marker colors, Leaflet icons
```

## Architecture

- **Astro** renders static/SSR content: landing page, layout, cards, forms
- **React** handles client-side interactive components: map, chatbot, attraction detail
- React components use `client:only="react"` directive on map and detail pages
- `.astro` files use frontmatter (`---`) for imports and logic; template below for HTML output
- `Layout.astro` wraps all pages with Header + Footer; contains Google Translate SDK scripts
- `astro.config.mjs` uses `output: "static"` + `@astrojs/node` adapter; SSR pages opt-in via `export const prerender = false`
- Global styles are imported once in `Layout.astro`

## Maya Theme Colors (Tailwind v4 @theme)

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

## Key Conventions

- **Imports in `.astro` files**: Use relative paths (`../components/Header.astro`)
- **Imports in `.tsx` files**: Use relative paths (`../../utils/mapHelpers`)
- **CSS classes**: Use Tailwind utility classes with `maya-*` theme tokens (e.g., `bg-maya-verde`, `text-maya-blanco`)
- **Client-side scripts**: Written inline in `.astro` `<script>` tags (not external modules)
- **Language**: UI text is in Spanish; bilingual toggle (ES / Yucatec Maya) via Google Translate cookies; SDK loaded in `Layout.astro` for persistence across all pages
- **API**: `PUBLIC_API_URL` env var points to backend base URL (e.g., `http://localhost:3000/api`); accessed via `import.meta.env.PUBLIC_API_URL`
- **API response shapes**:
  - Attractions: `{ success: boolean, cantidad: number, data: Attraction[] }`
  - Single Attraction: `{ success: boolean, data: Attraction }`
  - Auth: `{ success: boolean, token: string, user: User }`
- **Attraction interface**: Defined in `src/utils/mapHelpers.ts` with fields: `id`, `nombre`, `descripcion`, `categoria`, `municipio`, `estado`, `lat`, `long`, `imagenes?`, `direccion?`, `precio?`, `hora_apertura?`, `hora_cierre?`

## Authentication

- JWT token is stored in `localStorage` under key `auth_token`
- Token is auto-attached to API requests via `Authorization: Bearer <token>` header
- `src/services/api.ts` provides `apiClient()`, `setToken()`, `removeToken()`, `hasToken()`
- `src/services/auth.ts` provides `login()`, `register()`, `getMe()`, `logout()`, `isAuthenticated()`
- `Header.astro` detects token in `localStorage` and shows "Mi Perfil" + "Cerrar sesión" when authenticated
- Protected endpoints (`/api/atractivos`, `/api/chat`) require the Bearer token
- `AttractionDetail.tsx` reads token from `localStorage` on mount for its fetch call
- Registration form sends `{ nombre, apellido, correo, contrasena }` (backend field names)
- Login form sends `{ correo, contrasena }`
- On successful auth, user is redirected to `/map`

## File Patterns

### `.astro` component

```astro
---
import Component from "../path/Component.astro";
---

<div class="tailwind-classes">
  <Component />
</div>

<script>
  // Client-side JS (vanilla, no framework)
</script>
```

### `.tsx` React component

```tsx
import { useState } from "react";

export default function MyComponent() {
  return <div className="tailwind-classes">...</div>;
}
```

## External Dependencies

- **Google Translate API**: Loaded via script in `Layout.astro` for ES/MAY toggle across all pages; custom CSS hides Google's default banners/popups
- **Leaflet CSS**: Must be imported in map-related pages for marker rendering
- **react-leaflet-cluster**: Marker clustering on the interactive map; cluster icons themed with `maya-azul`
- **@astrojs/node**: Server adapter for SSR pages (e.g., attraction detail `/atractivo/[id]`)

## Environment Variables

| Variable         | Required | Description                                              |
| ---------------- | -------- | -------------------------------------------------------- |
| `PUBLIC_API_URL` | Yes      | Backend API base URL (e.g., `http://localhost:3000/api`) |
