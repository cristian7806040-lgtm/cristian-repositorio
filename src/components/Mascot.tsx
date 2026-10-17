import React from "react";
import { useCurrentFrame } from "remotion";
import { mascot } from "../theme";

export type Expresion = "normal" | "feliz" | "pensando";

// Robot pixel-art original: cuerpo morado, ojos cian, antena amarilla.
export const Mascot: React.FC<{ expresion: Expresion; capa: boolean; x: number; y: number }> = ({
  expresion,
  capa,
  x,
  y,
}) => {
  const frame = useCurrentFrame();
  const flote = Math.sin(frame / 9) * 6;
  const parpadeo = frame % 75 < 4;
  const u = 10;
  const R = (px: number, py: number, w: number, h: number, fill: string) => (
    <rect x={px * u} y={py * u} width={w * u} height={h * u} fill={fill} />
  );
  const oscuro = "#1A1040";

  const ojos =
    expresion === "feliz" ? (
      <>
        {R(2.5, 6.5, 1, 1, mascot.eyes)}
        {R(3.5, 5.5, 1, 1, mascot.eyes)}
        {R(4.5, 6.5, 1, 1, mascot.eyes)}
        {R(6.5, 6.5, 1, 1, mascot.eyes)}
        {R(7.5, 5.5, 1, 1, mascot.eyes)}
        {R(8.5, 6.5, 1, 1, mascot.eyes)}
      </>
    ) : parpadeo ? (
      <>
        {R(3, 6.5, 2, 0.5, mascot.eyes)}
        {R(7, 6.5, 2, 0.5, mascot.eyes)}
      </>
    ) : (
      <>
        {R(3, 5.5, 2, expresion === "pensando" ? 1.2 : 2, mascot.eyes)}
        {R(7, 5.5, 2, 2, mascot.eyes)}
      </>
    );

  const boca =
    expresion === "feliz" ? (
      <>
        {R(4, 7.8, 1, 0.6, oscuro)}
        {R(5, 8.4, 2, 0.6, oscuro)}
        {R(7, 7.8, 1, 0.6, oscuro)}
      </>
    ) : expresion === "pensando" ? (
      R(5, 8.2, 2.5, 0.6, oscuro)
    ) : (
      R(4.5, 8.2, 3, 0.6, oscuro)
    );

  return (
    <div style={{ position: "absolute", left: x, top: y + flote, width: 120, height: 160 }}>
      {/* partículas cuadradas */}
      {[0, 1, 2, 3].map((i) => {
        const t = (frame + i * 22) % 88;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: [-14, 118, 4, 104][i],
              top: 120 - t * 1.4,
              width: 8,
              height: 8,
              background: mascot.antenna,
              opacity: 1 - t / 88,
            }}
          />
        );
      })}
      <svg width={120} height={160} viewBox="0 0 120 160" shapeRendering="crispEdges">
        {capa && <polygon points="25,100 95,100 112,158 8,158" fill={mascot.cape} />}
        {R(5, 0, 2, 2, mascot.antenna)}
        {R(5.5, 2, 1, 1.5, "#4B33C7")}
        {R(1, 3.5, 10, 6, mascot.body)}
        {R(0, 5, 1, 3, "#4B33C7")}
        {R(11, 5, 1, 3, "#4B33C7")}
        {ojos}
        {boca}
        {R(2.5, 10, 7, 4.5, mascot.body)}
        {R(5, 11, 2, 2, mascot.antenna)}
        {R(1, 10.5, 1.5, 3, "#4B33C7")}
        {R(9.5, 10.5, 1.5, 3, "#4B33C7")}
        {R(3, 14.5, 2, 1.5, "#4B33C7")}
        {R(7, 14.5, 2, 1.5, "#4B33C7")}
      </svg>
    </div>
  );
};
