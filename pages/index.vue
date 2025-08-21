<template>
  <main>
    <custom-header />

    <module-home-banner :data="recBooks" />

    <section v-if="novelReadHistoryBooks.length > 0" class="module-common module-history">
      <common-title-label title="History Reading" />
      <div class="module-history-content">
        <item-module-common
          v-for="(item, i) in novelReadHistoryBooks"
          :key="i"
          :item="item"
          :index="i"
          :eager="3"
          :to="`/novel/${item.id}/`"
        />
      </div>
    </section>

    <section class="module-common module-trending">
      <common-title-label title="Trending" />
      <div class="module-trending-content">
        <item-module-common
          v-for="(item, i) in trendingBooks"
          :key="i"
          :item="item"
          :index="i"
          :eager="3"
          :to="`/novel/${item.id}/`"
          :is-show-tag="true"
        />
      </div>
    </section>

    <section class="module-common module-popular">
      <common-title-label title="Popular" />
      <div class="module-popular-content">
        <item-module-common
          v-for="(item, i) in popularBooks"
          :key="i"
          :item="item"
          :index="i"
          :to="`/novel/${item.id}/`"
        />
      </div>
    </section>

    <section class="module-all">
      <common-title-label title="Rec Books" />
      <common-infinite-scroll-list
        api-endpoint="/api/novel/novel_module"
        :initial-page="2"
        :page-size="4"
        :initial-items="allBooks"
        :params="{ module_id: 'all' }"
        class="module-all-content"
      >
        <template #default="{ items }">
          <item-module-all
            v-for="(item, i) in items"
            :key="i"
            :item="item"
            :index="i"
            :to="`/novel/${item.id}/`"
          />
        </template>
      </common-infinite-scroll-list>
    </section>
    <custom-footer />
  </main>
</template>
<script>
import Storage from "~/utils/storage";
export default {
  async asyncData({ $axios, env }) {
    try {
      const [recResponse, trendingResponse, popularResponse, allBooksResponse] = await Promise.all([
        $axios.$post("/api/free_novel/novel_module", {
          site_id: env.SITE_ID,
          module_id: "rec",
          page_size: 3,
          page: 1
        }),
        $axios.$post("/api/free_novel/novel_module", {
          site_id: env.SITE_ID,
          module_id: "trending",
          page_size: 6,
          page: 1
        }),
        $axios.$post("/api/free_novel/novel_module", {
          site_id: env.SITE_ID,
          module_id: "popular",
          page_size: 6,
          page: 1
        }),
        $axios.$post("/api/free_novel/novel_module", {
          site_id: env.SITE_ID,
          module_id: "all",
          page_size: 4,
          page: 1
        })
      ]);

      return {
        recBooks: recResponse.novel_list,
        trendingBooks: trendingResponse.novel_list,
        popularBooks: popularResponse.novel_list,
        allBooks: allBooksResponse.novel_list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  data() {
    return {
      novelReadHistoryBooks: []
    };
  },
  mounted() {
    const novelReadHistoryList = Storage.getItem("novel_read_history_list");
    this.novelReadHistoryBooks = (novelReadHistoryList && novelReadHistoryList.slice(0, 6)) || [];
  }
};
</script>

<style lang="scss" scoped>
.module-history-content,
.module-trending-content,
.module-popular-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(373px, 1fr));
  gap: 24px 40px;
}

@media screen and (max-width: 750px) {
  .module-history-content,
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
