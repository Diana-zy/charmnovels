<template>
  <main>
    <custom-header current-page="Home" />

    <module-home-banner :data="recBooks" @handleBannerItemClick="handleNovelItemClick" />

    <section class="module-common module-trending">
      <common-title-label title="Most Recommended" />
      <div class="module-trending-content">
        <item-module-common
          v-for="(item, i) in trendingBooks"
          :key="i"
          :item="item"
          :index="i"
          :eager="3"
          :to="`/read/?ch=${item.first_chapter_id}`"
          :is-show-tag="true"
          @click.native="handleNovelItemClick(item.id)"
        />
      </div>
    </section>

    <section class="module-common module-popular">
      <common-title-label title="Trending Now" />
      <div class="module-popular-content">
        <item-module-common
          v-for="(item, i) in popularBooks"
          :key="i"
          :item="item"
          :index="i"
          :eager="3"
          :to="`/read/?ch=${item.first_chapter_id}`"
          @click.native="handleNovelItemClick(item.id)"
        />
      </div>
    </section>

    <section class="module-all">
      <common-title-label title="More Popular Books" />
      <common-infinite-scroll-list
        api-endpoint="/api/novel/novel_module"
        :initial-page="2"
        :page-size="5"
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
            :to="`/read/?ch=${item.first_chapter_id}`"
            @click.native="handleNovelItemClick(item.id)"
          />
        </template>
      </common-infinite-scroll-list>
    </section>
    <custom-footer />
    <common-notification />
    <common-back-top />
  </main>
</template>
<script>
export default {
  async asyncData({ $axios, env }) {
    try {
      const [recResponse, trendingResponse, popularResponse, allBooksResponse] = await Promise.all([
        $axios.$post("/api/novel/novel_module", {
          site_id: env.SITE_ID,
          module_id: "rec",
          page_size: 4,
          page: 1
        }),
        $axios.$post("/api/novel/novel_module", {
          site_id: env.SITE_ID,
          module_id: "trending",
          page_size: 6,
          page: 1
        }),
        $axios.$post("/api/novel/novel_module", {
          site_id: env.SITE_ID,
          module_id: "popular",
          page_size: 6,
          page: 1
        }),
        $axios.$post("/api/novel/novel_module", {
          site_id: env.SITE_ID,
          module_id: "all",
          page_size: 5,
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
      currentClickNovelId: null
    };
  },
  mounted() {
    // 页面卸载跳转时，记录点击的小说id
    window.addEventListener("beforeunload", () => {
      if (this.currentClickNovelId) {
        window.dataLayer.push({
          event: "Home_Novel_Click",
          novel_id: this.currentClickNovelId
        });

        const source = window.getParam("hi_source");
        const { hi_source_clid } = window.getSourceClid(source);
        const userClickBooksData = window.getCookie("User_Click_Books_Data");
        if (!userClickBooksData) {
          const userClickBooksDataObj = {
            sourceClidArr: [hi_source_clid],
            clickBookArr: [this.currentClickNovelId]
          };
          window.setCookieToDay("User_Click_Books_Data", JSON.stringify(userClickBooksDataObj));
          window.trackEventToPixel("Click_Books_Clid");
          window.pushEventParamsToGtm("Click_Books_Clid");
          window.trackEventToPixel("Click_Books_Book");
          window.pushEventParamsToGtm("Click_Books_Book");
        } else {
          const userClickBooksDataObj = JSON.parse(userClickBooksData);
          if (!userClickBooksDataObj.sourceClidArr.includes(hi_source_clid)) {
            userClickBooksDataObj.sourceClidArr.push(hi_source_clid);
            window.trackEventToPixel("Click_Books_Clid");
            window.pushEventParamsToGtm("Click_Books_Clid");
          }
          if (!userClickBooksDataObj.clickBookArr.includes(this.currentClickNovelId)) {
            userClickBooksDataObj.clickBookArr.push(this.currentClickNovelId);
            window.trackEventToPixel("Click_Books_Book");
            window.pushEventParamsToGtm("Click_Books_Book");
          }
          window.setCookieToDay("User_Click_Books_Data", JSON.stringify(userClickBooksDataObj));
        }
      }
    });
  },
  methods: {
    handleNovelItemClick(novelId) {
      this.currentClickNovelId = novelId;
    }
  }
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
  .module-common,
  .module-all {
    padding: 0 vw(24);
  }
  .module-trending-content,
  .module-popular-content {
    grid-template-columns: repeat(3, vw(226));
    gap: vw(12);
    & .item:nth-of-type(n + 4) {
      display: none;
    }
  }
}
</style>
