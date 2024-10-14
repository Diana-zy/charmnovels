<template>
  <main>
    <custom-header />
    <section class="top-info">
      <h2 class="title">{{ collectionDetailData.name }}</h2>
      <nuxt-img
        format="auto"
        fit="cover"
        :width="1200"
        :src="collectionDetailData.img"
        :alt="collectionDetailData.name"
        class="banner"
        loading="lazy"
      />
      <google-ad ad-slot="1851010709" />
      <p class="desc">{{ collectionDetailData.desc }}</p>
    </section>

    <section class="module-collection-app-content">
      <google-ad class="ad-1" ad-slot="2540903743" />
      <google-ad class="ad-2" ad-slot="5790255714" />
      <item-module-collection-app
        v-for="(item, i) in collectionAppList"
        :key="i"
        :item="item"
        :index="i"
        :to="`/app/${item.path}/`"
      />
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
import storage from "~/utils/storage";
export default {
  async asyncData({ $axios, params, env }) {
    try {
      const collection_id = params.collection;
      const [collectionDetailResponse, allAppsResponse] = await Promise.all([
        $axios.$get("/api/game/app_collection_detail", {
          params: {
            site_id: env.SITE_ID,
            collection_id
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
        collectionDetailData: collectionDetailResponse,
        collectionAppList: collectionDetailResponse.game_list,
        allApps: allAppsResponse.list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  mounted() {
    let collectionAppListPathArray = [];
    this.collectionAppList.forEach((item) => {
      collectionAppListPathArray.push(item.path);
    });
    let collectionAppListPathString = collectionAppListPathArray.join(",");

    storage.setCookie("collectionAppListPathString", collectionAppListPathString, 1);
  }
};
</script>

<style scoped lang="scss">
.top-info {
  margin-top: 32px;
}
.title {
  font-size: 22px;
  font-family: "seb";
  line-height: 28px;
}
.banner {
  width: 100%;
  margin: 24px 0;
}
.desc {
  font-size: 16px;
  line-height: 22px;
  margin: 24px 0;
}

.module-collection-app-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(288px, 1fr));
  justify-items: center;
  gap: 16px;
}

.ad-1 {
  grid-row: 2;
  grid-column: 1 / -1;
  width: 100%;
}
.ad-2 {
  display: none;
}

@media screen and (max-width: 750px) {
  .top-info {
    margin-top: vw(48);
  }
  .title {
    font-size: vw(44);
    line-height: vw(52);
    padding: 0 vw(46);
  }
  .banner {
    margin: vw(32) 0;
  }
  .desc {
    font-size: vw(32);
    line-height: vw(44);
    margin: vw(32) vw(46);
  }
  .module-collection-app-content {
    grid-template-columns: repeat(1, vw(658));
    gap: vw(32);
    padding: 0 vw(46);
  }
  .ad-1 {
    grid-row: 3;
    width: 100vw;
  }
  .ad-2 {
    display: block;
    grid-row: 8;
    grid-column: 1 / -1;
    width: 100vw;
  }
}
</style>
