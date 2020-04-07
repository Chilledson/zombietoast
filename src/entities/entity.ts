import { Coords } from "../models/coordinates";

export interface Entity {
  position: Coords;

  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D, xView: number, yView: number): void;
}
