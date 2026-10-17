# 008 · Hero interactivo "flujo de agentes"

El hero de la portada muestra hoy `Lanes.astro`, un diagrama de dos carriles en bucle. Este spec lo
reemplaza por una escena que se recorre con el scroll: un cursor "arquitecto" arma el flujo, alguien
conversa con el agente y luego intenta saltarse las reglas. La referencia visual y de comportamiento es
`docs/specs/008-referencia.html`, un prototipo con script y estilos en línea que no se copia tal cual:
se reproduce dentro de las reglas del sitio (CSP sin `'unsafe-inline'`, tokens de diseño, sin
dependencias).
Este spec se escribe antes de implementar; cada criterio es verificable.

## Criterios de aceptación

**CA1. Componente `src/components/HeroFlujo.astro`**, que reemplaza a `Lanes.astro` en el hero de
`src/pages/index.astro`.
- El titular, la etiqueta superior y el CTA del hero pasan al componente. El párrafo de presentación y la
  fila de credenciales quedan en `index.astro`, después de la escena.
- Si `Lanes.astro` ya no se usa en ninguna parte, se borra.
- Verificación: `grep -r Lanes src` sin resultados.

**CA2. Datos tipados.** Nodos, cables y disposiciones salen de `src/data/heroFlujo.ts`, que usa los tipos
de paso existentes (`Paso` y `TipoPaso`, de `src/data/agentes.ts`).
- Nodos: WhatsApp (`entrada`), Agente (`ia`), Compuerta (`codigo`), Reserva (`codigo`), Persona (`humano`).
- Cables: entrada→agente, agente→compuerta, compuerta→reserva, compuerta→persona.
- Colores con los tokens del sitio (`global.css`): IA en `--ai`, código en `--gold`, humano en `--ok` con
  borde punteado, entrada en `--muted`. El rojo del bloqueo se agrega como tokens `--bad` y `--bad-dim`,
  con variante para el tema claro. Nada de colores escritos a mano en el componente.
- El HTML y el script leen el mismo módulo de datos: no hay una segunda copia de nodos ni textos.

**CA3. Textos literales**, iguales a la referencia:
- Titular: "El modelo conversa. El código decide."
- Leyendas: "Desliza para ver cómo diseño un agente.", "**1 · Construir.** Diseño el flujo: qué hace el
  modelo y qué decide el código.", "**2 · Conversar.** Alguien le escribe al agente.", "**3 · Defender.**
  Alguien intenta saltarse las reglas." y "El modelo propone. El código decide. **Sube para rebobinar.**"
- Los seis mensajes del chat, con sus notas "✓ confirmado por código, no por el modelo" y "✓ una persona
  revisa el caso".
- Subtextos de los nodos: "36.000+IVA=42.840", "bloqueo 30 min", "BLOQUEADO" y "revisa el caso".
- CTA "Ver cómo diseño agentes", que enlaza a `/arquitectura/`.
- Leyenda pequeña en mono: "Escena ilustrativa".
- La etiqueta superior conserva la del sitio ("Arquitecto de soluciones de IA · Bogotá").
- En la escena quieta (CA5), "Sube para rebobinar." y la pista "Desliza" no se muestran, porque no hay
  nada que rebobinar.

**CA4. Mecánica.**
- Pista sticky de `350vh` (`320vh` hasta 760 px de ancho), con tres fases: construir (el cursor
  "arquitecto" pone los nodos y tira los cables), conversar y defender. Todo es reversible al subir.
- La línea de tiempo es relativa a la pista (`p` = avance ÷ (alto de la pista − alto del viewport)), así
  que al acortarla las tres fases conservan sus proporciones sin cambiar constantes: construir 0,06–0,42
  (36 %), conversar 0,44–0,71 (27 %) y defender 0,71–0,92 (21 %) del recorrido. Con 350vh el recorrido es de
  250vh, y con 320vh de 220vh.
- Un solo `requestAnimationFrame`, con el suavizado `actual += (objetivo - actual) * 0.115`. Se detiene
  cuando `actual` y `objetivo` coinciden y vuelve a arrancar con `scroll` o `resize`.
- La luz que sigue al puntero y el paralaje solo corren con `(pointer: fine)` y usan el mismo bucle.
- Dos disposiciones del SVG: ancha (700 × 320) y alta (400 × 290, hasta 760 px). Las dos se renderizan en
  el HTML y una media query muestra la que toca; el script anima solo la visible y cambia al cruzar 760 px.

**CA5. Estado final siempre presente.**
- El HTML de Astro renderiza la escena final completa: todos los nodos, los cables y el chat lleno.
- El script solo activa el scrub si se cumplen `prefers-reduced-motion: no-preference`,
  `navigator.connection` sin `saveData` y un `effectiveType` que no sea `2g` ni `slow-2g`. Si no se
  cumplen, o si no hay JS, la pista mide `auto` y se ve la escena final quieta.
- Para que no haya un destello de la escena final antes de que cargue el script, el estado inicial del
  scrub se aplica por CSS con `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`.
  Si luego el script decide no animar, agrega la clase `still` y vuelve la escena final. Un navegador sin
  soporte de `scripting` ve siempre la escena quieta.

**CA6. CSP intacta.**
- No se toca `public/_headers`.
- `dist/` sin `<style>`, sin atributos `style=`, sin `on*=` y sin `<script>` con contenido. El script va a
  `/_astro/*.js`.
- Los valores dinámicos se ponen con `style.setProperty`, `setAttribute` o `classList`. No se usa
  `innerHTML`: la leyenda con negrita se arma con nodos del DOM y `textContent`.

**CA7. Accesibilidad.**
- Cada SVG lleva `role="img"` y un `aria-label` que describe el flujo, con los datos que muestran sus
  textos (total, bloqueo, revisión de una persona).
- El chat no usa `aria-live`, porque leería cada mensaje durante el scroll. Sus mensajes están en el DOM
  desde el inicio.
- El CTA tiene foco visible y se muestra al recibir el foco aunque la escena no haya llegado al final.
- Ningún texto queda solo dentro del SVG sin su equivalente legible.

**CA8. Peso y rendimiento.**
- Cero dependencias nuevas. El JS del componente pesa ≤ 10 KB sin comprimir.
- Lighthouse para celular: Performance ≥ 95, CLS < 0,01, y el LCP es el `h1` y no el SVG.

**CA9. Responsive** a 390 × 800 y 1280 × 800: sin scroll horizontal y con las burbujas del chat
completas (`.msg` con `flex-shrink: 0`).
- Capturas en los puntos 0, 0,3, 0,68, 0,88 y 1 de la pista, en los dos tamaños, con el Chrome lanzado con
  `--remote-debugging-port=0` como en `scripts/og.mjs`. Se guardan fuera del repo.

**CA10. Calidad.** `pnpm build` limpio, `pnpm audit` sin vulnerabilidades y las comprobaciones de código en
línea sobre `dist/` en limpio, como en los gates anteriores.

**CA11. Gate r08.** El subagente `auditor-seguridad` corre sobre un `git worktree` limpio, sin más
contexto que la ruta. Su informe se guarda literal en `docs/gates/r08.md`, con una disposición por
hallazgo. El worktree se borra al terminar.

## Notas de ajuste (antes del commit, aprobadas por Mario)

- **Credenciales en la escena.** La fila `.who` pasa de `index.astro` al encabezado de la escena, debajo
  del `h1`, en una línea en mono (12 px; 11 px hasta 760 px de ancho). En el celular puede envolver a dos
  líneas, siempre que el SVG y el chat sigan cabiendo en `100dvh` a 390 × 800. El párrafo `.lede` queda
  después de la escena. Esto modifica el CA1: en `index.astro` queda solo el párrafo de presentación.
- **Un solo CTA.** `dist/index.html` tiene un único enlace a `/arquitectura/` ("Ver cómo diseño agentes").
  El CTA anterior, "Cómo diseño agentes →", ya no existe. El enlace "Arquitectura" de la navegación
  (`/arquitectura`) es navegación, no un CTA.

## Fuera de alcance

Video, cambios a la OG, `/en`, otras páginas, autoalojar fuentes (D2), encabezados nuevos (D3), CI (D4),
caché en `_headers` (D5) y librerías de animación.
`docs/specs/008-referencia.html` entra en el commit como referencia; vive en `docs/` y no llega a `dist/`.
