import { Coords } from "../models/coordinates";
import { Entity } from "./entity";

export class Enemy implements Entity {
  constructor(public position: Coords) {}

  update(dt: number) {
    this.position.x = this.position.x * dt;
    this.position.y = this.position.y * dt;
  }

  draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
    ctx.fillRect(this.position.x - xView, this.position.y - yView, 50, 50);
  }
}
