<template>
  <transition name="fade">
    <div
      v-show="visible"
      class="model-overlay"
      :class="{ 'show-layer': showLayer }"
      @click="handleClickLayer"
    >
      <div v-show="visible" class="model-center" @click.stop="handleClick">
        <slot name="content"></slot>
        <footer v-show="showCloseIcon" class="footer-close-icon" @click="handleClose">
          <div class="icon-dialog-close"></div>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "SModel",
  props: {
    showLayer: {
      type: Boolean,
      default: true
    },
    value: {
      type: Boolean,
      default: false
    },
    clickLayerHide: {
      type: Boolean,
      default: false
    },
    showCloseIcon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: this.value
    };
  },
  watch: {
    visible: {
      handler(val) {
        this.$emit("update:value", val);
        this.$nextTick(() => {
          if (process.client) {
            if (val) {
              window?.document.body.classList.add("no-scroll");
            } else {
              window?.document.body.classList.remove("no-scroll");
            }
          }
        });
      },
      immediate: true
    },
    value(val) {
      this.visible = val;
    }
  },
  methods: {
    handleClickLayer() {
      if (this.showLayer && this.clickLayerHide) {
        this.visible = false;
      }
    },
    handleClick() {},
    handleClose() {
      this.$emit("handleClose");
      this.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.model-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
}
.show-layer {
  background: rgba(#000, 0.4);
  pointer-events: auto;
}
.model-center {
  z-index: 101;
  pointer-events: auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
}
.footer-close-icon {
  width: fit-content;
  margin: vw(120) auto 0;
}
.icon-dialog-close {
  @include icon(vw(60), vw(60), "icon-dialog-close.png");
}
</style>
