<template>
  <custom-link :to="to" class="item">
    <div class="icon-container">
      <nuxt-img
        format="auto"
        fit="cover"
        width="110"
        height="110"
        :src="item.icon"
        :alt="item.name"
        class="icon"
        :loading="index < eager ? 'eager' : 'lazy'"
      />
      <div class="rating">
        <i class="rating-icon"></i>
        <span class="score">{{ getStarScore(item.score) }}</span>
      </div>
    </div>
    <p class="name">{{ item.name }}</p>
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
  height: 151px;
  padding: 16px 0 0;
  border-radius: 24px;
  @include border;
  @include shadow-outer;
}

.icon-container {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 16px;
  overflow: hidden;
}
.icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.rating {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 44px;
  height: 20px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  background: rgba($color1, 0.4);
}
.rating-icon {
  @include icon(16px, 16px, "star.png");
}
.score {
  color: $color2;
}
.name {
  width: 100%;
  margin-top: 8px;
  padding: 0 10px;
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
    height: vw(218);
    padding: vw(24) 0 0;
    border-radius: vw(32);
  }
  .icon-container {
    width: vw(130);
    height: vw(130);
  }
  .rating {
    width: vw(88);
    height: vw(40);
  }
  .rating-icon {
    width: vw(32);
    height: vw(32);
  }
  .name {
    padding: 0 vw(20);
    font-size: vw(28);
    line-height: vw(38);
    margin-top: vw(10);
  }
}
</style>
