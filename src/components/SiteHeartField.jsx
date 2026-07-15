import { assets } from "../data/assets.js";
import DecorImage from "./DecorImage.jsx";

/**
 * Soft site-wide heart field — fixed, non-interactive, behind popups / above pages.
 * Positions & timings are hand-tuned for a calm “atelier” drift.
 */
const HEARTS = [
  { left: "6%",  size: 16, delay: 0,    duration: 18, sway: 14, rise: 22, opacity: 0.28, flip: false },
  { left: "18%", size: 11, delay: 2.4,  duration: 22, sway: 10, rise: 28, opacity: 0.2,  flip: true },
  { left: "28%", size: 14, delay: 5.1,  duration: 16, sway: 18, rise: 20, opacity: 0.26, flip: false },
  { left: "41%", size: 10, delay: 1.2,  duration: 20, sway: 12, rise: 26, opacity: 0.18, flip: true },
  { left: "52%", size: 18, delay: 7.2,  duration: 24, sway: 16, rise: 30, opacity: 0.24, flip: false },
  { left: "63%", size: 12, delay: 3.6,  duration: 17, sway: 11, rise: 21, opacity: 0.22, flip: true },
  { left: "74%", size: 15, delay: 8.8,  duration: 21, sway: 15, rise: 25, opacity: 0.27, flip: false },
  { left: "86%", size: 11, delay: 0.8,  duration: 19, sway: 13, rise: 23, opacity: 0.2,  flip: true },
  { left: "12%", size: 13, delay: 11,   duration: 23, sway: 9,  rise: 27, opacity: 0.19, flip: false },
  { left: "35%", size: 9,  delay: 6.4,  duration: 15, sway: 8,  rise: 18, opacity: 0.17, flip: true },
  { left: "58%", size: 14, delay: 9.5,  duration: 25, sway: 17, rise: 32, opacity: 0.23, flip: false },
  { left: "80%", size: 12, delay: 4.2,  duration: 18, sway: 12, rise: 24, opacity: 0.21, flip: true },
  { left: "93%", size: 10, delay: 13,   duration: 20, sway: 10, rise: 22, opacity: 0.18, flip: false },
  { left: "47%", size: 16, delay: 14.5, duration: 26, sway: 14, rise: 29, opacity: 0.22, flip: true },
];

export default function SiteHeartField({ active = true }) {
  return (
    <div
      className={`site-heart-field${active ? " is-active" : ""}`}
      aria-hidden="true"
    >
      {HEARTS.map((heart, i) => (
        <span
          key={i}
          className="site-heart-field__slot"
          style={{
            left: heart.left,
            "--heart-size": `${heart.size}px`,
            "--heart-delay": `${heart.delay}s`,
            "--heart-duration": `${heart.duration}s`,
            "--heart-sway": `${heart.sway}px`,
            "--heart-rise": `${heart.rise}vh`,
            "--heart-opacity": heart.opacity,
            "--heart-scale-x": heart.flip ? -1 : 1,
          }}
        >
          <DecorImage
            src={assets.decorations.floatingHeart}
            className="site-heart-field__heart"
            loading="eager"
          />
        </span>
      ))}
    </div>
  );
}
