import { useCallback, useSyncExternalStore } from "react";
import { getMusicEngine } from "../utils/musicEngine.js";

export default function useMusicManager() {
  const engine = getMusicEngine();

  const snapshot = useSyncExternalStore(
    engine.subscribe,
    engine.getSnapshot,
    () => ({
      activeTrack: null,
      isPlaying: false,
      hasUserInteracted: false,
      storyLocked: false,
      cueConsumed: false,
      fading: false,
      error: null,
    }),
  );

  const startHappyAfterEnvelopeTap = useCallback(
    () => engine.startHappyAfterEnvelopeTap(),
    [engine],
  );

  const ensureStoryScore = useCallback(() => engine.ensureStoryScore(), [engine]);

  return {
    ...snapshot,
    startHappyAfterEnvelopeTap,
    ensureStoryScore,
    crossfadeHappyToStory: ensureStoryScore,
  };
}
