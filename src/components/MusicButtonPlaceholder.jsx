import { assets } from "../data/assets.js";
import AssetImage from "./AssetImage.jsx";

export default function MusicButtonPlaceholder() {
  return (
    <button
      type="button"
      className="music-floating-button"
      aria-label="Music control"
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
