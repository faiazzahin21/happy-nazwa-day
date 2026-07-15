import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { loveLetter } from "../data/loveLetter.js";
import { curatedMedia } from "../data/curatedMedia.js";
import { assets } from "../data/assets.js";
import DecorImage from "../components/DecorImage.jsx";
import PhotoCard from "../components/PhotoCard.jsx";
import SectionFrame from "../components/SectionFrame.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const PARAGRAPHS = loveLetter
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const UNFOLD_MS = 2400;

export default function LoveLetterSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMode, setOpenMode] = useState(null); // "ceremony" | "instant"
  const [hasCeremonied, setHasCeremonied] = useState(false);
  const letterPhoto = curatedMedia.letter.photo;

  const openLetter = useCallback(() => {
    if (isOpen) return;

    if (!hasCeremonied) {
      setOpenMode("ceremony");
      setIsOpen(true);
      window.setTimeout(() => {
        setHasCeremonied(true);
        setOpenMode(null);
      }, UNFOLD_MS);
      return;
    }

    setOpenMode("instant");
    setIsOpen(true);
  }, [hasCeremonied, isOpen]);

  const closeLetter = useCallback(() => {
    setIsOpen(false);
    setOpenMode(null);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") closeLetter();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeLetter]);

  const popup = isOpen
    ? createPortal(
        <div
          className={[
            "letter-popup",
            openMode === "ceremony" ? "is-unfolding" : "",
            openMode === "instant" ? "is-reopening" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Letter"
        >
          <button
            type="button"
            className="letter-popup__backdrop"
            onClick={closeLetter}
            aria-label="Close letter"
          />

          <div className="letter-popup__stage">
            <button
              type="button"
              className="letter-popup__close"
              onClick={closeLetter}
              aria-label="Close letter"
            >
              <span className="letter-popup__close-x" aria-hidden="true" />
            </button>

            <article className="letter-popup__sheet">
              <div className="letter-popup__paper" aria-hidden="true">
                <img
                  src={assets.letter.foldShadow}
                  alt=""
                  className="letter-popup__paper-img"
                  draggable={false}
                />
              </div>

              <div className="letter-popup__body">
                {PARAGRAPHS.map((para, i) => (
                  <p key={i} className="letter-popup__para">
                    {para}
                  </p>
                ))}

              </div>

              {letterPhoto && (
                <div className="letter-popup__keepsake">
                  <PhotoCard
                    media={letterPhoto}
                    variant="polaroid"
                    size="small"
                    decor="tape-cream+pin"
                    className="letter-popup__polaroid"
                    reveal={false}
                  />
                </div>
              )}
            </article>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <SectionFrame id="love-letter" className="letter-atelier" size="normal">
      <div className="atelier-atmosphere atelier-atmosphere--paper" aria-hidden="true" />

      <SectionHeading
        title="When Life Gives You Tangerines"
        titleStyle="script"
        withDivider={false}
      />

      <div className="letter-fold" data-reveal>
        <button
          type="button"
          className="letter-fold__packet"
          onClick={openLetter}
          aria-label="Open the letter"
          aria-expanded={isOpen}
        >
          <span className="letter-fold__accordion" aria-hidden="true">
            <span className="letter-fold__panel letter-fold__panel--1" />
            <span className="letter-fold__panel letter-fold__panel--2" />
            <span className="letter-fold__panel letter-fold__panel--3" />
            <span className="letter-fold__panel letter-fold__panel--4" />
          </span>
          <span className="letter-fold__crease letter-fold__crease--1" aria-hidden="true" />
          <span className="letter-fold__crease letter-fold__crease--2" aria-hidden="true" />
          <span className="letter-fold__crease letter-fold__crease--3" aria-hidden="true" />
          <DecorImage
            src={assets.envelope.heartSealGold}
            className="letter-fold__seal"
            loading="lazy"
          />
          <span className="letter-fold__hint">Tap to unfold</span>
        </button>
      </div>

      {popup}
    </SectionFrame>
  );
}
