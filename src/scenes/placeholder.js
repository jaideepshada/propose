export const placeholder = {
  id: 'placeholder',
  mount(root) {
    root.innerHTML = `<section class="scene placeholder-scene"><p>Scene 5 will begin here.</p><span>Swipe down to return.</span></section>`;
  },
  enter() {},
  exit() {},
  destroy() {}
};
