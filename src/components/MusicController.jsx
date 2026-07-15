import { assets } from "../data/assets.js";
import AssetImage from "./AssetImage.jsx";

export default function MusicController({
  opened,
  isPlaying,
  activeTrack,
  onToggle,
  className = "",
}) {
  if (!opened) return null;

  const trackClass =
    activeTrack === "special"
      ? "music-floating-button--special"
      : activeTrack === "happy"
        ? "music-floating-button--happy"
        : "";

  return (
    <button
      type="button"
      className={`music-floating-button ${trackClass} ${className}`.trim()}
      onClick={onToggle}
      disabled={!activeTrack}
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      <AssetImage
        src={assets.icons.musicButton}
        alt=""
        loading="eager"
        decoding="async"
      />
    </button>
  );
}
