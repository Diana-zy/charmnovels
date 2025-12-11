<template>
  <s-popup
    ref="topUpRef"
    :value.sync="visible"
    label="Unlock This Chapter"
    showHeader
    isCenter
    click-layer-hide
  >
    <template v-slot:content>
      <div class="content">
        <div class="ms-box"> Choose a recharge level and unlock chapters you like! </div>
        <div class="select-box">
          <div
            v-for="(item, i) in list"
            :key="i"
            class="select-item"
            :class="{ active: i === select }"
            @click="handleClick(i)"
          >
          </div>
        </div>
        <div class="top-up-box">
          <div
            v-for="(item, i) in list"
            :key="i"
            class="item swiper-slide"
            :class="{ active: 'vip' + i === select }"
            @click="handleClick(i, 'vip')"
          >
          </div>
        </div>
        <div class="btn-box">
          <div class="btn top-btn">a</div>
          <div class="btn bottom-btn" @click="handlePayByPaypel">b</div>
        </div>
      </div>
    </template>
  </s-popup>
</template>

<script>
import { directive } from "vue-awesome-swiper";
import "swiper/css/swiper.min.css";
export default {
  name: "TopUpPopup",
  directives: {
    swiper: directive
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => [{}, {}, {}]
    }
  },
  data() {
    return {
      select: 1
    };
  },
  watch: {
    visible(val) {
      this.$emit("update:visible", val);
    }
  },
  methods: {
    handleClick(num, type) {
      if (type) {
        this.select = type + num;
      } else {
        this.select = num;
      }
    },
    handlePayByPaypel() {
      this.$globalMethod.showNotification({
        message: "PayPal is currently unavailable.Please use Stripe to complete your payment",
        type: "warning"
      });
    },
    handleClose() {
      this.$refs.topUpRef.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.content {
  padding: vw(32);
  .ms-box {
    margin: 0 0 vw(50);
    text-align: center;
    line-height: vw(38);
    font-size: vw(28);
    color: $color2;
    font-weight: 400;
  }
  .top-up-box {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: scroll;
    gap: vw(20);
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .item {
    flex-shrink: 0;
    width: vw(660);
    height: vw(222);
    border-radius: vw(8);
    background: pink;
  }
  .item:last-child {
    margin-right: 0;
  }
  .select-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: vw(28);
    .select-item {
      width: vw(200);
      height: vw(272);
      margin-bottom: vw(48);
      background: pink;
      border-radius: vw(16);
    }
  }
  .active {
    border: vw(2) solid #fa7a1d;
    background: #f59a23 !important;
  }
  .btn-box {
    padding-top: vw(32);
    width: 100%;
    .btn {
      width: 100%;
      border-radius: vw(40);
      height: vw(80);
      text-align: center;
      line-height: vw(80);
      margin-bottom: vw(32);
      border: vw(2) solid #ccc;
    }
  }
}
</style>
