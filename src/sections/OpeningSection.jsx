import { assets } from "../data/assets.js";
import DecorImage from "../components/DecorImage.jsx";
import FloatingDecor from "../components/FloatingDecor.jsx";
import OpeningEnvelope from "../components/OpeningEnvelope.jsx";
import SectionFrame from "../components/SectionFrame.jsx";

export default function OpeningSection({ isOpened, onOpen }) {
  return (
    <SectionFrame
      id="opening"
      className={`opening-section${isOpened ? " is-opening" : ""}`}
    >
      <div className="opening-bg" aria-hidden="true" />
      <FloatingDecor className="opening-decor" />

      <div className="opening-content stack center">
        <DecorImage
          src={assets.branding.monogram}
          className="opening-emblem anim-fade-in"
          loading="eager"
        />
        <OpeningEnvelope isOpen={isOpened} onOpen={onOpen} />
      </div>
    </SectionFrame>
  );
}
