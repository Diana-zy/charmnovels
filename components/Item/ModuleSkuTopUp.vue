<template>
  <div class="item">
    <div class="tag-off">{{ newDiscount }}</div>
    <div class="item-left">
      <p
        ><span class="coins-value">{{ item.base_coin }}</span> coins</p
      >
      <span class="coins-added">+{{ item.bonus_coin }} coins</span>
    </div>
    <div class="item-right">
      <p>{{ priceUnit + item.price }}</p>
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
    newDiscount() {
      return this.item.discount.includes("!")
        ? this.item.discount.split("!")[0]
        : this.item.discount;
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
  padding: 10px 12px 9px;
  border-radius: 8px;
  background: #fefaf8;
  border: 1px solid $color3;
  .tag-off {
    position: absolute;
    right: 6px;
    top: -12px;
    width: 57px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    font-size: 14px;
    line-height: 19px;
    font-family: "seb";
    border-radius: 4px;
    color: $color1;
    background: linear-gradient(180deg, #ffc67c 0%, #f59a23 100%);
  }

  .item-left {
    font-family: "seb";
    .coins-value {
      color: $color3;
      font-size: 14px;
      line-height: 19px;
    }
    .coins-added {
      font-family: "se";
      font-size: 12px;
      line-height: 16px;
    }
  }

  .item-right {
    align-content: end;
    text-align: right;
    p {
      font-size: 16px;
      font-family: "seb";
      line-height: 21px;
      margin-bottom: 3px;
    }
  }
}

@media screen and (max-width: 750px) {
  .item {
    padding: vw(20) vw(24) vw(18);
    border-radius: vw(16);
    border: vw(2) solid $color3;
    .tag-off {
      right: vw(12);
      top: vw(-24);
      width: vw(114);
      height: vw(44);
      line-height: vw(44);
      font-size: vw(28);
      line-height: vw(38);
      border-radius: vw(8);
    }

    .item-left {
      .coins-value {
        font-size: vw(28);
        line-height: vw(38);
      }
      .coins-added {
        font-size: vw(24);
        line-height: vw(32);
      }
    }

    .item-right {
      p {
        font-size: vw(32);
        line-height: vw(42);
        margin-bottom: vw(6);
      }
    }
  }
}
</style>
