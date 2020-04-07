import { Enemy } from "../entities/enemy";

export interface EnemyManagerOptions {
  max: number;
  spawnInterval: number;
}

export class EnemyManager {
  lastSpawn: number = null;

  constructor(
    public enemies: Array<Enemy>,
    public options: EnemyManagerOptions,
    public layerSize: any
  ) {}

  spawn() {
    const { max, spawnInterval } = this.options

    if (
      !this.lastSpawn ||
      (
        performance.now() - this.lastSpawn > spawnInterval &&
        this.enemies.length < max
      )
    ) {
      // create enemy at position
      const randX = Math.floor(Math.random() * (this.layerSize.width - 50)) + 1;
      const randY = this.layerSize.height - 50;
      this.enemies.push(new Enemy({ x: randX, y: randY }));
      this.lastSpawn = performance.now();
    }
  }

  kill(index: number) {
    this.enemies.splice(index, 1);
  }

  update(dt: number) {
    this.spawn();
  }

  draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
    this.enemies.forEach(e => e.draw(ctx, xView, yView));
  }
}
