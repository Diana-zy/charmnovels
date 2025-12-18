<template>
  <s-model :value.sync="visible" @handleClose="handleClose" click-layer-hide>
    <template v-slot:content>
      <div class="module-rec-mobile">
        <div class="dialog-title">You May Like</div>
        <section v-once v-swiper:mySwiper="swiperOption" ref="swiperRef" class="swiper-box">
          <div class="swiper-wrapper">
            <div v-for="(item, i) in recBooks.slice(0, 5)" :key="i" class="swiper-slide">
              <nuxt-img
                width="200"
                fit="cover"
                format="auto"
                preload
                :src="item.cover"
                :alt="item.name"
              />
            </div>
          </div>
        </section>
        <section class="book-info-box">
          <div
            v-for="(item, i) in recBooks.slice(0, 5)"
            v-show="i === currentBannerRealIndex"
            :key="i"
            class="book-info"
          >
            <div class="rec-novel-name">{{ item.name }}</div>
            <div class="rec-novel-status">
              <div class="rec-status">Completed</div>
              <div class="rec-category">
                <div class="rec-category-item">{{ item.category }}</div>
              </div>
            </div>
            <div class="rec-ms">{{ item.intro }}</div>
            <div class="rec-btn-box">
              <custom-link :to="`/novel/${item.id}/`" class="read-now-btn">Read now </custom-link>
            </div>
          </div>
        </section>
      </div>
    </template>
  </s-model>
</template>

<script>
import { directive } from "vue-awesome-swiper";
import "swiper/css/swiper.min.css";
import { simulateClickToPath } from "~/utils/utils";
export default {
  directives: {
    swiper: directive
  },
  name: "RecommendBox",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    recBooks: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      recIndex: 0,
      swiperOption: {
        slidesPerView: "auto",
        // centeredSlides: true,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        on: {
          slideChange: this.handleChange
        }
      },
      currentBannerRealIndex: 0
      // visible: false
    };
  },
  mounted() {},
  watch: {
    visible(val) {
      this.$emit("update:visible", val);
    }
  },
  methods: {
    handleChange() {
      // console.log(
      //   this.mySwiper && this.mySwiper.activeIndex,
      //   this.mySwiper && this.mySwiper.realIndex
      // );
      if (this.mySwiper && this.mySwiper.realIndex < 5) {
        // console.log(this.mySwiper.realIndex);
        // console.log("this", this);
        const currentBannerRealIndex = this.mySwiper.realIndex;
        this.currentBannerRealIndex = currentBannerRealIndex;
        // console.log("currentBannerRealIndex", currentBannerRealIndex);
      }
    },
    handleClick(item, i) {
      console.log(i);
      const currentBannerRealIndex = i;
      this.currentBannerRealIndex = currentBannerRealIndex;
    },
    handleClose() {
      simulateClickToPath("/");
    }
  }
};
</script>

<style scoped lang="scss">
.module-rec-mobile {
  margin-bottom: vw(44);
  width: 100vw;

  .module-rec-list {
    display: flex;
    align-items: center;
    gap: vw(24);
    margin-bottom: vw(48);
  }
}
.swiper-box {
  margin-bottom: vw(48);

  .swiper-wrapper {
    height: vw(404);
    padding-left: vw(80);
    align-items: flex-end;
  }
  .swiper-slide {
    width: vw(216);
    height: vw(296);
    margin-right: vw(20);
    border-radius: vw(8);
    transition: all 0.3s;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .swiper-slide-active {
    width: vw(296);
    height: vw(404);
  }
}

.book-info-box {
  position: relative;
  height: 198px;
}

.book-info {
  position: relative;
  /*height: 198px;*/
  /*padding: 18px 40px 18px 18px;*/
  border-radius: 16px;
  background: $color5;
}

@media screen and (max-width: 750px) {
  .dialog-title {
    font-weight: bold;
    font-size: vw(46);
    color: $color1;
    line-height: vw(70);
    text-align: center;
    margin-bottom: vw(64);
  }
  .book-info-box {
    height: auto;
    padding: 0 vw(46);
  }
  .book-info {
    /*height: vw(280);*/
    padding: 0;
    border-radius: 0;
    background: none;
    width: vw(658);
    .rec-novel-name {
      color: $color1;
      font-weight: bold;
      font-size: vw(38);
      line-height: vw(50);
      text-align: left;
    }
    .rec-novel-status {
      margin-top: vw(8);
      height: vw(38);
      display: flex;
      align-items: center;
      .rec-status {
        margin-right: vw(36);
        color: $color3;
        font-size: vw(28);
        font-weight: 600;
      }
      .rec-category {
        display: flex;
        gap: vw(20);
        height: vw(38);
        align-items: center;
        .rec-category-item {
          padding: 0 vw(20);
          background: linear-gradient(180deg, #ffc67c 0%, #f59a23 100%);
          border-radius: vw(8);
          color: $color1;
          font-weight: 400;
          text-align: center;
          line-height: vw(38);
          font-size: vw(24);
        }
      }
    }
    .rec-ms {
      margin-top: vw(20);
      width: vw(658);
      height: vw(166);
      font-weight: 600;
      font-size: vw(26);
      color: $color1;
      line-height: vw(33);
      @include ellipsis(5);
    }
    .rec-btn-box {
      width: 100%;
      margin-top: vw(30);
      height: vw(92);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: vw(34);
      flex-wrap: nowrap;
      .read-now-btn {
        height: vw(92);
        flex: 1;
        color: $color1;
        background: linear-gradient(180deg, #ffc67c 0%, #f59a23 100%);
        border-radius: vw(12);
        line-height: vw(92);
        text-align: center;
        font-weight: bold;
        font-size: vw(36);
      }
    }
  }
  ::v-deep .model-center {
    .footer-close-icon {
      position: absolute;
      top: vw(-150);
      right: vw(30);
    }
  }
}
</style>
