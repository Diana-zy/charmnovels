<template>
  <custom-link :to="to" class="item">
    <div class="item-top">
      <span class="order-no">Order {{ item.order_info.order_no }}</span>
      <span class="status">Paid</span>
    </div>
    <div class="item-content">
      <div class="cover">
        <nuxt-img
          width="96"
          height="144"
          :src="item.novel_info.cover"
          :alt="item.novel_info.name"
          fit="cover"
          format="auto"
        />
      </div>
      <div class="right-info">
        <p class="name">{{ item.novel_info.name }}</p>
        <div class="time-row">
          <i class="icon-time"></i>
          <span>{{ item.order_info.purchase_time }}</span>
        </div>
        <p class="price">$ {{ item.order_info.pay_price }}</p>
      </div>
    </div>
  </custom-link>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    to: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  height: 138px;
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
  width: 37px;
  height: 16px;
  border-radius: 4px;
  background: $color3;
  color: $color1;
  font-size: 12px;
  font-family: "seb";
  @include center;
}
.item-content {
  padding: 8px;
  display: flex;
  align-items: center;
}
.cover {
  width: 60px;
  height: 90px;
  border-radius: 2px;
  margin-right: 12px;
  @include book-edge(1.21px, 2px);
}
.name {
  height: 38px;
  font-size: 14px;
  line-height: 19px;
  margin-bottom: 6px;
  font-family: "seb";
  @include ellipsis(2);
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
.price {
  color: $color3;
  font-size: 14px;
  line-height: 19px;
  margin-top: 6px;
  font-family: "seb";
}

@media screen and (max-width: 750px) {
  .item {
    height: vw(276);
    border-radius: vw(16);
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
    width: vw(74);
    height: vw(32);
    border-radius: vw(8);
    font-size: vw(24);
  }
  .item-content {
    padding: vw(16);
  }
  .cover {
    width: vw(120);
    height: vw(180);
    border-radius: vw(4);
    margin-right: vw(24);
    @include book-edge(vw(2.42), vw(4));
  }
  .name {
    height: vw(76);
    font-size: vw(28);
    line-height: vw(38);
    margin-bottom: vw(12);
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
  .price {
    font-size: vw(28);
    line-height: vw(38);
    margin-top: vw(12);
  }
}
</style>
