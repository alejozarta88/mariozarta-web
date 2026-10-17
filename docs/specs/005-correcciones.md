# 005 · Correcciones de contenido y pulido de /arquitectura

Este spec se escribe antes de implementar; cada criterio es verificable.

## Criterios de aceptación

**CA1. Retirar el agente `mcp-mesa-ayuda`.** Se elimina de `src/data/agentes.ts` y su página deja de existir:
`/agentes/mcp-mesa-ayuda` no está en `dist/` y responde con la página 404.
- Ningún archivo de `src/` ni `dist/` contiene "mcp-mesa-ayuda", "mesa de ayuda" ni "SHA-256" (sin
  distinguir mayúsculas).
- Se quita la regla especial `SIN_EVIDENCIA` de `patrones.ts`. La validación de slugs inexistentes ya cubre
  ese caso.
- Los `docs/` históricos (specs y gates) no se tocan.
- Inventario aprobado por Mario:
  - el objeto del agente en `agentes.ts`;
  - la regla y su comentario en `patrones.ts`;
  - en `dist/`: la página del agente, su tarjeta en la portada y el enlace "Siguiente agente" de
    Registro de contratos, que pasa a TRIO.
- Las menciones genéricas a MCP se mantienen: no son ese agente.
- El título de la portada sale de los datos y pasa de 6 a 5 agentes.
- Verificación: búsqueda sin distinguir mayúsculas en `src/` y `dist/` sin coincidencias, más la prueba
  negativa de CA3 del spec 004 repetida con `mcp-mesa-ayuda`: el build falla porque el slug ya no existe.

**CA2. "Model Armor" fuera de `src/`.** Ocurrencias revisadas y aprobadas por Mario antes del cambio:

| # | Ubicación | Antes | Después |
|---|---|---|---|
| 1 | `src/data/agentes.ts:70` (paso del flujo de Cine Demo) | `Agente IA · Model Armor` | `Agente IA · guardrails (nivel medio)` |
| 2 | `src/data/agentes.ts:89` (stack de Cine Demo) | `… · crons · Model Armor` | `… · crons · guardrails de la plataforma` |

- Verificación: "Model Armor" no aparece en `src/` ni en `dist/`.
- Esto cierra el pendiente del spec 003 (verificar Model Armor).

**CA3. Stack de `/arquitectura`.** Se agrega este texto literal, y nada más:
- Agentes e IA: API de Anthropic · API de OpenAI · n8n
- Datos: PostgreSQL
- Infraestructura: Docker · Coolify

**CA4. Pulido visual de `/arquitectura`.**
- a) En el explorador, los patrones y agentes atenuados tienen opacidad mínima de 0.5 y se leen en claro
  y en oscuro. Se mide y se informa el contraste efectivo del texto atenuado.
  - Medido: con 0.5, el texto de un chip atenuado en claro queda en 3.62:1, por debajo de AA (4.5:1 para texto
    pequeño), y los chips siguen siendo botones activos. Por eso se usa **0.6**, que respeta el mínimo
    de 0.5: 5.95:1 en oscuro y 5.01:1 en claro.
  - Las tarjetas de patrón atenuadas no usan opacidad, porque bajaría el texto secundario y los enlaces.
    El título pasa a `--muted` (6.56:1 en oscuro, 6.25:1 en claro) y el borde de carril a neutro. Los
    enlaces conservan su contraste (9.00:1 y 4.99:1).
- b) La etiqueta de carril de cada tarjeta de patrón pasa a una palabra ("código", "IA", "persona") con un
  punto del color del carril.
- c) Los 5 principios pasan a tarjetas en una grilla: 1 columna en celular y 2–3 en escritorio. Cada
  tarjeta lleva un ícono genérico propio en SVG (aprobados por Mario) y entra al hacer scroll (`.rise`).
  Sin logotipos ni dependencias.

  | Principio | Ícono |
  |---|---|
  | 1 | Dos carriles con un globo de diálogo y llaves |
  | 2 | Llave |
  | 3 | Ojo |
  | 4 | Embudo con filtro |
  | 5 | Lista de verificación |

- Todo respeta `prefers-reduced-motion`.

**CA5. Calidad y seguridad.**
- `pnpm build` limpio y `pnpm audit` sin vulnerabilidades.
- `dist/**/*.html` sin `<style`, ` style=`, ` on*=` ni `<script>` con contenido.
- Verificación de identificadores de infraestructura (spec 002): sin coincidencias, con los patrones
  solo en la terminal.
- Ningún archivo del commit contiene caracteres de control, salvo salto de línea, retorno de carro y
  tabulador.

**CA6. Capturas** (sin scroll horizontal; rutas en el informe final, fuera del repo):
- `/arquitectura` a 390 px en claro, sin selección y con Escuadrón activo.
- `/arquitectura` a 1440 px.
- La portada a 390 px.

**CA7. Gate r05.** Se lanza `auditor-seguridad` sobre un `git worktree` limpio. Su informe se guarda
literal en `docs/gates/r05.md`, con una disposición por hallazgo.

## Fuera de alcance

La imagen OG, la versión en inglés y los textos de los demás agentes (salvo las dos ocurrencias de CA2).
