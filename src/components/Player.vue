<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from "vue-property-decorator";
import { Provider } from "../models/provider";
import { Coords } from "../models/coordinates";
import { Sprite } from "../utils/sprite";

const IDLE_FRAMES = [0, 1];
const MOVING_FRAMES = [2, 3, 4, 5];
const JUMPING_FRAMES = [6, 7, 8, 9, 10, 11, 12, 13];
const DEAD_FRAMES = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

@Component
export default class Player extends Vue {
  @Inject("provider") provider!: Provider;

  @Prop({ default: 50 })
  radius!: number;

  layerSize = { width: window.innerWidth, height: window.innerHeight };
  size: number = 66;
  position: Coords = { x: 50, y: window.innerHeight - 50 };
  newCoords: Coords = { x: 50, y: window.innerHeight - 50 };
  velocity = { x: 0, y: 0 };
  moving: boolean = false;
  distance: number = 5;
  friction: number = 0.89; // friction
  baseVelocity: number = 0.95;
  pressedKeys: { [key: string]: boolean } = {
    left: false,
    right: false,
    up: false,
    down: false
  };
  keyMap: { [key: number]: string } = {
    68: "right",
    65: "left",
    87: "up",
    83: "down"
  };
  now!: number;
  speed: number = 50;
  sprite!: Sprite;

  update(dt: number, now: number) {

    if (
      this.pressedKeys.up && // Is jumping
      this.velocity.y > 0 && // Is not falling
      this.position.y + this.size >= this.layerSize.height // Is on the bottom of the screen
    ) {
      this.velocity.y -= 15;
    }

    if (this.pressedKeys.left) {
      this.velocity.x -= this.baseVelocity;
    }

    if (this.pressedKeys.right) {
      this.velocity.x += this.baseVelocity;
    }

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
    if (this.position.x - this.size < 0) {
      this.newCoords.x = this.size;
      this.velocity.x = 0;
    }

    // Off the right of the screen
    if (this.position.x + this.size > this.layerSize.width) {
      this.newCoords.x = this.layerSize.width - this.size;
      this.velocity.x = 0;
    }

    // Off the bottom of the screen
    if (this.position.y + this.size > this.layerSize.height) {
      this.newCoords.y = this.layerSize.height - this.size;
      this.velocity.y = 0;
    }

    let hasMoved =
      this.position.x !== this.newCoords.x ||
      this.position.y !== this.newCoords.y;

    this.position = this.newCoords;

    if (hasMoved) {
      this.sprite.frames = MOVING_FRAMES;
    } else {
      // Is idle
      this.sprite.frames = IDLE_FRAMES;
    }

    this.sprite.update(this.provider.context, dt, this.position);

    // Update timestamp
    this.now = now;
  }

  render() {
    if (!this.provider.context) {
      return;
    }

    this.draw(this.provider.context);
    this.$emit("afterrender", this.now);
  }

  draw(ctx: any) {
    const { width, height } = this.provider.canvas!;
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // ctx.beginPath();
    // ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    // ctx.fillStyle = "blue";
    // ctx.fill();
    // ctx.stroke();
    // ctx.closePath();
  }

  mounted() {
    window.addEventListener("keydown", this.onMove);
    window.addEventListener("keyup", this.onMoveStop);

    this.sprite = new Sprite("ZombieToast.png");
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
}
</script>

<style lang="scss"></style>
