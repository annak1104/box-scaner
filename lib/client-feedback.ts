"use client";

export function vibrateDevice(pattern: number | number[]) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

export function playScanTone() {
  if (typeof window === "undefined") {
    return;
  }

  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gainNode.gain.value = 0.05;

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);

  oscillator.onended = () => {
    void context.close();
  };
}
