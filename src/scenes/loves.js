const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const loves = {
  id: 'loves',
  mount(root, ctx) {
    this.root = root;
    this.ctx = ctx;
    this.index = 0;
    this.startY = 0;
    this.startX = 0;
    this.eyesMoved = false;
    this.finished = false;
    this.ctx.lockNav(true);
    this.onMove = (event) => this.handleMove(event);
    root.addEventListener('pointermove', this.onMove);
    this.showMoment();
  },
  enter() {},
  showMoment() {
    const item = this.ctx.content.loves[this.index];
    this.root.innerHTML = `<section class="scene loves-scene moment-${this.index}">
      <div class="love-art" aria-hidden="true"></div>
      <div class="love-copy"><p class="love-title">${item.title}</p><p class="love-line">${item.line}</p></div>
      <p class="love-hint"></p>
    </section>`;
    this.scene = this.root.querySelector('.loves-scene');
    this.art = this.root.querySelector('.love-art');
    this.hint = this.root.querySelector('.love-hint');
    this.done = false;
    this.interactionComplete = false;
    this.onSceneClick = () => this.advanceMoment();
    this.scene.addEventListener('click', this.onSceneClick);
    [this.eyes, this.smile, this.breathe, this.walk, this.eat, this.hair, this.gentle, this.gentle].forEach((setup, i) => {
      if (i === this.index) setup.call(this);
    });
  },
  eyes() {
    this.art.innerHTML = '<i></i><i></i>';
    this.hint.textContent = this.ctx.content.door.hint;
    this.scene.classList.add('eyes-ready');
    this.completeSoon(3200);
  },
  smile() {
    this.art.innerHTML = '<svg viewBox="0 0 320 140"><path d="M25 42 C105 135 218 135 295 42" pathLength="1" /></svg>';
    this.hint.textContent = this.ctx.content.door.hint;
    this.scene.classList.add('smile-ready');
    this.completeSoon(3200);
  },
  breathe() {
    this.hint.textContent = this.ctx.content.door.hint;
    this.scene.classList.add('breathe-ready');
    this.completeSoon(3200);
  },
  walk() {
    this.hint.textContent = this.ctx.content.door.hint;
    this.scene.classList.add('walk-ready');
    this.completeSoon(3200);
  },
  eat() {
    this.art.innerHTML = '<div class="pizza-slices" data-bites="0"><i></i><i></i><i></i><i></i></div>';
    this.hint.textContent = this.ctx.content.door.hint;
    this.bites = 0;
    this.scene.classList.add('eat-ready');
    this.completeSoon(3200);
  },
  hair() {
    this.art.innerHTML = '<svg viewBox="0 0 340 250"><path d="M36 180C28 32 186 16 154 194M80 224C60 46 265 30 217 214M165 236C123 86 323 75 295 181" /></svg>';
    this.hint.textContent = this.ctx.content.door.hint;
    this.scene.classList.add('hair-ready');
    this.completeSoon(3200);
  },
  gentle() {
    this.hint.textContent = this.ctx.content.door.hint;
    this.scene.classList.add('gentle-ready');
    this.completeSoon(3200);
  },
  handleMove(event) {
    if (this.done || this.index !== 0) return;
    if (Math.hypot(event.clientX - this.startX, event.clientY - this.startY) > 22) this.eyesMoved = true;
    const rect = this.scene.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 12;
    this.art.style.setProperty('--eye-x', `${x}px`);
    this.art.style.setProperty('--eye-y', `${y}px`);
  },
  advanceMoment() {
    if (this.done) return;
    if (!this.interactionComplete) {
      if (this.index === 4) {
        this.bites += 1;
        this.art.querySelector('.pizza-slices').dataset.bites = String(this.bites);
        if (this.bites >= 4) this.revealInteraction();
      } else this.revealInteraction();
      return;
    }
    this.complete();
  },
  completeSoon(ms) {
    this.readyForSwipe = true;
    this.scene?.classList.add('moment-ready');
  },
  revealInteraction() {
    this.interactionComplete = true;
    window.clearTimeout(this.timer);
    this.scene.classList.add('moment-done');
  },
  async complete() {
    if (this.done) return;
    this.done = true;
    window.clearTimeout(this.timer);
    this.scene.classList.add('moment-done');
    const revealTime = this.index === 1 ? 1500 : this.index === 5 ? 1800 : 800;
    await wait(revealTime);
    if (this.index < this.ctx.content.loves.length - 1) {
      this.index += 1;
      this.showMoment();
    } else this.showFinale();
  },
  async showFinale() {
    this.root.innerHTML = `<section class="scene loves-scene more-scene"><div class="more-words"></div><p class="love-hint"></p></section>`;
    const words = this.root.querySelector('.more-words');
    const hint = this.root.querySelector('.love-hint');
    const items = this.ctx.content.loves_more;
    items.forEach((word, index) => {
      const el = document.createElement('span');
      el.textContent = word;
      const positions = [[9,9], [51,8], [8,24], [56,23], [13,40], [58,39], [7,57], [54,56], [18,73], [58,72], [9,87], [65,86]];
      const [x, y] = positions[index];
      el.style.setProperty('--x', `${x}%`);
      el.style.setProperty('--y', `${y}%`);
      el.style.setProperty('--size', `${.92 + (index % 3) * .11}rem`);
      el.style.setProperty('--delay', `${index * 150}ms`);
      words.append(el);
    });
    hint.textContent = '';
    await wait(items.length * 150 + 1150);
    this.finished = true;
    this.ctx.lockNav(false);
    this.scene = this.root.querySelector('.more-scene');
    this.onFinaleClick = () => this.ctx.next();
    this.scene.addEventListener('click', this.onFinaleClick, { once: true });
  },
  exit() { window.clearTimeout(this.timer); },
  destroy() {
    this.root?.removeEventListener('pointermove', this.onMove);
    this.scene?.removeEventListener('click', this.onSceneClick);
    this.scene?.removeEventListener('click', this.onFinaleClick);
  }
};
