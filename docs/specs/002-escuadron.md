# 002 · Ficha del Escuadrón de agentes

Nuevo agente en `src/data/agentes.ts`; la portada y `/agentes/<slug>` se generan solas.
La CSP de `public/_headers` no admite estilos ni scripts en línea (spec 001).
Este spec se escribe antes de implementar; cada criterio es verificable.

## Criterios de aceptación

**CA1. Orden.** Nuevo agente con slug `escuadron`, primero en el arreglo `agentes` y por tanto
primero en la portada.
- Verificación: la primera tarjeta de `dist/index.html` enlaza a `/agentes/escuadron`.

**CA2. Texto exacto.** El texto es exactamente el del bloque de contenido aprobado (abajo), repartido
en los campos existentes de `Agente`. Si falta un campo, se detiene el trabajo y se propone el cambio
de tipo antes de hacerlo. No se toca ningún otro agente.
- Verificación: cada frase del contenido aparece literal en `dist/agentes/escuadron/index.html`
  (salvo escapes HTML) y `git diff` no modifica los objetos de otros agentes.

**CA3. Nota de reserva en la ficha.** La nota de reserva se ve en `/agentes/escuadron`, no solo en la portada.
- Verificación: el texto de la nota aparece en `dist/agentes/escuadron/index.html` y en la captura de la ficha.

**CA4. Sin divulgación de infraestructura.** Antes de construir y después, `src/` y `dist/` no contienen
identificadores de infraestructura (servidor, proveedor, ubicación, herramientas de red y secretos,
IDs de chat, dominios internos, rutas del sistema, nombres de unidades y versiones). La lista de
patrones no se guarda en el repositorio; el grep se corre desde la terminal.
- Verificación: verificación de identificadores de infraestructura: sin coincidencias.

**CA5. Build y código en línea.** `pnpm build` termina sin error, `pnpm audit` sin vulnerabilidades y en
`dist/**/*.html` no hay `<style`, ` style=` ni atributos ` on[a-z]+=` (igual que CA3 del spec 001).

**CA6. Revisión visual.** Capturas a 390 px de ancho y en escritorio de la tarjeta en la portada y de la
ficha completa. Rutas de las capturas en el informe final (fuera del repo).

**CA7. Gate r02.** `git worktree` limpio en otra carpeta; se lanza el subagente `auditor-seguridad`
sobre ella. Enfoque adicional: divulgación de información (¿algo del texto ayuda a atacar el sistema
descrito?). Informe literal en `docs/gates/r02.md` con disposición por hallazgo.

## Fuera de alcance

Página `/patrones`, ficha del MCP de mesa de ayuda, diagramas, imagen OG, cambios en otros agentes.

## Contenido aprobado

- **Nombre:** Escuadrón de agentes
- **Resumen corto (tarjeta):** Un equipo de agentes autónomos que trabaja en un servidor propio:
  coordina por Telegram, investiga, abre pull requests y reporta. Cada agente tiene solo el
  permiso que necesita y nada llega a producción sin auditoría.
- **Fecha / contexto:** Proyecto propio · en producción desde octubre de 2026
- **Estado:** 3 agentes en producción (coordinador, desarrollo, investigación). Un cuarto, que
  envía correo, está diseñado y auditado, sin instalar.

**Qué hace**
- El coordinador recibe ideas por Telegram y las convierte en tareas (Issues de GitHub).
- Solo yo marco una tarea como lista para un agente. Esa marca es la compuerta.
- El agente de investigación toma una tarea por turno y entrega su resultado como pull
  request. El de desarrollo trabaja en una rama y abre su pull request. Yo reviso y fusiono.

**Decisiones de arquitectura**
- Los roles son sombreros; los usuarios son jaulas. Cada nivel de permiso es un usuario del
  sistema operativo, sin sudo y sin acceso a los demás. Cada agente tiene su propio token
  con el alcance mínimo.
- Lista permitida de herramientas. El coordinador puede leer, buscar y crear tareas, pero
  no ejecutar comandos, escribir archivos ni marcar tareas para los agentes. Lo que no
  tiene permitido, lo pide.
- Todo texto que viene de un agente es entrada no confiable. Al agente de investigación
  solo le llega el número de la tarea, validado; el resto lo lee él mismo.
- Prechequeo sin IA: si no hay trabajo, el modelo no se despierta.
- Lo que sale a terceros lo envía código, no el modelo. El agente de correo es un script
  determinista con plantillas fijas, validación de cada campo, topes diarios y un freno
  manual. Cada lista se aprueba fila por fila antes de enviarse.
- Quien construye no se audita. Todo cambio con privilegios pasa por un auditor en una
  sesión aparte, sin herramientas de escritura ni acceso a internet.

**Números**
- 12 rondas de auditoría; 8 rechazadas antes de aprobar. El gate no es un trámite.
- 0 agentes con sudo.

**Stack:** Claude Code en modo headless · Linux endurecido · systemd y cron · Bash ·
Python (biblioteca estándar) para el envío de correo · GitHub Issues y pull requests como
cola de trabajo · Telegram.

**Nota de reserva:** El código es privado. Por seguridad no publico la configuración del
servidor, las rutas, los permisos exactos ni los hallazgos que siguen abiertos; los
hallazgos se cuentan cuando están cerrados. El detalle técnico lo muestro en entrevista.

## Reparto en campos

Aprobado por Mario antes de cambiar el tipo (CA2):

- Cambio de tipo: `queHace?: string[]` opcional; la ficha lo muestra en la sección "Qué hace",
  antes del flujo. La tarjeta de la portada no cambia.
- `titulo`, `contexto`, `estado`, `resumen`, `decisiones` (6), `stack`, `nota`: literales del contenido.
- `metricas`: 12 · "rondas de auditoría"; 8 · "rechazadas antes de aprobar: el gate no es un trámite";
  0 · "agentes con sudo". La frase del gate va pegada a la etiqueta de la métrica de 8, por decisión
  de Mario (el contador solo anima el número; la etiqueta admite texto).
- `flujo` (aprobado literal): Telegram → Coordinador → Tarea → Compuerta humana → Agente →
  Pull request → Revisión humana. Coordinador y Agente son IA; Tarea, Compuerta humana, Pull request y
  Revisión humana son deterministas (`det`); Telegram es entrada y, como en los demás agentes, va sin `det`.
- `tags` (aprobados literal): Multiagente · Mínimo privilegio · Gates de auditoría · Claude Code.
- Los títulos de sección de la ficha ("Decisiones de diseño", "Evidencia") son de la plantilla común y no cambian.

### Ajustes de texto posteriores al gate r02

Aprobados por Mario al aprobar el spec; modifican CA2 (el texto ya no es en todo idéntico al contenido
aprobado de arriba):

1. `estado`: "3 agentes activos".
2. La decisión del agente de correo termina: "...Cada lista se aprueba fila por fila antes de enviarse.
   Está diseñado y auditado; aún sin instalar."
3. `stack`: sin punto final, igual que en los demás agentes.
4. `SECURITY.md`, en Medidas: "En este repo solo se publican los gates del sitio. Los gates de otros
   sistemas no se publican."
