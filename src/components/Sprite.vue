<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from "vue-property-decorator";
import { Provider } from "../models/provider";
import { Coords } from "../models/coordinates";
import { getImage } from "../utils/image";

@Component
export default class Sprite extends Vue {
  @Inject("provider") provider!: Provider;

  // the x and y coordinate in the image for this sprite
  position: Array<number> = [0, 0];
  // size of the sprite (just one keyframe)
  size: Array<number> = [64, 64];
  // speed in frames/sec for animating
  speed: number = 4;
  // an array of frame indexes for animating: [0, 1, 2, 1]
  frames: Array<number> = [2, 3, 4, 5];
  index: number = 0;
  // the path to the image for this sprite
  url: string = "ZombieToast.png";
  // which direction to move in the sprite map when animating: 'horizontal' (default) or 'vertical'
  dir: string = "horizontal";
  // true to only run the animation once, defaults to false
  once: boolean = false;

  done: boolean = false;

  image!: HTMLImageElement;

  now!: number;

  mounted() {
    getImage(this.url).then(image => (this.image = image));
  }

  update(dt: number, now: number) {
    this.index += this.speed * dt;
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

    if (this.image) ctx.drawImage(this.image, x, y, w, h, 0, 0, w, h);
  }
}
</script>

<style lang="scss"></style>
