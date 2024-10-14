<template>
  <main>
    <custom-header />
    <common-breadcrumb name="Search" />
    <common-search-input class="search-m" @handle-search="handleSearch" />

    <google-ad ad-slot="1454551777" />

    <!-- 搜索中 -->
    <section class="searching" v-if="searchLoading">
      <common-loading />
    </section>

    <!-- 搜索无结果 -->
    <section class="search-null" v-if="!searchLoading && resultAppCount == 0">
      Sorry, No <span>&nbsp;"{{ searchQueryText }}"&nbsp;</span> found
    </section>

    <!-- 搜索有结果 -->
    <section class="search-result" v-if="!searchLoading && resultAppCount > 0">
      <div class="number">
        <span>"{{ searchQueryText }}"</span>, {{ resultAppCount + resultCollectionCount }} results
        found
      </div>

      <!-- 搜索结果->合集列表 -->
      <section class="result-collection" v-if="resultCollectionCount > 0">
        <h3>Selected Collection</h3>
        <item-module-collection
          v-for="(item, i) in resultCollectionList"
          :key="i"
          :item="item"
          :index="i"
          :to="`/collection/${item.path}/`"
        />
      </section>
      <!-- 搜索结果->App列表 -->
      <section class="result-app">
        <h3>Apps</h3>
        <item-module-common
          v-for="(item, i) in resultAppList"
          :key="i"
          :item="item"
          :index="i"
          :to="`/app/${item.path}/`"
        />
      </section>
    </section>

    <!-- 推荐合集 -->
    <section
      class="module-common module-collection"
      v-if="resultCollectionCount == 0 || resultCollectionCount == null"
    >
      <common-title-label
        class="m-hidden-flex"
        title="Selected Collection"
        :is-see-more="true"
        to="/collection/"
      />
      <div class="module-collection-content">
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
import { shuffleArray } from "~/utils/utils";

export default {
  data() {
    return {
      searchLoading: false,
      matchAppData: {},
      input: "",
      resultCollectionCount: null,
      resultAppCount: null,
      resultCollectionList: [],
      resultAppList: [],
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
      const searchResultResponse = await this.$axios.$post("/api/game/search", {
        site_id: process.env.SITE_ID,
        name: text
      });
      this.searchLoading = false;
      this.resultCollectionCount = searchResultResponse.collection_count;
      this.resultAppCount = searchResultResponse.app_count;
      this.resultCollectionList = searchResultResponse.collection_list;
      this.resultAppList = searchResultResponse.app_list;
      this.searchQueryText = searchResultResponse.name;

      this.matchAppData = searchResultResponse;
    }
  },
  async asyncData({ $axios, env }) {
    try {
      // 并行处理多个异步请求
      const [collectionResponse, allAppResponse] = await Promise.all([
        $axios.$get("/api/game/all_app_collection", {
          params: {
            site_id: env.SITE_ID
          }
        }),
        $axios.$get("/api/game/all_app", {
          params: {
            site_id: env.SITE_ID,
            page: 1,
            size: 16
          }
        })
      ]);
      // 返回多个接口的数据
      return {
        collectionList: shuffleArray(collectionResponse.list).slice(0, 4),
        allApps: allAppResponse.list
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  display: none;
}

.searching,
.search-null {
  width: 100%;
  height: 120px;
  margin-top: 32px;
  @include center;
  @include shadow-inner;
  border-radius: 24px;
  font-size: 16px;
  font-family: "seb";
  span {
    color: $color3;
  }
}

.search-result {
  padding: 32px 24px;
  margin-top: 32px;
  @include shadow-inner;
  border-radius: 24px;
  .number {
    width: 100%;
    font-size: 16px;
    font-family: "seb";
    color: $color2;
    @include center;
    span {
      color: $color3;
      max-width: 1000px;
      @include ellipsis;
    }
  }
}

.result-collection,
.result-app {
  display: grid;
  gap: 24px;
  h3 {
    width: 100%;
    grid-column: 1 / -1;
    font-size: 16px;
    line-height: 21px;
    font-family: "seb";
    margin-top: 24px;
  }
}

.result-collection {
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  justify-items: center;
  ::v-deep .item {
    width: 270px;
    height: 204px;
    &::before {
      height: 161px;
    }
    .cover {
      height: 161px;
    }
  }
}

.result-app {
  grid-template-columns: repeat(auto-fit, minmax(172px, 1fr));
  ::v-deep .item {
    height: 197px;
    padding: 16px 0 0;
    border-radius: 16px;
    .icon {
      width: 124px;
      height: 124px;
      border-radius: 12px;
    }
    .name {
      width: 100%;
      margin: 8px 0 4px;
      padding: 0 10px;
    }
  }
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

@media screen and (max-width: 750px) {
  .search-box {
    display: flex;
    margin: vw(48) auto;
  }

  .searching,
  .search-null {
    width: vw(658);
    height: vw(240);
    margin: vw(48) auto 0;
    border-radius: vw(48);
    font-size: vw(28);
  }

  .search-result {
    width: vw(658);
    margin: vw(48) auto 0;
    padding: vw(32) vw(30);
    border-radius: vw(48);
    .number {
      font-size: vw(28);
      span {
        max-width: vw(590);
      }
    }
  }

  .result-collection,
  .result-app {
    gap: vw(32) vw(30);
    h3 {
      font-size: vw(28);
      line-height: vw(38);
      margin-top: vw(32);
    }
  }

  .result-collection {
    grid-template-columns: repeat(1, vw(594));
    ::v-deep .item {
      width: vw(594);
      height: vw(444);
      &::before {
        height: vw(356);
      }
      .cover {
        height: vw(356);
      }
    }
  }

  .result-app {
    grid-template-columns: repeat(3, vw(178));
    ::v-deep .item {
      height: vw(254);
      padding: vw(16) 0 0;
      border-radius: vw(32);
      .icon {
        width: vw(142);
        height: vw(142);
        border-radius: vw(24);
      }
      .name {
        width: 100%;
        margin: vw(8) 0 vw(4);
        padding: 0 vw(16);
      }
    }
  }

  .module-collection-content {
    flex-direction: column;
    gap: vw(48);
    padding: vw(20);
    margin: vw(28) vw(-20) vw(-20);
    @include scroll;
    ::v-deep .item {
      width: vw(658);
      height: vw(480);
      &::before {
        height: vw(392);
      }
      .cover {
        height: vw(392);
      }
    }
    ::v-deep .item:nth-of-type(n + 3) {
      display: none;
    }
  }
}
</style>
