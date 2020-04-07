import { Sprite } from "../utils/sprite";
import { Direction } from "../models/direction";
import { Coords } from "../models/coordinates";

export class Projectile {
  alive: boolean = true;
  initTime!: number;
  position: Coords = { x: 0, y: 0 };

  constructor(
    public width: number,
    public height: number,
    public startX: number,
    public startY: number,
    private direction: Direction,
    private delay: number,
    private range: number,
    public speed: number = 400,
    public spriteOffsets: Array<number>,
    public sprite: Sprite
  ) {
    this.position.x = startX + 5;
    this.position.y = this.startY;
    this.initTime = performance.now();
  }

  update(dt: number, x: number, y: number) {
    if (this.alive) {
      if (this.sprite) {
        this.sprite.update(dt);
      }

      // Check if movement delay
      if (performance.now() - this.initTime > this.delay) {
        this.direction === Direction.LEFT
          ? (this.position.x -= this.speed * dt)
          : (this.position.x += this.speed * dt);
      } else {
        this.position.x = x;
        this.position.y = y;
      }

      // Check if the projectile is on screen or is greater than the range
      if (this.position.x - this.startX > this.range) {
        this.alive = false;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
    const [oX, oY] = this.spriteOffsets;
    const spriteX = this.position.x - oX;
    const spriteY = this.position.y - oY;

    this.sprite.draw(ctx, { x: spriteX - xView, y: spriteY - yView });
  }
}
