# 003 · Tipos de paso en el flujo

Hoy cada paso del flujo es `{ texto, det?: boolean }` y la leyenda tiene dos colores ("carril de IA" y
"código determinista"). Así, las entradas (Telegram, WhatsApp, Usuario) se pintan como IA y los pasos
humanos (Compuerta humana, Revisión humana) como código. La tesis del sitio es que el humano decide lo
importante, y el diagrama tiene que mostrarlo.
Este spec se escribe antes de implementar; cada criterio es verificable.

## Criterios de aceptación

**CA1. Tipo.** Cada paso es `{ texto: string; tipo: 'entrada' | 'ia' | 'codigo' | 'humano' }` y se elimina `det`.
El build falla si un paso no tiene tipo o tiene un tipo fuera de la lista.
- Mecanismo: `astro build` no comprueba tipos de TypeScript y el repo no tiene `tsc` ni `astro check`.
  Para no añadir dependencias, `src/data/agentes.ts` valida en tiempo de build: si algún paso no tiene
  un `tipo` válido, lanza un error con el slug del agente y el texto del paso. El tipo de TypeScript
  queda además como `tipo` obligatorio para el editor.
- Verificación: `grep -rn "det" src/data/agentes.ts src/components/Flow.astro` → sin uso de `det`.
  Prueba negativa en una copia desechable: un paso sin `tipo` hace fallar `pnpm build` con ese mensaje.

**CA2. Escuadrón** (aprobado literal): Telegram=entrada · Coordinador=ia · Tarea=codigo ·
Compuerta humana=humano · Agente=ia · Pull request=codigo · Revisión humana=humano.

**CA3. Demás agentes.** Se aplica la clasificación de la tabla "Clasificación aprobada" (abajo), que
Mario aprueba antes de implementarla. La regla de partida es esta: `det=true` pasa a `codigo` salvo que
el paso sea una persona; sin `det` pasa a `ia` salvo que sea una entrada (canal o usuario) o una persona.
Las desviaciones de la regla quedan escritas con su razón.

**CA4. Estilos.** `ia` usa el azul actual (`--ai`/`--ai-dim`), `codigo` el dorado actual (`--gold`/`--gold-dim`) y `entrada` va en neutro
(borde `--muted`, sin relleno de color). `humano` se distingue de los tres sin depender solo del color;
el estilo se aprueba antes de implementarlo (ver "Estilo de humano"). Solo tokens existentes de
`global.css`. Contraste AA en claro y oscuro: texto ≥ 4.5:1 y bordes de componente ≥ 3:1 (WCAG 1.4.11).

**CA5. Leyenda.** Muestra solo los tipos presentes en ese flujo, en el orden entrada · IA · código determinista ·
persona, con esas etiquetas literales: "entrada", "IA", "código determinista", "persona".

**CA6. Accesibilidad.** Cada paso lleva su tipo en texto para lectores de pantalla, con una clase
visualmente oculta (`.sr-only` en `global.css`), no solo en color.

**CA7. Sin código en línea.** En `dist/**/*.html` no hay `<style`, ` style=`, ` on*=` ni `<script>` con
contenido (spec 001). `pnpm build` limpio y `pnpm audit` sin vulnerabilidades.

**CA8. Capturas** a 390 px en claro y en oscuro: flujo del Escuadrón y de Cine Demo. Rutas en el
informe final (fuera del repo).

**CA9. Gate r03.** Se lanza `auditor-seguridad` sobre un `git worktree` limpio. Su informe se guarda
literal en `docs/gates/r03.md`, con una disposición por hallazgo.

## Fuera de alcance

El diagrama de dos carriles de la portada (`Lanes.astro`), los textos de los agentes y `/patrones`.

## Clasificación aprobada

Aprobada por Mario antes de implementar (CA3). Las filas marcadas con ⚠️ se desvían de la regla de partida
o la confirman tras discutirla; cada una lleva su razón.

| Agente | Paso | det anterior | Tipo | Por qué |
|---|---|---|---|---|
| Escuadrón | Telegram | — | entrada | CA2 (aprobado literal) |
| | Coordinador | — | ia | CA2 |
| | Tarea | true | codigo | CA2 |
| | Compuerta humana | true | humano | CA2 |
| | Agente | — | ia | CA2 |
| | Pull request | true | codigo | CA2 |
| | Revisión humana | true | humano | CA2 |
| Cine Demo | WhatsApp | — | entrada | Canal |
| | Agente IA · Model Armor | — | ia | Regla |
| | 6 herramientas MCP | — | ia | Regla: el modelo decide llamarlas (igual que en `Lanes.astro`) |
| | calcular-total | true | codigo | Regla |
| | Mercado Pago | true | codigo | Regla |
| | confirmar idempotente | true | codigo | Regla |
| Extractor de facturas | Spec | — | humano ⚠️ | La persona escribe los criterios de aceptación (la regla daba ia) |
| | Prueba roja | — | ia | Regla |
| | Código | — | ia | Regla |
| | Agente revisor | true | ia ⚠️ | Es un subagente de IA: corrige el `det=true` erróneo (la regla daba codigo) |
| | Pull request | — | codigo ⚠️ | Coherente con el Escuadrón (la regla daba ia) |
| Registro de contratos | Usuario | — | entrada | Usuario |
| | Agente | — | ia | Regla |
| | Validación y confirmación | true | codigo ⚠️ | Regla confirmada: validar y pedir confirmación lo hace el código |
| | Registro | true | codigo | Regla |
| MCP mesa de ayuda | Agente | — | ia | Regla |
| | buscar · resumir | — | ia | Regla |
| | preparar → comprobante | true | codigo | Regla |
| | crear con aprobación | true | codigo ⚠️ | Regla confirmada: no hay evidencia de un paso humano propio, así que no se afirma más |
| TRIO | Cliente WhatsApp | — | entrada | Canal y usuario |
| | Motor de IA | — | ia | Regla |
| | Catálogo y CRM | true | codigo | Regla |
| | Asesor humano | — | humano | Persona |

## Estilo de humano

Aprobado por Mario (CA4): borde punteado de 1.5 px en `--ok` (implementado como `dashed`), sin relleno y
con el texto en `--ink`. El trazo discontinuo lo distingue de los otros tres tipos, que llevan borde
continuo, sin depender del color.

Contraste de los bordes nuevos (no textuales, mínimo 3:1):

| Borde | Oscuro (sobre `--surface` / `--bg`) | Claro (sobre `--surface` / `--bg`) |
|---|---|---|
| `--ok`, humano | 8.88 / 9.56 | 6.31 / 5.84 |
| `--muted`, entrada | 6.56 / 7.07 | 6.25 / 5.79 |

El texto de los pasos no cambia: sigue en `--ink`.

## Decisiones

- **Validación en lugar de `@astrojs/check`** (aprobado por Mario): el build falla por la validación de
  `src/data/agentes.ts` descrita en CA1, sin añadir dependencias.

## Pendiente (fuera de alcance)

- Verificar si Cine Demo usa de verdad "Model Armor" (texto del paso del flujo y del stack). No se cambia en este spec.
