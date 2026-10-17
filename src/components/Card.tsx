import React from "react";
import { fonts, Tema } from "../theme";

// Tarjeta base con barra de ventana ● ● ● y nombre de archivo.
export const Card: React.FC<{
  tema: Tema;
  archivo: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ tema, archivo, style, children }) => {
  const clara = tema.bg === "#F1EEE8";
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: 18,
        overflow: "hidden",
        background: tema.card,
        border: `2px solid ${tema.border}`,
        boxShadow: clara ? "0 18px 50px rgba(21,21,21,0.12)" : "none",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          height: 44,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "0 18px",
          borderBottom: `2px solid ${tema.border}`,
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
        ))}
        <span
          style={{
            marginLeft: 12,
            fontFamily: fonts.mono,
            fontSize: 18,
            color: tema.text,
            opacity: 0.55,
          }}
        >
          {archivo}
        </span>
      </div>
      <div style={{ position: "relative", flex: 1 }}>{children}</div>
    </div>
  );
};
