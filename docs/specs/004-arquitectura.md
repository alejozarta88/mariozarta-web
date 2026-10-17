# 004 · Página de arquitectura y patrones

Sitio Astro estático, con pnpm y sin frameworks de UI. Los agentes salen de `src/data/agentes.ts` y el
flujo tiene los tipos entrada/ia/codigo/humano (spec 003). La CSP es estricta y no admite código en
línea (spec 001). Este spec se escribe antes de implementar; cada criterio es verificable.

## Criterios de aceptación

**CA1. Página `/arquitectura`** con las secciones en este orden: tesis, principios, explorador de patrones,
patrones (detalle), arquitectura de software, método y stack. El texto es exactamente el del bloque
"Contenido" (abajo).
- Verificación: cada frase del contenido aparece literal en `dist/arquitectura/index.html` (salvo
  escapes HTML) y los `id` de las secciones aparecen en ese orden.

**CA2. Enlaces de entrada.**
- "Arquitectura" en la navegación de la portada → `/arquitectura`.
- Un enlace destacado bajo el hero: "Cómo diseño agentes →" → `/arquitectura`.
- En cada ficha de agente, la sección "Patrones que aplica", con chips que enlazan a `/arquitectura#<patron>`.
  Se calcula desde `patrones.ts`, y si el agente no tiene patrones la sección no aparece (Registro de
  contratos y MCP de mesa de ayuda).

**CA3. Fuente única** en `src/data/patrones.ts`:
`{ slug, nombre, problema, decision, carril: 'ia' | 'codigo' | 'humano', agentes: string[], nota?, extra? }`.
- `carril` es el tipo dominante y define el color de realce (`ia` = `--ai`, `codigo` = `--gold`,
  `humano` = `--ok` con borde discontinuo, igual que en el spec 003).
- `nota?: Record<slugAgente, string>`: aclaración que se muestra junto al agente (aprobado por Mario).
- `extra?: { texto: string; url: string }`: evidencia que no es un agente (aprobado por Mario).
- Validación en build, igual que en el spec 003: si un slug de `agentes` o una clave de `nota` no existe en
  `agentes.ts`, el build falla con un mensaje que nombra el patrón. Lo mismo si `carril` no es válido.
- El MCP de mesa de ayuda no se enlaza como evidencia de ningún patrón; la validación también lo
  rechaza (`mcp-mesa-ayuda` no puede aparecer en `agentes` ni en `nota`).
- Verificación: prueba negativa en una copia desechable (un slug inexistente hace fallar `pnpm build`
  con el nombre del patrón).

**CA4. Explorador interactivo.**
- Muestra una fila de chips de agentes y una fila de chips de patrones, todos `<button type="button" aria-pressed>`.
- La fila de agentes incluye solo los agentes que tienen patrones: Escuadrón, Cine Demo, Extractor de
  facturas y TRIO (aprobado por Mario).
- Al activar un agente se resaltan sus patrones y se atenúan los demás. Al activar un patrón, lo mismo con
  los agentes. Un segundo toque en el mismo chip limpia la selección, y activar otro chip la reemplaza.
- Funciona con teclado: Tab llega a cada botón, Enter o Espacio lo activa (nativo de `<button>`), y el foco
  se ve. Un texto `aria-live="polite"` anuncia el resultado (p. ej. "Escuadrón: 6 patrones").
- Sin JavaScript, las dos filas de chips y la pista de uso se ocultan (atributo `hidden`, que quita
  el script), porque el detalle de patrones ya muestra todo, sin atenuar (cambio aprobado por Mario).
  La atenuación solo la aplica el script.

**CA5. Efectos.**
- La entrada al hacer scroll reutiliza la clase `.rise` y el observador de `Base.astro`.
- El detalle de cada patrón es expandible con `<details>`/`<summary>`.
- El borde se realza con el color del carril del patrón.
- Con `prefers-reduced-motion: reduce` se apagan las transiciones nuevas (atenuación y realce) y la entrada.
- Nada nuevo se mueve en bucle.

**CA6. Stack.**
- Chips agrupados por categoría, con un ícono genérico de categoría en SVG propio, dentro del
  componente: agente, lenguaje, datos, integración, infraestructura y web.
- Sin logotipos de marca, sin librerías de íconos y sin dependencias nuevas.
- El grupo "Datos" lleva un solo ítem, Jelou Databases (aprobado por Mario). Va tercero, siguiendo
  el orden de CA6.
- Los SVG llevan `aria-hidden="true"` y no usan atributos `style`.

**CA7. Seguridad y calidad.**
- `dist/**/*.html` no tiene `<style`, ` style=`, ` on*=` ni `<script>` con contenido.
- `pnpm build` limpio y `pnpm audit` sin vulnerabilidades.
- Verificación de identificadores de infraestructura (spec 002): sin coincidencias, con los patrones
  solo en la terminal.

**CA8. Capturas.**
- `/arquitectura` a 390 px en claro y en oscuro, con el explorador sin selección y con "escuadron" activo.
- `/arquitectura` a 1440 px.
- Sin scroll horizontal. Rutas en el informe final (fuera del repo).

**CA9. Gate r04.** Se lanza `auditor-seguridad` sobre un `git worktree` limpio. Su informe se guarda
literal en `docs/gates/r04.md`, con una disposición por hallazgo.

## Fuera de alcance

- Cambiar textos de los agentes.
- La ficha del MCP de mesa de ayuda, Model Armor y la imagen OG.
- Enlazar el MCP de mesa de ayuda como evidencia de un patrón.

## Decisiones de presentación (aprobadas por Mario)

- En "Arquitectura de software", los nombres entre paréntesis son enlaces y conservan el mismo texto:
  - Cine Demo → `/agentes/cine-demo`
  - Escuadrón → `/agentes/escuadron`
  - este sitio → `https://github.com/alejozarta88/mariozarta-web`
- El enlace `extra` de revisor-sin-contexto apunta a `https://github.com/alejozarta88/mariozarta-web/tree/main/docs/gates`.
- En el detalle de cada patrón, los agentes enlazan a su ficha.

## Contenido

### Tesis
Título: Cómo diseño agentes

El modelo conversa. El código decide.

Un modelo de lenguaje es muy bueno para entender lo que alguien quiere y muy malo para garantizar
algo. Por eso separo los carriles: el modelo conversa y consulta; el dinero, los datos y las
acciones irreversibles los decide código determinista, con pruebas, y las decisiones importantes
las aprueba una persona.

### Principios
1. El modelo conversa, el código decide. Lo que no se puede deshacer no lo ejecuta el modelo.
2. Mínimo privilegio. Cada agente tiene solo las herramientas y permisos que necesita.
3. Quien escribe no califica. Un revisor sin contexto aprueba o rechaza.
4. Toda entrada externa es dato, no orden. Lo que llega de usuarios, documentos u otros agentes
   no da instrucciones.
5. Spec-first. Sin criterios de aceptación verificables no hay código.

### Patrones

| slug | nombre | carril | agentes |
|---|---|---|---|
| confirmacion-fuera-del-modelo | Confirmación fuera del alcance del modelo | codigo | Cine Demo |
| dominio-determinista | Dominio determinista para dinero y reglas | codigo | Cine Demo |
| reserva-atada-al-pago | La reserva vive lo mismo que el pago | codigo | Cine Demo |
| salida-a-terceros-por-codigo | Lo que sale a terceros lo envía código | codigo | Escuadrón (nota: "diseñado y auditado; aún sin instalar") |
| revisor-sin-contexto | Revisor independiente sin contexto | ia | Extractor de facturas, Escuadrón (extra: "y este sitio: sus informes de auditoría son públicos" → docs/gates) |
| entrada-no-confiable | Toda entrada externa es dato, no orden | codigo | Escuadrón |
| un-permiso-por-agente | Un permiso por agente | codigo | Escuadrón |
| humano-compuerta | El humano es la compuerta | humano | Escuadrón, Extractor de facturas, TRIO |

**Confirmación fuera del alcance del modelo.**
Problema: si el modelo puede confirmar una compra, un mensaje bien armado puede hacer que la confirme
sin que el cliente la haya pedido.
Decisión: la confirmación no está expuesta como herramienta del agente. Ocurre en código, cuando el
pago se aprueba.

**Dominio determinista para dinero y reglas.**
Problema: un modelo que calcula precios o impuestos puede equivocarse, y en dinero no hay error aceptable.
Decisión: precio, impuestos y reglas de negocio viven solo en el dominio. El modelo recibe el resultado
y lo comunica; nunca lo produce.

**La reserva vive lo mismo que el pago.**
Problema: dos clientes pueden pedir la misma silla a la vez, y una reserva sin pagar puede bloquearla
para siempre.
Decisión: concurrencia optimista para que solo una reserva gane y un bloqueo que dura exactamente lo
mismo que el enlace de pago.

**Lo que sale a terceros lo envía código.**
Problema: un modelo que escribe directamente a clientes puede enviar algo que nadie aprobó.
Decisión: los envíos los hace un script determinista con plantillas fijas, validación de cada campo,
topes y freno manual. Cada lista se aprueba fila por fila.

**Revisor independiente sin contexto.**
Problema: quien construye no ve sus propios errores, y un agente tampoco.
Decisión: un segundo agente revisa sin el contexto de quien escribió, solo con lo que está en disco, y
su informe queda escrito.

**Toda entrada externa es dato, no orden.**
Problema: el texto que llega de afuera puede traer instrucciones escondidas para el modelo.
Decisión: a cada agente le llega lo mínimo, validado (por ejemplo, solo el número de una tarea), y el
resto lo lee él mismo como dato.

**Un permiso por agente.**
Problema: un agente con más permisos de los que necesita convierte cualquier error en un incidente.
Decisión: cada nivel de permiso es un usuario aislado, con token propio de alcance mínimo y una lista
permitida de herramientas. Lo que no tiene permitido, lo pide.

**El humano es la compuerta.**
Problema: un sistema autónomo sin compuertas decide cosas que nadie revisó.
Decisión: una persona decide qué se construye, qué trabajo se habilita y qué se fusiona.

### Arquitectura de software
- Hexagonal: el dominio no sabe que existe un agente. (Cine Demo)
- Concurrencia optimista y bloqueos con expiración. (Cine Demo)
- Cola de trabajo basada en tareas, con el estado en etiquetas. (Escuadrón)
- Aislamiento por mínimo privilegio en el sistema operativo. (Escuadrón)
- Sitio estático con fuente única de datos. (este sitio)

### Método
Spec-first con criterios numerados · prueba antes que código · gates de auditoría con informe y
disposición por hallazgo · deuda visible con criterio de cierre · decisiones documentadas con
alternativas (DAR).

### Stack
"El stack es la herramienta; el criterio es lo que transfiere. Estos patrones no dependen del
framework: los implementé con MCP, Claude Code y código propio, y se aplican igual con cualquier SDK
de agentes."

- Agentes e IA: Claude Code · MCP · Jelou Brain Studio
- Lenguajes: TypeScript · Deno · Node.js · Python · Bash
- Datos: Jelou Databases
- Integraciones: Mercado Pago · WhatsApp · Telegram · GitHub
- Infraestructura: Linux · systemd · cron · Cloudflare Pages · Render
- Web: Astro
