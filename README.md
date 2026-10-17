# Mario Zarta · agentes de IA

Portafolio de agentes de IA de Mario Zarta. Sitio estático en [Astro](https://astro.build), publicado en Cloudflare Pages.

**Tesis:** el modelo conversa; el dinero, los datos y las acciones irreversibles los decide código determinista.

## Desarrollo

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # genera dist/
```

## Agregar un agente

Edita `src/data/agentes.ts` y agrega un objeto. La portada y su página de detalle (`/agentes/<slug>`) se generan solas.

## Despliegue

Cloudflare Pages · framework Astro · comando `pnpm build` · Node 22 (`.node-version`) · carpeta `dist`.
