export class PoseSmoother {
  constructor() {
    this.value = { yaw: 0, pitch: 0, roll: 0 };
    this.ready = false;
  }

  update(next, smoothing) {
    if (!this.ready) {
      this.value = { ...next };
      this.ready = true;
      return this.value;
    }
    const keep = Math.min(0.96, Math.max(0, smoothing));
    const take = 1 - keep;
    for (const axis of ['yaw', 'pitch', 'roll']) {
      this.value[axis] = this.value[axis] * keep + next[axis] * take;
    }
    return { ...this.value };
  }

  reset() {
    this.ready = false;
    this.value = { yaw: 0, pitch: 0, roll: 0 };
  }
}
