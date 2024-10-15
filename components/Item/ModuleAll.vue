<template>
  <custom-link :to="to" class="item">
    <div class="item-left">
      <nuxt-img
        format="auto"
        fit="cover"
        width="108"
        height="162"
        :src="item.icon"
        :alt="item.name"
        class="cover m-hidden-block"
        loading="lazy"
      />
      <nuxt-img
        format="auto"
        fit="cover"
        width="198"
        height="280"
        :src="item.icon"
        :alt="item.name"
        class="cover"
      />
    </div>

    <div class="item-right">
      <p class="name"
        >Accidentally Marked By The Alpha King aaaaaa Accidentally Marked By The Alpha King</p
      >
      <div class="info-row">
        <span>Writer Name</span>
        <span class="line"></span>
        <span>Romance</span>
      </div>
      <p class="desc">
        Novel summary: "Our marriage is nothing more than a transaction." Diablo glared at his
        fiancée and said. "I doubt you expect doubt you expect
      </p>
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
          <span>12.9M</span>
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
  height: 198px;
  padding: 18px 40px 18px 18px;
  border-radius: 16px;
  background: $color5;
}
.item-left {
  flex-shrink: 0;
  width: 108px;
  height: 162px;
  margin-right: 18px;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(#000, 0.45);
  overflow: hidden;
  @include book-edge(2.18px, 3px);
}
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.item-right {
  width: calc(100% - 126px);
  display: flex;
  flex-direction: column;
  padding: 6px 0;
  font-size: 12px;
  line-height: 16px;
  color: rgba($color2, 0.6);
}
.name {
  margin-bottom: 8px;
  font-family: "seb";
  line-height: 21px;
  font-size: 16px;
  color: $color2;
  @include ellipsis;
}
.info-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  .line {
    display: none;
  }
  span:last-child {
    color: $color3;
  }
}
.desc {
  margin-top: 8px;
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
    height: vw(280);
    padding: 0;
    border-radius: 0;
    background: none;
  }
  .item-left {
    width: vw(198);
    height: vw(280);
    margin-right: vw(16);
    border-radius: vw(4);
    box-shadow: none;
    @include book-edge(vw(4), vw(8));
  }
  .item-right {
    width: vw(444);
    padding: vw(4) 0;
    font-size: vw(24);
    line-height: vw(32);
  }
  .name {
    margin-bottom: vw(8);
    line-height: vw(38);
    font-size: vw(28);
    @include ellipsis(2);
    white-space: unset;
  }
  .info-row {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;
    gap: vw(12);
    .line {
      display: block;
      width: vw(2);
      height: vw(20);
      background: $color2;
      opacity: 0.1;
    }
  }
  .desc {
    margin-top: vw(8);
  }
  .views {
    .icon-views {
      width: vw(32);
      height: vw(32);
    }
  }
}
</style>
