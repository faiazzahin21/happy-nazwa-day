import { useCallback } from "react";
import { assets } from "../data/assets.js";
import DecorImage from "./DecorImage.jsx";

export default function OpeningEnvelope({ isOpen, onOpen, hidden }) {
  const handleOpen = useCallback(() => {
    if (isOpen) return;
    onOpen();
  }, [isOpen, onOpen]);

  if (hidden) return null;

  return (
    <div
      id="envelope-gate"
      className="envelope-gate"
      role="dialog"
      aria-modal="true"
      aria-label="Open your invitation"
    >
      <div className="figma-envelope-wrap">
        <div className="figma-envelope-stage" aria-label="Birthday invitation envelope">
          <div className="envelope-body-bg" />

          <DecorImage
            src={assets.envelope.flapRight}
            className="figma-flap figma-flap--right"
            loading="eager"
          />
          <DecorImage
            src={assets.envelope.flapLeft}
            className="figma-flap figma-flap--left"
            loading="eager"
          />
          <DecorImage
            src={assets.envelope.flapTop}
            className="figma-flap figma-flap--top"
            loading="eager"
          />
          <DecorImage
            src={assets.envelope.flapBottom}
            className="figma-flap figma-flap--bottom"
            loading="eager"
          />

          <button
            id="open-envelope"
            type="button"
            className="wax-seal"
            onClick={handleOpen}
            disabled={isOpen}
            aria-label="Open birthday letter"
          >
            <DecorImage
              src={assets.envelope.heartSealRed}
              alt=""
              loading="eager"
            />
          </button>

          {!isOpen && <div className="tap-to-open">TAP TO OPEN</div>}
        </div>
      </div>
    </div>
  );
}
