import { FPS, Fase } from "../theme";

// Clips con la voz del usuario, uno detrás de otro (inicio y duración en frames).
export const clips = {
  video1: { src: "clips/video1.mp4", inicio: 0, duracion: 134 },
  video2: { src: "clips/video2.mp4", inicio: 134, duracion: 196 },
  video3: { src: "clips/video3.mp4", inicio: 330, duracion: 489 },
  video4: { src: "clips/video4.mp4", inicio: 819, duracion: 242 },
} as const;

export type ClipId = keyof typeof clips;

// Cierre: la llamada a la acción se queda 1 s más después de la voz.
export const COLA = 30;
export const DURACION_TOTAL = clips.video4.inicio + clips.video4.duracion + COLA;
export const CAMBIO_DE_FASE = clips.video3.inicio;

// Un tramo de voz: [inicio, fin] en segundos dentro del clip, y lo que se dice.
// Las palabras entre *asteriscos* son palabras clave.
type Tramo = [number, number, string];

export type Visual =
  | { tipo: "contador"; valor: number; etiqueta: string }
  | { tipo: "etiquetas"; items: string[]; alerta: string }
  | { tipo: "demo"; paso: 1 | 2 | 3 }
  | { tipo: "anillo" }
  | { tipo: "cta"; palabra: string };

export type Escena = {
  id: string;
  seccion: string;
  paso: number;
  fase: Fase;
  clip: ClipId;
  desde: number; // segundos dentro del clip donde empieza la escena
  hasta: number; // segundos dentro del clip donde termina la escena
  tramos: Tramo[];
  visual: Visual;
};

export const escenas: Escena[] = [
  {
    id: "01",
    seccion: "gancho",
    paso: 1,
    fase: "clara",
    clip: "video1",
    desde: 0,
    hasta: 4.47,
    tramos: [
      [0.26, 1.67, "Revisé *23 planos* técnicos"],
      [2.25, 3.06, "y no lo hice solo."],
      [3.3, 4.27, "¿La *IA* puede revisar planos?"],
    ],
    visual: { tipo: "contador", valor: 23, etiqueta: "planos técnicos revisados" },
  },
  {
    id: "02",
    seccion: "problema",
    paso: 2,
    fase: "clara",
    clip: "video2",
    desde: 0,
    hasta: 6.53,
    tramos: [
      [0.33, 2.2, "Revisar dibujos es muy *largo*:"],
      [2.2, 4.6, "toma medidas, cotas, acotaciones, cajetines…"],
      [4.6, 5.96, "toma *muchas horas*."],
    ],
    visual: {
      tipo: "etiquetas",
      items: ["medidas", "cotas", "acotaciones", "cajetines"],
      alerta: "muchas horas",
    },
  },
  {
    id: "03",
    seccion: "paso 1",
    paso: 3,
    fase: "oscura",
    clip: "video3",
    desde: 0,
    hasta: 5.5,
    tramos: [
      [0.0, 0.43, "Entonces,"],
      [0.81, 2.97, "implementé *tres pasos* clave."],
      [3.36, 5.23, "Uno: hice un *repositorio* de todas las tareas."],
    ],
    visual: { tipo: "demo", paso: 1 },
  },
  {
    id: "04",
    seccion: "paso 2",
    paso: 4,
    fase: "oscura",
    clip: "video3",
    desde: 5.5,
    hasta: 10.6,
    tramos: [
      [5.84, 8.92, "Dos: le di una *guía clara* y detallada"],
      [9.07, 10.59, "de cómo tiene que revisar."],
    ],
    visual: { tipo: "demo", paso: 2 },
  },
  {
    id: "05",
    seccion: "paso 3",
    paso: 5,
    fase: "oscura",
    clip: "video3",
    desde: 10.6,
    hasta: 16.3,
    tramos: [
      [10.6, 11.89, "Tres: después de cada revisión"],
      [12.3, 15.98, "me enviaba un *documento* con los detalles que había encontrado."],
    ],
    visual: { tipo: "demo", paso: 3 },
  },
  {
    id: "06",
    seccion: "resultado",
    paso: 6,
    fase: "oscura",
    clip: "video4",
    desde: 0,
    hasta: 3.9,
    tramos: [
      [0.13, 0.74, "Así que ya está:"],
      [1.03, 3.72, "todo un día de trabajo en *menos de una hora*."],
    ],
    visual: { tipo: "anillo" },
  },
  {
    id: "07",
    seccion: "cta",
    paso: 7,
    fase: "oscura",
    clip: "video4",
    desde: 3.9,
    hasta: 8.07 + COLA / FPS,
    tramos: [
      [4.09, 5.48, "Escribe la palabra *PROFE*"],
      [5.66, 7.59, "y te mando la guía detallada *paso a paso*."],
    ],
    visual: { tipo: "cta", palabra: "PROFE" },
  },
];

export const PASOS = ["GANCHO", "PROBLEMA", "PASO 1", "PASO 2", "PASO 3", "LOGRO", "PROFE"];

// Frames absolutos (en todo el video) de una escena.
export const inicioEscena = (e: Escena) => clips[e.clip].inicio + Math.round(e.desde * FPS);
export const finEscena = (e: Escena, i: number) =>
  i === escenas.length - 1
    ? DURACION_TOTAL
    : inicioEscena(escenas[i + 1]);

export type Palabra = { texto: string; inicio: number; clave: boolean };

// Reparte cada palabra dentro de su tramo de voz según su largo,
// y devuelve el frame (relativo al inicio de la escena) en que se ilumina.
export const palabrasDe = (e: Escena): Palabra[] => {
  const base = inicioEscena(e);
  const resultado: Palabra[] = [];
  for (const [t0, t1, texto] of e.tramos) {
    const trozos = texto.split(/(\*[^*]+\*)/).filter(Boolean);
    const palabras: { texto: string; clave: boolean }[] = [];
    for (const trozo of trozos) {
      const clave = trozo.startsWith("*");
      for (const p of trozo.replace(/\*/g, "").split(/\s+/).filter(Boolean)) {
        // La puntuación suelta (": . …") se pega a la palabra anterior.
        if (/^[.,:;!?…]+$/.test(p) && palabras.length > 0) {
          palabras[palabras.length - 1].texto += p;
        } else {
          palabras.push({ texto: p, clave });
        }
      }
    }
    const total = palabras.reduce((s, p) => s + p.texto.length + 1, 0);
    let acumulado = 0;
    for (const p of palabras) {
      const t = t0 + ((t1 - t0) * acumulado) / total;
      resultado.push({
        ...p,
        inicio: clips[e.clip].inicio + Math.round(t * FPS) - base,
      });
      acumulado += p.texto.length + 1;
    }
  }
  return resultado;
};
