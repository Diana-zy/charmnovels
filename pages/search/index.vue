<template>
  <main>
    <custom-header />

    <google-ad-preload class="ad-1" ad-slot="1454551777" />

    <!-- 搜索中 -->
    <section v-if="searchLoading" class="search-loading">
      <common-loading />
    </section>

    <!-- 搜索无结果 -->
    <section v-if="!searchLoading && resultDataCount == 0" class="search-null">
      Sorry! No results were found. Please try a new search!
    </section>

    <!-- 搜索有结果 -->
    <section v-if="!searchLoading && resultDataCount > 0" class="search-result">
      <common-title-label :title="`${resultDataCount} Novels Related to ${searchQueryText}`" />
      <div class="search-result-content">
        <item-module-common
          v-for="(item, i) in resultDataList"
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
    <common-notification />
    <common-back-top />
  </main>
</template>

<script>
export default {
  async asyncData({ $axios, env }) {
    try {
      const [allBooksResponse] = await Promise.all([
        $axios.$post("/api/novel/novel_module", {
          site_id: env.SITE_ID,
          module_id: "all",
          page_size: 4,
          page: 1
        })
      ]);
      return {
        allBooks: allBooksResponse.novel_list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  data() {
    return {
      searchLoading: false,
      input: "",
      resultDataCount: null,
      resultDataList: [],
      searchQueryText: ""
    };
  },
  mounted() {
    this.input = this.$route.query.text || "";
    this.input && this.searchApp(this.input);
  },
  methods: {
    handleSearch(inputValue) {
      this.searchApp(inputValue);
    },

    async searchApp(text) {
      this.input = text;
      this.searchLoading = true;
      const searchResultResponse = await this.$axios.$post("/api/novel/novel_search", {
        site_id: process.env.SITE_ID,
        name: text
      });
      this.searchLoading = false;
      this.resultDataCount = searchResultResponse.total;
      this.resultDataList = searchResultResponse.list;
      this.searchQueryText = text;
    }
  }
};
</script>

<style lang="scss" scoped>
.ad-1 {
  margin-top: 32px;
}

.search-loading,
.search-null {
  width: 329px;
  height: 54px;
  margin: 96px auto;
  text-align: center;
  @include center;
  font-size: 20px;
  line-height: 27px;
  font-family: "seb";
}

.search-result-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(373px, 1fr));
  gap: 24px 40px;
}

@media screen and (max-width: 750px) {
  .ad-1 {
    margin-top: vw(48);
  }

  .search-loading,
  .search-null {
    width: vw(658);
    height: vw(108);
    margin: vw(128) auto;
    font-size: vw(40);
    line-height: vw(54);
  }

  .search-result {
    width: vw(658);
    margin: 0 auto;
  }

  .search-result-content {
    grid-template-columns: repeat(3, vw(198));
    gap: vw(32);
  }
}
</style>
