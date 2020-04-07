export class Logger {
  private message: any = "";

  constructor() {}

  write(text: any) {
    this.message = text;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = "30px Arial";

    ctx.fillText(this.message, 10, 50);
  }
}
