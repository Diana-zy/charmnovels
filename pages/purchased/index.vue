<template>
  <main>
    <custom-header />
    <google-ad class="ad-1" ad-slot="" />
    <div class="feedback-info">
      <i class="icon-clock"></i>
      For payment issues, please contact
      <a href="#" @click.prevent="copyToClipboard('support@egames.cc')">support@egames.cc</a>
    </div>
    <div v-if="purchaseBooks.length === 0" class="empty-box">
      <i class="icon-empty"></i>
      <span>"Not yet purchased the novel"</span>
    </div>
    <section v-else class="module-common module-purchased">
      <common-title-label :title="`Purchase ${purchaseBooks.length} novels`" />
      <div class="module-purchased-content">
        <item-module-purchased
          v-for="(item, i) in purchaseBooks"
          :key="i"
          :item="item"
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
    <ad-loading />
  </main>
</template>
<script>
import Storage from "@/utils/storage";
export default {
  async asyncData({ $axios, env, req }) {
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
      purchaseBooks: []
    };
  },
  beforeMount() {
    Storage.getCookie("token") && this.getPurchaseList();
  },
  methods: {
    async getPurchaseList() {
      await this.$axios
        .$get("/api/novel/novel_purchase_list", {
          params: {
            site_id: process.env.SITE_ID,
            page: 1,
            page_size: 99
          }
        })
        .then((response) => {
          this.purchaseBooks = response.list;
        });
    },
    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Email copied to clipboard!");
        })
        .catch((err) => {
          console.error("copy failed: ", err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.ad-1 {
  margin: 16px 0;
}
.feedback-info {
  @include center;
  font-size: 14px;
  line-height: 18px;
  .icon-clock {
    @include icon(16px, 16px, "icon-bell.png");
    margin-right: 4px;
  }
  a {
    text-decoration: underline;
    margin-left: 4px;
  }
}
.empty-box {
  @include center;
  flex-direction: column;
  margin-top: 30px;
  .icon-empty {
    @include icon(320px, 216px, "icon-empty.png");
  }
  span {
    font-size: 18px;
    line-height: 24px;
    margin-top: -24px;
    font-family: "seb";
  }
}
.module-purchased-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(384px, 1fr));
  justify-items: center;
  gap: 24px;
}

@media screen and (max-width: 750px) {
  .ad-1 {
    margin-top: vw(48) 0;
  }
  .feedback-info {
    font-size: vw(24);
    line-height: vw(32);
    .icon-clock {
      width: vw(32);
      height: vw(32);
      margin-right: vw(8);
    }
    a {
      margin-left: vw(8);
    }
  }
  .empty-box {
    margin-top: vw(62);
    .icon-empty {
      width: vw(320);
      height: vw(216);
    }
    span {
      font-size: vw(36);
      line-height: vw(48);
      margin-top: vw(4);
    }
  }
  .module-purchased-content {
    grid-template-columns: vw(658);
    gap: vw(32);
  }
}
</style>
