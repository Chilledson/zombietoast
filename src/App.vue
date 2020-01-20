<template>
  <div id="viewport">
    <layer class="background" :dimensions="layerSize">
      <Background ref="background" :speed="speed" />
    </layer>
    <layer class="foreground" :dimensions="layerSize">
      <Player ref="player" />
    </layer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Layer from "./components/Layer.vue";
import Player from "./components/Player.vue";
import Background from "./components/Background.vue";

@Component({
  components: {
    Layer,
    Player,
    Background
  }
})
export default class App extends Vue {
  dt: number = 0;
  step: number = 1 / 60;
  now!: number;
  last: number = performance.now();
  speed = 50;

  layerSize = { width: window.innerWidth, height: window.innerHeight };

  mounted() {
    window.requestAnimationFrame(this.loop);
  }

  update(step: number) {
    Object.values(this.$refs).forEach((ref: any) => {
      if (typeof ref.update === "function") {
        ref.update(this.step, this.now);
      }
    });
  }
  
  loop() {
    this.now = performance.now();
    this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);

    while (this.dt > this.step) {
      this.dt = this.dt - this.step;
      this.update(this.step);
    }

    this.last = this.now;

    window.requestAnimationFrame(this.loop);
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
}

#viewport {
  position: relative;
  background: #9acbfc;
  height: 100vh;
  overflow: hidden;
}

.layer {
  position: absolute;
  &.background {
    z-index: 1;
  }
  &.foreground {
    z-index: 2;
  }
}
</style>
