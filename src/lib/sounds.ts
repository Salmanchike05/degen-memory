/**
 * Звуки игры через Web Audio API (без внешних файлов).
 * Вызывать после взаимодействия пользователя, чтобы браузер не блокировал воспроизведение.
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Игнорируем ошибки (автоплей политика и т.д.)
  }
}

/** Звук при совпадении пары карт */
export function playMatch(): void {
  playTone(523.25, 0.12, "sine", 0.12);
  setTimeout(() => playTone(659.25, 0.15, "sine", 0.1), 80);
}

/** Звук при несовпадении (карты переворачиваются обратно) */
export function playWrong(): void {
  playTone(200, 0.2, "sawtooth", 0.08);
}

/** Звук победы */
export function playWin(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    setTimeout(() => {
      playTone(freq, 0.2, "sine", 0.12);
    }, i * 120);
  });
}

/** Звук при перевороте карты (опционально, можно не использовать) */
export function playFlip(): void {
  playTone(400, 0.06, "sine", 0.06);
}
