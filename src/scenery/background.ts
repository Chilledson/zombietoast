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
    let normalisedScrollValue = this.scrollVal * ratio;

    if (
      Math.abs(normalisedScrollValue) >= this.image.width ||
      Math.abs(normalisedScrollValue) <= 0
    ) {
      this.scrollVal = 0;
    }

    this.prevX = this.currentX;


    let sWidth = this.image.width * ratio;
    let sHeight = this.image.height * ratio;

    let dWidth = sWidth;
    let dHeight = sHeight;

    let sx = this.image.width + normalisedScrollValue;
    let sy = ctx.canvas.height - this.image.height; // Anchor to bottom of canvas

    // Central image
    ctx.drawImage(this.image, -sx, 0, sWidth, sHeight, 0, sy, dWidth, dHeight);

    // Image to the right of the screen
    ctx.drawImage(
      this.image,
      -normalisedScrollValue,
      0,
      sWidth,
      sHeight,
      0,
      sy,
      dWidth,
      dHeight
    );

    // Image to the left of the screen
    ctx.drawImage(
      this.image,
      sWidth - normalisedScrollValue,
      0,
      sWidth,
      sHeight,
      0,
      sy,
      dWidth,
      dHeight
    );

  }
}
