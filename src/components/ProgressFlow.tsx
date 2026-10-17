import React from "react";
import { Fase, fonts, MARGEN, temaDe } from "../theme";

// Barra de progreso persistente: el paso activo se rellena con el acento.
export const ProgressFlow: React.FC<{ fase: Fase; pasos: string[]; activo: number }> = ({
  fase,
  pasos,
  activo,
}) => {
  const tema = temaDe(fase);
  return (
    <div
      style={{
        position: "absolute",
        top: 1500,
        left: MARGEN,
        width: 820,
        display: "flex",
        gap: 8,
      }}
    >
      {pasos.map((nombre, i) => {
        const hecho = i + 1 < activo;
        const actual = i + 1 === activo;
        return (
          <div key={nombre} style={{ flex: 1 }}>
            <div
              style={{
                height: 10,
                borderRadius: 5,
                background: hecho || actual ? tema.accent : tema.muted,
                opacity: hecho ? 0.55 : 1,
                boxShadow: actual ? `0 0 18px ${tema.accent}AA` : "none",
              }}
            />
            <div
              style={{
                marginTop: 10,
                fontFamily: fonts.mono,
                fontWeight: 700,
                fontSize: 16,
                color: actual ? tema.accent : tema.text,
                opacity: actual ? 1 : 0.45,
              }}
            >
              {nombre}
            </div>
          </div>
        );
      })}
    </div>
  );
};
