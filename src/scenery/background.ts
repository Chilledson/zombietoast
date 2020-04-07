import backgroundImage from "../assets/scenery/Grass 2.png";
import { Logger } from "../utils/logger";
import { Coords } from "../models/coordinates";

export class Background {
  image = new Image();
  totalSeconds: number = 0;
  scrollVal: number = 0;

  prevX: number = 0;
  currentX: number = 0;

  constructor(
    public canvasWidth: number,
    public canvasHeight: number,
    public speed: number = 100
  ) {
    this.image.src = backgroundImage;
  }

  update(dt: number) {}

  // draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
  //   let sx, sy, dx, dy;
  //   let sWidth, sHeight, dWidth, dHeight;

  //   // offset point to crop the image
  //   sx = xView;
  //   sy = yView;

  //   // dimensions of cropped image
  //   sWidth = ctx.canvas.width;
  //   sHeight = ctx.canvas.height;

  //   sy -= sHeight - this.image.height;

  //   // if cropped image is smaller than canvas we need to change the source dimensions
  //   if (this.image.width - sx < sWidth) {
  //     sWidth = this.image.width - sx;
  //   }
  //   if (this.image.height - sy < sHeight) {
  //     sHeight = this.image.height - sy;
  //   }

  //   // location on canvas to draw the cropped image
  //   dx = 0;
  //   dy = 0;
  //   // match destination with source to not scale the image
  //   dWidth = sWidth;
  //   dHeight = sHeight;

  //   // Draw first image
  //   ctx.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

  // }d

  draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
    this.currentX = xView;

    const distance = this.currentX - this.prevX;

    this.scrollVal -= distance;


    let hRatio = ctx.canvas.width / this.image.width;
    let vRatio = ctx.canvas.height / this.image.height;
    let ratio = Math.min(hRatio, vRatio);

    let normalisedScrollValue = Math.abs(this.scrollVal * ratio)

    if (normalisedScrollValue >= ctx.canvas.width || normalisedScrollValue <= 0) {
      this.scrollVal = 0;
    }

    this.prevX = this.currentX;

    let sx = this.image.width + this.scrollVal;
    let sy = ctx.canvas.height - (this.image.height - yView) * ratio;

    let dWidth = this.image.width * ratio;
    let dHeight = this.image.height * ratio;

    console.log(sy)

    // Central image
    ctx.drawImage(
      this.image,
      -sx,
      sy,
      this.image.width,
      this.image.height,
      0,
      sy,
      dWidth,
      dHeight
    );

    // Image to the right of the screen
    ctx.drawImage(
      this.image,
      -this.scrollVal,
      sy,
      this.image.width,
      this.image.height,
      0,
      sy,
      dWidth,
      dHeight
    );

    // Image to the left of the screen
    ctx.drawImage(
      this.image,
      this.image.width - this.scrollVal,
      sy,
      this.image.width,
      this.image.height,
      0,
      sy,
      dWidth,
      dHeight
    );

    ctx.strokeRect(sx, sy, dWidth, dHeight);
    ctx.strokeRect(this.scrollVal, sy, dWidth, dHeight);
  }
}
