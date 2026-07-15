import { assets } from "../data/assets.js";
import { curatedMedia } from "../data/curatedMedia.js";
import PhotoCard from "../components/PhotoCard.jsx";
import SectionFrame from "../components/SectionFrame.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const MAX = 8;

/** Clip corners match the marked spots on each polaroid */
const LAYOUT = {
  hero: { clip: "left", size: "large" },
  fan: [
    { clip: "left" },
    { clip: "right" },
    { clip: "right" },
    { clip: "right" },
  ],
  row: [
    { clip: "left" },
    { clip: "right" },
    { clip: "right" },
  ],
};

function MemoryPolaroid({ media, size, clip, className = "", priority = false }) {
  return (
    <div className={`memories-collage__frame ${className}`.trim()}>
      <PhotoCard
        media={media}
        variant="polaroid"
        size={size}
        decor="none"
        className="memories-collage__photo"
        priority={priority}
        reveal={false}
      />
      <img
        src={assets.scrapbook.paperClipGold}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`memories-collage__clip memories-collage__clip--${clip}`}
      />
    </div>
  );
}

export default function MemoryScatteredSection() {
  const all = [
    ...curatedMedia.memories.featured,
    ...curatedMedia.memories.mosaic,
  ].slice(0, MAX);

  const [hero, a, b, c, d, ...rest] = all;
  const fan = [a, b, c, d].filter(Boolean);
  const row = rest.slice(0, 3);

  return (
    <SectionFrame id="memory-scattered" className="memories-collage" size="normal" bleed>
      <div className="memories-collage__inner">
        <div className="atelier-atmosphere atelier-atmosphere--paper" aria-hidden="true" />

        <SectionHeading title="Montage" titleStyle="script" withDivider />

        <div className="memories-collage__stage" data-reveal>
          {hero && (
            <MemoryPolaroid
              media={hero}
              size={LAYOUT.hero.size}
              clip={LAYOUT.hero.clip}
              className="memories-collage__hero"
              priority
            />
          )}

          <div className="memories-collage__fan">
            {fan.map((media, i) => (
              <MemoryPolaroid
                key={media.id}
                media={media}
                size="medium"
                clip={LAYOUT.fan[i]?.clip ?? "right"}
                className={`memories-collage__fan-item memories-collage__fan-item--${i}`}
              />
            ))}
          </div>

          {row.length > 0 && (
            <div className="memories-collage__row">
              {row.map((media, i) => (
                <MemoryPolaroid
                  key={media.id}
                  media={media}
                  size="small"
                  clip={LAYOUT.row[i]?.clip ?? "right"}
                  className={`memories-collage__row-item memories-collage__row-item--${i}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionFrame>
  );
}
