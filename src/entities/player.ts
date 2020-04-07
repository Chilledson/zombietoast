import { Coords } from "../models/coordinates";
import { Direction } from "../models/direction";
import { Sprite } from "../utils/sprite";
import { Projectile } from "./projectile";

import SpriteImage from "../assets/player/ZombieToast-combined-128.png";
import BallSpriteImage from "../assets/player/ball-throw3.png";
import { Entity } from "./entity";

const IDLE_FRAMES = [0, 1];
const MOVING_FRAMES = [2, 3, 4, 5];
// const isJumping_FRAMES = [6, 7, 8, 9, 10, 11, 12, 13];
const DEAD_FRAMES = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const SHOOT_FRAMES = [25, 26, 27, 28];
const PROJECTILE_FRAMES = [0, 1, 2];
const PROJECTILE_DEAD = [3, 4, 5, 6];

export default class Player {
  layerSize = { width: window.innerWidth, height: window.innerHeight };
  size: number = 128;
  position: Coords = { x: 50, y: window.innerHeight - 50 };
  newCoords: Coords = { x: 50, y: window.innerHeight - 50 };
  velocity = { x: 0, y: 0 };
  moving: boolean = false;
  distance: number = 5;
  friction: number = 0.79; // friction
  baseVelocity: number = 0.99;
  pressedKeys: { [key: string]: boolean } = {
    left: false,
    right: false,
    up: false,
    down: false,
    spacebar: false,
  };
  keyMap: { [key: number]: string } = {
    68: "right",
    65: "left",
    87: "up",
    83: "down",
    32: "spacebar",
  };
  sprite!: Sprite;

  isJumping: boolean = false;
  isDead: boolean = false;
  isShooting: boolean = false;
  dir: Direction = Direction.RIGHT;
  lastFire!: number;
  projectiles: Array<Projectile> = [];
  projectileImg: HTMLImageElement;

  constructor(private worldWidth: number, private worldHeight: number) {
    window.addEventListener("keydown", this.onMove.bind(this));
    window.addEventListener("keyup", this.onMoveStop.bind(this));

    const img = new Image();
    img.src = SpriteImage;

    this.projectileImg = new Image();
    this.projectileImg.src = BallSpriteImage;

    this.sprite = new Sprite(img, IDLE_FRAMES, 0, 6, [128, 128], false);
  }

  update(dt: number) {
    let hasMoved = false;

    if (
      this.pressedKeys.up && // Is Jumping
      this.velocity.y > 0 && // Is not falling
      this.position.y + this.size >= this.layerSize.height // Is on the bottom of the screen
    ) {
      this.velocity.y -= 15;
      this.isJumping = true;
      hasMoved = true;
    } else {
      this.isJumping = false;
    }

    if (this.pressedKeys.left) {
      this.velocity.x -= this.baseVelocity;
      hasMoved = true;
      this.dir = Direction.LEFT;
    }

    if (this.pressedKeys.right) {
      this.velocity.x += this.baseVelocity;
      hasMoved = true;
      this.dir = Direction.RIGHT;
    }

    this.isShooting = this.pressedKeys.spacebar;

    this.newCoords.x += this.velocity.x;
    this.newCoords.y += this.velocity.y;
    // Slowdown friction
    this.velocity.x *= this.friction;
    this.velocity.y = this.velocity.y + dt * 40;

    // Moving off the top of the screen
    if (this.position.y - this.size < 0) {
      this.newCoords.y = this.size;
      this.velocity.y = 0;
    }

    // Off the left of the screen
    if (this.position.x < 0) {
      this.newCoords.x = 0;
      this.velocity.x = 0;
    }

    // Off the right of the world
    if (this.position.x + this.size > this.worldWidth) {
      this.newCoords.x = this.worldWidth - this.size;
      this.velocity.x = 0;
    }

    // Off the bottom of the screen
    if (this.position.y + this.size > this.layerSize.height) {
      this.newCoords.y = this.layerSize.height - this.size;
      this.velocity.y = 0;
    }
    if (hasMoved) {
      this.sprite.frames = MOVING_FRAMES;
    } else if (this.isDead) {
      this.sprite.frames = DEAD_FRAMES;
    } else if (this.isShooting) {
      this.sprite.frames = SHOOT_FRAMES;
    } else {
      // Is idle
      this.sprite.frames = IDLE_FRAMES;
    }

    if (
      this.isShooting &&
      (performance.now() - this.lastFire > 700 || !this.lastFire)
    ) {
      const mid = this.midPoint();

      this.projectiles.push(
        new Projectile(
          14,
          14,
          mid.x,
          mid.y,
          this.dir,
          250, // Movement delay
          700, // Range (in px)
          700, // Speed
          [68, 32],
          new Sprite(
            this.projectileImg,
            PROJECTILE_FRAMES,
            this.dir === Direction.RIGHT ? 0 : 1,
            7,
            [92, 64],
            true
          )
        )
      );
      // Update last fire time
      this.lastFire = performance.now();
    }

    // Set the row of the animation - one row per player direction
    this.sprite.currentRow = this.dir === Direction.RIGHT ? 1 : 0;

    this.position = this.newCoords;

    this.sprite.update(dt);
    this.projectiles.forEach((projectile, index) => {
      projectile.update(dt, this.position.x + 24, this.position.y + 92);

      if (!projectile.alive) {
        // Remove dead projectiles
        this.projectiles.splice(index, 1);
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D, xView: number, yView: number) {
    const playerWorldPosition = {
      x: this.position.x - xView,
      y: this.position.y - yView,
    };
    this.sprite.draw(ctx, playerWorldPosition);
    this.projectiles.forEach((projectile) =>
      projectile.draw(ctx, xView, yView)
    );
  }

  onMove(event: KeyboardEvent) {
    const key = this.keyMap[event.keyCode];
    if (key) {
      this.moving = true;
      this.pressedKeys[key] = true;
    }
  }

  onMoveStop(event: KeyboardEvent) {
    const key = this.keyMap[event.keyCode];
    if (key) {
      this.moving = false;
      this.pressedKeys[key] = false;
    }
  }

  midPoint() {
    return {
      x: this.position.x + this.size / 2,
      y: this.position.y + this.size / 2,
    };
  }
}
