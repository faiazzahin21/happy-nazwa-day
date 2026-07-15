import { assets } from "../data/assets.js";
import AssetImage from "./AssetImage.jsx";
import DecorImage from "./DecorImage.jsx";

const VARIANT_CLASS = {
  editorial: "photo-card--editorial",
  rounded: "photo-card--rounded",
  arch: "photo-card--arch",
  polaroid: "photo-card--polaroid",
  floating: "photo-card--floating",
  small: "photo-card--small",
};

const SIZE_CLASS = {
  large: "photo-card--size-large",
  medium: "photo-card--size-medium",
  small: "photo-card--size-small",
  wide: "photo-card--size-wide",
};

function parseDecor(decor) {
  const parts = String(decor || "none")
    .split("+")
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    tapePink: parts.includes("tape-pink"),
    tapeCream: parts.includes("tape-cream"),
    clip: parts.includes("clip"),
    pin: parts.includes("pin"),
  };
}

export default function PhotoCard({
  media,
  variant = "editorial",
  size,
  decor = "none",
  label,
  className = "",
  priority = false,
  reveal = true,
}) {
  if (!media?.src) return null;

  const variantClass = VARIANT_CLASS[variant] ?? VARIANT_CLASS.editorial;
  const sizeClass = size ? SIZE_CLASS[size] : "";
  const isPolaroid = variant === "polaroid";
  const d = parseDecor(decor);

  return (
    <figure
      className={`photo-card editorial-media ${variantClass} ${sizeClass} ${className}`.trim()}
      data-reveal={reveal ? "" : undefined}
    >
      {label && <span className="photo-card__chip">{label}</span>}

      <div className="photo-card__media-wrap">
        <AssetImage
          src={media.src}
          alt={media.alt || "Memory"}
          className="photo-card__image"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
        {isPolaroid && (
          <DecorImage
            src={assets.scrapbook.polaroidFrame}
            className="photo-card__polaroid-frame"
            loading="lazy"
          />
        )}
      </div>

      {d.clip && (
        <DecorImage
          src={assets.scrapbook.paperClipGold}
          className="photo-card__clip"
          loading="lazy"
        />
      )}

      {d.tapeCream && (
        <DecorImage
          src={assets.scrapbook.tapeCream}
          className="photo-card__tape photo-card__tape--cream"
          loading="lazy"
        />
      )}

      {d.tapePink && (
        <DecorImage
          src={assets.scrapbook.tapePink}
          className="photo-card__tape photo-card__tape--pink"
          loading="lazy"
        />
      )}

      {d.pin && (
        <DecorImage
          src={assets.decorations.heartPin}
          className="photo-card__pin"
          loading="lazy"
        />
      )}
    </figure>
  );
}
