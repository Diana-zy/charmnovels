<template>
  <s-model :value.sync="visible" :show-close-icon="false">
    <template #content>
      <div class="content">
        <h2>Daily Limit Reached</h2>
        <p
          >You’ve used today’s all 5 free unlock limit. You can unlock more with coins, or come back
          tomorrow for more free unlocks!</p
        >
        <footer class="submit-box">
          <div @click="handleClickClose">Close</div>
          <div @click="handleClickUnlockNow">Unlock Now</div>
        </footer>
      </div>
    </template>
  </s-model>
</template>

<script>
export default {
  name: "IncentiveAdUseUpTip",
  props: {},
  data() {
    return {
      visible: false
    };
  },
  methods: {
    handleClickClose() {
      this.visible = false;
    },
    handleClickUnlockNow() {
      this.visible = false;
      this.$emit("handleClickUnlockNow");
    }
  }
};
</script>

<style scoped lang="scss">
.content {
  width: vw(600);
  background: $color1;
  padding: vw(32);
  border-radius: vw(16);
  h2 {
    text-align: center;
    font-size: vw(42);
    line-height: vw(64);
    font-family: "seb";
    margin-bottom: vw(24);
  }
  p {
    font-size: vw(32);
    line-height: vw(38);
    color: rgba($color2, 0.4);
  }
}
.submit-box {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: vw(24);
  div {
    width: vw(220);
    height: vw(80);
    border-radius: vw(40);
    @include center;
    background: rgba($color2, 0.4);
    color: $color1;
    font-size: 16px;
    line-height: 21px;
    font-family: "seb";

    &:last-child {
      background: $color3;
    }
  }
}
</style>
