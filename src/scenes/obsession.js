const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const obsession = {
  id: 'obsession',
  mount(root, ctx) {
    this.root = root;
    this.ctx = ctx;
    this.index = 0;
    this.holding = false;
    this.ctx.lockNav(true);
    this.renderLine();
    this.onDown = (event) => this.startHold(event);
    this.onUp = () => this.stopHold();
    root.addEventListener('pointerdown', this.onDown);
    root.addEventListener('pointerup', this.onUp);
    root.addEventListener('pointercancel', this.onUp);
    root.addEventListener('pointerleave', this.onUp);
  },
  enter() { this.ctx.setMood({ vignette: .84, palette: 'oxblood', grain: 1.12 }); },
  renderLine() {
    const line = this.ctx.content.obsession[this.index];
    this.root.innerHTML = `<section class="scene obsession-scene">
      <div class="obsession-beat" aria-hidden="true"></div>
      <p class="obsession-line" style="--line-size:${1.8 + this.index * .17}rem">${line}</p>
      <p class="obsession-hint">${this.ctx.content.door.hint}</p>
    </section>`;
    this.scene = this.root.querySelector('.obsession-scene');
  },
  startHold(event) {
    if (this.holding || this.finished || event.pointerType === 'mouse' && event.button !== 0) return;
    this.holding = true;
    this.scene.classList.add('is-closing');
    this.ctx.audio.swell(1.7);
    this.timer = window.setTimeout(() => this.nextLine(), 2000);
  },
  stopHold() {
    if (!this.holding) return;
    this.holding = false;
    window.clearTimeout(this.timer);
    this.scene?.classList.remove('is-closing');
    this.ctx.audio.swell(1);
  },
  async nextLine() {
    this.stopHold();
    this.index += 1;
    if (this.index < this.ctx.content.obsession.length) {
      this.renderLine();
      return;
    }
    this.finished = true;
    this.root.innerHTML = `<section class="scene obsession-scene obsession-final"><p>${this.ctx.content.obsession_final}</p></section>`;
    await wait(1600);
    this.ctx.lockNav(false);
    this.finalScene = this.root.querySelector('.obsession-final');
    this.onFinalClick = () => this.ctx.next();
    this.finalScene.addEventListener('click', this.onFinalClick, { once: true });
  },
  exit() { window.clearTimeout(this.timer); },
  destroy() {
    this.root?.removeEventListener('pointerdown', this.onDown);
    this.root?.removeEventListener('pointerup', this.onUp);
    this.root?.removeEventListener('pointercancel', this.onUp);
    this.root?.removeEventListener('pointerleave', this.onUp);
    this.finalScene?.removeEventListener('click', this.onFinalClick);
  }
};
