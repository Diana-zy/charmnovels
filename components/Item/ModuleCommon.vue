<template>
  <custom-link :to="to" class="item">
    <nuxt-img
      format="auto"
      fit="cover"
      width="120"
      height="120"
      :src="item.icon"
      :alt="item.name"
      class="icon"
      :loading="index < eager ? 'eager' : 'lazy'"
    />
    <p class="name">{{ item.name }}</p>
    <div class="rating">
      <i class="rating-icon"></i>
      <span class="score">{{ getStarScore(item.score) }}</span>
    </div>
  </custom-link>
</template>

<script>
import { getStarScore } from "~/utils/utils";
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    eager: {
      type: Number,
      default: 0
    },
    to: {
      type: String,
      required: true
    }
  },
  methods: { getStarScore }
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 176px;
  padding: 16px 0 0;
  border-radius: 24px;
  @include shadow-outer;
  @include border;
}

.icon {
  width: 109px;
  height: 109px;
  border-radius: 16px;
}
.name {
  width: 100%;
  margin: 4px 0;
  padding: 0 16px;
  text-align: center;
  font-family: "seb";
  line-height: 19px;
  font-size: 14px;
  @include ellipsis;
}

.item:hover {
  @include shadow-inner;
  .name {
    color: $color3;
  }
}
@media screen and (max-width: 750px) {
  .item {
    height: vw(254);
    padding: vw(16) 0 0;
    border-radius: vw(32);
  }
  .icon {
    width: vw(142);
    height: vw(142);
    border-radius: vw(24);
  }
  .name {
    padding: 0 vw(16);
    font-size: vw(24);
    line-height: vw(32);
    margin: vw(8) 0;
  }
}
</style>
