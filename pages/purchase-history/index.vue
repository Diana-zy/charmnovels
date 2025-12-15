<template>
  <main>
    <custom-back-header :is-page-content="true" title="Purchase History" />
    <section v-if="!isShowLoading" class="module-common module-purchase">
      <div class="module-purchase-content">
        <item-module-purchased v-for="(item, i) in purchaseList" :key="i" :item="item" />
      </div>
      <div v-if="purchaseList.length === 0" class="empty-content">
        <i class="icon-empty"></i>
        <span>No historical purchased available at the moment .</span>
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
      purchaseList: [],
      isShowLoading: true
    };
  },
  mounted() {
    this.getPurchaseList();
  },
  methods: {
    async getPurchaseList() {
      await this.$axios
        .$post("/api/user/purchase_sku_history", {
          site_id: process.env.SITE_ID,
          order_status: [3]
        })
        .then((response) => {
          response.list && (this.purchaseList = response.list);
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
  padding: 0 23px;
  box-sizing: border-box;
}
.module-purchase {
  margin: 24px 0;
}
.module-purchase-content {
  display: grid;
  grid-template-columns: 1;
  justify-items: center;
  gap: 16px;
}

.empty-content {
  @include center;
  flex-direction: column;
  margin-top: 30px;
  .icon-empty {
    @include icon(320px, 216px, "icon-empty.png");
  }
  span {
    font-size: 14px;
    line-height: 19px;
    font-family: "seb";
  }
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
}

@media screen and (max-width: 750px) {
  main {
    width: 100%;
    padding: 0;
  }
  ::v-deep .back-header {
    left: 0;
  }
  .module-purchase {
    margin: vw(48) 0;
  }
  .module-purchase-content {
    gap: vw(32);
  }

  .empty-content {
    margin-top: vw(62);
    .icon-empty {
      width: vw(320);
      height: vw(216);
    }
    span {
      font-size: vw(28);
      line-height: vw(39);
      margin-top: vw(10);
    }
  }
}
</style>
