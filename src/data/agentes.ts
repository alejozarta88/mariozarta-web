export interface Agente {
  slug: string;
  contexto: string;
  titulo: string;
  estado?: string;
  tags: string[];
  resumen: string;
  queHace?: string[];
  flujo: { texto: string; det?: boolean }[];
  decisiones: string[];
  metricas?: { valor: number; etiqueta: string }[];
  stack: string;
  enlace?: { texto: string; url: string };
  nota?: string;
}

export const agentes: Agente[] = [
  {
    slug: 'escuadron',
    contexto: 'Proyecto propio · en producción desde octubre de 2026',
    titulo: 'Escuadrón de agentes',
    estado: '3 agentes activos',
    tags: ['Multiagente', 'Mínimo privilegio', 'Gates de auditoría', 'Claude Code'],
    resumen:
      'Un equipo de agentes autónomos que trabaja en un servidor propio: coordina por Telegram, investiga, abre pull requests y reporta. Cada agente tiene solo el permiso que necesita y nada llega a producción sin auditoría.',
    queHace: [
      'El coordinador recibe ideas por Telegram y las convierte en tareas (Issues de GitHub).',
      'Solo yo marco una tarea como lista para un agente. Esa marca es la compuerta.',
      'El agente de investigación toma una tarea por turno y entrega su resultado como pull request. El de desarrollo trabaja en una rama y abre su pull request. Yo reviso y fusiono.',
    ],
    flujo: [
      { texto: 'Telegram' },
      { texto: 'Coordinador' },
      { texto: 'Tarea', det: true },
      { texto: 'Compuerta humana', det: true },
      { texto: 'Agente' },
      { texto: 'Pull request', det: true },
      { texto: 'Revisión humana', det: true },
    ],
    decisiones: [
      'Los roles son sombreros; los usuarios son jaulas. Cada nivel de permiso es un usuario del sistema operativo, sin sudo y sin acceso a los demás. Cada agente tiene su propio token con el alcance mínimo.',
      'Lista permitida de herramientas. El coordinador puede leer, buscar y crear tareas, pero no ejecutar comandos, escribir archivos ni marcar tareas para los agentes. Lo que no tiene permitido, lo pide.',
      'Todo texto que viene de un agente es entrada no confiable. Al agente de investigación solo le llega el número de la tarea, validado; el resto lo lee él mismo.',
      'Prechequeo sin IA: si no hay trabajo, el modelo no se despierta.',
      'Lo que sale a terceros lo envía código, no el modelo. El agente de correo es un script determinista con plantillas fijas, validación de cada campo, topes diarios y un freno manual. Cada lista se aprueba fila por fila antes de enviarse. Está diseñado y auditado; aún sin instalar.',
      'Quien construye no se audita. Todo cambio con privilegios pasa por un auditor en una sesión aparte, sin herramientas de escritura ni acceso a internet.',
    ],
    metricas: [
      { valor: 12, etiqueta: 'rondas de auditoría' },
      { valor: 8, etiqueta: 'rechazadas antes de aprobar: el gate no es un trámite' },
      { valor: 0, etiqueta: 'agentes con sudo' },
    ],
    stack: 'Claude Code en modo headless · Linux endurecido · systemd y cron · Bash · Python (biblioteca estándar) para el envío de correo · GitHub Issues y pull requests como cola de trabajo · Telegram',
    nota: 'El código es privado. Por seguridad no publico la configuración del servidor, las rutas, los permisos exactos ni los hallazgos que siguen abiertos; los hallazgos se cuentan cuando están cerrados. El detalle técnico lo muestro en entrevista.',
  },
  {
    slug: 'cine-demo',
    contexto: 'Reto técnico · AI Solutions Engineer · Jelou · oct 2026',
    titulo: 'Cine Demo: taquilla por WhatsApp con pago',
    estado: 'Funciona en vivo',
    tags: ['Brain Studio', 'Jelou Functions', 'MCP', 'Mercado Pago'],
    resumen:
      'El cliente conversa con un agente, ve la cartelera, elige asientos en un mapa y paga sin salir de WhatsApp. Los asientos se bloquean 30 minutos y la venta se confirma solo cuando la pasarela aprueba.',
    flujo: [
      { texto: 'WhatsApp' },
      { texto: 'Agente IA · Model Armor' },
      { texto: '6 herramientas MCP' },
      { texto: 'calcular-total', det: true },
      { texto: 'Mercado Pago', det: true },
      { texto: 'confirmar idempotente', det: true },
    ],
    decisiones: [
      'La herramienta que confirma la venta no está expuesta al modelo: la dispara el flujo tras el pago. Un "cóbrame 1 peso" no tiene a qué herramienta llegar.',
      'Precio e IVA 19 % se calculan solo en el dominio; lo que escriba el usuario se ignora.',
      'Arquitectura hexagonal en un solo despliegue: cambiar la API de datos fue reescribir un adaptador, sin tocar las reglas.',
      'Concurrencia optimista contra la doble venta y deuda técnica escrita con criterio de cierre.',
      'Bloqueo de 30 minutos igual a la vida del enlace de pago: nadie paga por asientos ya liberados.',
    ],
    metricas: [
      { valor: 80, etiqueta: 'pruebas automatizadas, sin red' },
      { valor: 110, etiqueta: 'criterios de aceptación' },
      { valor: 2, etiqueta: 'rondas de auditoría independiente' },
      { valor: 0, etiqueta: 'hallazgos críticos al cierre' },
    ],
    stack: 'Deno · TypeScript · Zod · Jelou Databases · crons · Model Armor',
    nota: 'Repositorio privado durante la evaluación; acceso a solicitud.',
  },
  {
    slug: 'extractor-facturas',
    contexto: 'Taller técnico · Trycore · oct 2026',
    titulo: 'Extractor de facturas, de la spec al pull request',
    estado: 'PR abierto',
    tags: ['Node 22', 'Claude Code', 'Spec-first'],
    resumen:
      'Extrae NIT, fecha y total de facturas en texto. Lo que no se puede leer con seguridad no se inventa: sale con confianza baja y va a revisión humana con el motivo escrito.',
    flujo: [
      { texto: 'Spec' },
      { texto: 'Prueba roja' },
      { texto: 'Código' },
      { texto: 'Agente revisor', det: true },
      { texto: 'Pull request' },
    ],
    decisiones: [
      'El agente revisor encontró que "$ 119.000,00" se leía 100 veces más grande con confianza alta; se corrigió con un criterio nuevo y su prueba antes de cerrar.',
      'La función de extracción no lee archivos ni red: recibe texto y devuelve datos.',
      'Cada criterio de aceptación tiene una prueba que lo nombra; 6 de 6 en verde.',
    ],
    stack: 'Node.js 22 · node:test · Claude Code · subagente revisor',
    enlace: { texto: 'github.com/alejozarta88/taller-spec-a-pr', url: 'https://github.com/alejozarta88/taller-spec-a-pr' },
  },
  {
    slug: 'registro-contratos',
    contexto: 'Reto técnico · AI-Native Product Manager · Periferia IT · sep 2026',
    titulo: 'Agente de registro de contratos',
    estado: 'Calificado 4/5',
    tags: ['TypeScript', 'Herramientas', 'Render'],
    resumen:
      'Agente conversacional que guía el registro de un contrato, confirma los datos con el usuario antes de guardarlos y queda desplegado para probarlo de punta a punta.',
    flujo: [
      { texto: 'Usuario' },
      { texto: 'Agente' },
      { texto: 'Validación y confirmación', det: true },
      { texto: 'Registro', det: true },
    ],
    decisiones: [
      'El agente pide confirmación explícita antes de escribir.',
      'Desplegado en la nube para que el evaluador lo pruebe sin instalar nada.',
    ],
    stack: 'TypeScript · Node.js · Render',
    enlace: { texto: 'github.com/alejozarta88/agente-conversacional', url: 'https://github.com/alejozarta88/agente-conversacional' },
  },
  {
    slug: 'mcp-mesa-ayuda',
    contexto: 'Laboratorio · 2026',
    titulo: 'Servidor MCP para mesa de ayuda',
    tags: ['MCP SDK', 'TypeScript', 'Human-in-the-loop'],
    resumen:
      'Cuatro herramientas para buscar, resumir y crear tickets. Escribir exige dos pasos: preparar y crear con un comprobante, para que una persona apruebe antes de cualquier cambio.',
    flujo: [
      { texto: 'Agente' },
      { texto: 'buscar · resumir' },
      { texto: 'preparar → comprobante', det: true },
      { texto: 'crear con aprobación', det: true },
    ],
    decisiones: [
      'La salida de las herramientas se marca como datos de terceros; un ticket con prompt injection forma parte de las pruebas.',
      'Comprobante SHA-256 entre preparar y crear: lo que se aprueba es exactamente lo que se escribe.',
      'Auditoría de cada escritura en un registro aparte; 9 de 9 pruebas en verde.',
    ],
    stack: 'TypeScript · @modelcontextprotocol/sdk · Zod · Vitest',
  },
  {
    slug: 'trio',
    contexto: 'Línea de producto · HUB Medrar',
    titulo: 'TRIO: ventas conversacionales por WhatsApp',
    tags: ['WhatsApp Business API', 'Agentes', 'CRM'],
    resumen:
      'CRM y ventas conversacionales por WhatsApp para pymes de Latinoamérica, con un motor de IA que atiende, califica y acompaña la venta sobre un catálogo multiproducto.',
    flujo: [
      { texto: 'Cliente WhatsApp' },
      { texto: 'Motor de IA' },
      { texto: 'Catálogo y CRM', det: true },
      { texto: 'Asesor humano' },
    ],
    decisiones: [
      'El agente califica y prepara; la persona del equipo cierra cuando hace falta.',
      'Un solo motor para varios productos, con catálogo propio por cliente.',
    ],
    stack: 'WhatsApp Business API · TypeScript · PostgreSQL',
  },
];
