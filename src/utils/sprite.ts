import { Coords } from "@/models/coordinates";
import { getImage } from "./image";

export class Sprite {
  // scale the sprite image
  scale: number = 1;

  // the x and y coordinate in the image for this sprite
  position: Array<number> = [0, 0];

  // size of the sprite (just one keyframe)
  size: Array<number> = [64, 64];

  // the number of rows
  rows: number = 2;

  // sprite height
  imgHeight: number = 128;

  // speed in frames/sec for animating
  speed: number = 4;

  // the row to use
  private _currentRow: number = 1;

  public get currentRow() {
    return this._currentRow;
  }
  public set currentRow(row) {
    this._currentRow = row;
  }

  // an array of frame indexes for animating: [0, 1, 2, 1]
  private _frames: Array<number> = [2, 3, 4, 5];

  public get frames() {
    return this._frames;
  }

  public set frames(frames) {
    this._frames = frames;
  }

  // Position in the frame
  index: number = 0;

  // true to only run the animation once, defaults to false
  once: boolean = false;

  done: boolean = false;

  image!: HTMLImageElement;

  now!: number;

  constructor(private url: string) {
    getImage(this.url).then(image => (this.image = image));
  }

  update(ctx: any, dt: number, coords: Coords) {
    this.index += this.speed * dt;

    this.draw(ctx, coords);
  }

  draw(ctx: any, coords: Coords) {
    const { width, height } = ctx.canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    let frame;

    if (this.speed > 0) {
      const max = this.frames.length;
      const idx = Math.floor(this.index);
      frame = this.frames[idx % max];

      if (this.once && idx >= max) {
        this.done = true;
        return;
      }
    } else {
      frame = 0;
    }

    let [x, y] = this.position;
    let [w, h] = this.size;

    y += this.imgHeight - (this.imgHeight / this.currentRow);
    x += frame * w;

    if (this.image) {
      ctx.drawImage(this.image, x, y, w, h, coords.x, coords.y, w, h);
    }
  }
}
