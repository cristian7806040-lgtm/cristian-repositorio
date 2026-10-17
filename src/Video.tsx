import React from "react";
import { AbsoluteFill, Freeze, interpolateColors, Sequence, useCurrentFrame } from "remotion";
import { ClipCircle, ClipFrame } from "./components/ClipFrame";
import { KaraokeTitle } from "./components/KaraokeTitle";
import { Mascot } from "./components/Mascot";
import { ProgressFlow } from "./components/ProgressFlow";
import { TopBar } from "./components/TopBar";
import {
  CommentCTA,
  Contador,
  DemoCard,
  Etiquetas,
  PasosChips,
  RingProgress,
  Stamp,
} from "./components/Visuales";
import {
  CAMBIO_DE_FASE,
  clips,
  COLA,
  Escena,
  escenas,
  finEscena,
  inicioEscena,
  palabrasDe,
  PASOS,
} from "./data/escenas";
import { dark, light, temaDe } from "./theme";

// Duración real de la demostración (20,7 s) repartida sobre la voz del video 3 (16,3 s).
const VELOCIDAD_DEMO = 20.71 / 16.29;

const VisualEscena: React.FC<{ e: Escena }> = ({ e }) => {
  const tema = temaDe(e.fase);
  const v = e.visual;
  switch (v.tipo) {
    case "contador":
      return <Contador tema={tema} valor={v.valor} etiqueta={v.etiqueta} />;
    case "etiquetas":
      return <Etiquetas tema={tema} items={v.items} alerta={v.alerta} />;
    case "demo":
      return (
        <>
          <PasosChips tema={tema} activo={v.paso} />
          {v.paso === 3 && <Stamp texto="APROBADO" delay={40} />}
        </>
      );
    case "anillo":
      return <RingProgress tema={tema} />;
    case "cta":
      return <CommentCTA tema={tema} palabra={v.palabra} />;
  }
};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const indice = Math.max(
    0,
    escenas.filter((e) => frame >= inicioEscena(e)).length - 1,
  );
  const actual = escenas[indice];
  const fase = frame >= CAMBIO_DE_FASE ? "oscura" : "clara";

  // Cambio de fase: el fondo funde a gris y luego a negro en 10 frames.
  const fondo = interpolateColors(
    frame,
    [CAMBIO_DE_FASE - 10, CAMBIO_DE_FASE - 5, CAMBIO_DE_FASE],
    [light.bg, "#8F8F8F", dark.bg],
  );

  const { video1, video2, video3, video4 } = clips;

  return (
    <AbsoluteFill style={{ background: fondo }}>
      {/* Clips del usuario (con su voz) */}
      <Sequence from={video1.inicio} durationInFrames={video1.duracion}>
        <ClipFrame src={video1.src} tema={light} entrada />
      </Sequence>
      <Sequence from={video2.inicio} durationInFrames={video2.duracion}>
        <ClipFrame src={video2.src} tema={light} />
      </Sequence>
      <Sequence from={video3.inicio} durationInFrames={video3.duracion}>
        <DemoCard tema={dark} playbackRate={VELOCIDAD_DEMO} />
        <ClipCircle src={video3.src} tema={dark} />
      </Sequence>
      <Sequence from={video4.inicio} durationInFrames={video4.duracion}>
        <ClipFrame src={video4.src} tema={dark} entrada />
      </Sequence>
      <Sequence from={video4.inicio + video4.duracion} durationInFrames={COLA}>
        <Freeze frame={video4.duracion - 1}>
          <ClipFrame src={video4.src} tema={dark} muted />
        </Freeze>
      </Sequence>

      {/* Escenas: titular karaoke + visual */}
      {escenas.map((e, i) => (
        <Sequence
          key={e.id}
          from={inicioEscena(e)}
          durationInFrames={finEscena(e, i) - inicioEscena(e)}
        >
          <KaraokeTitle palabras={palabrasDe(e)} fase={e.fase} />
          <VisualEscena e={e} />
        </Sequence>
      ))}

      {/* Capas fijas */}
      <TopBar
        fase={fase}
        id={actual.id}
        seccion={actual.seccion}
        paso={actual.paso}
        total={PASOS.length}
      />
      <ProgressFlow fase={fase} pasos={PASOS} activo={actual.paso} />
      <Mascot
        x={905}
        y={1440}
        capa={fase === "oscura"}
        expresion={
          actual.seccion === "problema"
            ? "pensando"
            : actual.paso >= 6
              ? "feliz"
              : "normal"
        }
      />
    </AbsoluteFill>
  );
};
