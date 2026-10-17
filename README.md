# mariozarta.dev

Portafolio de agentes de IA de Mario Zarta. Sitio estático en [Astro](https://astro.build), publicado en Cloudflare Pages.

**Tesis:** el modelo conversa; el dinero, los datos y las acciones irreversibles los decide código determinista.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # genera dist/
```

## Agregar un agente

Edita `src/data/agentes.ts` y agrega un objeto. La portada y su página de detalle (`/agentes/<slug>`) se generan solas.

## Despliegue

Cloudflare Pages · framework Astro · comando `npm run build` · carpeta `dist`.
