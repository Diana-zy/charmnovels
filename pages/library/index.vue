<template>
  <main>
    <custom-header current-page="Library" />

    <section class="module-common module-library">
      <div class="module-library-content">
        <google-ad class="ad-1" ad-slot="" />
        <item-module-library
          v-for="(item, i) in latestApps"
          :key="i"
          :item="item"
          :to="`/read/${item.path}/`"
        />
      </div>
    </section>

    <section class="module-all">
      <common-title-label title="Rec Books" />
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
            :to="`/read/${item.path}/`"
          />
        </template>
      </common-infinite-scroll-list>
    </section>
    <custom-footer />
    <common-notification />
    <common-back-top />
    <ad-loading />
  </main>
</template>
<script>
import GoogleAd from "../../components/GoogleAd.vue";
export default {
  components: { GoogleAd },
  async asyncData({ $axios, env }) {
    try {
      const [latestAppsResponse, allAppsResponse] = await Promise.all([
        $axios.$get("/api/game/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "new",
            size: 6,
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
      return {
        latestApps: latestAppsResponse.list,
        allApps: allAppsResponse.list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  data() {
    return {};
  },
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.module-library {
  margin-top: 32px;
}
.module-library-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  justify-items: center;
  gap: 24px;
}
.ad-1 {
  width: 100%;
  grid-column: 1 / -1;
  grid-row: 2;
}

@media screen and (max-width: 750px) {
  main {
    padding-top: vw(167);
  }
  .module-library {
    margin-top: vw(48);
  }
  .module-library-content {
    grid-template-columns: repeat(3, vw(198));
    gap: vw(32);
  }
  .ad-1 {
    width: 100vw;
  }
}
</style>
