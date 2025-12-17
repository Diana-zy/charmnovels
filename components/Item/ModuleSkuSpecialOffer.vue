<template>
  <div class="item">
    <div class="tag-off" :style="{ 'background-image': `url(${tagOffIcon})` }"></div>
    <div class="item-left">
      <p class="title">{{ item.display_name }}</p>
      <p class="coins-value">{{ item.info }}</p>
      <span class="coins-tip">Spend coins to unlock any chapters you like.</span>
    </div>
    <div class="item-right">
      <p>{{ priceUnit + item.price }}</p>
      <span>{{ priceUnit + item.price_old }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    tagOffIcon() {
      const off = this.item.discount.split(" ")[0];
      return require(`@/assets/images/tag-sku-${off.replace("%", "")}-rec.png`);
    },
    priceUnit() {
      const unitArr = {
        CNY: "¥", // 人民币
        USD: "$", // 美元
        EUR: "€", // 欧元
        GBP: "£", // 英镑
        JPY: "¥", // 日元
        KRW: "₩" // 韩元
      };
      return unitArr[this.item.currency] || "$";
    }
  }
};
</script>

<style scoped lang="scss">
.item {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  background: $bgColor1;
  border: 1px solid $color3;
  .tag-off {
    position: absolute;
    right: 4px;
    top: -20px;
    width: 94px;
    height: 33px;
    background-position: center;
    background-size: 100% 100%;
  }
  .title {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 21px;
    font-family: "seb";
    color: $color3;
    &::before {
      content: "";
      @include icon(32px, 32px, "icon-percent.png");
      margin-right: 6px;
    }
  }

  .item-left {
    font-family: "seb";
    .coins-value {
      font-size: 12px;
      line-height: 19px;
    }
    .coins-tip {
      margin-top: 4px;
      font-size: 12px;
      line-height: 16px;
      color: rgba($color2, 0.4);
      font-family: "se";
    }
  }

  .item-right {
    align-content: end;
    text-align: right;
    p {
      font-size: 16px;
      font-family: "seb";
      line-height: 21px;
    }
    span {
      font-size: 14px;
      line-height: 19px;
      color: rgba($color2, 0.4);
      text-decoration: line-through;
    }
  }
}

@media screen and (max-width: 750px) {
  .item {
    padding: vw(20) vw(24);
    border-radius: vw(16);
    border: vw(2) solid $color3;
    .tag-off {
      right: vw(8);
      top: vw(-40);
      width: vw(188);
      height: vw(66);
    }
    .title {
      font-size: vw(32);
      line-height: vw(42);
      &::before {
        width: vw(64);
        height: vw(64);
        margin-right: vw(12);
      }
    }

    .item-left {
      .coins-value {
        font-size: vw(24);
        line-height: vw(38);
      }
      .coins-tip {
        margin-top: vw(8);
        font-size: vw(24);
        line-height: vw(32);
      }
    }

    .item-right {
      p {
        font-size: vw(32);
        line-height: vw(42);
      }
      span {
        font-size: vw(28);
        line-height: vw(38);
      }
    }
  }
}
</style>
