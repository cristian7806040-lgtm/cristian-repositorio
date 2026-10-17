import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fuentes guardadas en public/fonts (no dependen de internet al renderizar).
const fuente = (family: string, archivo: string, weight: string, style = "normal") =>
  loadFont({ family, url: staticFile(`fonts/${archivo}`), weight, style });

fuente("Inter", "inter-latin-700-normal.woff2", "700");
fuente("Inter", "inter-latin-800-normal.woff2", "800");
fuente("Instrument Serif", "instrument-serif-latin-400-italic.woff2", "400", "italic");
fuente("JetBrains Mono", "jetbrains-mono-latin-400-normal.woff2", "400");
fuente("JetBrains Mono", "jetbrains-mono-latin-700-normal.woff2", "700");
fuente("Archivo Black", "archivo-black-latin-400-normal.woff2", "400");

export const fonts = {
  sans: "Inter",
  serif: "Instrument Serif",
  mono: "JetBrains Mono",
  black: "Archivo Black",
};

export type Tema = {
  bg: string;
  card: string;
  text: string;
  accent: string;
  muted: string;
  border: string;
};

export const light: Tema = {
  bg: "#F1EEE8",
  card: "#FFFFFF",
  text: "#151515",
  accent: "#E0412F",
  muted: "rgba(21,21,21,0.15)",
  border: "#E4E0D8",
};

export const dark: Tema = {
  bg: "#121212",
  card: "#1C1C1C",
  text: "#FFFFFF",
  accent: "#FFD93B",
  muted: "rgba(255,255,255,0.15)",
  border: "#2A2A2A",
};

export const status = { ok: "#2FBF71", error: "#E5483B" };
export const mascot = {
  body: "#6B4BFF",
  eyes: "#3FE0E0",
  antenna: "#FFD93B",
  cape: "#E0412F",
};

export type Fase = "clara" | "oscura";
export const temaDe = (fase: Fase) => (fase === "clara" ? light : dark);

export const FPS = 30;
export const MARGEN = 45;
export const USUARIO = "@cristian";
