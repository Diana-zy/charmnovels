<template>
  <transition name="slide">
    <div v-if="show" class="notification" :class="{ success: type === 'success' }" @click="hide">
      <p>{{ message }}</p>
    </div>
  </transition>
</template>
<script>
export default {
  computed: {
    show() {
      return this.$globalData.notification.show;
    },
    message() {
      return this.$globalData.notification.message;
    },
    type() {
      return this.$globalData.notification.type;
    }
  },
  methods: {
    hide() {
      this.$globalMethod.hideNotification();
    }
  }
};
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  max-width: 400px;
  bottom: 40px;
  left: 20px;
  background: rgba($color2, 0.8);
  padding: 10px 16px;
  border-radius: 10px;
  color: #ffffff;
  line-height: 24px;
  display: flex;
  align-items: center;
  transition: transform 0.5s ease; /* 添加过渡效果 */
  z-index: 999;
  &.success {
    background: $color3;
  }
}

.slide-leave-to {
  transform: translateX(-130%); /* 进入时从左侧滑入，离开时向左侧滑出 */
}

@media screen and (max-width: 750px) {
  .notification {
    max-width: vw(658);
    bottom: vw(150);
    left: vw(46);
    padding: vw(16) vw(24);
    border-radius: vw(20);
    font-size: vw(24);
    line-height: vw(30);
  }
}
</style>
