import { assets } from "../data/assets.js";
import { curatedMedia } from "../data/curatedMedia.js";
import DecorImage from "../components/DecorImage.jsx";
import MonogramMark from "../components/MonogramMark.jsx";
import AssetImage from "../components/AssetImage.jsx";
import SectionFrame from "../components/SectionFrame.jsx";

export default function HeroIntroSection() {
  const photo = curatedMedia.hero.photo;

  return (
    <SectionFrame id="hero-intro" className="hero-lookbook" size="hero" bleed>
      <div className="hero-lookbook__stage">
        {photo && (
          <AssetImage
            src={photo.src}
            alt={photo.alt || "Memory"}
            className="hero-lookbook__photo"
            loading="eager"
          />
        )}
        <div className="hero-lookbook__veil" aria-hidden="true" />
        <div className="hero-lookbook__grain" aria-hidden="true" />
        <MonogramMark className="hero-lookbook__monogram" size="lg" />

        <div className="hero-lookbook__content" data-reveal>
          <DecorImage
            src={assets.decorations.sparkleGold}
            className="hero-lookbook__sparkle hero-lookbook__sparkle--1 anim-sparkle"
            loading="eager"
          />
          <DecorImage
            src={assets.branding.number25}
            className="hero-lookbook__number"
            loading="eager"
          />
          <h1 className="hero-lookbook__title">Happy Nazwa Day</h1>
          <DecorImage
            src={assets.decorations.divider}
            className="hero-lookbook__divider"
            loading="lazy"
          />
          <DecorImage
            src={assets.decorations.sparkleGold}
            className="hero-lookbook__sparkle hero-lookbook__sparkle--2 anim-soft-pulse"
            loading="lazy"
          />
        </div>
      </div>
    </SectionFrame>
  );
}
