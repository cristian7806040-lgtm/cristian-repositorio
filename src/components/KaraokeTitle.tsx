import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Palabra } from "../data/escenas";
import { Fase, fonts, MARGEN, temaDe } from "../theme";

// Titular con efecto karaoke: cada palabra se ilumina cuando se dice.
export const KaraokeTitle: React.FC<{ palabras: Palabra[]; fase: Fase }> = ({
  palabras,
  fase,
}) => {
  const frame = useCurrentFrame();
  const tema = temaDe(fase);
  const tamano = palabras.length > 12 ? 68 : 78;

  return (
    <div
      style={{
        position: "absolute",
        top: 230,
        left: MARGEN,
        width: 960,
        fontFamily: fonts.sans,
        fontWeight: 800,
        fontSize: tamano,
        lineHeight: 1.08,
        letterSpacing: -1.5,
        color: tema.text,
      }}
    >
      {palabras.map((p, i) => {
        const opacidad = interpolate(frame, [p.inicio, p.inicio + 4], [0.15, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const encendida = frame >= p.inicio;
        const estiloClave: React.CSSProperties =
          fase === "clara"
            ? {
                fontFamily: fonts.serif,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: tamano * 1.1,
                letterSpacing: 0,
                color: encendida ? tema.accent : tema.text,
              }
            : {
                color: encendida ? tema.accent : tema.text,
                textShadow: encendida ? `0 0 30px ${tema.accent}66` : "none",
              };
        return (
          <span
            key={i}
            style={{
              opacity: opacidad,
              marginRight: "0.24em",
              display: "inline-block",
              ...(p.clave ? estiloClave : {}),
            }}
          >
            {p.texto}
          </span>
        );
      })}
    </div>
  );
};
