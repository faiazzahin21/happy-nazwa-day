import { useEffect, useRef } from "react";
import { assets } from "../data/assets.js";
import { curatedMedia } from "../data/curatedMedia.js";
import DecorImage from "../components/DecorImage.jsx";
import PhotoCard from "../components/PhotoCard.jsx";
import SoftGlow from "../components/SoftGlow.jsx";
import SectionFrame from "../components/SectionFrame.jsx";

const DELILAH_VERSE = [
  "Hey there, Delilah, what's it like in New York City?",
  "I'm a thousand miles away, but girl, tonight, you look so pretty",
  "Yes, you do",
  "Times Square can't shine as bright as you",
  "I swear it's true",
];

export default function FinalBirthdaySection({ canAutoplayVideo = false }) {
  const videoRef = useRef(null);
  const photos = curatedMedia.final.photos;

  useEffect(() => {
    if (!canAutoplayVideo || !videoRef.current) return;
    const video = videoRef.current;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.play().catch(() => {});
  }, [canAutoplayVideo]);

  return (
    <SectionFrame id="final-birthday" className="finale-cinema" size="large" bleed>
      <div className="finale-cinema__night" aria-hidden="true" />
      <SoftGlow
        className="finale-cinema__glow"
        style={{ top: "8%", width: "300px", height: "300px" }}
      />

      <div className="finale-cinema__inner" data-reveal>
        <blockquote className="finale-cinema__verse">
          {DELILAH_VERSE.map((line) => (
            <p
              key={line}
              className={
                line.length < 28
                  ? "finale-cinema__line finale-cinema__line--soft"
                  : "finale-cinema__line"
              }
            >
              {line}
            </p>
          ))}
        </blockquote>

        <div className="finale-cinema__stage">
          <DecorImage
            src={assets.final.heartFrame}
            className="finale-cinema__frame"
            loading="lazy"
          />
          <div className="finale-cinema__video-wrap">
            <video
              ref={videoRef}
              className="finale-cinema__video"
              src={assets.final.birthdayCakeVideo}
              playsInline
              muted
              loop
              preload="metadata"
            />
          </div>
          <DecorImage
            src={assets.final.birthdayIllustration}
            className="finale-cinema__illustration"
            loading="lazy"
          />
          <DecorImage
            src={assets.decorations.sparkleGold}
            className="finale-cinema__sparkle finale-cinema__sparkle--1 anim-sparkle"
            loading="lazy"
          />
          <DecorImage
            src={assets.decorations.sparkleGold}
            className="finale-cinema__sparkle finale-cinema__sparkle--2 anim-soft-pulse"
            loading="lazy"
          />
        </div>

        <div className="finale-cinema__strip">
          {photos.map((media, i) => {
            const accent =
              i === 0
                ? { src: assets.scrapbook.tapePinkOrig, kind: "tape-pink" }
                : i === 1
                  ? { src: assets.scrapbook.paperClipGold, kind: "clip" }
                  : { src: assets.scrapbook.tapeCreamOrig, kind: "tape-cream" };

            return (
              <div key={media.id} className={`finale-cinema__keep finale-cinema__keep--${i + 1}`}>
                <PhotoCard
                  media={media}
                  variant="polaroid"
                  size="small"
                  decor="none"
                  className="finale-cinema__photo"
                />
                <DecorImage
                  src={accent.src}
                  className={`finale-cinema__accent finale-cinema__accent--${accent.kind}`}
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>

        <p className="finale-cinema__sender">
          <span className="finale-cinema__sender-lead">With Love</span>
          <span className="finale-cinema__sender-name">Seemon</span>
        </p>
      </div>
    </SectionFrame>
  );
}
