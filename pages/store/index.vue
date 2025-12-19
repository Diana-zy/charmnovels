<template>
  <main>
    <custom-back-header url="/profile/" :is-page-content="true" title="Charmnovel Store" />
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
    <common-notification />
  </main>
</template>

<script>
import { getSKUList, paymentSKU, updateSkuOrder } from "~/api/api";
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
    this.handleGetOrderPayStatus();
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
    async handleClickSkuItem(item) {
      const data = {
        sku_id: item.ID,
        redirect_url: `${window.location.href}`
      };
      await paymentSKU(data).then((res) => {
        window.dataLayer.push({
          event: "Purchase_action",
          purchase_action: "start_purchase_with_stripe"
        });
        const { url } = res.data.order_info;
        window.location.href = url;
      });

      window.setCookie("purchase_action", `purchase_completed_with_${window.getTypeByID(item.ID)}`);
      window.setCookie("purchase_price", item.price);
    },

    async handleGetOrderPayStatus() {
      const orderNo = window.getParam("order_no");
      const payStatus = window.getParam("pay_status");
      if (orderNo) {
        if (payStatus === "success") {
          await updateSkuOrder({ order_no: orderNo }).then((res) => {
            if (res.data.order_status === 3) {
              // 订单成功
              this.$globalMethod.showNotification({
                message: "Payment successful!",
                type: "success"
              });

              window.trackEventToPixel("Purchase_Completed");
              window.dataLayer.push({
                event: "Purchase_Completed"
              });
              window.dataLayer.push({
                event: "Purchase_action",
                purchase_action: "purchase_completed"
              });
              window.dataLayer.push({
                event: "Purchase_action",
                purchase_action: window.getCookie("purchase_action")
              });
            }
          });
        } else if (payStatus === "cancel") {
          // 订单取消
          this.$globalMethod.showNotification({
            message: "Cancel payment!",
            type: "warning"
          });

          window.dataLayer.push({
            event: "Purchase_action",
            purchase_action: "purchase_fail_by_userexit"
          });
        }
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete("order_no");
        searchParams.delete("pay_status");
        searchParams.delete("after_pay");
        const newUrl = `${window.location.origin}${
          window.location.pathname
        }?${searchParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }
};
</script>

<style scoped lang="scss">
main {
  position: relative;
  width: 375px;
  padding: 0 23px;
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
    padding: 0 vw(46);
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
