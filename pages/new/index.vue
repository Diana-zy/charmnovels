<template>
  <main>
    <custom-header />

    <section class="main-left">
      <div class="module-new">
        <common-title-label title="New Wallpapers" />
        <div class="module-new-content">
          <google-ad class="ad-1" ad-slot="4363167594" />

          <item-module-common
            v-for="(item, i) in newApps"
            :key="i"
            :item="item"
            :index="i"
            :to="`/app/${item.path}/`"
            class="m-hidden-flex"
          />

          <item-module-new-mobile
            v-for="(item, i) in newApps"
            :key="`m-${i}`"
            :item="item"
            :index="i"
            :to="`/app/${item.path}/`"
            class="pc-hidden-flex"
          />
        </div>
      </div>
      <div class="module-all">
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
      </div>
    </section>

    <section class="main-right">
      <google-ad ad-slot="5676249263" />
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

    <custom-footer />
    <common-back-top />
  </main>
</template>

<script>
import { shuffleArray } from "~/utils/utils";

export default {
  async asyncData({ $axios, env }) {
    try {
      const [newAppsResponse, collectionResponse, allAppsResponse] = await Promise.all([
        $axios.$get("/api/game/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "new"
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
            size: 16,
            page: 1
          }
        })
      ]);

      return {
        newApps: newAppsResponse.list,
        collectionList: shuffleArray(collectionResponse.list).slice(0, 8),
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
}

main {
  position: relative;
}

.main-left {
  width: 770px;
  @media screen and (max-width: 1220px) {
    width: 100%;
  }
}
.module-new-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(141px, 1fr));
  gap: 24px 16px;
}

.module-all-content {
  grid-template-columns: repeat(auto-fit, minmax(108px, 1fr));
  ::v-deep .item {
    height: 131px;
    border-radius: 16px;
    .icon-container {
      width: 76px;
      height: 76px;
      border-radius: 12px;
    }
  }
}

.main-right {
  position: absolute;
  width: 390px;
  top: 144px;
  right: 20px;
  @media screen and (max-width: 1220px) {
    display: none;
  }
}

.collection-list {
  display: grid;
  grid-template-columns: repeat(2, 183px);
  gap: 24px;

  ::v-deep .item {
    width: 183px;
    height: 152px;
    &::before {
      height: 109px;
    }
    .cover {
      height: 109px;
    }
    .name {
      padding: 0 10px;
    }
    .btn-get {
      display: none !important;
    }
  }
}

@media screen and (max-width: 750px) {
  .ad-1 {
    width: 100vw;
    margin-left: vw(-46);
  }
  .module-new {
    padding: 0 vw(46);
  }
  .module-new-content {
    grid-template-columns: repeat(3, vw(198));
    gap: vw(32);
    padding: vw(16) vw(46) vw(0);
    margin: vw(-16) vw(-46) vw(0);
    ::v-deep .item {
      width: vw(198);
      height: vw(394);
      &::before {
        top: vw(-18);
        transform: translateX(-50%);
        @include icon(vw(250), vw(455), "mask-phone.png");
      }
      &::after {
        top: vw(24);
        font-size: vw(44);
        line-height: vw(64);
      }
      .cover {
        width: vw(180);
        height: vw(376);
      }
    }
  }
  .module-all-content {
    grid-template-columns: repeat(3, vw(198));
    ::v-deep .item {
      height: vw(218);
      padding: vw(24) 0 0;
      border-radius: vw(32);
      .icon-container {
        width: vw(130);
        height: vw(130);
      }
    }
  }
}
</style>
