<template>
  <main>
    <custom-header />
    <common-breadcrumb :name="currentApp.name" />

    <section class="main-left">
      <div class="header-info">
        <nuxt-img
          width="112"
          height="112"
          fit="cover"
          format="auto"
          :src="currentApp.icon"
          :alt="currentApp.name"
          class="icon"
        />
        <div class="content">
          <p class="name">{{ currentApp.name }}</p>
          <div class="rating">
            <i
              v-for="(item, i) in getStarListStyle(currentApp.score)"
              :key="i"
              :class="item"
              class="rating-item"
            ></i>
            <span class="score">{{ getStarScore(currentApp.score) }}</span>
          </div>
        </div>
        <div
          class="get-it-now"
          @click="
            $refs.targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
          "
        >
          <i class="icon-get-app"></i>
          <span>Get App</span>
        </div>
      </div>

      <google-ad ad-slot="7534582229" />

      <div class="package-info">
        <div class="info-row">
          <div class="label">
            <i class="icon-os"></i>
            <span>OS</span>
          </div>
          <div class="value">
            <i v-if="currentApp.android" class="icon-android"></i>
            <i v-if="currentApp.ios" class="icon-ios"></i>
          </div>
        </div>
        <div class="info-row">
          <div class="label">
            <i class="icon-size"></i>
            <span>Size</span>
          </div>
          <div class="value">
            <span>{{ currentApp.apk_size }}</span>
          </div>
        </div>
        <div class="info-row">
          <div class="label">
            <i class="icon-version"></i>
            <span>Version</span>
          </div>
          <div class="value">
            <span>{{ currentApp.version }}</span>
          </div>
        </div>
        <div class="info-row">
          <div class="label">
            <i class="icon-updated"></i>
            <span>Updated</span>
          </div>
          <div class="value">
            <span>{{ currentApp.updated_time }}</span>
          </div>
        </div>
      </div>

      <section class="game-introduction">
        <div
          v-swiper:mySwiper="swiperOption"
          v-if="currentApp.banner_list.length > 0"
          class="swiper-box"
        >
          <div class="swiper-wrapper">
            <div v-for="(banner, i) in currentApp.banner_list" :key="i" class="swiper-slide">
              <NuxtImg
                format="auto"
                fit="cover"
                height="288"
                :src="banner"
                :alt="currentApp.name"
                loading="lazy"
                class="img"
              />
            </div>
          </div>
          <div class="swiper-tool">
            <div class="swiper-button-prev"></div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-next"></div>
          </div>
        </div>
        <module-expandable-text :text="currentApp.desc" />
      </section>

      <div ref="targetElement">
        <google-ad ad-slot="8029406241" />
      </div>

      <section class="get-the-game">
        <custom-link class="download" :to="`/download/${currentApp.path}/`">
          <i></i>
          <span>Download</span>
        </custom-link>
        <div class="tip">
          * For reference, The {{ currentApp.name }} app websites are all approved, there are no
          viruses and malware.
        </div>
      </section>

      <section class="module-all">
        <common-title-label title="Trending Apps" />
        <common-infinite-scroll-list
          api-endpoint="/api/game/all_app"
          :initial-page="2"
          :page-size="12"
          :initial-items="allApps"
          class="module-all-content"
        >
          <template #default="{ items }">
            <item-module-all
              v-for="(item, i) in items"
              :key="i"
              :item="item"
              :index="i"
              :to="`/app/${item.path}/`"
            />
          </template>
        </common-infinite-scroll-list>
      </section>
    </section>

    <section class="main-right">
      <google-ad ad-slot="3595337216" />
      <common-title-label title="Selected Collection" />
      <div class="collection-list">
        <item-module-collection
          v-for="(item, i) in collectionList"
          :key="i"
          :index="i"
          :item="item"
          :to="`/collection/${item.path}/`"
        />
      </div>
    </section>

    <section v-if="isShowBottomChangeBtn" class="main-bottom pc-hidden-flex">
      <div class="btn-change" @click="handleChangeApp('prev')">
        <i class="icon-arrow"></i>
        <span>Previous</span>
      </div>
      <div class="btn-change" @click="handleChangeApp('next')">
        <span>Next</span>
        <i class="icon-arrow icon-arrow-right"></i>
      </div>
    </section>

    <custom-footer />
    <common-back-top />
    <ad-loading />
  </main>
</template>
<script>
import { directive } from "vue-awesome-swiper";
import "swiper/css/swiper.min.css";
import { shuffleArray, simulateClick } from "~/utils/utils";
import { getStarListStyle, getStarScore } from "~/utils/utils";
import storage from "~/utils/storage";

export default {
  directives: {
    swiper: directive
  },
  data() {
    return {
      collectionAppList: [],
      isShowBottomChangeBtn: false, // 是否显示底部切换按钮
      swiperOption: {
        slidesPerView: "auto",
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      },
      collapsed: true
    };
  },
  async asyncData({ $axios, params, env }) {
    try {
      const path = params.app;
      const lastDashIndex = path.lastIndexOf("-");
      const id = path.substring(lastDashIndex + 1, path.length);
      const [currentAppResponse, collectionResponse, allAppsResponse] = await Promise.all([
        $axios.$get("/api/game/detail", {
          params: {
            site_id: env.SITE_ID,
            game_id: id
          }
        }),
        $axios.$get("/api/game/all_app_collection", {
          params: {
            site_id: env.SITE_ID
          }
        }),
        $axios.$get("/api/game/all_app", {
          params: {
            site_id: env.SITE_ID,
            size: 12,
            page: 1
          }
        })
      ]);
      return {
        currentApp: currentAppResponse,
        collectionList: shuffleArray(collectionResponse.list).slice(0, 8),
        allApps: allAppsResponse.list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  head() {
    return {
      title: `charmnovels－Carefully selected - Each one is filled with surprises and inspiration in the ${
        this.currentApp.name || "app"
      }!` // 使用 asyncData 中获取的数据设置页面标题
    };
  },
  mounted() {
    this.initCollectionAppChangeData();
  },
  methods: {
    getStarScore,
    getStarListStyle,
    // 初始化合集应用切换数据
    initCollectionAppChangeData() {
      if (storage.getCookie("collectionAppListPathString")) {
        this.collectionAppList = storage.getCookie("collectionAppListPathString").split(",") || [];
        let fromPath = this.$route.query.from || null;
        if (fromPath && fromPath === "collection-detail") {
          this.isShowBottomChangeBtn = true;
        }
      }
    },
    handleChangeApp(type) {
      let currentAppPath = this.currentApp.path;
      let currentIndex =
        this.collectionAppList.length !== 0 &&
        this.collectionAppList.findIndex((item) => item === currentAppPath);

      let jumpToIndex = 0;

      if (type === "prev") {
        jumpToIndex =
          (currentIndex - 1 + this.collectionAppList.length) % this.collectionAppList.length;
      } else {
        jumpToIndex = (currentIndex + 1) % this.collectionAppList.length;
      }
      console.log("jumpToIndex", jumpToIndex);
      simulateClick(`/app/${this.collectionAppList[jumpToIndex]}/`, "from", "collection-detail");
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/app.scss";
</style>
