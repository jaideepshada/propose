export const door = {
  id: 'door',
  mount(root, ctx) {
    this.ctx = ctx;
    root.innerHTML = `
      <section class="scene door-scene" aria-label="A private message">
        <div class="door-light" aria-hidden="true"></div>
        <div class="door-copy">
          <p class="door-line">${ctx.content.door.line}</p>
          <p class="door-hint">${ctx.content.door.hint}</p>
        </div>
      </section>`;
    this.el = root.querySelector('.door-scene');
    this.light = root.querySelector('.door-light');
    this.onDown = this.handleDown.bind(this);
    this.onUp = this.handleUp.bind(this);
    this.el.addEventListener('pointerdown', this.onDown);
    this.el.addEventListener('pointerup', this.onUp);
    this.el.addEventListener('pointercancel', this.onUp);
    this.el.addEventListener('pointerleave', this.onUp);
  },
  enter() {},
  handleDown(event) {
    if (this.complete || event.pointerType === 'mouse' && event.button !== 0) return;
    this.el.setPointerCapture?.(event.pointerId);
    this.ctx.audio.unlock();
    this.ctx.audio.setMuted(false);
    const rect = this.el.getBoundingClientRect();
    this.light.style.setProperty('--x', `${event.clientX - rect.left}px`);
    this.light.style.setProperty('--y', `${event.clientY - rect.top}px`);
    this.el.classList.add('is-holding');
    this.ctx.setMood({ vignette: 0.82, grain: 1.35 });
    this.ctx.audio.swell(1.65);
    this.timer = window.setTimeout(() => this.open(), 2200);
  },
  handleUp() {
    if (this.complete) return;
    window.clearTimeout(this.timer);
    this.el.classList.remove('is-holding');
    this.ctx.setMood({ vignette: 0.62, grain: 1 });
    this.ctx.audio.swell(1);
  },
  open() {
    this.complete = true;
    this.el.classList.remove('is-holding');
    this.el.classList.add('is-opening');
    this.ctx.lockNav(true);
    window.setTimeout(() => {
      this.ctx.lockNav(false);
      this.ctx.next();
    }, 1150);
  },
  exit() { window.clearTimeout(this.timer); },
  destroy() {
    this.el?.removeEventListener('pointerdown', this.onDown);
    this.el?.removeEventListener('pointerup', this.onUp);
    this.el?.removeEventListener('pointercancel', this.onUp);
    this.el?.removeEventListener('pointerleave', this.onUp);
  }
};
