import Player from "./entities/player";
import { EnemyManager } from "./utils/enemyManager";
import { hasRectCollided } from "./utils/collision";
import { Background } from "./scenery/background";
import { Camera } from "./utils/camera";
import { Logger } from "./utils/logger";

export default class App {
  dt: number = 0;
  step: number = 1 / 60;
  now: number = 0;
  last: number = performance.now();
  speed = 50;
  layerSize: any = {};
  ctx: CanvasRenderingContext2D;
  world: any = {};

  player: Player;
  enemyManager: EnemyManager;
  background: Background;
  camera: Camera;
  logger: Logger;

  constructor(public canvas: HTMLCanvasElement) {
    window.requestAnimationFrame(this.loop.bind(this));

    this.logger = new Logger();

    this.ctx = canvas.getContext("2d");

    const scale = this.resize();

    console.log(scale);

    this.layerSize = {
      width: this.canvas.width,
      height: this.canvas.height,
    };

    this.world = {
      width: 6000,
      height: this.layerSize.width,
    };

    this.player = new Player(
      this.world.width,
      this.world.height,
      this.layerSize
    );

    this.enemyManager = new EnemyManager(
      [],
      { max: 2, spawnInterval: 1000 },
      this.layerSize
    );

    this.background = new Background(this.canvas.width, this.canvas.height);

    // Set the right viewport size for the camera
    const vWidth = Math.min(this.world.width, this.canvas.width);
    const vHeight = Math.min(this.world.height, this.canvas.height);

    this.camera = new Camera(
      0,
      0,
      vWidth,
      vHeight,
      this.world.width,
      this.world.height
    );

    this.camera.follow(this.player, vWidth / 2, vHeight / 2);
  }

  resize() {
    const baseW = 1280;
    const baseH = 720;
    const deviceWidth = baseW; // window.innerWidth;
    const deviceHeight = baseH; // window.innerHeight;

    const scaleFitNative = Math.min(deviceWidth / baseW, deviceHeight / baseH);

    this.canvas.style.width = `${deviceWidth}px`;
    this.canvas.style.height = `${deviceHeight}px`;
    this.canvas.width = deviceWidth;
    this.canvas.height = deviceHeight;

    return scaleFitNative;
  }

  loop() {
    this.now = performance.now();
    this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);

    while (this.dt > this.step) {
      this.dt = this.dt - this.step;
      // Update entities
      this.update(this.step);
    }

    // Render entities
    this.render(this.dt);
    this.last = this.now;
    window.requestAnimationFrame(this.loop.bind(this));
  }

  update(step: number) {
    this.player.update(step);
    this.enemyManager.update(step);
    this.background.update(step);

    this.detectCollisions();

    this.camera.update();
  }

  render(step: number) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    const { xView, yView } = this.camera;

    // Draw
    this.background.draw(this.ctx, xView, yView);
    this.player.draw(this.ctx, xView, yView);
    this.enemyManager.draw(this.ctx, xView, yView);

    // Log
    this.logger.draw(this.ctx);
  }

  detectCollisions() {
    this.player.projectiles.forEach((p, i) => {
      this.enemyManager.enemies.forEach((e, j) => {
        const eRect = {
          ...e.position,
          width: 50,
          height: 50,
        };

        const pRect = {
          ...p.position,
          width: p.width,
          height: p.height,
        };

        if (hasRectCollided(eRect, pRect)) {
          this.enemyManager.kill(j);
          this.player.projectiles.splice(i, 1);
        }
      });
    });
  }
}

const app = new App(<HTMLCanvasElement>document.getElementById("app"));
