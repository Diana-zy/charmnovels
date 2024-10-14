<template>
  <main>
    <custom-header />
    <section class="module-collection">
      <common-title-label title="Selected Collection" />
      <div class="module-collection-content">
        <google-ad class="ad-1" ad-slot="1976167625" />

        <item-module-collection
          v-for="(item, i) in collectionList"
          :key="i"
          :item="item"
          :index="i"
          :to="`/collection/${item.path}/`"
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
  </main>
</template>

<script>
export default {
  async asyncData({ $axios, env }) {
    try {
      const [collectionResponse, allAppsResponse] = await Promise.all([
        $axios.$get("/api/game/all_app_collection", {
          params: {
            site_id: env.SITE_ID
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
        collectionList: collectionResponse.list,
        allApps: allAppsResponse.list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};
</script>

<style lang="scss" scoped>
.ad-1 {
  grid-row: 2;
  grid-column: 1 / -1;
  width: 100%;
}

.module-collection-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(282px, 1fr));
  gap: 16px 24px;
  justify-items: center;
}

@media screen and (max-width: 750px) {
  .ad-1 {
    width: 100vw;
    margin-left: vw(-46);
  }

  .module-collection {
    padding: 0 vw(46);
  }
  .module-collection-content {
    grid-template-columns: repeat(2, vw(314));
    gap: vw(32) vw(30);
    ::v-deep .item {
      width: vw(314);
      height: vw(268);
      &::before {
        height: vw(188);
      }
      .cover {
        height: vw(188);
      }
      .name {
        padding: 0 vw(20);
        line-height: vw(80);
      }
      .btn-get {
        display: none;
      }
    }
  }
}
</style>
