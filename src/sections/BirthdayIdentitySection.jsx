import { assets } from "../data/assets.js";
import { curatedMedia } from "../data/curatedMedia.js";
import DecorImage from "../components/DecorImage.jsx";
import AssetImage from "../components/AssetImage.jsx";
import PhotoCard from "../components/PhotoCard.jsx";
import SectionFrame from "../components/SectionFrame.jsx";

export default function BirthdayIdentitySection() {
  const photos = curatedMedia.birthdayIdentity.photos;
  const primary = photos[0];
  const secondary = photos[1];

  return (
    <SectionFrame id="birthday-identity" className="identity-frame" size="normal" bleed>
      <div className="identity-frame__stage">
        {primary && (
          <AssetImage
            src={primary.src}
            alt={primary.alt || "Memory"}
            className="identity-frame__bg"
            loading="lazy"
          />
        )}
        <div className="identity-frame__veil" aria-hidden="true" />

        <DecorImage
          src={assets.decorations.cornerFloralLeft}
          className="identity-frame__floral identity-frame__floral--left"
          loading="lazy"
        />
        <DecorImage
          src={assets.decorations.cornerFloralRight}
          className="identity-frame__floral identity-frame__floral--right"
          loading="lazy"
        />

        <div className="identity-frame__content" data-reveal>
          <DecorImage
            src={assets.decorations.sparkleGold}
            className="identity-frame__sparkle identity-frame__sparkle--1 anim-sparkle"
            loading="lazy"
          />

          <p className="identity-frame__message">
            I love you and I miss you my Kashu ❤️
          </p>

          {secondary && (
            <div className="identity-frame__polaroid-wrap">
              <PhotoCard
                media={secondary}
                variant="polaroid"
                size="medium"
                decor="none"
                className="identity-frame__polaroid"
                reveal={false}
              />
              <DecorImage
                src={assets.scrapbook.paperClipGold}
                className="identity-frame__clip"
                loading="lazy"
              />
            </div>
          )}

          <DecorImage
            src={assets.decorations.sparkleGold}
            className="identity-frame__sparkle identity-frame__sparkle--2 anim-soft-pulse"
            loading="lazy"
          />
        </div>
      </div>
    </SectionFrame>
  );
}
