<template>
  <transition name="fade">
    <div
      v-show="visible"
      class="popup-layer"
      :class="{ 'show-layer': showLayer }"
      @click="handleClickLayer"
    >
      <transition name="slide">
        <div v-show="visible" class="popup-bottom" @click.stop="handleClick">
          <div :class="['popup-container', { 'popup-container-dark': theme === 'dark' }]">
            <div v-show="showHeader" class="popup-header">
              <h3 :class="{ isCenter: isCenter }">{{ label }}</h3>
              <i class="icon-close" @click="handleClose"></i>
            </div>
            <slot name="content"></slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: "SPopup",
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
    theme: {
      type: String,
      default: "light" // light: 白色主题, dark: 黑色主题
    },
    showHeader: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    isCenter: {
      type: Boolean,
      default: false
    },
    closeNeedCallBack: {
      type: Boolean,
      default: false
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
    handleClose() {
      if (this.closeNeedCallBack) {
        this.$emit("handleClose");
      } else {
        this.visible = false;
        this.$emit("handleClose");
      }
    },
    handleClick() {}
  }
};
</script>

<style scoped lang="scss">
.popup-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 900;
}
.show-layer {
  background: rgba(#000, 0.4);
  pointer-events: auto;
  display: flex;
  justify-content: center;
}
.popup-bottom {
  pointer-events: auto;
  position: fixed;
  bottom: 0;
  width: 450px;
  z-index: 901;
}
.popup-container {
  width: 100%;
  background: $color4;
  box-shadow: 0 4px 16px 0 rgba($color6, 0.15);
  border-radius: 28px 28px 0 0;
}
.popup-header {
  display: flex;
  align-items: center;
  height: 46px;
  padding-left: 20px;
  border-bottom: 1px solid rgba($color2, 0.1);
}

.icon-close {
  @include icon(20px, 20px, "icon-close-black.png");
  margin-left: auto;
  margin-right: 20px;
}
.isCenter {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
@media (max-width: 750px) {
  .popup-bottom {
    pointer-events: auto;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  .popup-container {
    width: 100%;
    box-shadow: none;
    border-radius: vw(48) vw(48) 0 0;
  }
  .popup-header {
    height: vw(96);
    padding: vw(30) vw(46) 0;
    h3 {
      font-weight: bold;
      font-size: vw(28);
      color: $color2;
    }
  }
  .icon-close {
    @include icon(vw(48), vw(48), "icon-close-black.png");
    margin-left: auto;
  }
  .isCenter {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .popup-container-dark {
    background: $color7;
    color: $color8;
    .icon-close {
      @include icon(vw(48), vw(48), "icon-close.png");
    }
    .sort-row {
      color: rgba($color8, 0.6);
    }
    .chapter-item {
      border-bottom: 1px solid rgba($color8, 0.1);
    }
    .chapter-item-active {
      color: $color8;
    }
  }
}
</style>
