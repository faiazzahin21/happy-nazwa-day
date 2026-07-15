import { assets } from "../data/assets.js";
import { curatedMedia, mediaStats } from "../data/curatedMedia.js";
import { mediaManifest } from "../data/mediaManifest.js";
import AssetImage from "./AssetImage.jsx";
import DecorImage from "./DecorImage.jsx";

const WEB_FRIENDLY = /\.(jpe?g|png|webp)$/i;

function walkCuratedItems() {
  const items = [];
  const push = (item) => {
    if (item?.id) items.push(item);
  };

  push(curatedMedia.hero?.photo);
  for (const photo of curatedMedia.birthdayIdentity?.photos ?? []) push(photo);
  for (const photo of curatedMedia.since?.photos ?? []) push(photo);
  for (const photo of curatedMedia.memories?.featured ?? []) push(photo);
  for (const photo of curatedMedia.memories?.mosaic ?? []) push(photo);
  for (const still of curatedMedia.littleMoments?.stills ?? []) push(still);
  for (const photo of curatedMedia.littleMoments?.photos ?? []) push(photo);
  push(curatedMedia.letter?.photo);
  for (const photo of curatedMedia.final?.photos ?? []) push(photo);

  return items;
}

const designAssetGroups = [
  { label: "Backgrounds", items: Object.entries(assets.backgrounds) },
  { label: "Branding", items: Object.entries(assets.branding) },
  { label: "Decorations", items: Object.entries(assets.decorations) },
  { label: "Icons", items: Object.entries(assets.icons) },
  { label: "Final", items: Object.entries(assets.final).filter(([, v]) => !v.endsWith(".mp4")) },
];

const sectionSummary = [
  ["Hero", curatedMedia.hero?.photo ? 1 : 0],
  ["Birthday identity", curatedMedia.birthdayIdentity?.photos?.length ?? 0],
  ["Since", curatedMedia.since?.photos?.length ?? 0],
  [
    "Memories",
    (curatedMedia.memories?.featured?.length ?? 0) + (curatedMedia.memories?.mosaic?.length ?? 0),
  ],
  [
    "Little Moments",
    (curatedMedia.littleMoments?.stills?.length ?? 0) + (curatedMedia.littleMoments?.photos?.length ?? 0),
  ],
  ["Letter", curatedMedia.letter?.photo ? 1 : 0],
  ["Final", curatedMedia.final?.photos?.length ?? 0],
];

function AssetGrid({ items }) {
  return (
    <div className="debug-grid">
      {items.map(([key, src]) => (
        <div key={key} className="debug-asset-item">
          <DecorImage src={src} loading="eager" />
          <span>{key}</span>
        </div>
      ))}
    </div>
  );
}

export default function AssetDebugScreen({ onBack }) {
  const photos = mediaManifest.filter((m) => m.type === "photo");
  const videos = mediaManifest.filter((m) => m.type === "video");
  const curatedItems = walkCuratedItems();
  const webPhotos = curatedItems.filter((item) => item.src.includes("/web/photos/"));
  const motionStills = curatedItems.filter((item) => item.kind === "motion-still");
  const risky = curatedItems.filter((item) => !WEB_FRIENDLY.test(item.src));

  return (
    <div className="debug-screen">
      <button type="button" className="debug-back" onClick={onBack}>
        ← Back to preview
      </button>

      <header className="debug-header">
        <h1>Asset Verification</h1>
        <p>Image-led site — Step 5 polish. No main-flow video section.</p>
      </header>

      <section className="debug-section">
        <h2>Site Direction</h2>
        <div className="debug-stat">
          <span>Main scroll experience</span>
          <strong>Image-led</strong>
        </div>
        <div className="debug-stat">
          <span>Video player section</span>
          <strong>Removed</strong>
        </div>
        <div className="debug-stat">
          <span>Little Moments</span>
          <strong>Motion stills + photos</strong>
        </div>
        <div className="debug-stat">
          <span>Final cake video</span>
          <strong>Present (finale only)</strong>
        </div>
      </section>

      {designAssetGroups.map((group) => (
        <section key={group.label} className="debug-section">
          <h2>{group.label}</h2>
          <AssetGrid items={group.items} />
        </section>
      ))}

      <section className="debug-section">
        <h2>Web Derivatives</h2>
        <div className="debug-stat">
          <span>Web photo JPGs</span>
          <strong>{webPhotos.length}</strong>
        </div>
        <div className="debug-stat">
          <span>Motion stills</span>
          <strong>{motionStills.length}</strong>
        </div>
        <div className="debug-stat">
          <span>Curated images on site</span>
          <strong>{mediaStats.curatedImageCount ?? curatedItems.length}</strong>
        </div>
        {webPhotos.length > 0 && (
          <>
            <h3 className="debug-subheading">Web photo derivatives</h3>
            <div className="debug-media-grid">
              {webPhotos.slice(0, 4).map((item) => (
                <div key={item.id} className="debug-poster-thumb">
                  <img src={item.src} alt="" loading="lazy" />
                  <span>{item.id}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {motionStills.length > 0 && (
          <>
            <h3 className="debug-subheading">Motion stills</h3>
            <div className="debug-media-grid">
              {motionStills.slice(0, 4).map((item) => (
                <div key={item.id} className="debug-poster-thumb">
                  <img src={item.src} alt="" loading="lazy" />
                  <span>{item.id}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="debug-section">
        <h2>Curated Media by Section</h2>
        {sectionSummary.map(([label, count]) => (
          <div key={label} className="debug-stat">
            <span>{label}</span>
            <strong>{count}</strong>
          </div>
        ))}
        <ul className="debug-poster-status">
          {curatedItems.map((item) => (
            <li key={item.id}>
              <span>{item.id}</span>
              <span>{item.kind}</span>
              <strong>{WEB_FRIENDLY.test(item.src) ? "web: ok" : "web: risk"}</strong>
            </li>
          ))}
        </ul>
        {risky.length > 0 && (
          <p className="debug-path debug-path--warn">
            {risky.length} curated item(s) may not render in all browsers. Run npm run generate:web-photos
            or npm run generate:motion-stills.
          </p>
        )}
      </section>

      <section className="debug-section">
        <h2>Fonts</h2>
        <div className="debug-font-sample">
          <span className="label">Havana</span>
          <span className="debug-font-havana">Sajida Nazwa</span>
        </div>
        <div className="debug-font-sample">
          <span className="label">HappyBirthday</span>
          <span className="debug-font-birthday">Happy 25th Birthday</span>
        </div>
        <div className="debug-font-sample">
          <span className="label">JumpingChick</span>
          <span className="debug-font-playful">Little memory</span>
        </div>
      </section>

      <section className="debug-section">
        <h2>Music</h2>
        <div className="debug-stat">
          <span>Happy birthday song</span>
          <strong>configured</strong>
        </div>
        <p className="debug-path">{assets.music.happyBirthdaySong}</p>
        <p className="debug-path">{assets.music.storySong}</p>
        <p className="debug-path">
          Happy song starts after envelope seal tap. Crossfades to story song at Since section (locks until refresh).
        </p>
      </section>

      <section className="debug-section">
        <h2>Final Video — birthday-cake-25.mp4</h2>
        <video
          className="debug-video-full"
          src={assets.final.birthdayCakeVideo}
          controls
          muted
          playsInline
          preload="metadata"
        />
        <p className="debug-path">{assets.final.birthdayCakeVideo}</p>
      </section>

      <section className="debug-section">
        <h2>Media Manifest (source archive)</h2>
        <div className="debug-stat">
          <span>Total entries</span>
          <strong>{mediaManifest.length}</strong>
        </div>
        <div className="debug-stat">
          <span>Photos</span>
          <strong>{photos.length}</strong>
        </div>
        <div className="debug-stat">
          <span>Videos / live clips (archive only)</span>
          <strong>{videos.length}</strong>
        </div>
      </section>

      <section className="debug-section">
        <h2>First 6 Personal Photos</h2>
        <div className="debug-media-grid">
          {photos.slice(0, 6).map((item) => (
            <AssetImage
              key={item.id}
              src={item.src}
              alt={item.originalName}
              loading="lazy"
            />
          ))}
        </div>
      </section>

      <section className="debug-section">
        <h2>CSS-only Utilities</h2>
        <div className="debug-grid">
          <div className="debug-asset-item">
            <span className="close-icon-css" />
            <span>close-icon-css</span>
          </div>
          <div className="debug-asset-item">
            <DecorImage
              src={assets.icons.galleryNext}
              className="gallery-prev-css"
              loading="eager"
            />
            <span>gallery-prev-css</span>
          </div>
          <div className="debug-asset-item">
            <DecorImage
              src={assets.decorations.cornerFloralLeft}
              className="gallery-prev-css"
              loading="eager"
            />
            <span>floral-right (flipped)</span>
          </div>
        </div>
      </section>
    </div>
  );
}
