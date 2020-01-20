<script lang="ts">
import {
  Component,
  Vue,
  Inject,
  Prop,
  Watch,
  InjectReactive
} from "vue-property-decorator";
import { Provider } from "../models/provider";
import { Coords } from "../models/coordinates";
import { getImage } from "../utils/image";

@Component
export default class Background extends Vue {
  @Inject("provider") provider!: Provider;

  @Prop({ default: 0 })
  speed!: number;

  scrollVal: number = 0;

  backgroundLayers: Array<{
    src: string;
    image: HTMLImageElement | null;
    offset: number;
  }> = [
    {
      src: "/background/Sky BG 1.png",
      image: null,
      offset: 0.6
    },
    {
      src: "/background/Clouds.png",
      image: null,
      offset: 0.5
    },
    {
      src: "/background/Grass 2.png",
      image: null,
      offset: 0.7
    },
    {
      src: "/background/Grass 1.png",
      image: null,
      offset: 1
    }
  ];
  now!: number;
  scale!: number;

  mounted() {
    this.backgroundLayers.forEach(async (layer, index) => {
      const image = await getImage(layer.src);
      this.backgroundLayers[index].image = image;
    });

    this.scale = Math.max(window.innerWidth / 1280, window.innerHeight / 640);
  }

  update(dt: number, now: number) {
    this.scrollVal += this.speed * dt;

    if (this.scrollVal >= 1280 * this.scale) {
      this.scrollVal = 0;
    }

    this.now = now;
  }

  render() {
    if (!this.provider.context) {
      return;
    }

    this.draw(this.provider.context);
    // after render
    this.$emit("afterrender", this.now);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { width, height } = this.provider.canvas!;
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    this.backgroundLayers.forEach(({ image, offset }) => {
      if (image) {
        const scale = Math.max(width / image.width, height / image.height);
        // get the top left position of the image
        const x = width / 2 - (image.width / 2) * scale;
        const y = height / 2 - (image.height / 2) * scale;

        ctx.drawImage(
          image,
          x + (image.width * scale - this.scrollVal) * offset,
          y,
          image.width * scale,
          image.height * scale
        );

        ctx.drawImage(
          image,
          x - this.scrollVal * offset,
          y,
          image.width * scale,
          image.height * scale
        );
      }
    });
  }
}
</script>

<style lang="scss"></style>
