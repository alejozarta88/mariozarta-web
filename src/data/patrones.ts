import { agentes } from './agentes';

export type Carril = 'ia' | 'codigo' | 'humano';
export const CARRILES: readonly Carril[] = ['ia', 'codigo', 'humano'];

export interface Patron {
  slug: string;
  nombre: string;
  problema: string;
  decision: string;
  carril: Carril;
  agentes: string[];
  nota?: Record<string, string>;
  extra?: { texto: string; url: string };
}

export const patrones: Patron[] = [
  {
    slug: 'confirmacion-fuera-del-modelo',
    nombre: 'Confirmación fuera del alcance del modelo',
    problema:
      'si el modelo puede confirmar una compra, un mensaje bien armado puede hacer que la confirme sin que el cliente la haya pedido.',
    decision: 'la confirmación no está expuesta como herramienta del agente. Ocurre en código, cuando el pago se aprueba.',
    carril: 'codigo',
    agentes: ['cine-demo'],
  },
  {
    slug: 'dominio-determinista',
    nombre: 'Dominio determinista para dinero y reglas',
    problema: 'un modelo que calcula precios o impuestos puede equivocarse, y en dinero no hay error aceptable.',
    decision:
      'precio, impuestos y reglas de negocio viven solo en el dominio. El modelo recibe el resultado y lo comunica; nunca lo produce.',
    carril: 'codigo',
    agentes: ['cine-demo'],
  },
  {
    slug: 'reserva-atada-al-pago',
    nombre: 'La reserva vive lo mismo que el pago',
    problema:
      'dos clientes pueden pedir la misma silla a la vez, y una reserva sin pagar puede bloquearla para siempre.',
    decision:
      'concurrencia optimista para que solo una reserva gane y un bloqueo que dura exactamente lo mismo que el enlace de pago.',
    carril: 'codigo',
    agentes: ['cine-demo'],
  },
  {
    slug: 'salida-a-terceros-por-codigo',
    nombre: 'Lo que sale a terceros lo envía código',
    problema: 'un modelo que escribe directamente a clientes puede enviar algo que nadie aprobó.',
    decision:
      'los envíos los hace un script determinista con plantillas fijas, validación de cada campo, topes y freno manual. Cada lista se aprueba fila por fila.',
    carril: 'codigo',
    agentes: ['escuadron'],
    nota: { escuadron: 'diseñado y auditado; aún sin instalar' },
  },
  {
    slug: 'revisor-sin-contexto',
    nombre: 'Revisor independiente sin contexto',
    problema: 'quien construye no ve sus propios errores, y un agente tampoco.',
    decision:
      'un segundo agente revisa sin el contexto de quien escribió, solo con lo que está en disco, y su informe queda escrito.',
    carril: 'ia',
    agentes: ['extractor-facturas', 'escuadron'],
    extra: {
      texto: 'y este sitio: sus informes de auditoría son públicos',
      url: 'https://github.com/alejozarta88/mariozarta-web/tree/main/docs/gates',
    },
  },
  {
    slug: 'entrada-no-confiable',
    nombre: 'Toda entrada externa es dato, no orden',
    problema: 'el texto que llega de afuera puede traer instrucciones escondidas para el modelo.',
    decision:
      'a cada agente le llega lo mínimo, validado (por ejemplo, solo el número de una tarea), y el resto lo lee él mismo como dato.',
    carril: 'codigo',
    agentes: ['escuadron'],
  },
  {
    slug: 'un-permiso-por-agente',
    nombre: 'Un permiso por agente',
    problema: 'un agente con más permisos de los que necesita convierte cualquier error en un incidente.',
    decision:
      'cada nivel de permiso es un usuario aislado, con token propio de alcance mínimo y una lista permitida de herramientas. Lo que no tiene permitido, lo pide.',
    carril: 'codigo',
    agentes: ['escuadron'],
  },
  {
    slug: 'humano-compuerta',
    nombre: 'El humano es la compuerta',
    problema: 'un sistema autónomo sin compuertas decide cosas que nadie revisó.',
    decision: 'una persona decide qué se construye, qué trabajo se habilita y qué se fusiona.',
    carril: 'humano',
    agentes: ['escuadron', 'extractor-facturas', 'trio'],
  },
];

// Igual que en agentes.ts: un patrón mal enlazado detiene el build aquí.
const slugs = new Set(agentes.map((a) => a.slug));
for (const p of patrones) {
  if (!CARRILES.includes(p.carril)) {
    throw new Error(`Patrón "${p.slug}": carril no válido (${String(p.carril)})`);
  }
  for (const s of [...p.agentes, ...Object.keys(p.nota ?? {})]) {
    if (!slugs.has(s)) throw new Error(`Patrón "${p.slug}": el agente "${s}" no existe en agentes.ts`);
  }
}

export const patronesDe = (slug: string) => patrones.filter((p) => p.agentes.includes(slug));
