import { assets } from "../data/assets.js";
import { siteInfo } from "../data/siteInfo.js";
import { curatedMedia } from "../data/curatedMedia.js";
import DecorImage from "../components/DecorImage.jsx";
import PhotoCard from "../components/PhotoCard.jsx";
import SectionFrame from "../components/SectionFrame.jsx";

const POLAROIDS = [
  { tilt: -8, side: "left", tape: "cream" },
  { tilt: 12, side: "right", decor: "clip" },
  { tilt: -10, side: "left", tape: "pink" },
];

export default function SinceTimelineSection() {
  const photos = curatedMedia.since.photos.slice(0, 3);

  return (
    <SectionFrame id="since-timeline" className="since-board" size="compact">
      <div className="since-board__bg" aria-hidden="true" />

      <DecorImage
        src={assets.decorations.cornerFloralLeft}
        className="since-board__floral since-board__floral--left"
        loading="lazy"
      />
      <DecorImage
        src={assets.decorations.cornerFloralRight}
        className="since-board__floral since-board__floral--right"
        loading="lazy"
      />

      <header className="since-board__head" data-reveal>
        <p className="since-board__eyebrow">Since</p>
        <h2 className="since-board__date">{siteInfo.knownSince}</h2>
        <DecorImage
          src={assets.decorations.timelineLine}
          className="since-board__line"
          loading="lazy"
        />
      </header>

      <div className="since-board__stack">
        {photos.map((media, i) => {
          const layout = POLAROIDS[i] ?? POLAROIDS[0];
          return (
            <div
              key={media.id}
              className={`since-board__item since-board__item--${layout.side}`}
              data-reveal
            >
              <DecorImage
                src={assets.decorations.timelineDotHeart}
                className="since-board__heart"
                loading="lazy"
              />
              <div
                className="since-board__pinboard"
                style={{ "--since-tilt": `${layout.tilt}deg` }}
              >
                <div className="since-board__shot">
                  <PhotoCard
                    media={media}
                    variant="polaroid"
                    size="medium"
                    decor={layout.decor ?? "none"}
                    className="since-board__photo"
                    reveal={false}
                  />
                </div>
                {layout.tape === "cream" && (
                  <img
                    src={assets.scrapbook.tapeCream}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className="since-board__tape since-board__tape--cream"
                  />
                )}
                {layout.tape === "pink" && (
                  <img
                    src={assets.scrapbook.tapePink}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className="since-board__tape since-board__tape--pink"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DecorImage
        src={assets.decorations.timelineLine}
        className="since-board__line since-board__line--end"
        loading="lazy"
      />
    </SectionFrame>
  );
}
