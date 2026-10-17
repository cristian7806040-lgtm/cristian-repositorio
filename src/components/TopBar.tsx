import React from "react";
import { Fase, fonts, MARGEN, temaDe, USUARIO } from "../theme";

// Píldora con avatar + usuario, etiqueta de sección y contador de pasos.
export const TopBar: React.FC<{
  fase: Fase;
  id: string;
  seccion: string;
  paso: number;
  total: number;
}> = ({ fase, id, seccion, paso, total }) => {
  const tema = temaDe(fase);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 80,
          right: MARGEN,
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 26px 0 8px",
          borderRadius: 32,
          background: tema.card,
          border: `2px solid ${tema.border}`,
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 26,
          color: tema.text,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            background: `linear-gradient(135deg, ${tema.accent}, #6B4BFF)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontFamily: fonts.black,
            fontSize: 24,
          }}
        >
          C
        </div>
        {USUARIO}
      </div>
      <div
        style={{
          position: "absolute",
          top: 170,
          left: MARGEN,
          right: MARGEN,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: fonts.mono,
          fontSize: 22,
          color: tema.text,
          opacity: 0.6,
        }}
      >
        <span>
          // {id} – {seccion}
        </span>
        <span style={{ fontWeight: 700 }}>
          PASO {paso} / {total}
        </span>
      </div>
    </>
  );
};
