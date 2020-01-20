<template>
  <div class="layer">
    <canvas ref="canvas"></canvas>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide, Ref } from "vue-property-decorator";
import { Provider } from "../models/provider";

@Component
export default class Layer extends Vue {
  @Prop({ required: true }) dimensions!: { width: number; height: number };
  // This is the CanvasRenderingContext that children will draw to.
  @Provide() provider: Provider = {
    context: null,
    canvas: null
  };

  @Ref("canvas") readonly canvas!: HTMLCanvasElement;

  mounted() {
    this.canvas.width = this.dimensions.width;
    this.canvas.height = this.dimensions.height;
    // We can't access the rendering context until the canvas is mounted to the DOM.
    // Once we have it, provide it to all child components.
    this.provider.context = this.canvas.getContext("2d");
    this.provider.canvas = this.canvas;
  }
}
</script>

<style scoped lang="scss">
.layer {
  width: 100%;
  height: 100%;
}
</style>
