import { assets } from "../data/assets.js";
import { curatedMedia } from "../data/curatedMedia.js";
import DecorImage from "../components/DecorImage.jsx";
import PhotoCard from "../components/PhotoCard.jsx";
import SectionFrame from "../components/SectionFrame.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const TILTS = [-3.5, 4, -2.5, 3, -4, 2.5];

/** Pink-marked corners: mix of gold clip + cream/pink tape */
const ACCENTS = [
  { kind: "tape-cream", corner: "right" },
  { kind: "clip", corner: "left" },
  { kind: "tape-pink", corner: "left" },
  { kind: "clip", corner: "right" },
  { kind: "tape-cream", corner: "left" },
  { kind: "tape-pink", corner: "right" },
];

function Accent({ kind, corner }) {
  if (kind === "clip") {
    return (
      <img
        src={assets.scrapbook.paperClipGold}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={
          "moments-strip__accent moments-strip__accent--clip moments-strip__accent--" +
          corner
        }
      />
    );
  }

  const src =
    kind === "tape-pink" ? assets.scrapbook.tapePink : assets.scrapbook.tapeCream;
  const tapeClass =
    kind === "tape-pink"
      ? "moments-strip__accent--tape-pink"
      : "moments-strip__accent--tape-cream";

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={
        "moments-strip__accent moments-strip__accent--tape " +
        tapeClass +
        " moments-strip__accent--" +
        corner
      }
    />
  );
}

export default function LittleMomentsSection() {
  const items = curatedMedia.littleMoments.photos.slice(0, 6);

  return (
    <SectionFrame id="little-moments" className="moments-strip" size="normal">
      <div className="atelier-atmosphere atelier-atmosphere--mist" aria-hidden="true" />

      <SectionHeading title="Over the Years" titleStyle="script" withDivider />

      <div className="moments-strip__film">
        {items.map((media, i) => {
          const accent = ACCENTS[i] ?? ACCENTS[0];
          return (
            <div
              key={media.id}
              className={`moments-strip__frame moments-strip__frame--${i % 2}`}
              data-reveal
            >
              <div
                className="moments-strip__pinboard"
                style={{ "--moments-tilt": `${TILTS[i] ?? -2}deg` }}
              >
                <div className="moments-strip__shot">
                  <PhotoCard
                    media={media}
                    variant="polaroid"
                    size={i === 0 ? "large" : "medium"}
                    decor="none"
                    className="moments-strip__photo"
                    priority={i === 0}
                    reveal={false}
                  />
                </div>
                <Accent kind={accent.kind} corner={accent.corner} />
              </div>
            </div>
          );
        })}
      </div>

      <DecorImage
        src={assets.decorations.cornerFloralLeft}
        className="moments-strip__floral moments-strip__floral--left"
        loading="lazy"
      />
      <DecorImage
        src={assets.decorations.cornerFloralRight}
        className="moments-strip__floral moments-strip__floral--right"
        loading="lazy"
      />
    </SectionFrame>
  );
}
