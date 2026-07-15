import DecorImage from "./DecorImage.jsx";
import { assets } from "../data/assets.js";

export default function GoldDivider({ className = "" }) {
  return (
    <DecorImage
      src={assets.decorations.divider}
      alt=""
      className={`gold-divider section-divider ${className}`.trim()}
      loading="lazy"
    />
  );
}
