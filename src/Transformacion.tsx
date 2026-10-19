import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {
  antes: string; // ej. "img/antes.jpg"
  despues: string; // ej. "img/despues.jpg"
  origen?: { x: number; y: number }; // 0–1, relativo al lienzo
  inicio?: number; // frame en que arranca la transformación
  duracion?: number; // frames que dura la expansión
  colorBorde?: string; // color de la franja del frente
  ruido?: number; // intensidad de la deformación (px)
  fibras?: number; // largo de las fibras del borde (px)
};

// Transición ANTES → DESPUÉS: la imagen B aparece desde un punto
// con un frente orgánico (ruido + fibras) y una franja de brillo.
export const Transformacion: React.FC<Props> = ({
  antes,
  despues,
  origen = { x: 0.45, y: 0.45 },
  inicio = 15,
  duracion = 75,
  colorBorde = "#FF6B5A",
  ruido = 120,
  fibras = 40,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();

  // Progreso 0→1 con easing lento-rápido-lento
  const p = interpolate(frame, [inicio, inicio + duracion], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Radio máximo = distancia del origen a la esquina más lejana + margen para el ruido
  const cx = origen.x * W;
  const cy = origen.y * H;
  const rMax =
    Math.max(
      Math.hypot(cx, cy),
      Math.hypot(W - cx, cy),
      Math.hypot(cx, H - cy),
      Math.hypot(W - cx, H - cy),
    ) +
    ruido * 1.5;
  const r = p * rMax;

  // El borde "hierve": la semilla cambia cada 2 frames
  const seed = Math.floor(frame / 2);
  // Intensidad de la franja: sube al empezar y se apaga al terminar
  const brillo = interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
  // Pequeño zoom de "respiro"
  const zoom = interpolate(frame, [0, inicio + duracion + 30], [1, 1.04], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {/* Imagen A (ANTES) */}
        <Img src={staticFile(antes)} style={{ width: W, height: H, objectFit: "cover" }} />

        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            {/* Deformación orgánica del frente */}
            <filter
              id="organico"
              filterUnits="userSpaceOnUse"
              x={-200}
              y={-200}
              width={W + 400}
              height={H + 400}
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008"
                numOctaves={3}
                seed={seed}
                result="n1"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="n1"
                scale={ruido}
                xChannelSelector="R"
                yChannelSelector="G"
                result="d1"
              />
              {/* Fibras: ruido muy fino y estirado */}
              <feTurbulence
                type="turbulence"
                baseFrequency="0.9 0.05"
                numOctaves={1}
                seed={seed + 7}
                result="n2"
              />
              <feDisplacementMap
                in="d1"
                in2="n2"
                scale={fibras}
                xChannelSelector="R"
                yChannelSelector="B"
              />
            </filter>

            <mask id="mascara">
              <rect width={W} height={H} fill="black" />
              <circle cx={cx} cy={cy} r={r} fill="white" filter="url(#organico)" />
            </mask>

            {/* Franja del frente: anillo = círculo grande menos círculo pequeño */}
            <mask id="franja">
              <rect width={W} height={H} fill="black" />
              <circle cx={cx} cy={cy} r={r + 35} fill="white" filter="url(#organico)" />
              <circle
                cx={cx}
                cy={cy}
                r={Math.max(r - 25, 0)}
                fill="black"
                filter="url(#organico)"
              />
            </mask>
            <filter id="blur">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>

          {/* Imagen B (DESPUÉS), recortada por la máscara orgánica */}
          <image
            href={staticFile(despues)}
            width={W}
            height={H}
            preserveAspectRatio="xMidYMid slice"
            mask="url(#mascara)"
          />

          {/* Brillo del frente */}
          <g mask="url(#franja)" style={{ mixBlendMode: "screen", opacity: 0.55 * brillo }}>
            <rect width={W} height={H} fill={colorBorde} filter="url(#blur)" />
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
