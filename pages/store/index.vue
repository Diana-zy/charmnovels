<template>
  <main>
    <div class="sku-list-content">
      <item-module-sku-special-offer
        v-for="(item, index) in skuSpecialOfferList"
        :key="index"
        :item="item"
        @click.native="handleClickSkuItem(item)"
      ></item-module-sku-special-offer>
      <item-module-sku-vip
        v-for="(item, index) in skuVipList"
        :key="index"
        :item="item"
        @click.native="handleClickSkuItem(item)"
      ></item-module-sku-vip>
    </div>
    <div class="sku-list-content sku-top-up-content">
      <item-module-sku-top-up
        v-for="(item, index) in skuTopUpList"
        :key="index"
        :item="item"
        @click.native="handleClickSkuItem(item)"
      ></item-module-sku-top-up>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      skuSpecialOfferList: [
        {
          title: "Limited time offer!",
          discountedPrice: "$4.99",
          originalPrice: "$9.99",
          coinsValue: 1000,
          off: "50%"
        }
      ],
      skuVipList: [
        {
          title: "Weekly VIP",
          discountedPrice: "$9.99",
          originalPrice: "$19.99",
          coinsValue: 2000,
          off: "50%"
        },
        {
          title: "Monthly VIP",
          discountedPrice: "$35.99",
          originalPrice: "$79.99",
          coinsValue: 8000,
          off: "55%"
        }
      ],
      skuTopUpList: [
        {
          title: "",
          discountedPrice: "$11.99",
          originalPrice: "",
          coinsValue: 1200,
          addedCoins: 120,
          off: "10%"
        },
        {
          title: "",
          discountedPrice: "$19.99",
          originalPrice: "",
          coinsValue: 2000,
          addedCoins: 300,
          off: "15%"
        },
        {
          title: "",
          discountedPrice: "$24.99",
          originalPrice: "",
          coinsValue: 2500,
          addedCoins: 750,
          off: "30%"
        }
      ]
    };
  },
  methods: {
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
    padding: vw(96) vw(46) 0;
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
