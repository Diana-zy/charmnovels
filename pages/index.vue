<template>
  <main>
    <custom-header current-page="Home" />

    <module-home-banner :data="recApps.slice(0, 3)" />

    <section class="module-common module-collection">
      <common-title-label title="Selected Collection" :is-see-more="true" to="/collection/" />
      <div class="module-collection-content">
        <item-module-collection
          v-for="(item, i) in collectionList.slice(0, 4)"
          :key="i"
          :item="item"
          :index="i"
          :eager="2"
          :to="`/collection/${item.path}/`"
        />
      </div>
    </section>

    <section class="module-common module-new">
      <common-title-label title="New Wallpapers" :is-see-more="true" to="/new/" />
      <div class="module-new-content m-hidden-grid">
        <item-module-row
          v-for="(item, i) in latestApps"
          :key="i"
          :item="item"
          :to="`/app/${item.path}/`"
          :is-arrow="true"
        />
      </div>

      <div class="module-new-content module-new-content-mobile pc-hidden-flex">
        <item-module-new-mobile
          v-for="(item, i) in latestApps"
          :key="i"
          :item="item"
          :to="`/app/${item.path}/`"
        />
      </div>
    </section>

    <section class="module-all">
      <common-title-label title="Trending Apps" />
      <common-infinite-scroll-list
        api-endpoint="/api/game/all_app"
        :initial-page="2"
        :page-size="16"
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
    <custom-footer />
    <common-back-top />
    <ad-loading />
  </main>
</template>
<script>
export default {
  data() {
    return {};
  },
  async asyncData({ $axios, env }) {
    try {
      const [recAppsResponse, collectionResponse, latestAppsResponse, allAppsResponse] =
        await Promise.all([
          $axios.$get("/api/game/menu", {
            params: {
              site_id: env.SITE_ID,
              mod_id: "rec",
              size: 5,
              page: 1
            }
          }),
          $axios.$get("/api/game/all_app_collection", {
            params: {
              site_id: env.SITE_ID
            }
          }),
          $axios.$get("/api/game/menu", {
            params: {
              site_id: env.SITE_ID,
              mod_id: "new",
              size: 9,
              page: 1
            }
          }),
          $axios.$get("/api/game/all_app", {
            params: {
              site_id: env.SITE_ID,
              size: 16,
              page: 1
            }
          })
        ]);

      let recApps = recAppsResponse.list;
      recApps.forEach((item) => {
        if (item.path.indexOf("56446") != -1 || item.path.indexOf("56318") != -1) {
          item.collectionPath = 2;
        }
        if (item.path.indexOf("47410") != -1) {
          item.collectionPath = 5;
        }
        if (item.path.indexOf("56346") != -1 || item.path.indexOf("72115") != -1) {
          item.collectionPath = 6;
        }
      });

      return {
        recApps,
        collectionList: collectionResponse.list,
        latestApps: latestAppsResponse.list,
        allApps: allAppsResponse.list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  mounted() {
    this.handleScroll();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const collectionContainer = document.querySelector(".module-collection-content");
      const newContainer = document.querySelector(".module-new-content-mobile");
      let lastScrollTop = 0; // 用于记录上一次的滚动位置
      window.addEventListener("scroll", (event) => {
        const collectionRect = collectionContainer.getBoundingClientRect();
        const newRect = newContainer.getBoundingClientRect();
        const currentScrollTop = window.scrollY; // 获取当前的滚动位置
        // 检查collectionContainer是否在可视区域内
        if (collectionRect.bottom >= 0 && collectionRect.top <= window.innerHeight) {
          if (currentScrollTop > lastScrollTop) {
            collectionContainer.scrollLeft += 2;
          } else {
            collectionContainer.scrollLeft -= 2;
          }
        }
        // 检查newContainer是否在可视区域内
        if (newRect.bottom >= 0 && newRect.top <= window.innerHeight) {
          if (currentScrollTop > lastScrollTop) {
            newContainer.scrollLeft += 2;
          } else {
            newContainer.scrollLeft -= 2;
          }
        }
        lastScrollTop = currentScrollTop; // 更新上一次的滚动位置
        event.preventDefault();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ad-m {
  display: none;
}

.module-collection-content {
  display: flex;
  flex-wrap: nowrap;
  gap: 24px;
  padding: 10px;
  margin: -10px;
  @include scroll;
  .item {
    flex-shrink: 0;
  }
}

.module-new-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(384px, 1fr));
  gap: 24px;
}

@media screen and (max-width: 750px) {
  main {
    padding-top: vw(167);
  }

  .module-collection-content {
    gap: vw(32);
    padding: vw(32) vw(46);
    margin: vw(-32) vw(-46);
    @include scroll;
  }

  .module-new-content {
    display: flex;
    flex-wrap: nowrap;
    gap: vw(32);
    height: vw(568);
    padding: vw(18) vw(46) vw(0);
    margin: vw(-18) vw(-46) vw(-48);
    @include scroll;
  }
}
</style>
