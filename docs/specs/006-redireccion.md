# 006 · Redirigir la ficha retirada

La ficha `/agentes/mcp-mesa-ayuda` se retiró en el spec 005 y hoy responde con 404. Este spec la redirige
de forma permanente a `/arquitectura` para no romper enlaces ya compartidos.
Este spec se escribe antes de implementar; cada criterio es verificable.

## Criterios de aceptación

**CA1. `public/_redirects`** con dos líneas, en formato de Cloudflare Pages:

```
/agentes/mcp-mesa-ayuda /arquitectura/ 301
/agentes/mcp-mesa-ayuda/ /arquitectura/ 301
```

Cambio posterior a la auditoría (I1 de r06, aprobado por Mario): el destino pasa de `/arquitectura` a
`/arquitectura/` en las dos líneas. Solo cambia el destino; evita un salto extra.

**CA2. Build y cabeceras.**
- `pnpm build` termina limpio.
- `dist/_redirects` existe con exactamente ese contenido (`cmp` contra `public/_redirects`).
- `public/_headers` no cambia (`git diff --quiet public/_headers`).

**CA3. Gate r06.** Se lanza `auditor-seguridad` sobre un `git worktree` limpio. Su informe se guarda
literal en `docs/gates/r06.md`, con una disposición por hallazgo. Por ser un cambio pequeño, basta una ronda.

## Excepción al spec 005

El CA1 del spec 005 exige que ningún archivo de `dist/` contenga "mcp-mesa-ayuda". `dist/_redirects` es
la excepción explícita: contiene la ruta de origen de la redirección y ningún contenido del agente
retirado. Todo lo demás de ese criterio sigue vigente: las páginas HTML de `dist/` y todo `src/` siguen
sin "mcp-mesa-ayuda", "mesa de ayuda" ni "SHA-256".

## Verificación en producción (después del despliegue)

`astro preview` no aplica `_redirects`, así que el 301 solo se puede comprobar en Cloudflare Pages:
`curl -sI` a `/agentes/mcp-mesa-ayuda` y a `/agentes/mcp-mesa-ayuda/` → `301` con `location: /arquitectura/`.

## Fuera de alcance

Cambios en `_headers` (deudas D3 y D4).
