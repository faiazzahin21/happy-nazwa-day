export async function safePlayAudio(audioElement) {
  if (!audioElement) return false;

  try {
    await audioElement.play();
    return true;
  } catch {
    return false;
  }
}

export function safePauseAudio(audioElement) {
  if (!audioElement) return false;

  try {
    audioElement.pause();
    return true;
  } catch {
    return false;
  }
}

export function setAudioVolume(audioElement, volume) {
  if (!audioElement) return false;

  const clamped = Math.min(1, Math.max(0, volume));
  audioElement.volume = clamped;
  return true;
}
