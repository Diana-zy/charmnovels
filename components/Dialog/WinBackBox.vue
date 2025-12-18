<template>
  <s-model :value.sync="visible" @handleClose="handleClose">
    <template v-slot:content>
      <div class="win-back-content">
        <div
          class="watch-ad-unlock"
          @click="handleViewAdUnlock"
          :class="{ 'disable-btn': !userInfo?.user_free_count }"
        >
          <div> watch ad to unlock this chapter</div>
          <div> Watched today({{ 5 - userInfo?.user_free_count }}/5)</div>
        </div>

        <div class="top-up-out-box">
          <item-module-sku-special-offer
            v-for="(item, index) in skuSpecialOfferList"
            :key="'special' + index"
            :item="item"
            @click.native="handleClick(item)"
          ></item-module-sku-special-offer>
          <item-module-sku-vip
            v-for="(item, index) in skuVipList"
            :key="index"
            :item="item"
            @click.native="handleClick(item)"
          ></item-module-sku-vip>
        </div>
      </div>
    </template>
  </s-model>
</template>

<script>
import { getUserInfo, getSKUList } from "~/api/api";
import { simulateClickToPath } from "~/utils/utils";
export default {
  name: "WinBackBox",
  props: {
    url: {
      type: String
    },
    userInfo: {
      type: Object
    }
  },
  data() {
    return {
      visible: false,
      skuSpecialOfferList: [],
      skuVipList: [],
      isBacK: false
    };
  },
  mounted() {},
  methods: {
    handleViewAdUnlock() {
      this.$emit("handleViewAdUnlock", () => {
        this.visible = false;
      });
    },
    handleClose() {
      this.$emit("handleClose");
      if (this.isBacK) {
        simulateClickToPath(this.url);
      }
    },
    handleClick(val) {
      window.dataLayer.push({
        event: "Novel_Purchase_Dialog",
        purchase_dialog: `second_page_click_button_${window.getTypeByID(val.ID)}`
      });
      window.setCookie("purchase_dialog", "purchase_completed_with_second_page");
      window.setCookie("purchase_action", `purchase_completed_with_${window.getTypeByID(val.ID)}`);
      this.$emit("handlePayByStripe", val.ID);
    },
    async handleOpen(val = false, callback) {
      const data = {
        sku_type: ["period", "first"]
      };
      await getSKUList(data).then((res) => {
        if (callback instanceof Function) {
          callback();
        }
        if (res.success) {
          const { sku } = res.data;
          const is_paid = sku.find((item) => item.sky_type === "first");
          if (is_paid) {
            this.skuSpecialOfferList = [is_paid];
            this.skuVipList = sku.filter((item) => item.ID === 5); //判断 取出 Monthly VIP
            window.dataLayer.push({
              event: "Novel_Purchase_Dialog",
              purchase_dialog: `second_page_show_button_499`
            });
            window.dataLayer.push({
              event: "Novel_Purchase_Dialog",
              purchase_dialog: `second_page_show_button_month`
            });
          } else {
            this.skuVipList = sku.filter((item) => item.sky_type === "period");
            this.skuSpecialOfferList = [];
            window.dataLayer.push({
              event: "Novel_Purchase_Dialog",
              purchase_dialog: `second_page_show_button_week`
            });
            window.dataLayer.push({
              event: "Novel_Purchase_Dialog",
              purchase_dialog: `second_page_show_button_month`
            });
          }
          // console.log(this.skuSpecialOfferList, this.skuVipList);
        }
      });

      this.visible = true;
      this.isBacK = val;
    }
  }
};
</script>

<style scoped lang="scss">
@media screen and (min-width: 751px) {
  .win-back-content {
    width: 330px;
    .watch-ad-unlock {
      width: 330px;
      height: 66px;
      border-radius: 44px;
      background: #e58946;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      div:first-child {
        font-weight: bold;
        font-size: 20px;
        color: $color1;
        line-height: 28px;
        text-align: center;
      }

      div:last-child {
        font-size: 16px;
        font-weight: 400;
        color: $color2;
        line-height: 20px;
        text-align: center;
      }
    }
    .top-up-out-box {
      margin-top: 28px;
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 20px;

      .item {
        width: 330px;
        height: 100px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .win-back-content {
    .watch-ad-unlock {
      height: vw(88);
      width: vw(658);
      background: #e58946;
      border-radius: vw(100);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      div:first-child {
        font-weight: bold;
        font-size: vw(28);
        color: $color1;
        line-height: vw(38);
        text-align: center;
      }

      div:last-child {
        font-size: vw(20);
        font-weight: 400;
        color: $color2;
        line-height: vw(26);
        text-align: center;
      }
    }

    .top-up-out-box {
      margin-top: vw(76);
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: vw(62);

      .item {
        width: vw(660);
        height: vw(184);
      }
    }
  }
}
</style>
