<template>
  <div class="item">
    <div class="item-top">
      <span class="order-no">Order {{ item.order_no }}</span>
      <span class="status">{{ item.pay_channel }}</span>
    </div>
    <div class="item-content">
      <div class="left-info">
        <p class="name"> {{ item.display_name }} </p>
        <div class="time-row">
          <i class="icon-time"></i>
          <span> {{ item.purchase_time }} </span>
        </div>
      </div>
      <div class="right-info">
        <p class="price">$ {{ item.pay_price }} </p>
        <p class="coins">+ {{ item.coin }} coins</p>
      </div>
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
  }
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  border-radius: 8px;
  border: 1px solid $color5;
  overflow: hidden;
}
.item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 8px;
  background: $color5;
}
.order-no {
  font-size: 12px;
  line-height: 16px;
  color: rgba($color2, 0.6);
  @include ellipsis;
}
.status {
  width: 38px;
  height: 18px;
  border-radius: 4px;
  background: $color3;
  color: $color1;
  font-size: 12px;
  @include center;
}
.item-content {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.name {
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 8px;
  font-family: "seb";
}
.time-row {
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 16px;
  color: rgba($color2, 0.6);
  .icon-time {
    @include icon(12px, 12px, "icon-time.png");
    margin-right: 4px;
  }
}
.right-info {
  font-family: "seb";
  .price {
    margin-top: 8px;
    font-size: 14px;
    line-height: 19px;
    text-align: right;
  }
  .coins {
    color: $color3;
    font-size: 16px;
    line-height: 21px;
  }
}

@media screen and (max-width: 750px) {
  .item {
    border-radius: vw(16);
    border: vw(2) solid $color5;
  }
  .item-top {
    height: vw(64);
    padding: 0 vw(16);
  }
  .order-no {
    font-size: vw(24);
    line-height: vw(32);
  }
  .status {
    width: vw(76);
    height: vw(36);
    border-radius: vw(8);
    font-size: vw(24);
  }
  .item-content {
    padding: vw(16);
  }
  .name {
    font-size: vw(36);
    line-height: vw(48);
    margin-bottom: vw(16);
  }
  .time-row {
    font-size: vw(24);
    line-height: vw(32);
    .icon-time {
      width: vw(24);
      height: vw(24);
      margin-right: vw(8);
    }
  }

  .right-info {
    .price {
      margin-top: vw(16);
      font-size: vw(28);
      line-height: vw(38);
    }
    .coins {
      font-size: vw(32);
      line-height: vw(42);
    }
  }
}
</style>
