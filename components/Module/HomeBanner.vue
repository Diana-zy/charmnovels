<template>
  <section v-swiper:recPcSwiper="swiperOption" class="swiper-box">
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
          width="1200"
          height="380"
          :src="item.pc_img || item.icon"
          :alt="item.name"
          loading="lazy"
          class="cover"
        />
      </custom-link>
    </div>
    <div class="swiper-pagination"></div>
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
      currentBannerIndex: 0,
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
          slideChange: this.handleSwiperChange
        }
      }
    };
  },
  methods: {
    handleSwiperChange() {
      this.currentBannerIndex = (this.recPcSwiper && this.recPcSwiper.realIndex) || 0;
    }
  }
};
</script>

<style scoped lang="scss">
.swiper-box {
  position: relative;
  margin-top: 24px;
  width: 100%;
  height: 380px;
  border-radius: 24px;
  overflow: hidden;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
}

::v-deep .swiper-pagination-bullets {
  width: auto;
  display: flex;
  align-items: center;
  bottom: 16px;
  right: 24px;
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
</style>
