<template>
  <s-model :value.sync="visible" @handleClose="handleClose">
    <template v-slot:content>
      <div class="win-back-content">
        <div class="watch-ad-unlock" @click="handleViewAdUnlock" :class="{ 'disable-btn': false }">
          <div> watch ad to unlock this chapter</div>
          <div> Watched today({{ 0 }}/5)</div>
        </div>

        <div class="top-up-out-box">
          <item-module-sku-special-offer
            v-for="(item, index) in skuSpecialOfferList"
            :key="index"
            :item="item"
          ></item-module-sku-special-offer>
          <item-module-sku-vip
            v-for="(item, index) in skuVipList"
            :key="index"
            :item="item"
          ></item-module-sku-vip>
        </div>
      </div>
    </template>
  </s-model>
</template>

<script>
import { getUserInfo, getSKUList } from "~/api/api";
export default {
  name: "WinBackBox",
  props: {
    url: {
      type: String
    }
  },
  data() {
    return {
      visible: false,
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
      isBacK: false
    };
  },
  methods: {
    handleViewAdUnlock() {},
    handleClose() {
      this.$emit("handleClose");
      if (this.isBacK) {
        this.$router.push({
          path: this.url
        });
      }
    },
    async handleOpen(val = false, callback) {
      await getSKUList().then((res) => {
        console.log(res);
        callback();
        if (res.success) {
          const { sku } = res.data;
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
