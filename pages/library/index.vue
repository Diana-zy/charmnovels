<template>
  <main>
    <custom-header current-page="Library" />

    <section class="module-common module-library">
      <div class="module-library-content">
        <google-ad class="ad-1" ad-slot="" />
        <item-module-library
          v-for="(item, i) in libraryList"
          :key="i"
          :item="item"
          :to="`/novel/${item.id}/`"
        />
        <custom-link to="/" class="add-book">
          <i class="icon-add"></i>
          <span>Add Books</span>
        </custom-link>
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
    <ad-loading />
  </main>
</template>
<script>
import Storage from "@/utils/storage";
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
      libraryList: []
    };
  },
  beforeMount() {
    Storage.getItem("token") && this.getLibraryList();
  },
  mounted() {},
  methods: {
    async getLibraryList() {
      await this.$axios
        .$post("/api/novel/novel_library_list", {
          site_id: process.env.SITE_ID,
          page: 1,
          page_size: 99
        })
        .then((response) => {
          this.libraryList = response.list;
        });
    }
  }
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
.add-book {
  width: 100%;
  height: 270px;
  border-radius: 4px;
  background: $color5;
  @include center;
  flex-direction: column;
  color: #ba9d82;
  font-size: 20px;
  line-height: 27px;
  font-family: "seb";
  .icon-add {
    @include icon(50px, 50px, "icon-add.png");
    margin-bottom: 8px;
  }
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
  .add-book {
    height: vw(296);
    border-radius: vw(4);
    font-size: vw(24);
    line-height: vw(32);
    .icon-add {
      width: vw(58);
      height: vw(58);
      margin-bottom: vw(12);
    }
  }
}
</style>
