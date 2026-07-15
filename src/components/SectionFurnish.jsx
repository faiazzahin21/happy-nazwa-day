import { assets } from "../data/assets.js";
import DecorImage from "./DecorImage.jsx";

/**
 * Soft floral corners only — keep sparse.
 * modes: "pair-top" | "pair-bottom" | "corners" (tl + br)
 */
export default function SectionFurnish({
  mode = "corners",
  className = "",
}) {
  const showTl = mode === "pair-top" || mode === "corners";
  const showTr = mode === "pair-top";
  const showBl = mode === "pair-bottom";
  const showBr = mode === "pair-bottom" || mode === "corners";

  return (
    <div className={`section-furnish ${className}`.trim()} aria-hidden="true">
      {showTl && (
        <DecorImage
          src={assets.decorations.cornerFloralLeft}
          className="section-furnish__corner section-furnish__corner--tl"
          loading="lazy"
        />
      )}
      {showTr && (
        <DecorImage
          src={assets.decorations.cornerFloralLeft}
          className="section-furnish__corner section-furnish__corner--tr"
          loading="lazy"
        />
      )}
      {showBl && (
        <DecorImage
          src={assets.decorations.cornerFloralLeft}
          className="section-furnish__corner section-furnish__corner--bl"
          loading="lazy"
        />
      )}
      {showBr && (
        <DecorImage
          src={assets.decorations.cornerFloralLeft}
          className="section-furnish__corner section-furnish__corner--br"
          loading="lazy"
        />
      )}
    </div>
  );
}
