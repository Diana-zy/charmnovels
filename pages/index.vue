<template>
  <main>
    <custom-header current-page="Home" />

    <module-home-banner :data="recApps.slice(0, 3)" />

    <section class="module-common module-trending">
      <common-title-label title="Trending" />
      <div class="module-trending-content">
        <item-module-common
          v-for="(item, i) in latestApps"
          :key="i"
          :item="item"
          :index="i"
          :eager="3"
          :to="`/read/${item.path}/`"
        />
      </div>
    </section>

    <section class="module-common module-popular">
      <common-title-label title="Popular" />
      <div class="module-popular-content">
        <item-module-common
          v-for="(item, i) in latestApps"
          :key="i"
          :item="item"
          :index="i"
          :eager="3"
          :to="`/novel/${item.path}/`"
          :is-show-tag="true"
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
export default {
  async asyncData({ $axios, env }) {
    try {
      const [recAppsResponse, latestAppsResponse, allAppsResponse] = await Promise.all([
        $axios.$get("/api/game/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "rec",
            size: 5,
            page: 1
          }
        }),
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
        recApps: recAppsResponse.list,
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
.module-trending-content,
.module-popular-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(373px, 1fr));
  gap: 24px 40px;
}

@media screen and (max-width: 750px) {
  main {
    padding-top: vw(167);
  }

  .module-trending-content,
  .module-popular-content {
    grid-template-columns: repeat(3, vw(198));
    gap: vw(32);
    & .item:nth-of-type(n + 4) {
      display: none;
    }
  }
}
</style>
