// Main triage gameplay
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    this.SHIFT = 180;            // seconds per shift
    this.elapsed = 0;
    this.nextSpawn = 1;
    this.lastCaseIndex = -1;
    this.waiting = [];           // untriaged patients
    this.queue = [];             // triaged, waiting for a bed
    this.beds = [null, null, null, null];  // index 0 = resus bay (ESI 1 only)
    this.selected = null;
    this.stats = { score: 0, triaged: 0, correct: 0, over: 0, under: 0, treated: 0, bad: 0, lwbs: 0 };
    this.dyn = [];               // objects redrawn often (lists, beds)
    this.chartObjs = [];         // objects in the patient chart
    this.renderTimer = 0;
    this.dirtyLists = true;
    this.dirtyChart = true;
    this.alertUntil = 0;
    this.over = false;

    this.drawStatic();

    // Keys 1-5 assign a triage level
    this.input.keyboard.on('keydown', (e) => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 5) this.assign(n);
    });
    this.events.once('shutdown', () => this.input.keyboard.removeAllListeners('keydown'));
  }

  // ---------- Layout that never changes ----------
  drawStatic() {
    this.add.rectangle(0, 0, 1100, 55, 0x0b131c).setOrigin(0);
    this.hud = this.add.text(15, 6, '', { fontSize: '18px', color: '#ffffff' });
    this.alertText = this.add.text(15, 31, '', { fontSize: '15px', color: '#ff6b6b' });

    const panel = (x, w, title) => {
      this.add.rectangle(x, 62, w, 520, 0x1b2a3b).setOrigin(0).setStrokeStyle(1, 0x34506e);
      this.add.text(x + 10, 68, title, { fontSize: '15px', color: '#9fb3c8', fontStyle: 'bold' });
    };
    panel(10, 330, 'WAITING ROOM (max 6)');
    panel(350, 410, 'PATIENT CHART');
    panel(770, 320, 'TREATMENT AREA');

    this.feedback = this.add.text(362, 440, '', { fontSize: '14px', color: '#ffffff', wordWrap: { width: 388 }, lineSpacing: 3 });

    // ESI quick guide
    const guide = {
      1: 'Life-saving help NOW: no pulse, can\'t breathe, shock, nonstop seizure',
      2: 'High risk (heart attack, stroke), confused, or danger-zone vitals: HR>100, RR>20, O2<92%',
      3: 'Stable. Needs 2+ resources (labs, X-ray/CT, IV fluids/meds, stitches, specialist)',
      4: 'Stable. Needs 1 resource (e.g. just an X-ray, or just stitches)',
      5: 'Stable. Needs 0 resources (exam, pills, or a prescription only)'
    };
    for (let n = 1; n <= 5; n++) {
      const x = 10 + (n - 1) * 217;
      this.add.rectangle(x, 590, 211, 102, 0x1b2a3b).setOrigin(0).setStrokeStyle(2, ESI_COLORS[n]);
      this.add.text(x + 8, 595, `ESI ${n}`, { fontSize: '16px', color: ESI_HEX[n], fontStyle: 'bold' });
      this.add.text(x + 8, 617, guide[n], { fontSize: '13px', color: '#dbe7f3', wordWrap: { width: 196 } });
    }
  }

  // ---------- Game loop ----------
  update(time, delta) {
    if (this.over) return;
    const dt = delta / 1000;
    this.elapsed += dt;

    // New arrivals (faster as the shift goes on)
    if (this.elapsed >= this.nextSpawn) {
      this.spawn();
      this.nextSpawn = this.elapsed + Math.max(3.5, 7 - this.elapsed / 40);
    }

    // Untriaged patients waiting too long
    for (const p of [...this.waiting]) {
      if (this.elapsed - p.arrivedAt > UNTRIAGED_LIMIT[p.c.esi]) {
        this.waiting = this.waiting.filter(q => q !== p);
        if (this.selected === p) { this.selected = null; this.dirtyChart = true; }
        if (p.c.esi <= 2) this.badOutcome(p, 'got worse in the waiting room before being triaged');
        else this.leftWithoutBeingSeen(p, 'waited too long and left without being seen');
      }
    }

    // Triaged patients waiting too long for a bed
    for (const p of [...this.queue]) {
      if (this.elapsed - p.triagedAt > QUEUE_LIMIT[p.c.esi]) {
        this.queue = this.queue.filter(q => q !== p);
        if (p.c.esi <= 2) this.badOutcome(p, `waited too long for a bed (you triaged them ESI ${p.assigned})`);
        else this.leftWithoutBeingSeen(p, 'waited too long for a bed and left');
      }
    }

    // Treatment progress
    for (let i = 0; i < this.beds.length; i++) {
      const b = this.beds[i];
      if (b) {
        b.remaining -= dt;
        if (b.remaining <= 0) {
          this.beds[i] = null;
          this.stats.treated++;
          this.stats.score += 20;
        }
      }
    }
    this.fillBeds();

    if (this.elapsed - this.alertUntil > 0 && this.alertText.text) this.alertText.setText('');

    // Redraw (throttled)
    this.renderTimer -= dt;
    if (this.renderTimer <= 0 || this.dirtyLists) { this.renderTimer = 0.25; this.dirtyLists = false; this.renderLists(); }
    if (this.dirtyChart) { this.dirtyChart = false; this.renderChart(); }

    if (this.elapsed >= this.SHIFT) this.endGame();
  }

  spawn() {
    const c = pickCase(this.lastCaseIndex);
    this.lastCaseIndex = CASES.indexOf(c);
    const p = { c, name: Phaser.Utils.Array.GetRandom(FIRST_NAMES), arrivedAt: this.elapsed };

    if (this.waiting.length >= 6) {
      if (c.esi <= 2) this.badOutcome(p, 'arrived but the waiting room was full');
      else this.leftWithoutBeingSeen(p, 'saw the packed waiting room and left');
      return;
    }
    this.waiting.push(p);
    this.dirtyLists = true;
  }

  // Player assigns a triage level to the selected patient
  assign(level) {
    const p = this.selected;
    if (!p || this.over) return;

    this.waiting = this.waiting.filter(q => q !== p);
    p.assigned = level;
    p.triagedAt = this.elapsed;
    this.queue.push(p);

    const truth = p.c.esi;
    const s = this.stats;
    s.triaged++;
    let msg, color;
    if (level === truth) {
      s.correct++; s.score += 100;
      msg = `CORRECT: ESI ${truth}. `; color = '#8ce99a';
    } else if (level < truth) {
      s.over++; s.score += 20;
      msg = `OVERTRIAGED: you said ESI ${level}, actually ESI ${truth}. Safe, but it takes a spot sicker patients need. `; color = '#ffd43b';
    } else {
      s.under++; s.score -= 50;
      msg = `UNDERTRIAGED: you said ESI ${level}, actually ESI ${truth}. They may wait too long! `; color = '#ff6b6b';
    }
    this.feedback.setColor(color).setText(`${p.name}: ${msg}\n${p.c.why}`);

    this.selected = null;
    this.fillBeds();
    this.dirtyLists = true;
    this.dirtyChart = true;
  }

  fillBeds() {
    this.queue.sort((a, b) => a.assigned - b.assigned || a.triagedAt - b.triagedAt);
    // Resus bay only takes patients triaged ESI 1
    if (!this.beds[0]) {
      const idx = this.queue.findIndex(p => p.assigned === 1);
      if (idx >= 0) this.startTreatment(0, this.queue.splice(idx, 1)[0]);
    }
    for (let i = 1; i < this.beds.length; i++) {
      if (!this.beds[i] && this.queue.length) this.startTreatment(i, this.queue.shift());
    }
  }

  startTreatment(i, p) {
    const t = TREAT_TIME[p.c.esi];
    this.beds[i] = { p, remaining: t, total: t };
    this.dirtyLists = true;
  }

  badOutcome(p, reason) {
    this.stats.bad++; this.stats.score -= 150;
    this.showAlert(`BAD OUTCOME: ${p.name} (really ESI ${p.c.esi}) ${reason}.`, '#ff6b6b');
    this.dirtyLists = true;
  }

  leftWithoutBeingSeen(p, reason) {
    this.stats.lwbs++; this.stats.score -= 40;
    this.showAlert(`${p.name} ${reason}.`, '#ffa94d');
    this.dirtyLists = true;
  }

  showAlert(text, color) {
    this.alertText.setText(text).setColor(color);
    this.alertUntil = this.elapsed + 5;
  }

  // ---------- Drawing ----------
  renderLists() {
    this.dyn.forEach(o => o.destroy());
    this.dyn = [];
    const add = (o) => { this.dyn.push(o); return o; };
    const s = this.stats;

    const left = Math.max(0, Math.ceil(this.SHIFT - this.elapsed));
    const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0');
    this.hud.setText(`Score: ${s.score}     Time left: ${mm}:${ss}     Treated: ${s.treated}     Bad outcomes: ${s.bad}     Left without being seen: ${s.lwbs}`);

    // Waiting room cards
    this.waiting.forEach((p, i) => {
      const y = 95 + i * 80;
      const sel = this.selected === p;
      const card = add(this.add.rectangle(20, y, 310, 72, sel ? 0x3a4f6b : 0x2a3a50).setOrigin(0)
        .setStrokeStyle(2, sel ? 0xffe066 : 0x44607f).setInteractive({ useHandCursor: true }));
      card.on('pointerdown', () => { this.selected = p; this.dirtyChart = true; this.dirtyLists = true; });
      add(this.add.text(30, y + 8, `${p.name}, ${p.c.age}${p.c.sex}`, { fontSize: '18px', color: '#ffffff', fontStyle: 'bold' }));
      add(this.add.text(30, y + 38, p.c.short, { fontSize: '15px', color: '#cfe3ff' }));
      const waited = Math.floor(this.elapsed - p.arrivedAt);
      add(this.add.text(320, y + 8, `waiting ${waited}s`, { fontSize: '14px', color: waited > 20 ? '#ffa94d' : '#9fb3c8' }).setOrigin(1, 0));
    });
    if (!this.waiting.length) add(this.add.text(175, 320, 'No one waiting... for now', { fontSize: '16px', color: '#6c829a' }).setOrigin(0.5));

    // Beds
    this.beds.forEach((b, i) => {
      const y = 95 + i * 70;
      add(this.add.rectangle(780, y, 300, 62, i === 0 ? 0x4a2630 : 0x24384f).setOrigin(0).setStrokeStyle(2, i === 0 ? 0xd64545 : 0x44607f));
      add(this.add.text(790, y + 5, i === 0 ? 'RESUS BAY (ESI 1 only)' : `Bed ${i}`, { fontSize: '13px', color: '#9fb3c8' }));
      if (b) {
        add(this.add.text(790, y + 23, b.p.name, { fontSize: '17px', color: '#ffffff' }));
        add(this.add.rectangle(1015, y + 23, 56, 20, ESI_COLORS[b.p.assigned]).setOrigin(0));
        add(this.add.text(1043, y + 33, `ESI ${b.p.assigned}`, { fontSize: '13px', color: '#111111', fontStyle: 'bold' }).setOrigin(0.5));
        add(this.add.rectangle(790, y + 50, 280, 6, 0x0b131c).setOrigin(0));
        add(this.add.rectangle(790, y + 50, 280 * (1 - b.remaining / b.total), 6, 0x51cf66).setOrigin(0));
      } else {
        add(this.add.text(790, y + 25, 'Empty', { fontSize: '16px', color: '#6c829a' }));
      }
    });

    // Bed queue
    add(this.add.text(780, 382, `WAITING FOR A BED (${this.queue.length})`, { fontSize: '15px', color: '#9fb3c8', fontStyle: 'bold' }));
    this.queue.slice(0, 6).forEach((p, i) => {
      const y = 408 + i * 28;
      add(this.add.rectangle(780, y, 52, 22, ESI_COLORS[p.assigned]).setOrigin(0));
      add(this.add.text(806, y + 11, `ESI ${p.assigned}`, { fontSize: '13px', color: '#111111', fontStyle: 'bold' }).setOrigin(0.5));
      add(this.add.text(842, y + 2, p.name, { fontSize: '16px', color: '#ffffff' }));
      add(this.add.text(1078, y + 3, `${Math.floor(this.elapsed - p.triagedAt)}s`, { fontSize: '14px', color: '#9fb3c8' }).setOrigin(1, 0));
    });
  }

  renderChart() {
    this.chartObjs.forEach(o => o.destroy());
    this.chartObjs = [];
    const add = (o) => { this.chartObjs.push(o); return o; };
    const p = this.selected;

    if (!p) {
      add(this.add.text(555, 250, 'Click a patient in the\nwaiting room to triage them', { fontSize: '20px', color: '#6c829a', align: 'center' }).setOrigin(0.5));
      return;
    }

    add(this.add.text(365, 95, `${p.name}, ${p.c.age} y/o ${p.c.sex === 'F' ? 'female' : 'male'}`, { fontSize: '22px', color: '#ffffff', fontStyle: 'bold' }));
    add(this.add.text(365, 130, 'CHIEF COMPLAINT', { fontSize: '13px', color: '#9fb3c8' }));
    add(this.add.text(365, 148, p.c.complaint, { fontSize: '17px', color: '#ffffff', wordWrap: { width: 380 }, lineSpacing: 3 }));

    const v = p.c.vitals;
    add(this.add.text(365, 228, 'VITAL SIGNS', { fontSize: '13px', color: '#9fb3c8' }));
    add(this.add.text(365, 246, [
      `Heart rate (HR):     ${v.hr} bpm`,
      `Blood pressure:      ${v.bp}`,
      `Breathing (RR):      ${v.rr} /min`,
      `Oxygen (SpO2):       ${v.spo2}`,
      `Temperature:         ${v.temp} °F`
    ].join('\n'), { fontSize: '16px', color: '#ffffff', fontFamily: 'monospace', lineSpacing: 5 }));

    add(this.add.text(365, 362, 'ASSIGN TRIAGE LEVEL:', { fontSize: '13px', color: '#9fb3c8' }));
    for (let n = 1; n <= 5; n++) {
      const x = 365 + (n - 1) * 77;
      const btn = add(this.add.rectangle(x, 380, 70, 44, ESI_COLORS[n]).setOrigin(0).setInteractive({ useHandCursor: true }));
      btn.on('pointerover', () => btn.setStrokeStyle(3, 0xffffff));
      btn.on('pointerout', () => btn.setStrokeStyle());
      btn.on('pointerdown', () => this.assign(n));
      add(this.add.text(x + 35, 402, `ESI ${n}`, { fontSize: '18px', color: '#111111', fontStyle: 'bold' }).setOrigin(0.5));
    }
    add(this.add.text(555, 428, '(or press keys 1-5)', { fontSize: '12px', color: '#6c829a' }).setOrigin(0.5, 0));
  }

  endGame() {
    if (this.over) return;
    this.over = true;
    this.scene.start('End', { stats: this.stats });
  }
}
