import { assets } from "../data/assets.js";
import { safePauseAudio, safePlayAudio, setAudioVolume } from "../utils/audio.js";

const HAPPY_VOLUME = 0.42;
const STORY_VOLUME = 0.52;
const CROSSFADE_MS = 3000;
const CROSSFADE_MS_REDUCED = 650;
const PLAY_RETRIES = 4;
const PLAY_RETRY_MS = 280;
/** First story playthrough → fireworks window → song loops forever after. */
const FIREWORKS_MS = 8000;
const FIREWORKS_MS_REDUCED = 400;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function waitForAudioReady(audio, timeoutMs = 8000) {
  if (!audio) return Promise.resolve(false);
  if (audio.readyState >= 2) return Promise.resolve(true);

  return new Promise((resolve) => {
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("loadeddata", onReady);
      audio.removeEventListener("error", onError);
      window.clearTimeout(timer);
      resolve(ok);
    };
    const onReady = () => finish(true);
    const onError = () => finish(false);
    const timer = window.setTimeout(() => finish(audio.readyState >= 2), timeoutMs);

    audio.addEventListener("canplay", onReady);
    audio.addEventListener("canplaythrough", onReady);
    audio.addEventListener("loadeddata", onReady);
    audio.addEventListener("error", onError);

    try {
      audio.load();
    } catch {
      /* ignore */
    }
  });
}

async function playWithRetry(audio, retries = PLAY_RETRIES) {
  if (!audio) return false;
  for (let i = 0; i < retries; i += 1) {
    const ok = await safePlayAudio(audio);
    if (ok) return true;
    await wait(PLAY_RETRY_MS * (i + 1));
  }
  return false;
}

function createEngine() {
  const happy = new Audio(assets.music.happyBirthdaySong);
  happy.loop = true;
  happy.preload = "auto";
  setAudioVolume(happy, HAPPY_VOLUME);

  const story = new Audio(assets.music.storySong);
  // First play is one-shot so we can catch `ended` for fireworks; loop after that.
  story.loop = false;
  story.preload = "auto";
  setAudioVolume(story, 0);

  try {
    happy.load();
    story.load();
  } catch {
    /* ignore */
  }

  const state = {
    activeTrack: null, // "happy" | "story" | null
    isPlaying: false,
    hasUserInteracted: false,
    storyLocked: false,
    cueConsumed: false,
    fading: false,
    fireworksActive: false,
    fireworksDone: false,
    error: null,
  };

  const listeners = new Set();
  let fadeRaf = 0;
  let fireworksTimer = 0;
  let snapshot = {
    activeTrack: null,
    isPlaying: false,
    hasUserInteracted: false,
    storyLocked: false,
    cueConsumed: false,
    fading: false,
    fireworksActive: false,
    fireworksDone: false,
    error: null,
  };

  const emit = () => {
    snapshot = { ...state };
    listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        /* ignore subscriber errors */
      }
    });
  };

  const setState = (patch) => {
    Object.assign(state, patch);
    emit();
  };

  const startHappyAfterEnvelopeTap = async () => {
    if (state.storyLocked) return false;

    setState({ hasUserInteracted: true, error: null });
    safePauseAudio(story);
    setAudioVolume(story, 0);
    setAudioVolume(happy, HAPPY_VOLUME);

    await waitForAudioReady(happy, 4000);
    const played = await playWithRetry(happy);
    setState({
      activeTrack: "happy",
      isPlaying: played,
      error: played ? null : "play-blocked",
    });

    // Warm the story track so the Since crossfade never cold-starts
    void waitForAudioReady(story, 12000);

    return played;
  };

  const crossfadeHappyToStory = async () => {
    // Once the story score has locked in, never touch happy birthday again
    if (state.storyLocked) return true;
    if (state.fading) return false;

    state.cueConsumed = true;
    setState({ fading: true, hasUserInteracted: true, error: null });

    await waitForAudioReady(story, 10000);

    try {
      story.currentTime = 0;
    } catch {
      /* ignore */
    }
    setAudioVolume(story, 0);

    const started = await playWithRetry(story);
    if (!started) {
      setState({
        fading: false,
        error: "play-blocked",
      });
      // Keep cueConsumed true but allow another attempt via ensureStoryScore
      return false;
    }

    // LOCK immediately once story audio is audibly starting
    setState({
      storyLocked: true,
      activeTrack: "story",
      isPlaying: true,
      error: null,
    });

    const duration = prefersReducedMotion() ? CROSSFADE_MS_REDUCED : CROSSFADE_MS;
    const happyWasPlaying = happy && !happy.paused;
    const happyStartVol = happyWasPlaying ? (Number.isFinite(happy.volume) ? happy.volume : HAPPY_VOLUME) : 0;
    const start = performance.now();

    await new Promise((resolve) => {
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const e = easeInOutCubic(t);

        if (happyWasPlaying) setAudioVolume(happy, happyStartVol * (1 - e));
        setAudioVolume(story, STORY_VOLUME * e);

        if (t < 1) {
          fadeRaf = requestAnimationFrame(tick);
        } else {
          safePauseAudio(happy);
          try {
            happy.currentTime = 0;
          } catch {
            /* ignore */
          }
          setAudioVolume(happy, HAPPY_VOLUME);
          setAudioVolume(story, STORY_VOLUME);
          setState({ fading: false, isPlaying: true, activeTrack: "story" });
          resolve();
        }
      };

      fadeRaf = requestAnimationFrame(tick);
    });

    // Guarantee story keeps looping even if something paused mid-fade
    if (story.paused) {
      await playWithRetry(story);
    }
    setAudioVolume(story, STORY_VOLUME);
    setState({ isPlaying: !story.paused, activeTrack: "story", storyLocked: true });

    return true;
  };

  const resumeStoryAfterFireworks = async () => {
    fireworksTimer = 0;
    setState({ fireworksActive: false });

    story.loop = true;
    try {
      story.currentTime = 0;
    } catch {
      /* ignore */
    }
    setAudioVolume(story, STORY_VOLUME);
    const ok = await playWithRetry(story, 3);
    setState({
      isPlaying: ok,
      activeTrack: "story",
      storyLocked: true,
      fireworksActive: false,
      error: ok ? null : "play-blocked",
    });
  };

  const beginFireworksInterlude = () => {
    if (state.fireworksDone || state.fireworksActive) return;

    safePauseAudio(story);
    setState({
      fireworksActive: true,
      fireworksDone: true,
      isPlaying: false,
      activeTrack: "story",
    });

    const duration = prefersReducedMotion() ? FIREWORKS_MS_REDUCED : FIREWORKS_MS;
    if (fireworksTimer) window.clearTimeout(fireworksTimer);
    fireworksTimer = window.setTimeout(() => {
      void resumeStoryAfterFireworks();
    }, duration);
  };
  const ensureStoryScore = async () => {
    if (state.storyLocked) {
      // Don't yank the song back mid-fireworks
      if (state.fireworksActive) return true;
      if (story.paused) {
        setAudioVolume(story, STORY_VOLUME);
        const ok = await playWithRetry(story);
        setState({ isPlaying: ok, activeTrack: "story" });
      }
      return true;
    }
    if (state.fading) return true; // in progress — treat as handled
    return crossfadeHappyToStory();
  };

  const subscribe = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  const getSnapshot = () => snapshot;

  const destroy = () => {
    if (fadeRaf) cancelAnimationFrame(fadeRaf);
    if (fireworksTimer) window.clearTimeout(fireworksTimer);
    safePauseAudio(happy);
    safePauseAudio(story);
  };

  // Keep story alive if the browser pauses it while locked
  const onStoryPause = () => {
    if (!state.storyLocked || state.fading || state.fireworksActive) return;
    // If locked and unexpectedly paused (except intentional pause APIs — we don't expose pause for story), nudge resume
    window.setTimeout(async () => {
      if (!state.storyLocked || state.fading || state.fireworksActive) return;
      if (!story.paused) return;
      await playWithRetry(story, 2);
      setState({ isPlaying: !story.paused, activeTrack: "story" });
    }, 120);
  };
  story.addEventListener("pause", onStoryPause);
  story.addEventListener("ended", async () => {
    if (!state.storyLocked) return;

    // First natural end → fireworks once, then loop forever
    if (!state.fireworksDone) {
      beginFireworksInterlude();
      return;
    }

    // After the interlude, loop=true should handle restarts; belt-and-suspenders
    try {
      story.currentTime = 0;
    } catch {
      /* ignore */
    }
    await playWithRetry(story, 2);
    setState({ isPlaying: !story.paused, activeTrack: "story" });
  });

  return {
    startHappyAfterEnvelopeTap,
    ensureStoryScore,
    crossfadeHappyToStory,
    subscribe,
    getSnapshot,
    destroy,
    get cueConsumed() {
      return state.cueConsumed;
    },
    get storyLocked() {
      return state.storyLocked;
    },
    get fireworksActive() {
      return state.fireworksActive;
    },
  };
}

let engine = null;

export function getMusicEngine() {
  if (!engine) engine = createEngine();
  return engine;
}
