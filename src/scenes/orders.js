export const orders = {
  id: 'orders',
  mount(root, ctx) {
    this.root = root;
    this.ctx = ctx;
    this.count = 0;
    this.activeTimer = null;
    this.ctx.lockNav(true);
    this.render();
  },
  enter() { this.ctx.setMood({ vignette: .38, palette: 'candle', grain: .84 }); },
  render() {
    const orderLines = this.ctx.content.orders.map((item, index) => `<button class="order-command" type="button" data-index="${index}">${item.command}</button>`).join('');
    this.root.innerHTML = `<section class="scene orders-scene">
      <div class="order-stage" aria-hidden="true"></div>
      <p class="order-response"></p>
      <p class="order-counter"></p>
      <div class="order-list">${orderLines}</div>
    </section>`;
    this.scene = this.root.querySelector('.orders-scene');
    this.stage = this.root.querySelector('.order-stage');
    this.response = this.root.querySelector('.order-response');
    this.counter = this.root.querySelector('.order-counter');
    this.onCommand = (event) => this.playOrder(event);
    this.scene.addEventListener('click', this.onCommand);
  },
  playOrder(event) {
    const button = event.target.closest('.order-command');
    if (!button) {
      if (this.count >= this.ctx.content.orders_counter.length) this.ctx.next();
      return;
    }
    window.clearTimeout(this.activeTimer);
    this.scene.classList.remove('is-playing');
    const item = this.ctx.content.orders[Number(button.dataset.index)];
    const icons = [
      '<svg viewBox="0 0 80 80"><path d="M17 41h37M42 23l20 18-20 17M22 50l-7 14"/></svg>',
      '<svg viewBox="0 0 80 80"><path d="M17 52c5-14 14-20 25-20h18c3 0 5 3 4 6l-4 14H20c-4 0-5-3-3-6Z"/><path d="M24 53v8M53 53v8"/></svg>',
      '<svg viewBox="0 0 80 80"><path d="M17 40h44M42 19l21 21-21 21"/></svg>',
      '<svg viewBox="0 0 80 80"><path d="M25 25h27l6 40H21l4-40ZM31 25c0-9 18-9 18 0"/></svg>',
      '<svg viewBox="0 0 80 80"><path d="M18 57c12-28 31-28 44 0M26 31h.1M55 31h.1"/></svg>',
      '<svg viewBox="0 0 80 80"><path d="M18 41c8-20 36-20 44 0-8 20-36 20-44 0Z"/><path d="M29 41c6 5 16 5 22 0"/></svg>'
    ];
    this.stage.innerHTML = icons[Number(button.dataset.index)];
    this.response.textContent = item.response;
    this.count += 1;
    this.counter.textContent = this.ctx.content.orders_counter[Math.min(this.count, this.ctx.content.orders_counter.length) - 1] ?? this.ctx.content.orders_done;
    this.scene.classList.add('is-playing');
    if (this.count >= this.ctx.content.orders_counter.length) {
      this.counter.textContent = this.ctx.content.orders_done;
      this.ctx.lockNav(false);
      this.scene.classList.add('is-unlocked');
    }
    this.activeTimer = window.setTimeout(() => this.scene?.classList.remove('is-playing'), 1400);
  },
  exit() { window.clearTimeout(this.activeTimer); },
  destroy() { this.scene?.removeEventListener('click', this.onCommand); }
};
