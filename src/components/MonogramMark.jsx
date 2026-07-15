import { assets } from "../data/assets.js";
import DecorImage from "./DecorImage.jsx";

/** Soft SN watermark used across sections */
export default function MonogramMark({ className = "", size = "md" }) {
  return (
    <DecorImage
      src={assets.branding.monogram}
      className={`monogram-mark monogram-mark--${size} ${className}`.trim()}
      loading="lazy"
    />
  );
}
