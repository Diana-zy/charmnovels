<template>
  <div v-if="show" class="dialog-overlay">
    <div class="dialog-box">
      <p class="dialog-message">{{ message }}</p>
      <div class="dialog-actions">
        <button @click="cancel">Cancel</button>
        <button @click="confirm">Log in</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      distanceFromTop: 0
    };
  },
  computed: {
    show() {
      return this.$globalData.dialog.show;
    },
    message() {
      return this.$globalData.dialog.message;
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.distanceFromTop = document.documentElement.scrollTop;
        document.body.classList.add("no-scroll");
        document.body.style.top = `-${this.distanceFromTop}px`;
        window.dataLayer.push({ event: "Login_expired_Window" });
      } else {
        document.body.classList.remove("no-scroll");
        window.scrollTo(0, this.distanceFromTop); // 恢复滚动位置
      }
    }
  },

  methods: {
    confirm() {
      this.$emit("confirm");
      this.$globalMethod.hideDialog();
    },
    cancel() {
      this.$emit("cancel");
      this.$globalMethod.hideDialog();
    }
  }
};
</script>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba($color6, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-box {
  width: 329px;
  background: $color1;
  border-radius: 16px;
  text-align: center;
  font-size: 16px;
  line-height: 21px;
}
.dialog-message {
  padding: 32px 16px;
  border-bottom: 1px solid #ececee;
}
.dialog-actions {
  position: relative;
  display: flex;
  &::before {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    content: "";
    display: inline-block;
    width: 1px;
    height: 100%;
    background: #ececee;
  }
}
button {
  flex: 1;
  height: 48px;
  border: none;
  background: none;
  @include center;
  cursor: pointer;
  color: rgba($color2, 0.4);
  font-size: 16px;
  line-height: 21px;
  font-family: "seb";
  &:last-child {
    color: $color3;
  }
}

@media screen and (max-width: 750px) {
  .dialog-box {
    width: vw(658);
    border-radius: vw(32);
    text-align: center;
    font-size: vw(32);
    line-height: vw(42);
  }
  .dialog-message {
    padding: vw(64) vw(32);
  }
  button {
    height: vw(96);
    font-size: vw(32);
    line-height: vw(42);
  }
}
</style>
