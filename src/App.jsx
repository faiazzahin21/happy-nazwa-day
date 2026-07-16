import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import AssetDebugScreen from "./components/AssetDebugScreen.jsx";
import OpeningEnvelope from "./components/OpeningEnvelope.jsx";
import HeroIntroSection from "./sections/HeroIntroSection.jsx";
import BirthdayIdentitySection from "./sections/BirthdayIdentitySection.jsx";
import SinceTimelineSection from "./sections/SinceTimelineSection.jsx";
import MemoryScatteredSection from "./sections/MemoryScatteredSection.jsx";
import LittleMomentsSection from "./sections/LittleMomentsSection.jsx";
import LoveLetterSection from "./sections/LoveLetterSection.jsx";
import FinalBirthdaySection from "./sections/FinalBirthdaySection.jsx";
import BalloonBurst, { preloadBalloonAssets } from "./components/BalloonBurst.jsx";
import FireworkSky from "./components/FireworkSky.jsx";
import SiteHeartField from "./components/SiteHeartField.jsx";
import useMusicManager from "./hooks/useMusicManager.js";
import {
  useFinalSectionObserver,
  useRevealObserver,
  useSinceMusicCue,
} from "./hooks/useScrollReveal.js";

function subscribe(callback) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getDebugMode() {
  return new URLSearchParams(window.location.search).get("debug") === "assets";
}

function useDebugMode() {
  return useSyncExternalStore(subscribe, getDebugMode, () => false);
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const REVEAL_DELAY_MS = prefersReducedMotion() ? 0 : 1600;
const OPEN_TOTAL_MS = prefersReducedMotion() ? 50 : 2400;
const GATE_HIDE_MS = prefersReducedMotion() ? 80 : 3800;

function OpeningExperience() {
  const [opened, setOpened] = useState(false);
  const [gateHidden, setGateHidden] = useState(false);
  const [siteRevealed, setSiteRevealed] = useState(false);
  const [balloonsActive, setBalloonsActive] = useState(false);
  const timersRef = useRef([]);

  const music = useMusicManager();

  useRevealObserver(siteRevealed);
  useFinalSectionObserver(siteRevealed);

  useSinceMusicCue(siteRevealed && opened, music.ensureStoryScore);

  useEffect(() => {
    document.body.classList.remove("is-opening", "is-open", "is-final-section");
    preloadBalloonAssets();

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      document.body.classList.remove("is-opening", "is-open", "is-final-section");
    };
  }, []);

  const handleBalloonDone = useCallback(() => {
    setBalloonsActive(false);
  }, []);

  const handleOpen = useCallback(async () => {
    if (opened) return;
    setOpened(true);
    setBalloonsActive(true);

    document.body.classList.add("is-opening");

    await music.startHappyAfterEnvelopeTap();

    timersRef.current.push(
      window.setTimeout(() => {
        setSiteRevealed(true);
        document.getElementById("site-main")?.setAttribute("aria-hidden", "false");
        if (!prefersReducedMotion()) {
          document.getElementById("hero-intro")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, REVEAL_DELAY_MS),
    );

    timersRef.current.push(
      window.setTimeout(() => {
        document.body.classList.add("is-open");
      }, OPEN_TOTAL_MS),
    );

    timersRef.current.push(
      window.setTimeout(() => {
        setGateHidden(true);
        document.getElementById("envelope-gate")?.setAttribute("aria-hidden", "true");
        document.body.classList.remove("is-opening", "is-open");
      }, GATE_HIDE_MS),
    );
  }, [opened, music.startHappyAfterEnvelopeTap]);

  return (
    <>
      <OpeningEnvelope isOpen={opened} onOpen={handleOpen} hidden={gateHidden} />
      <BalloonBurst active={balloonsActive} onDone={handleBalloonDone} />
      <FireworkSky active={Boolean(music.fireworksActive)} />
      <SiteHeartField active={siteRevealed} />

      <main
        id="site-main"
        className={`site-main${siteRevealed ? " is-revealed" : ""}`}
        aria-hidden="true"
      >
        <div className="app-shell">
          <div className="phone-stage">
            <HeroIntroSection />
            <BirthdayIdentitySection />
            <SinceTimelineSection />
            <MemoryScatteredSection />
            <LittleMomentsSection />
            <LoveLetterSection />
            <FinalBirthdaySection canAutoplayVideo={opened} />
          </div>
        </div>
      </main>
    </>
  );
}

function App() {
  const isDebug = useDebugMode();

  const closeDebug = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("debug");
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  return (
    <>
      {isDebug ? (
        <div className="app-shell">
          <div className="phone-stage">
            <section className="section">
              <div className="section-inner">
                <AssetDebugScreen onBack={closeDebug} />
              </div>
            </section>
          </div>
        </div>
      ) : (
        <OpeningExperience />
      )}
    </>
  );
}

export default App;
