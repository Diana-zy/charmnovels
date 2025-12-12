<template>
  <main>
    <custom-back-header :is-page-content="true" title="Reading History" />
    <section v-if="!isShowLoading" class="module-common module-library">
      <div class="module-library-content">
        <item-module-library
          v-for="(item, i) in libraryList"
          :key="i"
          :item="item"
          :to="`/read/?ch=${item.last_read_chapter_id}`"
        />
      </div>
      <div v-if="libraryList.length === 0" class="empty-content">
        No historical records available at the moment .
      </div>
    </section>
    <div v-else class="loading-content">
      <common-loading />
    </div>
  </main>
</template>
<script>
export default {
  data() {
    return {
      libraryList: [],
      isShowLoading: true
    };
  },
  mounted() {
    this.getLibraryList();
  },
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
        })
        .finally(() => {
          this.isShowLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  position: relative;
  width: 375px;
  padding: 0 23px 0;
  box-sizing: border-box;
}
.module-library {
  margin-top: 24px;
}
.module-library-content {
  display: grid;
  grid-template-columns: repeat(3, 99px);
  justify-items: center;
  gap: 16px;
}
.empty-content {
  padding: 100px 0;
}

@media screen and (min-width: 750px) {
  ::v-deep .back-header {
    display: flex !important;
    width: 375px;
    height: 48px;
    left: 0;
    padding: 0 23px;
    margin-left: -23px;
    .header-url {
      align-items: center;
    }
    .header-icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
    .header-label {
      font-size: 14px;
      line-height: 19px;
    }
  }

  .module-library-content {
    ::v-deep .item {
      width: 99px;
      height: 189px;
      .cover {
        width: 99px;
        height: 148px;
        border-radius: 2px;
      }
      .name {
        font-size: 14px;
        line-height: 19px;
        margin: 4px 0 2px;
      }
      .progress {
        font-size: 12px;
        line-height: 16px;
      }
    }
  }
}

@media screen and (max-width: 750px) {
  main {
    width: 100%;
    padding: 0;
  }
  ::v-deep .back-header {
    left: 0;
  }
  .module-library {
    margin-top: vw(48);
  }
  .module-library-content {
    grid-template-columns: repeat(3, vw(198));
    gap: vw(32);
  }
  .empty-content {
    padding: vw(200) 0;
  }
}
</style>
