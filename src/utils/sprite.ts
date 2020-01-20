import { Coords } from "@/models/coordinates";
import { getImage } from "./image";

export class Sprite {

  // the x and y coordinate in the image for this sprite
  private position: Array<number> = [0, 0];

  // size of the sprite (just one keyframe)
  size: Array<number> = [128, 128];

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
  private _frames: Array<number> = [];

  public get frames() {
    return this._frames;
  }

  public set frames(frames) {
    this._frames = frames;
  }

  // Position in the frame
  index: number = 0;

  // The image source
  image!: HTMLImageElement;

  constructor(
    private url: string,
    frames: Array<number>,
    currentRow: number,
    speed: number,
    size: Array<number>,
  ) {
    
    this.frames = frames;
    this.currentRow = currentRow;
    this.speed = speed;
    this.size = size;

    getImage(this.url).then(image => (this.image = image));
  }

  update(dt: number) {
    this.index += this.speed * dt;
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
    } else {
      frame = 0;
    }

    let [x, y] = this.position;
    let [w, h] = this.size;

    y = this.currentRow * h;
    x += frame * w;

    if (this.image) {
      ctx.drawImage(this.image, x, y, w, h, coords.x, coords.y, w, h);
    }
  }
}
