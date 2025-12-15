<template>
  <main>
    <custom-back-header :is-page-content="true" title="Charmnovel Store" />
    <div class="sku-list-content">
      <item-module-sku-special-offer
        v-for="(item, index) in skuSpecialOfferList"
        :key="'special' + index"
        :item="item"
        @click.native="handleClickSkuItem(item)"
      ></item-module-sku-special-offer>
      <item-module-sku-vip
        v-for="(item, index) in skuVipList"
        :key="'vip' + index"
        :item="item"
        @click.native="handleClickSkuItem(item)"
      ></item-module-sku-vip>
    </div>
    <div class="sku-list-content sku-top-up-content">
      <item-module-sku-top-up
        v-for="(item, index) in skuTopUpList"
        :key="'topup' + index"
        :item="item"
        @click.native="handleClickSkuItem(item)"
      ></item-module-sku-top-up>
    </div>
  </main>
</template>

<script>
import { getSKUList } from "~/api/api";
export default {
  data() {
    return {
      skuSpecialOfferList: [],
      skuVipList: [],
      skuTopUpList: []
    };
  },
  mounted() {
    this.handleGetSKUList();
  },
  methods: {
    async handleGetSKUList() {
      const data = {
        site_id: "charmnovel",
        sku_type: ["topup", "period", "first"]
      };
      await getSKUList(data).then((res) => {
        const skuList = res.data?.sku;
        this.skuSpecialOfferList = skuList.filter((item) => item.sky_type === "first");
        this.skuVipList = skuList.filter((item) => item.sky_type === "period");
        this.skuTopUpList = skuList.filter((item) => item.sky_type === "topup");
      });
    },
    handleClickSkuItem(item) {
      console.log("Clicked SKU item:", item);
    }
  }
};
</script>

<style scoped lang="scss">
main {
  position: relative;
  width: 375px;
  padding: 48px 23px 0;
  box-sizing: border-box;
}

.sku-list-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 43px;
}

.sku-top-up-content {
  gap: 21px;
  margin-top: 30px;
}
@media screen and (max-width: 750px) {
  main {
    width: 100%;
    padding: 0 vw(46) 0;
  }

  .sku-list-content {
    gap: vw(60);
    margin-top: vw(86);
  }

  .sku-top-up-content {
    gap: vw(42);
    margin-top: vw(60);
  }
}
</style>
