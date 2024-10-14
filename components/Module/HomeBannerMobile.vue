<template>
  <section class="module-banner-m pc-hidden-block">
    <i class="bg-decorate"></i>
    <div class="cover-box">
      <span class="current-time">{{ currentTime }}</span>
      <nuxt-img
        v-for="(item, i) in data"
        :key="i"
        format="auto"
        fit="cover"
        width="382"
        height="724"
        :src="item.mobile_img"
        :alt="item.name"
        class="cover"
        :class="{ 'cover-active': i === currentBannerIndex }"
      />
      <custom-link
        class="cover cover-top"
        v-show="i === currentBannerIndex"
        v-for="(item, i) in data"
        :key="`link-${i}`"
        :to="`/collection/${item.collectionPath}/`"
      />
    </div>

    <div v-once v-swiper:recMobileSwiper="swiperOption" class="swiper-box">
      <div class="swiper-wrapper">
        <custom-link
          v-for="(item, i) in data"
          :key="i"
          :to="`/collection/${item.collectionPath}/`"
          class="swiper-slide"
        >
          <nuxt-img
            format="auto"
            fit="cover"
            width="96"
            height="96"
            :src="item.icon"
            :alt="item.name"
            class="icon"
          />
        </custom-link>
      </div>
    </div>
    <p class="name" v-if="data[currentBannerIndex]">{{ data[currentBannerIndex].name || "" }}</p>
  </section>
</template>

<script>
import { directive } from "vue-awesome-swiper";
import "swiper/css/swiper.min.css";
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  directives: {
    swiper: directive
  },
  data() {
    return {
      currentTime: "",
      currentBannerIndex: 0,
      swiperOption: {
        slidesPerView: "auto",
        effect: "coverflow",
        centeredSlides: true,
        slideToClickedSlide: true,
        loop: true,
        loopedSlides: 7,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        coverflowEffect: {
          rotate: 0,
          stretch: -19,
          depth: 200,
          modifier: 1,
          slideShadows: false
        },
        on: {
          slideChange: this.handleSwiperChange
        }
      }
    };
  },
  methods: {
    updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0"); // 小时
      const minutes = String(now.getMinutes()).padStart(2, "0"); // 分钟
      this.currentTime = `${hours}:${minutes}`;
    },
    handleSwiperChange() {
      this.currentBannerIndex = (this.recMobileSwiper && this.recMobileSwiper.realIndex) || 0;
    }
  },
  mounted() {
    this.updateTime(); // 初始化时更新一次
    setInterval(this.updateTime, 60000); // 每分钟更新一次
  }
};
</script>

<style scoped lang="scss">
.module-banner-m {
  position: relative;
  width: 100%;
  height: vw(1050);
  margin-top: vw(-96);
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: vw(1000);
    background: linear-gradient(to bottom, #ffc4d6 0%, $color4 100%);
  }
}

.bg-decorate {
  position: absolute;
  top: vw(170);
  left: 0;
  @include icon(vw(156), vw(205), "m-rec-star.png");
  &::before {
    content: "";
    position: absolute;
    top: vw(-54);
    left: vw(616);
    @include icon(vw(112), vw(138), "m-rec-aixin.png");
  }
  &::after {
    content: "";
    position: absolute;
    top: vw(423);
    left: vw(528);
    @include icon(vw(222), vw(244), "m-rec-emoji.png");
  }
}

.cover-box {
  position: absolute;
  top: vw(96);
  left: 0;
  width: 100%;
  height: vw(938);
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    @include icon(vw(662), 100%, "m-rec-mask.png");
  }
  .current-time {
    position: absolute;
    top: vw(60);
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    display: block;
    color: $color1;
    font-size: vw(76);
    line-height: vw(102);
    text-shadow: 0 0 vw(20) rgba(#000, 0.35);
  }

  .cover {
    opacity: 0;
    position: absolute;
    top: vw(16);
    left: vw(184);
    z-index: 2;
    width: vw(382);
    height: vw(724);
    border-radius: vw(40);
    transition: opacity 1s ease-in-out;
  }

  .cover-active {
    opacity: 1;
  }

  .cover-top {
    z-index: 5;
  }
}

.swiper-box {
  position: absolute;
  top: vw(858);
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  width: vw(450);
}

.swiper-wrapper {
  height: vw(104);
  display: flex;
  align-items: center;
}

.swiper-slide {
  width: vw(96);
  height: vw(96);
  // margin: 0 vw(16);
  border-radius: vw(20);
  overflow: hidden;
}

.swiper-slide-active {
  box-shadow: 0 0 0 vw(4) $color3;
}

.icon {
  width: vw(96);
  height: vw(96);
}

.name {
  position: absolute;
  top: vw(970);
  left: 50%;
  transform: translateX(-50%);
  width: vw(450);
  color: $color3;
  font-size: vw(36);
  line-height: vw(48);
  text-align: center;
  font-family: "seb";
  @include ellipsis;
}
</style>
