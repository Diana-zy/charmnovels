<template>
  <s-model :value.sync="visible" @handleClose="handleClose" click-layer-hide>
    <template v-slot:content>
      <div class="module-rec-mobile">
        <section v-once v-swiper:mySwiper="swiperOption" ref="swiperRef" class="swiper-box">
          <div class="swiper-wrapper">
            <div
              v-for="(item, i) in recBooks.slice(0, 5)"
              :key="i"
              class="swiper-slide"
              @click="handleRecItemClick(i)"
            >
              <nuxt-img width="200" fit="cover" format="auto" :src="item.cover" :alt="item.name" />
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
                width="198"
                height="280"
                :src="item?.cover"
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
                <div class="views">
                  <i class="icon-views"></i>
                  <span>{{ item.view }}</span>
                </div>
              </div>
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
export default {
  directives: {
    swiper: directive
  },
  name: "RecommendBox",
  props: {
    visible: {
      type: Boolean,
      default: true
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
        // autoplay: {
        //   delay: 3000,
        //   disableOnInteraction: false
        // },
        on: {
          slideChange: this.handleChange
        }
      },
      currentBannerRealIndex: 0
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
      console.log(
        this.mySwiper && this.mySwiper.activeIndex,
        this.mySwiper && this.mySwiper.realIndex
      );
      if (this.mySwiper && this.mySwiper.realIndex < 5) {
        console.log(this.mySwiper.realIndex);
        console.log("this", this);
        const currentBannerRealIndex = this.mySwiper.realIndex;
        this.currentBannerRealIndex = currentBannerRealIndex
        console.log("currentBannerRealIndex", currentBannerRealIndex);
      }
    },
    handleClose() {
      this.$router.push({
        path: "/"
      });
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
  position: absolute;
  display: flex;
  height: 198px;
  padding: 18px 40px 18px 18px;
  border-radius: 16px;
  background: $color5;

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
}

@media screen and (max-width: 750px) {
  .book-info-box {
    height: vw(280);
    padding: 0 vw(46);
  }
  .book-info {
    height: vw(280);
    padding: 0;
    border-radius: 0;
    background: none;
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
}
</style>
