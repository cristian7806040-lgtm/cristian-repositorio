import React from "react";
import { OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MARGEN, Tema } from "../theme";

export const CLIP = { x: MARGEN, y: 720, w: 405, h: 720 };

// Clip del usuario dentro de una tarjeta (zona del visual central, a la izquierda).
export const ClipFrame: React.FC<{
  src: string;
  tema: Tema;
  entrada?: boolean;
  muted?: boolean;
}> = ({ src, tema, entrada = false, muted = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = entrada ? spring({ frame, fps, config: { damping: 12 } }) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: CLIP.x,
        top: CLIP.y,
        width: CLIP.w,
        height: CLIP.h,
        borderRadius: 24,
        overflow: "hidden",
        border: `3px solid ${tema.border}`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
        transform: `scale(${0.85 + 0.15 * s})`,
        opacity: s,
      }}
    >
      <OffthreadVideo
        src={staticFile(src)}
        muted={muted}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

// El mismo clip en un círculo pequeño, encima de la demostración.
export const ClipCircle: React.FC<{ src: string; tema: Tema }> = ({ src, tema }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 745,
        top: 1150,
        width: 290,
        height: 290,
        borderRadius: 145,
        overflow: "hidden",
        border: `6px solid ${tema.accent}`,
        boxShadow: `0 0 40px ${tema.accent}80`,
        transform: `scale(${s})`,
      }}
    >
      <OffthreadVideo
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 28%" }}
      />
    </div>
  );
};
