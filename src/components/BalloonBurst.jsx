import { useEffect, useMemo } from "react";
import { assets } from "../data/assets.js";
import DecorImage from "./DecorImage.jsx";

const LETTERS = assets.balloons;

/** Foil spelling — reuse H/A/P/Y; finish with 2 + 5 for the birthday age. */
const SPELL = [
  "H",
  "A",
  "P",
  "P",
  "Y",
  "B",
  "I",
  "R",
  "T",
  "H",
  "D",
  "A",
  "Y",
  "2",
  "5",
];

const LETTER_SRC = {
  H: LETTERS.H,
  A: LETTERS.A,
  P: LETTERS.P,
  Y: LETTERS.Y,
  B: LETTERS.B,
  I: LETTERS.I,
  R: LETTERS.R,
  T: LETTERS.T,
  D: LETTERS.D,
  2: LETTERS.two,
  5: LETTERS.five,
};

/** Soft horizontal lanes so phones never stack a crowd. */
const LETTER_LANES = [18, 42, 68, 28, 55, 78, 12, 48, 72, 22, 58, 82, 36, 44, 62];
const COLOR_LANES = [14, 34, 54, 74, 22, 46, 66, 86, 10, 38, 58, 78, 26, 50, 18, 70, 42, 82];

const LETTER_STAGGER_S = 0.34;
const COLOR_STAGGER_S = 0.2;
const AGE_GAP_S = 0.38;
const COLOR_GAP_S = 0.4;
const COLOR_COUNT = 18;
const FLOAT_BASE_S = 5.4;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function buildBurst() {
  const items = [];
  let t = 0.08;

  SPELL.forEach((ch, i) => {
    const isAge = ch === "2" || ch === "5";
    if (ch === "2") t += AGE_GAP_S;

    const sway = 10 + (i % 5) * 3;
    const duration = FLOAT_BASE_S + (i % 3) * 0.28;
    items.push({
      id: `letter-${i}-${ch}`,
      src: LETTER_SRC[ch],
      kind: isAge ? "age" : "letter",
      left: LETTER_LANES[i % LETTER_LANES.length],
      size: isAge ? 92 + (ch === "5" ? 4 : 0) : 78 + (i % 4) * 6,
      delay: t,
      duration,
      sway,
      rotate: (i % 2 === 0 ? -1 : 1) * (4 + (i % 3)),
    });
    t += LETTER_STAGGER_S;
  });

  t += COLOR_GAP_S;

  for (let i = 0; i < COLOR_COUNT; i += 1) {
    const maroon = i % 2 === 1;
    const duration = FLOAT_BASE_S + 0.45 + (i % 4) * 0.25;
    items.push({
      id: `color-${i}`,
      src: maroon ? LETTERS.maroon : LETTERS.blue,
      kind: "color",
      left: COLOR_LANES[i % COLOR_LANES.length],
      size: 64 + (i % 5) * 8,
      delay: t,
      duration,
      sway: 12 + (i % 6) * 4,
      rotate: (i % 2 === 0 ? 1 : -1) * (5 + (i % 4)),
    });
    t += COLOR_STAGGER_S;
  }

  const endMs = Math.ceil((t + FLOAT_BASE_S + 1.2) * 1000);
  return { items, endMs };
}

export function preloadBalloonAssets() {
  const urls = [
    ...SPELL.map((ch) => LETTER_SRC[ch]),
    LETTERS.blue,
    LETTERS.maroon,
  ];
  const unique = [...new Set(urls)];
  unique.forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  });
}

export default function BalloonBurst({ active, onDone }) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const { items, endMs } = useMemo(() => buildBurst(), []);

  useEffect(() => {
    if (!active) return undefined;

    if (reduced) {
      onDone?.();
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onDone?.();
    }, endMs);

    return () => window.clearTimeout(timer);
  }, [active, reduced, endMs, onDone]);

  if (!active || reduced) return null;

  return (
    <div className="balloon-burst" aria-hidden="true">
      {items.map((balloon) => (
        <span
          key={balloon.id}
          className={`balloon-burst__slot balloon-burst__slot--${balloon.kind}`}
          style={{
            left: `${balloon.left}%`,
            "--balloon-size": `${balloon.size}px`,
            "--balloon-delay": `${balloon.delay}s`,
            "--balloon-duration": `${balloon.duration}s`,
            "--balloon-sway": `${balloon.sway}px`,
            "--balloon-rotate": `${balloon.rotate}deg`,
          }}
        >
          <DecorImage
            src={balloon.src}
            className="balloon-burst__img"
            loading="eager"
            decoding="async"
          />
        </span>
      ))}
    </div>
  );
}
