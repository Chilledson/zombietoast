import { Entity } from "../entities/entity";
import { Rectangle } from "./rectangle";

export class Camera {
  // Distance from followed object to border before camera starts move
  private xDeadZone = 0; // min distance to horizontal borders
  private yDeadZone = 0; // min distance to vertical borders

  // The object to follow in the world
  public followed: any;

  public viewportRect: Rectangle = new Rectangle(
    this.xView,
    this.yView,
    this.viewportWidth,
    this.viewportHeight
  );

  public worldRect: Rectangle = new Rectangle(
    0,
    0,
    this.worldWidth,
    this.worldHeight
  );

  constructor(
    public xView: number = 0,
    public yView: number = 0,
    public viewportWidth: number,
    public viewportHeight: number,
    public worldWidth: number,
    public worldHeight: number
  ) {}

  update(): void {
    const { x, y } = this.followed.position;

    if (x - this.xView + this.xDeadZone > this.viewportWidth) {
      this.xView = x - (this.viewportWidth - this.xDeadZone);
    } else if (x - this.xDeadZone < this.xView) {
      this.xView = x - this.xDeadZone;
    }

    // update viewportRect
    this.viewportRect.set(this.xView, this.yView);

    // don't let camera leaves the world's boundary
    if (!this.viewportRect.within(this.worldRect)) {
      if (this.viewportRect.left < this.worldRect.left)
        this.xView = this.worldRect.left;
      if (this.viewportRect.top < this.worldRect.top)
        this.yView = this.worldRect.top;
      if (this.viewportRect.right > this.worldRect.right)
        this.xView = this.worldRect.right - this.viewportWidth;
      if (this.viewportRect.bottom > this.worldRect.bottom)
        this.yView = this.worldRect.bottom - this.viewportHeight;
    }
  }

  follow(entity: any, xDeadZone: number, yDeadZone: number) {
    this.followed = entity;
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
  }
}
