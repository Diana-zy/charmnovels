<template>
  <custom-link ref="moduleAll" :to="to" class="item">
    <div class="item-left">
      <nuxt-img
        format="auto"
        fit="cover"
        width="108"
        height="162"
        :src="item.cover"
        :alt="item.name"
        class="cover m-hidden-block"
        loading="lazy"
      />
      <nuxt-img
        format="auto"
        fit="cover"
        width="226"
        height="280"
        :src="item.cover"
        :alt="item.name"
        class="cover"
      />
    </div>

    <div class="item-right">
      <p class="name">{{ item.name }}</p>
      <div class="info-row">
        <span>{{ item.author }}</span>
        <span class="line"></span>
        <span>{{ item.category }}</span>
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
  data() {
    return {
      observerShow: null,
      observerHide: null,
      isHide: true
    };
  },
  mounted() {
    if (this.$route.path === "/") {
      this.observerShow = new IntersectionObserver((e) => this.handleIntersection(e, "show"), {
        threshold: 1
      });
      this.observerHide = new IntersectionObserver((e) => this.handleIntersection(e, "hide"));
      setTimeout(() => {
        this.observerShow.observe(this.$refs.moduleAll.$el);
        this.observerHide.observe(this.$refs.moduleAll.$el);
      }, 0);
    }
  },
  methods: {
    getStarListStyle,
    getStarScore,
    handleIntersection(entries, type) {
      if (entries[0].isIntersecting && type === "show" && this.isHide) {
        this.isHide = false;
        window.dataLayer.push({
          event: "Home_Novel_Show",
          novel_id: this.item.id
        });
      } else if (!entries[0].isIntersecting && type === "hide") {
        this.isHide = true;
      }
    }
  }
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
  box-shadow: 0 4px 12px 0 rgba($color6, 0.45);
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
    width: vw(226);
    height: vw(280);
    margin-right: vw(16);
    border-radius: vw(4);
    box-shadow: none;
    @include book-edge(vw(4), vw(8));
  }
  .item-right {
    width: vw(468);
    padding: vw(4) 0;
    font-size: vw(28);
    line-height: vw(38);
  }
  .name {
    margin-bottom: vw(8);
    line-height: vw(42);
    font-size: vw(32);
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
