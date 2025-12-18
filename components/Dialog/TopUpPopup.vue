<template>
  <s-popup
    ref="topUpRef"
    :value.sync="visible"
    label="Unlock This Chapter"
    showHeader
    isCenter
    @handleClose="closeByWinBack"
  >
    <template v-slot:content>
      <div class="content">
        <div class="ms-box"> Choose a recharge level and unlock chapters you like! </div>
        <div class="select-box">
          <div
            v-for="(item, i) in skuTopUpList"
            :key="i"
            class="select-item"
            :class="{ active: item.ID === select }"
            @click="handleClick(i, undefined, item)"
          >
            <div class="right-icon-box">{{ item.discount }}</div>
            <div class="all-coins">{{ item.coin }}</div>
            <div class="old-coins">{{ item.base_coin }} coins+</div>
            <div class="give-coins">{{ item.bonus_coin }} coins</div>
            <div class="need-money">${{ item.price }}</div>
          </div>
        </div>
        <div class="top-up-box">
          <div
            v-for="(item, index) in skuVipList"
            :key="index"
            class="item-top"
            @click="handleClick(index, 'vip', item)"
          >
            <item-module-sku-vip
              :class="{ active: item.ID === select }"
              :item="item"
            ></item-module-sku-vip>
          </div>
        </div>
        <div class="btn-box">
          <div class="btn top-btn" @click="handlePayByStripe">Purchase With Stripe</div>
          <div class="btn bottom-btn disable-btn" @click="handlePayByPaypel"
            >Purchase With PayPal</div
          >
        </div>
      </div>
    </template>
  </s-popup>
</template>

<script>
import { directive } from "vue-awesome-swiper";
import "swiper/css/swiper.min.css";
import { getUserInfo, getSKUList } from "~/api/api";
export default {
  name: "TopUpPopup",
  directives: {
    swiper: directive
  },
  props: {
    // visible: {
    //   type: Boolean,
    //   default: false
    // }
    // skuTopUpList: {
    //   type: Array,
    //   default: () => []
    // },
    // skuVipList:{
    //   type: Array,
    //   default: () => []
    // }
  },
  data() {
    return {
      select: 3,
      skuVipList: [],
      loading: false,
      skuTopUpList: [],
      visible: false
      // sku: []
    };
  },
  watch: {
    visible(val) {
      // this.$emit("update:visible", val);
      if (val) {
        this.loading = false;
      }
    }
  },
  mounted() {},
  methods: {
    handleClick(num, type, item) {
      this.select = item.ID;
    },
    handlePayByPaypel() {
      window.dataLayer.push({
        event: "Novel_Purchase_Dialog",
        purchase_dialog: "paypal_button_click"
      });
      window.setCookie("purchase_dialog", "purchase_completed_with_dialog");
      this.$globalMethod.showNotification({
        message: "PayPal is currently unavailable.Please use Stripe to complete your payment",
        type: "warning"
      });
    },
    handleClose() {
      this.$refs.topUpRef.visible = false;
    },
    closeByWinBack() {
      //todo
      //关闭弹窗挽回
      this.$emit("handleWinBack");
      window.dataLayer.push({
        event: "Novel_Purchase_Dialog",
        purchase_dialog: "closeing_show_second_purchase_page"
      });
    },
    handlePayByStripe() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$emit("handlePayByStripe", this.select);
      window.setCookie(
        "purchase_action",
        `purchase_completed_with_${window.getTypeByID(this.select)}`
      );
      window.dataLayer.push({
        event: "Novel_Purchase_Dialog",
        purchase_dialog: `purchase_dialog_with_${window.getTypeByID(this.select)}`
      });
      window.dataLayer.push({
        event: "Novel_Purchase_Dialog",
        purchase_dialog: "purchase_button_stripe"
      });
      const timer = setTimeout(() => {
        this.loading = false;
        clearTimeout(timer);
      }, 2000);
    },
    async handleOpen(callback) {
      const data = {
        sku_type: ["period", "topup"]
      };
      await getSKUList(data).then((res) => {
        if (callback instanceof Function) {
          callback();
        }
        if (res.success) {
          const { sku } = res.data;
          // this.sku = sku;
          this.skuTopUpList = sku.filter((item) => item.sky_type === "topup");
          this.skuVipList = sku.filter((item) => item.sky_type === "period");
          this.skuTopUpList.splice(2, 1, ...this.skuTopUpList.splice(1, 1, this.skuTopUpList[2]));
          window.dataLayer.push({
            event: "Novel_Purchase_Dialog",
            purchase_dialog: "purchase_dialog_show "
          });
          this.visible = true;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
@media screen and (min-width: 751px) {
  .show-layer {
    background: none !important;
    pointer-events: none;
    .popup-bottom {
      width: 450px !important;
    }
  }
  .content {
    cursor: pointer;
    padding: 12px;
    /*height: 500px;*/

    .ms-box {
      margin: 0 0 16px;
      text-align: center;
      line-height: 28px;
      font-size: 16px;
      color: $color2;
      font-weight: 400;
    }

    .top-up-box {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: scroll;
      align-items: flex-end;
      gap: 20px;
      height: 160px;
      width: 100%;

      /*&::-webkit-scrollbar {*/
      /*  display: none;*/
      /*}*/
    }

    .item-top {
      flex-shrink: 0;
      width: 363px;
      height: 130px;
      padding-top: 21px;
    }

    .item-top:last-child {
      margin-right: 0;
    }

    .select-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: vw(28);
      height: auto;
      .select-item {
        position: relative;
        width: 110px;
        height: 150px;
        margin-bottom: 6px;
        background: rgba(#fce6db, 0.59);
        border-radius: 8px;
        border: 1px solid #f59a23;
        display: flex;
        align-items: center;
        flex-direction: column;
        color: $color2;

        .right-icon-box {
          font-weight: bold;
          font-size: 15px;
          line-height: 24px;
          text-align: center;
          position: absolute;
          top: -12px;
          right: 7px;
          width: 57px;
          height: 24px;
          background: linear-gradient(180deg, #ffc67c 0%, #f59a23 100%);
          border-radius: 4px;
          color: $color1;
        }

        .all-coins {
          font-weight: bold;
          font-size: 18px;
          line-height: 23px;
          margin-top: 23px;
        }

        .old-coins {
          font-weight: 400;
          font-size: 15px;
          line-height: 21px;
        }

        .give-coins {
          width: 62px;
          height: 22px;
          background: linear-gradient(180deg, #ffc67c 0%, #f59a23 100%);
          border-radius: 4px;
          line-height: 22px;
          text-align: center;
          color: $color1;
          font-weight: 400;
          font-size: 13px;
          margin-top: 4px;
        }

        .need-money {
          font-weight: 600;
          font-size: 18px;
          color: #f69b24;
          margin-top: 20px;
        }
      }
    }

    ::v-deep .active {
      border: 1px solid #fa7a1d;
      background: #f59a23 !important;

      .right-icon-box {
        background: linear-gradient(180deg, #f59c27 0%, #fa7a1d 100%) !important;
      }

      .old-coins {
        color: $color1 !important;
      }

      .give-coins {
        background: rgba($color1, 0.6) !important;
        color: #fa7a1d !important;
      }

      .need-money {
        color: $color1 !important;
      }

      .tag-off {
      }

      .item-left > .title {
        color: $color1;
      }

      .item-left .coins-value {
        color: $color1;
      }

      .item-left > .coins-tip {
        color: $color1;
      }

      .item-right > span {
        color: $color1;
      }
    }

    .btn-box {
      width: 100%;
      padding: 20px;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      gap: 30px;
      .btn {
        width: 230px;
        height: 66px;
        border-radius: 33px;
        line-height: 66px;
        font-weight: bold;
        font-size: 16px;
        color: #fffcf7;
        text-align: center;
        cursor: pointer;
      }
      .top-btn {
        background: $color3;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .content {
    padding: vw(32);

    .ms-box {
      margin: 0 0 vw(50);
      text-align: center;
      line-height: vw(38);
      font-size: vw(28);
      color: $color2;
      font-weight: 400;
    }

    .top-up-box {
      width: 100vw;
      margin-left: vw(-32);
      display: flex;
      flex-wrap: nowrap;
      overflow-x: scroll;
      align-items: flex-end;
      gap: vw(20);

      .item-top:first-child {
        margin-left: vw(32);
      }
      .item-top:last-child {
        margin-right: vw(32);
      }
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .item-top {
      flex-shrink: 0;
      width: vw(660);
      height: vw(238);
      padding-top: vw(38);
    }

    .item-top:last-child {
      margin-right: 0;
    }

    .select-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: vw(28);

      .select-item {
        position: relative;
        width: vw(200);
        height: vw(272);
        margin-bottom: vw(48);
        background: rgba(#fce6db, 0.59);
        border-radius: vw(16);
        border: vw(2) solid #f59a23;
        display: flex;
        align-items: center;
        flex-direction: column;
        color: $color2;

        .right-icon-box {
          font-weight: bold;
          font-size: vw(28);
          line-height: vw(44);
          text-align: center;
          position: absolute;
          top: vw(-22);
          right: vw(12);
          width: vw(104);
          height: vw(44);
          background: linear-gradient(180deg, #ffc67c 0%, #f59a23 100%);
          border-radius: vw(8);
          color: $color1;
        }

        .all-coins {
          font-weight: bold;
          font-size: vw(32);
          line-height: vw(42);
          margin-top: vw(42);
        }

        .old-coins {
          font-weight: 400;
          font-size: vw(28);
          line-height: vw(38);
        }

        .give-coins {
          width: vw(112);
          height: vw(40);
          background: linear-gradient(180deg, #ffc67c 0%, #f59a23 100%);
          border-radius: vw(8);
          line-height: vw(40);
          text-align: center;
          color: $color1;
          font-weight: 400;
          font-size: vw(24);
          margin-top: vw(8);
        }

        .need-money {
          font-weight: 600;
          font-size: vw(32);
          color: #f69b24;
          margin-top: vw(36);
        }
      }
    }

    ::v-deep .active {
      border: vw(2) solid #fa7a1d;
      background: #f59a23 !important;

      .right-icon-box {
        background: linear-gradient(180deg, #f59c27 0%, #fa7a1d 100%) !important;
      }

      .old-coins {
        color: $color1 !important;
      }

      .give-coins {
        background: rgba($color1, 0.6) !important;
        color: #fa7a1d !important;
      }

      .need-money {
        color: $color1 !important;
      }

      .tag-off {
      }

      .item-left > .title {
        color: $color1;
      }

      .item-left .coins-value {
        color: $color1;
      }

      .item-left > .coins-tip {
        color: $color1;
      }

      .item-right > span {
        color: $color1;
      }
    }

    .btn-box {
      padding-top: vw(32);
      width: 100%;

      .btn {
        width: 100%;
        border-radius: vw(40);
        height: vw(80);
        text-align: center;
        line-height: vw(80);
        margin-bottom: vw(32);
        font-weight: bold;
        font-size: vw(28);
        color: #fffcf7;
      }

      .top-btn {
        background: $color3;
      }

      .bottom-btn {
      }
    }
  }
}
</style>
