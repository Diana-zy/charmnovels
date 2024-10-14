<template>
  <custom-link :to="to" class="item">
    <div class="info">
      <div class="left">
        <p class="name">{{ item.name }}</p>
        <div class="rating">
          <i
            v-for="(item2, i) in getStarListStyle(item.score)"
            :key="i"
            :class="item2"
            class="rating-item"
          ></i>
          <span class="score">{{ getStarScore(item.score) }}</span>
        </div>
      </div>
      <div class="right">
        <i class="icon-download"></i>
        <span class="pc-hidden-block">Download</span>
      </div>
    </div>

    <nuxt-img
      format="auto"
      fit="cover"
      :width="240"
      :height="464"
      :src="item.mobile_img || item.cover"
      :alt="item.name"
      class="cover"
      :loading="index < eager ? 'eager' : 'lazy'"
    />
  </custom-link>
</template>

<script>
import { getStarListStyle, getStarScore } from "~/utils/utils";
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
  methods: { getStarScore, getStarListStyle }
};
</script>

<style lang="scss" scoped>
.item {
  position: relative;
  width: 100%;
  height: 340px;
  border-radius: 24px;
  overflow: hidden;
  @include border;
  @include shadow-outer;
  &:hover {
    @include shadow-inner;
    .name {
      color: $color3;
    }
  }
  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    z-index: -1;
    left: 50%;
    transform: translateX(-50%);
    @include icon(329px, 256px, "collection-app-mask.png");
  }
  &::after {
    content: "12:59";
    position: absolute;
    top: 107px;
    left: 50%;
    transform: translateX(-50%);
    color: $color1;
    font-size: 30px;
    line-height: 40px;
    text-shadow: 0 0 6px rgba(#000, 0.35);
  }
}

.info {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 16px 0;
}

.left {
  width: calc(100% - 53px);
}

.name {
  width: 100%;
  font-family: "seb";
  line-height: 24px;
  font-size: 18px;
  margin-bottom: 12px;
  @include ellipsis;
}

.rating {
  justify-content: flex-start;
}

.right {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-shadow: 3px 3px 6px 0 rgba(#83a9c4, 0.3), -3px -3px 6px 0 $color1;
  @include center;
  background: $color3;
}

.icon-download {
  @include icon(20px, 20px, "icon-detail-download.png");
}

.cover {
  position: absolute;
  top: 86px;
  left: 50%;
  transform: translateX(-50%);
  z-index: -2;
  width: 120px;
  height: 232px;
  border-radius: 20px;
}

@media screen and (max-width: 750px) {
  .item {
    height: vw(680);
    border-radius: vw(48);
    &::before {
      width: vw(658);
      height: vw(512);
    }
    &::after {
      top: vw(214);
      font-size: vw(60);
      line-height: vw(80);
      text-shadow: 0 0 vw(12) rgba(#000, 0.35);
    }
  }
  .info {
    padding: vw(32) vw(32) 0;
  }
  .left {
    width: calc(100% - vw(232));
  }
  .name {
    line-height: vw(48);
    font-size: vw(36);
    margin-bottom: vw(24);
  }
  .right {
    width: vw(216);
    height: vw(64);
    border-radius: vw(64);
    @include shadow-outer;
    color: $color1;
    font-size: vw(28);
    font-family: "seb";
  }
  .icon-download {
    width: vw(40);
    height: vw(40);
    margin-right: vw(8);
  }
  .cover {
    top: vw(172);
    width: vw(240);
    height: vw(464);
    border-radius: vw(40);
  }
}
</style>
