export function createAudio() {
  let context;
  let gain;
  let oscillator;
  let muted = true;

  const unlock = () => {
    if (!context) {
      context = new AudioContext();
      oscillator = context.createOscillator();
      gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 58;
      gain.gain.value = 0;
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
    }
    context.resume();
  };

  return {
    unlock,
    setMuted(value) {
      muted = value;
      if (gain && context) gain.gain.setTargetAtTime(muted ? 0 : 0.018, context.currentTime, 0.7);
    },
    swell(amount = 1) {
      if (gain && context && !muted) gain.gain.setTargetAtTime(0.018 * amount, context.currentTime, 0.35);
    },
    setMood({ palette } = {}) {
      if (oscillator && context && palette === 'oxblood') oscillator.frequency.setTargetAtTime(48, context.currentTime, 1);
    },
    destroy() {
      oscillator?.stop();
      context?.close();
    }
  };
}
