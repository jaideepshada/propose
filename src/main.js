import './styles.css';
import { content } from './content.js';
import { createAudio } from './audio.js';
import { scenes } from './scenes/index.js';

const root = document.querySelector('#app');
const audio = createAudio();
const soundToggle = document.querySelector('.sound-toggle');
let sceneIndex = 0;
let active;
let locked = false;
let startY = 0;
let muted = true;

const ctx = {
  content,
  audio,
  next: () => show(sceneIndex + 1),
  prev: () => show(sceneIndex - 1),
  lockNav: (value) => { locked = value; },
  setMood: ({ vignette = 0.62, palette = 'ink', grain = 1 } = {}) => {
    document.documentElement.style.setProperty('--vignette', vignette);
    document.documentElement.style.setProperty('--grain', grain);
    document.documentElement.dataset.palette = palette;
  }
};

function show(index) {
  if (index < 0 || index >= scenes.length || locked || index === sceneIndex && active) return;
  active?.exit();
  active?.destroy();
  sceneIndex = index;
  active = scenes[sceneIndex];
  active.mount(root, ctx);
  requestAnimationFrame(() => active.enter());
}

root.addEventListener('pointerdown', (event) => { startY = event.clientY; }, { passive: true });
root.addEventListener('pointerup', (event) => {
  if (locked || Math.abs(event.clientY - startY) < 64) return;
  if (event.clientY < startY) ctx.next(); else ctx.prev();
}, { passive: true });

soundToggle.addEventListener('click', () => {
  audio.unlock();
  muted = !muted;
  audio.setMuted(muted);
  soundToggle.setAttribute('aria-pressed', String(!muted));
  soundToggle.setAttribute('aria-label', muted ? 'Turn sound on' : 'Mute sound');
});

show(0);
