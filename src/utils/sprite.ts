import { Coords } from "@/models/coordinates";
import { getImage } from "./image";

export class Sprite {
  // the x and y coordinate in the image for this sprite
  position: Array<number> = [0, 0];
  // size of the sprite (just one keyframe)
  size: Array<number> = [64, 64];
  // speed in frames/sec for animating
  speed: number = 4;
  // an array of frame indexes for animating: [0, 1, 2, 1]
  _frames: Array<number> = [2, 3, 4, 5];

  get frames() {
    return this._frames;
  }

  set frames(frames) {
    this._frames = frames;
  }

  // Position in the frame
  index: number = 0;
  // which direction to move in the sprite map when animating: 'horizontal' (default) or 'vertical'
  dir: string = "horizontal";
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

    if (this.dir == "vertical") {
      y += frame * h;
    } else {
      x += frame * w;
    }

    // console.log(x, y)

    if (this.image) {
      ctx.drawImage(this.image, x, y, w, h, coords.x, coords.y, w, h);
    }
  }
}
