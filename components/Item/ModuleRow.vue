<template>
  <custom-link :to="to" class="item">
    <nuxt-img
      format="auto"
      fit="cover"
      width="64"
      height="64"
      :src="item.icon"
      :alt="item.name"
      class="icon"
      loading="lazy"
    />
    <div class="info">
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
    <i v-if="isArrow" class="icon-arrow"></i>
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
    to: {
      type: String,
      required: true
    },
    isArrow: {
      type: Boolean,
      default: false
    }
  },
  methods: { getStarScore, getStarListStyle }
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  padding-left: 8px;
  padding-right: 12px;
  border-radius: 20px;
  @include border;
  @include shadow-outer;
  &:hover {
    @include shadow-inner;
    .name {
      color: $color3;
    }
    .icon-arrow {
      @include icon(24px, 24px, "icon-arrow-active.png");
    }
  }
}

.info {
  flex-grow: 1;
  max-width: calc(100% - 108px);
}

.icon {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  margin-right: 8px;
  border-radius: 12px;
}

.name {
  margin-bottom: 10px;
  font-family: "seb";
  line-height: 18px;
  font-size: 14px;
  @include ellipsis();
}

.rating {
  justify-content: flex-start;
}

.icon-arrow {
  margin-left: auto;
  @include icon(24px, 24px, "icon-arrow.png");
}
</style>
