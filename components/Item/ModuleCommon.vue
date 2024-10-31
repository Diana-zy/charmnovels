<template>
  <custom-link :to="to" class="item">
    <div class="item-left">
      <i v-if="isShowTag && index < 3" :class="['icon-tag', 'icon-tag-' + (index + 1)]"></i>
      <nuxt-img
        format="auto"
        fit="cover"
        width="198"
        height="296"
        :src="item.cover"
        :alt="item.name"
        class="cover"
        :loading="index < eager ? 'eager' : 'lazy'"
      />
    </div>

    <div class="item-right">
      <p class="name">{{ item.name }}</p>
      <div class="info-row">
        <span>{{ item.category }}</span>
        <span class="line"></span>
        <span>{{ item.author }}</span>
      </div>
      <p class="desc">{{ item.intro }}</p>
      <div class="info-bottom">
        <div class="rating">
          <i
            v-for="(item2, i) in getStarListStyle(item.score)"
            :key="i"
            :class="item2"
            class="rating-item"
          ></i>
          <span class="score">{{ getStarScore(item.score) }}</span>
        </div>
        <div class="views">
          <i class="icon-views"></i>
          <span>{{ item.view }}</span>
        </div>
      </div>
    </div>
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
    },
    isShowTag: {
      type: Boolean,
      default: false
    }
  },
  methods: { getStarListStyle, getStarScore }
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  height: 140px;
}
.item-left {
  flex-shrink: 0;
  width: 99px;
  height: 140px;
  margin-right: 8px;
  border-radius: 2px;
  overflow: hidden;
  @include book-edge;
}
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.item-right {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  line-height: 16px;
  color: rgba($color2, 0.6);
}
.name {
  width: 100%;
  margin-bottom: 4px;
  font-family: "seb";
  line-height: 19px;
  font-size: 14px;
  color: $color2;
  @include ellipsis(2);
}
.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  .line {
    width: 1px;
    height: 10px;
    background: $color2;
    opacity: 0.1;
  }
  span:first-child {
    color: $color3;
  }
  span {
    width: 100%;
    @include ellipsis();
  }
}
.desc {
  margin-top: 4px;
  @include ellipsis(3);
}
.info-bottom {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.views {
  @include center;
  .icon-views {
    @include icon(16px, 16px, "icon-views.png");
  }
}
.item:hover {
  .name {
    color: $color3;
  }
}

@media screen and (max-width: 750px) {
  .item {
    height: vw(414);
    flex-direction: column;
  }
  .item-left {
    width: vw(198);
    height: vw(296);
    margin: 0;
    border-radius: vw(4);
    @include book-edge(vw(4), vw(6));
  }
  .icon-tag {
    position: absolute;
    top: 0;
    left: vw(4);
  }
  $tagIcons: ("icon-tag-1", "icon-tag-2", "icon-tag-3");
  @each $icon in $tagIcons {
    .#{$icon} {
      @include icon(vw(80), vw(98), "#{$icon}.png");
    }
  }

  .item-right {
    font-size: vw(24);
    line-height: vw(32);
  }
  .name {
    margin: vw(8) 0 vw(4);
    line-height: vw(38);
    font-size: vw(28);
    @include ellipsis;
    display: block;
    -webkit-line-clamp: unset;
  }
  .info-row {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: vw(4);
    .line {
      display: none;
    }
    span:first-child {
      color: $color3;
    }
  }
  .desc,
  .info-bottom {
    display: none;
  }
}
</style>
