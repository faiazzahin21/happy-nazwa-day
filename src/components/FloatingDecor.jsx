import { assets } from "../data/assets.js";
import DecorImage from "./DecorImage.jsx";

const DECOR_ITEMS = [
  { type: "heart", className: "floating-decor__item--h1 anim-slow-drift" },
  { type: "petal", className: "floating-decor__item--p1 anim-float-up" },
  { type: "sparkle", className: "floating-decor__item--s1 anim-sparkle" },
  { type: "heart", className: "floating-decor__item--h2 anim-float-up" },
  { type: "petal", className: "floating-decor__item--p2 anim-slow-drift" },
  { type: "sparkle", className: "floating-decor__item--s2 anim-soft-pulse" },
  { type: "heart", className: "floating-decor__item--h3 anim-slow-drift" },
  { type: "petal", className: "floating-decor__item--p3 anim-float-up" },
];

const SRC_MAP = {
  heart: assets.decorations.floatingHeart,
  petal: assets.decorations.floatingPetal,
  sparkle: assets.decorations.sparkleGold,
};

export default function FloatingDecor({ className = "", density = "full" }) {
  const items = density === "soft" ? DECOR_ITEMS.slice(0, 5) : DECOR_ITEMS;

  return (
    <div className={`floating-decor ${className}`.trim()} aria-hidden="true">
      {items.map((item, index) => (
        <DecorImage
          key={index}
          src={SRC_MAP[item.type]}
          className={`floating-decor__item ${item.className}`}
          loading="lazy"
        />
      ))}
    </div>
  );
}
