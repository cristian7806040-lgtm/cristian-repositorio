import React from "react";
import {
  Easing,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fonts, MARGEN, status, Tema } from "../theme";
import { Card } from "./Card";

// Columna derecha, junto al clip del usuario.
const COLUMNA: React.CSSProperties = {
  position: "absolute",
  left: 490,
  top: 720,
  width: 545,
  height: 720,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const useRebote = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 12 } });
};

// Rayos alrededor de un elemento.
export const Burst: React.FC<{ color: string; size: number; delay: number }> = ({
  color,
  size,
  delay,
}) => {
  const frame = useCurrentFrame();
  const s = useRebote(delay);
  const dash = interpolate(frame - delay, [0, 20], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const c = size / 2;
  return (
    <svg
      width={size}
      height={size}
      style={{ position: "absolute", transform: `scale(${s}) rotate(${frame * 0.4}deg)` }}
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r1 = size * 0.36;
        const r2 = size * 0.48;
        return (
          <line
            key={i}
            x1={c + Math.cos(a) * r1}
            y1={c + Math.sin(a) * r1}
            x2={c + Math.cos(a) * r2}
            y2={c + Math.sin(a) * r2}
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={60}
            strokeDashoffset={dash}
          />
        );
      })}
    </svg>
  );
};

export const Contador: React.FC<{ tema: Tema; valor: number; etiqueta: string }> = ({
  tema,
  valor,
  etiqueta,
}) => {
  const frame = useCurrentFrame();
  const n = interpolate(frame, [8, 50], [0, valor], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const s = useRebote(4);
  return (
    <div style={COLUMNA}>
      <div
        style={{
          position: "relative",
          width: 480,
          height: 480,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Burst color={tema.accent} size={480} delay={46} />
        <div
          style={{
            fontFamily: fonts.black,
            fontSize: 250,
            color: tema.accent,
            transform: `scale(${s})`,
            lineHeight: 1,
          }}
        >
          {Math.round(n).toLocaleString("es-BO")}
        </div>
      </div>
      <div
        style={{
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 28,
          color: tema.text,
          textAlign: "center",
          opacity: s,
        }}
      >
        {etiqueta}
      </div>
    </div>
  );
};

const Reloj: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const a = frame * 12;
  return (
    <svg width={90} height={90} viewBox="0 0 90 90">
      <circle cx={45} cy={45} r={38} fill="none" stroke={color} strokeWidth={8} />
      <line
        x1={45}
        y1={45}
        x2={45}
        y2={18}
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        transform={`rotate(${a} 45 45)`}
      />
      <line
        x1={45}
        y1={45}
        x2={62}
        y2={45}
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        transform={`rotate(${a / 12} 45 45)`}
      />
    </svg>
  );
};

export const Etiquetas: React.FC<{ tema: Tema; items: string[]; alerta: string }> = ({
  tema,
  items,
  alerta,
}) => {
  const sAlerta = useRebote(138);
  return (
    <div style={{ ...COLUMNA, alignItems: "stretch", gap: 22, padding: "0 20px" }}>
      {items.map((item, i) => (
        <Etiqueta key={item} tema={tema} texto={item} i={i} />
      ))}
      <div
        style={{
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "22px 26px",
          borderRadius: 18,
          background: status.error,
          color: "#FFFFFF",
          transform: `scale(${0.6 + 0.4 * sAlerta}) rotate(-3deg)`,
          opacity: sAlerta,
          boxShadow: `0 0 40px ${status.error}80`,
        }}
      >
        <Reloj color="#FFFFFF" />
        <span style={{ fontFamily: fonts.black, fontSize: 48, textTransform: "uppercase" }}>
          {alerta}
        </span>
      </div>
    </div>
  );
};

const Etiqueta: React.FC<{ tema: Tema; texto: string; i: number }> = ({ tema, texto, i }) => {
  const s = useRebote(62 + i * 16);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "18px 24px",
        borderRadius: 16,
        background: tema.card,
        border: `2px solid ${tema.border}`,
        boxShadow: "0 10px 30px rgba(21,21,21,0.08)",
        fontFamily: fonts.mono,
        fontWeight: 700,
        fontSize: 34,
        color: tema.text,
        transform: `translateX(${(1 - s) * 80}px) rotate(${i % 2 ? 1.5 : -1.5}deg)`,
        opacity: s,
      }}
    >
      <span style={{ color: tema.accent }}>//</span>
      {texto}
    </div>
  );
};

// Demostración: la grabación de pantalla dentro de una tarjeta.
export const DEMO = { x: MARGEN, y: 720, w: 990, h: 620 };

export const DemoCard: React.FC<{ tema: Tema; playbackRate: number }> = ({
  tema,
  playbackRate,
}) => {
  const frame = useCurrentFrame();
  const s = useRebote(0);
  const zoom = interpolate(frame, [0, 489], [1, 1.06]);
  return (
    <Card
      tema={tema}
      archivo="calificador · Claude en Chrome"
      style={{
        left: DEMO.x,
        top: DEMO.y,
        width: DEMO.w,
        height: DEMO.h,
        transform: `scale(${0.9 + 0.1 * s})`,
        opacity: s,
        boxShadow: `0 0 50px ${tema.accent}33`,
      }}
    >
      <OffthreadVideo
        src={staticFile("clips/demo.mp4")}
        playbackRate={playbackRate}
        volume={0.08}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: DEMO.w,
          transform: `scale(${zoom})`,
          transformOrigin: "30% 0%",
        }}
      />
    </Card>
  );
};

export const PasosChips: React.FC<{ tema: Tema; activo: number }> = ({ tema, activo }) => {
  const nombres = ["Repositorio", "Guía clara", "Documento"];
  return (
    <div
      style={{
        position: "absolute",
        left: MARGEN,
        top: 1366,
        display: "flex",
        gap: 12,
      }}
    >
      {nombres.map((n, i) => (
        <Chip key={n} tema={tema} n={n} i={i} activo={activo} />
      ))}
    </div>
  );
};

const Chip: React.FC<{ tema: Tema; n: string; i: number; activo: number }> = ({
  tema,
  n,
  i,
  activo,
}) => {
  const hecho = i + 1 < activo;
  const actual = i + 1 === activo;
  const s = useRebote(0);
  return (
    <div
      style={{
        height: 58,
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderRadius: 29,
        fontFamily: fonts.mono,
        fontWeight: 700,
        fontSize: 22,
        background: actual ? tema.accent : "transparent",
        color: actual ? "#121212" : tema.text,
        border: `2px solid ${hecho || actual ? tema.accent : tema.muted}`,
        opacity: hecho || actual ? 1 : 0.5,
        boxShadow: actual ? `0 0 30px ${tema.accent}80` : "none",
        transform: actual ? `scale(${0.9 + 0.1 * s})` : "none",
      }}
    >
      <span>{hecho ? "✓" : i + 1}</span>
      {n}
    </div>
  );
};

export const Stamp: React.FC<{ texto: string; delay: number }> = ({ texto, delay }) => {
  const s = useRebote(delay);
  const escala = interpolate(s, [0, 1], [1.6, 1]);
  const giro = interpolate(s, [0, 1], [-12, -6]);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 980,
        padding: "14px 34px",
        border: `8px solid ${status.ok}`,
        borderRadius: 16,
        background: "rgba(18,18,18,0.82)",
        color: status.ok,
        fontFamily: fonts.black,
        fontSize: 76,
        letterSpacing: 4,
        opacity: s,
        transform: `scale(${escala}) rotate(${giro}deg)`,
        boxShadow: `0 0 40px ${status.ok}66`,
      }}
    >
      {texto}
    </div>
  );
};

export const RingProgress: React.FC<{ tema: Tema }> = ({ tema }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [10, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const horas = interpolate(t, [0, 1], [8, 1]);
  const r = 190;
  const largo = 2 * Math.PI * r;
  const s = useRebote(0);
  const sSticker = useRebote(80);
  return (
    <div style={COLUMNA}>
      <div style={{ position: "relative", width: 440, height: 440, transform: `scale(${s})` }}>
        <svg width={440} height={440} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={220} cy={220} r={r} fill="none" stroke={tema.muted} strokeWidth={28} />
          <circle
            cx={220}
            cy={220}
            r={r}
            fill="none"
            stroke={tema.accent}
            strokeWidth={28}
            strokeLinecap="round"
            strokeDasharray={largo}
            strokeDashoffset={largo * (1 - horas / 8)}
            style={{ filter: `drop-shadow(0 0 16px ${tema.accent}AA)` }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: tema.text,
          }}
        >
          <span style={{ fontFamily: fonts.black, fontSize: 150, lineHeight: 1 }}>
            {Math.ceil(horas - 0.001)} h
          </span>
          <span style={{ fontFamily: fonts.mono, fontSize: 26, opacity: 0.6 }}>de trabajo</span>
        </div>
      </div>
      <div
        style={{
          marginTop: 30,
          padding: "14px 28px",
          background: tema.accent,
          color: "#121212",
          fontFamily: fonts.black,
          fontSize: 46,
          borderRadius: 12,
          transform: `rotate(-4deg) scale(${sSticker})`,
        }}
      >
        &lt; 1 HORA
      </div>
    </div>
  );
};

export const CommentCTA: React.FC<{ tema: Tema; palabra: string }> = ({ tema, palabra }) => {
  const frame = useCurrentFrame();
  const inicioTexto = 8;
  const letras = Math.max(0, Math.floor((frame - inicioTexto) / 3));
  const escrito = palabra.slice(0, letras);
  const cursor = frame % 30 < 15;
  const s = useRebote(0);
  const enviado = useRebote(inicioTexto + palabra.length * 3 + 8);
  const sSticker = useRebote(50);
  return (
    <div style={{ ...COLUMNA, gap: 28 }}>
      <div
        style={{
          width: 520,
          padding: 26,
          borderRadius: 22,
          background: tema.card,
          border: `2px solid ${tema.border}`,
          transform: `scale(${s})`,
        }}
      >
        <div style={{ fontFamily: fonts.mono, fontSize: 22, color: tema.text, opacity: 0.55 }}>
          Añade un comentario…
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
          <div
            style={{
              flex: 1,
              height: 96,
              borderRadius: 16,
              border: `3px solid ${tema.accent}`,
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
              fontFamily: fonts.black,
              fontSize: 60,
              color: tema.accent,
              boxShadow: `0 0 30px ${tema.accent}55`,
            }}
          >
            {escrito}
            <span style={{ opacity: cursor ? 1 : 0, marginLeft: 4 }}>|</span>
          </div>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              background: tema.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${0.85 + 0.15 * enviado})`,
            }}
          >
            <svg width={44} height={44} viewBox="0 0 24 24">
              <path d="M3 11.5 21 3l-8.5 18-2.2-7.3L3 11.5Z" fill="#121212" />
            </svg>
          </div>
        </div>
      </div>
      <div
        style={{
          width: 520,
          padding: "20px 24px",
          borderRadius: 18,
          background: "#6B4BFF",
          color: "#FFFFFF",
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 30,
          opacity: enviado,
          transform: `translateY(${(1 - enviado) * 30}px)`,
        }}
      >
        Te mando la guía detallada paso a paso por DM
      </div>
      <div
        style={{
          padding: "12px 30px",
          background: tema.accent,
          color: "#121212",
          fontFamily: fonts.black,
          fontSize: 64,
          borderRadius: 12,
          transform: `rotate(-4deg) scale(${sSticker})`,
        }}
      >
        GRATIS
      </div>
    </div>
  );
};
