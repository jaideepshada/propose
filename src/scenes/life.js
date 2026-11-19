export const life = {
  id: 'life',
  mount(root, ctx) {
    this.root = root;
    this.ctx = ctx;
    this.index = 0;
    this.ctx.lockNav(true);
    this.render();
  },
  enter() { this.ctx.setMood({ vignette: .22, palette: 'candle', grain: .7 }); },
  render() {
    this.root.innerHTML = `<section class="scene life-scene"><div class="life-glow" aria-hidden="true"></div><p class="life-line">${this.ctx.content.life[this.index]}</p></section>`;
    this.scene = this.root.querySelector('.life-scene');
    this.onTap = () => this.advance();
    this.scene.addEventListener('click', this.onTap);
  },
  advance() {
    if (this.index < this.ctx.content.life.length - 1) {
      this.scene.removeEventListener('click', this.onTap);
      this.index += 1;
      this.render();
      return;
    }
    this.ctx.lockNav(false);
    this.ctx.next();
  },
  exit() {},
  destroy() { this.scene?.removeEventListener('click', this.onTap); }
};
