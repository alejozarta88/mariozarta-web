# Seguridad

## Reportar una vulnerabilidad

Escribe a **mazarta88@gmail.com** con el asunto `SEGURIDAD`. Incluye la URL afectada, los pasos para
reproducir y el impacto. Respondo en un plazo de 5 días hábiles. Por favor no publiques el hallazgo
hasta que esté corregido.

## Medidas

Sitio estático (Astro) servido por Cloudflare Pages: sin servidor, sin formularios, sin base de datos
ni cookies.

- **Cabeceras** (`public/_headers`, todas las rutas): Content-Security-Policy sin `'unsafe-inline'`
  (scripts y estilos solo desde el propio origen; hojas de fuentes de `fonts.googleapis.com` y archivos
  de `fonts.gstatic.com`), `object-src 'none'`, `frame-ancestors 'none'`, `form-action 'none'`,
  `upgrade-insecure-requests`; HSTS de un año con subdominios; `X-Content-Type-Options: nosniff`;
  `X-Frame-Options: DENY`; `Referrer-Policy: strict-origin-when-cross-origin`; `Permissions-Policy`
  que cierra cámara, micrófono, geolocalización, pagos y USB; `Cross-Origin-Opener-Policy: same-origin`.
  Los assets con hash en `/_astro/*` se cachean como inmutables.
- **Sin código en línea**: `build.inlineStylesheets: 'never'` y `vite.build.assetsInlineLimit: 0`;
  el HTML generado no contiene `<script>` con contenido, `<style>`, `style=` ni manejadores `on*=`.
- **Dependencias**: `astro` fijado a versión exacta, lockfile de pnpm versionado, `pnpm audit` sin
  vulnerabilidades, solo `esbuild` autorizado a ejecutar scripts de instalación
  (`pnpm.onlyBuiltDependencies`), Node fijado en `.node-version`.
- **Enlaces externos** con `rel="noopener noreferrer"`.
- **Datos personales**: solo se publican correo, LinkedIn y GitHub.
- **Gate de seguridad**: antes de publicar cambios sensibles, el subagente
  `.claude/agents/auditor-seguridad.md` audita una copia limpia (git worktree) sin contexto y en solo
  lectura. Los informes y la disposición de cada hallazgo quedan en `docs/gates/`. El gate se aprueba
  cuando una ronda no tiene hallazgos críticos ni altos.

Especificación: [`docs/specs/001-seguridad.md`](docs/specs/001-seguridad.md).
