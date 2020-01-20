<template>
  <div id="viewport">
    <layer class="background" :dimensions="layerSize">
      <Background ref="background" @afterrender="afterRender" :speed="speed" />
    </layer>
    <layer class="foreground" :dimensions="layerSize">
      <Player ref="player" />

      <!-- <Sprite ref="sprite" /> -->
    </layer>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Provide,
  ProvideReactive
} from "vue-property-decorator";
import Layer from "./components/Layer.vue";
import Player from "./components/Player.vue";
import Background from "./components/Background.vue";
import Sprite from "./components/Sprite.vue";
import { Coords } from "./models/coordinates";

@Component({
  components: {
    Layer,
    Player,
    Background,
    Sprite
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

  loop() {
    this.now = performance.now();
    this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);

    while (this.dt > this.step) {
      this.dt = this.dt - this.step;
      Object.values(this.$refs).forEach((ref: any) => {
        if (typeof ref.update === "function") {
          ref.update(this.step, this.now);
        }
      });
    }
    window.requestAnimationFrame(this.loop);
  }

  afterRender(now: number) {
    if (now) {
      this.last = now;
    }
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
