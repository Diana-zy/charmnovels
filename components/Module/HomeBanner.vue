<template>
  <section ref="moduleHomeBanner" v-swiper:recPcSwiper="swiperOption" class="swiper-box">
    <div class="swiper-wrapper">
      <custom-link
        v-for="(item, i) in data"
        :key="i"
        :to="`/read/?ch=${item.first_chapter_id}`"
        class="swiper-slide"
        @click.native="
          () => {
            $emit('handleBannerItemClick', item.id);
          }
        "
      >
        <nuxt-img
          format="auto"
          fit="cover"
          width="1200"
          height="380"
          :src="item.cover"
          :alt="item.name"
          loading="lazy"
          class="cover-bg m-hidden-block"
        />

        <nuxt-img
          format="auto"
          fit="cover"
          width="658"
          height="330"
          :src="item.cover"
          :alt="item.name"
          class="cover-bg pc-hidden-block"
        />

        <div class="info">
          <div class="info-left">
            <nuxt-img
              width="218"
              height="296"
              :src="item.cover"
              :alt="item.name"
              loading="lazy"
              class="cover"
            />
          </div>
          <div class="info-right">
            <p class="name">{{ item.name }}</p>
            <p class="author">{{ item.category }}</p>
            <div class="rating">
              <i
                v-for="(item2, i2) in getStarListStyle(item.score)"
                :key="i2"
                :class="item2"
                class="rating-item"
              ></i>
              <span class="score">{{ getStarScore(item.score) }}</span>
            </div>
          </div>
        </div>
      </custom-link>
    </div>
    <div class="swiper-pagination"></div>
  </section>
</template>

<script>
import { directive } from "vue-awesome-swiper";
import { getStarListStyle, getStarScore } from "~/utils/utils";
import "swiper/css/swiper.min.css";
export default {
  directives: {
    swiper: directive
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      swiperOption: {
        effect: "fade",
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        on: {
          slideChange: () => this.handleBannerChange()
        }
      },
      observerShow: null,
      observerHide: null,
      isHide: true,
      bannerShowData: this.data.map((item) => ({ id: item.id, isItemShow: false }))
    };
  },
  mounted() {
    this.observerShow = new IntersectionObserver((e) => this.handleIntersection(e, "show"), {
      threshold: 1
    });
    this.observerHide = new IntersectionObserver((e) => this.handleIntersection(e, "hide"));
    setTimeout(() => {
      this.observerShow.observe(this.$refs.moduleHomeBanner);
      this.observerHide.observe(this.$refs.moduleHomeBanner);
    }, 0);
  },
  methods: {
    getStarScore,
    getStarListStyle,
    handleIntersection(entries, type) {
      if (entries[0].isIntersecting && type === "show" && this.isHide) {
        this.isHide = false;
        this.handleBannerChange();
      } else if (!entries[0].isIntersecting && type === "hide") {
        this.isHide = true;
        // 重置轮播展示状态
        this.bannerShowData = this.data.map((item) => ({ id: item.id, isItemShow: false }));
      }
    },
    handleBannerChange() {
      const currentSwiperIndex = this.$refs.moduleHomeBanner.swiper.realIndex;
      // 当前轮播外层为展示状态且当前item未展示过
      if (!this.isHide && !this.bannerShowData[currentSwiperIndex].isItemShow) {
        this.bannerShowData[currentSwiperIndex].isItemShow = true;
        window.dataLayer.push({
          event: "Home_Novel_Show",
          novel_id: this.bannerShowData[currentSwiperIndex].id
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.swiper-box {
  position: relative;
  margin-top: 32px;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.swiper-slide {
  &::before {
    position: absolute;
    z-index: 2;
    display: inline-block;
    content: "";
    width: 100%;
    height: 100%;
    background-color: rgba($color6, 0.4);
    backdrop-filter: blur(24px);
  }
}

.cover-bg {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
}

.info-left {
  position: relative;
  width: 120px;
  height: 180px;
  margin-right: 20px;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.45);
  border-radius: 4px;
  overflow: hidden;
  @include book-edge(2.42px);
}

.info-right {
  width: 567px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .name {
    font-family: "sh";
    font-size: 34px;
    line-height: 50px;
    color: $color1;
    @include ellipsis(2);
  }
  .rating {
    margin-top: 12px;
    .icon-star-on,
    .icon-star-half {
      width: 24px;
      height: 24px;
    }
    .score {
      font-size: 18px;
      line-height: 24px;
      color: $color1;
      margin-left: 6px;
    }
  }
  .author {
    font-size: 22px;
    line-height: 29px;
    margin-top: 8px;
    font-family: "sesb";
    color: rgba($color1, 0.6);
  }
}

.cover {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-box {
  ::v-deep .swiper-pagination-bullets {
    width: auto;
    display: flex;
    align-items: center;
    bottom: 16px;
    right: 16px;
    left: auto;
  }
  ::v-deep .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    background: rgba($color1, 0.8);
    border-radius: 50%;
    margin: 0 4px;
    opacity: 1;
  }
  ::v-deep .swiper-pagination-bullet-active {
    background: $color3;
    border: 2px solid $color1;
    box-sizing: content-box;
  }
}

@media (max-width: 800px) {
  .info-right {
    width: 500px;
  }
}

@media (max-width: 750px) {
  .swiper-box {
    margin: vw(22) auto 0;
    width: vw(702);
    height: vw(330);
    border-radius: vw(16);
  }

  .swiper-slide {
    &::before {
      backdrop-filter: blur(vw(8));
    }
  }

  .info-left {
    position: relative;
    width: vw(218);
    height: vw(296);
    margin-right: vw(32);
    box-shadow: 0 vw(8) vw(24) 0 rgba(0, 0, 0, 0.45);
    border-radius: vw(4);
    overflow: hidden;
    @include book-edge(vw(4));
  }

  .info-right {
    width: vw(364);
    .name {
      font-size: vw(32);
      line-height: vw(46);
    }
    .rating {
      margin-top: vw(16);
      .icon-star-on,
      .icon-star-half {
        width: vw(32);
        height: vw(32);
      }
      .score {
        font-size: vw(24);
        line-height: vw(32);
        margin-left: vw(8);
      }
    }
    .author {
      font-size: vw(28);
      line-height: vw(38);
      margin-top: vw(16);
    }
  }

  .swiper-box {
    ::v-deep .swiper-pagination-bullets {
      bottom: vw(20);
      right: vw(20);
    }
    ::v-deep .swiper-pagination-bullet {
      width: vw(20);
      height: vw(20);
      margin: 0 vw(8) !important;
    }
    ::v-deep .swiper-pagination-bullet-active {
      border: vw(4) solid $color1;
    }
  }
}
</style>
