export const ask = {
  id: 'ask',
  mount(root, ctx) {
    this.root = root;
    this.ctx = ctx;
    this.complete = false;
    this.renderQuestion();
  },
  enter() { this.ctx.setMood({ vignette: .18, palette: 'candle', grain: .62 }); },
  renderQuestion() {
    const { question, holdHint } = this.ctx.content.ask;
    this.root.innerHTML = `<section class="scene ask-scene"><div class="ask-light" aria-hidden="true"></div><div class="ask-copy"><p class="ask-question">${question}</p><p class="ask-hint">${holdHint}</p></div></section>`;
    this.scene = this.root.querySelector('.ask-scene');
    this.onDown = (event) => this.start(event);
    this.onUp = () => this.cancel();
    this.scene.addEventListener('pointerdown', this.onDown);
    this.scene.addEventListener('pointerup', this.onUp);
    this.scene.addEventListener('pointercancel', this.onUp);
    this.scene.addEventListener('pointerleave', this.onUp);
  },
  start(event) {
    if (this.complete || event.pointerType === 'mouse' && event.button !== 0) return;
    this.scene.setPointerCapture?.(event.pointerId);
    this.ctx.audio.unlock();
    this.ctx.audio.setMuted(false);
    this.ctx.audio.swell(1.5);
    this.scene.classList.add('is-holding');
    this.timer = window.setTimeout(() => this.sayYes(), 2000);
  },
  cancel() {
    if (this.complete) return;
    window.clearTimeout(this.timer);
    this.scene?.classList.remove('is-holding');
    this.ctx.audio.swell(1);
  },
  sayYes() {
    this.complete = true;
    this.scene.classList.remove('is-holding');
    this.scene.classList.add('is-answered');
    window.setTimeout(() => this.renderAfter(), 1050);
  },
  renderAfter() {
    const { after, button, whatsappMessage } = this.ctx.content.ask;
    const encoded = encodeURIComponent(whatsappMessage);
    this.root.innerHTML = `<section class="scene ask-scene ask-after"><div class="ask-light" aria-hidden="true"></div><div class="ask-copy"><p class="ask-answer">${after}</p><a class="tell-him" href="https://wa.me/919057095046?text=${encoded}" rel="noopener">${button}</a><a class="sms-fallback" href="sms:?body=${encoded}" aria-label="Send by SMS"></a></div></section>`;
  },
  exit() { window.clearTimeout(this.timer); },
  destroy() {
    this.scene?.removeEventListener('pointerdown', this.onDown);
    this.scene?.removeEventListener('pointerup', this.onUp);
    this.scene?.removeEventListener('pointercancel', this.onUp);
    this.scene?.removeEventListener('pointerleave', this.onUp);
  }
};
