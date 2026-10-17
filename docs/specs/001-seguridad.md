# 001 · Seguridad del sitio

Sitio estático Astro publicado en Cloudflare Pages (`mariozarta.pages.dev`), gestionado con pnpm.
Este spec se escribe antes de implementar; cada criterio es verificable.

## Criterios de aceptación

**CA1. Marca.** El texto `mariozarta.dev` no aparece en ninguna página ni en el README.
El encabezado muestra "Mario Zarta · agentes de IA" y enlaza a `/`.
- Verificación: `grep -r "mariozarta.dev" src README.md dist` sin resultados (el texto visible
  tampoco puede formarse con `<span>` partidos); el enlace de marca es `<a href="/">`.

**CA2. Dependencias.** `astro` fijado exacto en `7.3.5` (sin `^`). `pnpm audit` sin vulnerabilidades.
`package.json` con `"packageManager": "pnpm@9.15.0"`, `"engines": {"node": ">=22.12.0"}` y
`"pnpm": {"onlyBuiltDependencies": ["esbuild"]}`. Existe `.node-version` con `22`.
- Verificación: `pnpm audit` → "No known vulnerabilities found"; `pnpm build` termina sin error.

**CA3. Sin código en línea.** `astro.config.mjs` usa `build.inlineStylesheets: 'never'` y
`vite.build.assetsInlineLimit: 0`. Ningún atributo `style=""` en el código fuente: todo va a clases.
En `dist/` no hay `<script>` con contenido, `<style>`, `style=` ni atributos `on*=`.
- Verificación: búsqueda en `dist/**/*.html` de `<style`, ` style=`, ` on[a-z]+=` y de `<script>`
  cuyo cuerpo no esté vacío → cero coincidencias.

**CA4. Cabeceras** en `public/_headers` para todas las rutas (`/*`):
- `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`
- `Cross-Origin-Opener-Policy: same-origin`

Para `/_astro/*`: `Cache-Control: public, max-age=31536000, immutable`.

La CSP no rompe: fuentes de Google (hoja en fonts.googleapis.com, archivos en fonts.gstatic.com),
el script propio (archivo externo en `/_astro/`), la animación SVG (SMIL/CSS, sin estilos en línea)
ni los efectos con `element.style.setProperty` (la CSSOM no está sujeta a `style-src`).

**CA5. Gate de seguridad reutilizable.** Existe `.claude/agents/auditor-seguridad.md`: subagente auditor
externo, sin contexto, en solo lectura, que revisa cabeceras, `dist/`, `pnpm audit`, secretos,
`rel="noopener"` en enlaces externos, datos personales expuestos y cadena de suministro. Entrega
VEREDICTO / HALLAZGOS por severidad con `archivo:línea` / EVIDENCIA. Regla de parada: se aprueba cuando
una ronda no tiene críticos ni altos. Existe `SECURITY.md` con las medidas y el correo
`mazarta88@gmail.com` para reportes.

**CA6. Gate ejecutado.** Se crea un `git worktree` en otra carpeta (copia limpia) y se lanza el
subagente `auditor-seguridad` sobre ella sin pasarle contexto. Su informe se guarda tal cual en
`docs/gates/r01.md` con una disposición escrita por hallazgo (corregido con su cambio, o aceptado con
su razón). Si hay críticos o altos, se corrige y se repite como `r02`.

**CA7. Datos de contacto.** `Contact.astro` no muestra el teléfono; quedan correo, LinkedIn y GitHub.
- Verificación: `grep -r "312 449" src dist` sin resultados.
